import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { statusLabels } from "../../data/packages";
import { db, auth, storage } from "../../firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";

import ProfessionalShipmentReceipt from "./ProfessionalShipmentReceipt";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ShipmentsTable from "./ShipmentsTable";
import ChatHub from "./ChatHub";
import AddPackageModal from "./AddPackageModal";
import StatusUpdaterModal from "./StatusUpdaterModal";
import CustomsWarningModal from "./CustomsWarningModal";
import "../../admin/styles/admin.css";

function AdminDashboard({ packages }) {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [chatSearchTerm, setChatSearchTerm] = useState("");
    const [statusForm, setStatusForm] = useState({ location: "", description: "" });
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);
    const [adminChatText, setAdminChatText] = useState("");
    const [isAdminUploading, setIsAdminUploading] = useState(false);

    // Customs warning popup states
    const [customsWarning, setCustomsWarning] = useState("Package now in customs clearance. Recipient may need to pay duties or provide clearance documents within 7 days to avoid delays.");
    const [tempCustomsWarning, setTempCustomsWarning] = useState("");
    const [showCustomsPopup, setShowCustomsPopup] = useState(false);
    const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

    const navigate = useNavigate();
    const adminMessagesEndRef = useRef(null);
    const adminFileInputRef = useRef(null);


    const scrollToBottom = () => {
        adminMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    // Fetch admin settings for customs warning
    useEffect(() => {
        const settingsRef = doc(db, "adminSettings", "customs_warning");
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCustomsWarning(data.message || "Default customs warning message.");
            }
        }, (error) => {
            console.log("Customs settings not found, using default:", error);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Chats List with unread counts
    React.useEffect(() => {
        const q = collection(db, "chats");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Add unread count logic for admin messages
            const chatsWithCounts = chatList.map(chat => {
                const hasUnreadAdminMessage = Boolean(
                    chat.lastAdminMessageAt &&
                    chat.updatedAt &&
                    chat.lastAdminMessageAt.seconds < chat.updatedAt.seconds
                );

                return {
                    ...chat,
                    unreadCount: hasUnreadAdminMessage ? 1 : 0,
                };
            });


            setChats(chatsWithCounts.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)));
        });
        return () => unsubscribe();
    }, []);



    // Fetch Active Chat Messages
    React.useEffect(() => {
        if (activeChatId) {
            const q = query(
                collection(db, "chats", activeChatId, "messages"),
                orderBy("timestamp", "asc")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setActiveMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [activeChatId]);

    const handleAdminSendMessage = async (e, imageUrl = null, quickReplyText = null) => {
        if (e) e.preventDefault();

        const text = quickReplyText || adminChatText;
        if ((!text.trim() && !imageUrl) || !activeChatId) return;

        if (!quickReplyText) setAdminChatText("");

        try {
            const chatRef = doc(db, "chats", activeChatId);
            await addDoc(collection(chatRef, "messages"), {
                text: text || "",
                imageUrl: imageUrl || null,
                sender: "admin",
                timestamp: serverTimestamp()
            });
            await updateDoc(chatRef, {
                lastMessage: imageUrl ? "📷 Image Sent" : text,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error sending admin message:", err);
        }
    };

    const handleAdminImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !activeChatId) return;

        setIsAdminUploading(true);
        try {
            const storageRef = ref(storage, `chat_attachments/${activeChatId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            await handleAdminSendMessage(null, url);
        } catch (err) {
            console.error("Admin image upload failed:", err);
            alert("Failed to send image.");
        } finally {
            setIsAdminUploading(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!activeChatId || !messageId) return;
        try {
            await deleteDoc(doc(db, "chats", activeChatId, "messages", messageId));
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Failed to delete message.");
        }
    };

    // Form states
    const [formData, setFormData] = useState({
        description: "",
        weight: "",
        senderName: "",
        senderAddress: "",
        recipientName: "",
        recipientAddress: "",
        recipientPhone: "",
        estimatedDelivery: ""
    });

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/admin/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleDeletePackage = async (firestoreId, trackingCode) => {
        if (window.confirm(`Are you sure you want to PERMANENTLY delete shipment ${trackingCode}? This cannot be undone.`)) {
            try {
                await deleteDoc(doc(db, "packages", firestoreId));
                alert("Shipment deleted successfully.");
            } catch (err) {
                console.error("Error deleting package:", err);
                alert("Failed to delete shipment. Check your permissions.");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            description: "",
            weight: "",
            senderName: "",
            senderAddress: "",
            recipientName: "",
            recipientAddress: "",
            recipientPhone: "",
            estimatedDelivery: ""
        });
    };

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        try {
            const nextId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
            const nextCode = `FX-2026-${String(nextId).padStart(3, '0')}`;

            const initialEvent = {
                status: "picked_up",
                label: "Package Registered",
                description: "Package received and registered at the pickup location.",
                location: formData.senderAddress.split(',')[0]?.trim() || "Origin Hub",
                timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            };

            const selectedFiles = formData?.mediaFiles || [];
            const imageFiles = selectedFiles.filter((f) => (f?.type || '').startsWith('image/'));
            const videoFiles = selectedFiles.filter((f) => (f?.type || '').startsWith('video/'));

            // Create package first so we can upload into its dedicated folder.
            const newPackage = {
                id: nextId,
                trackingCode: nextCode,
                sender: {
                    name: formData.senderName,
                    address: formData.senderAddress,
                },
                recipient: {
                    name: formData.recipientName,
                    address: formData.recipientAddress,
                    phone: formData.recipientPhone,
                },
                description: formData.description,
                weight: formData.weight,
                estimatedDelivery: formData.estimatedDelivery || "TBD",
                currentStatus: "picked_up",
                events: [initialEvent],
                ...(selectedFiles.length > 0 ? { media: { imageUrls: [], videoUrls: [] } } : {}),
            };

            const docRef = await addDoc(collection(db, "packages"), newPackage);

            const uploadFiles = async (files, folderName) => {
                const urls = [];
                for (const file of files) {
                    const storageRef = ref(storage, `packages_media/${docRef.id}/${folderName}/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    urls.push(url);
                }
                return urls;
            };

            if (selectedFiles.length > 0) {
                const [imageUrls, videoUrls] = await Promise.all([
                    uploadFiles(imageFiles, 'images'),
                    uploadFiles(videoFiles, 'videos'),
                ]);

                await updateDoc(docRef, {
                    media: {
                        imageUrls,
                        videoUrls,
                    },
                });

                newPackage.media = { imageUrls, videoUrls };
            }

            setReceiptData(newPackage);
            setShowReceipt(true);
            setIsAdding(false);
            resetForm();
        } catch (err) {
            console.error("Error creating package:", err);
            alert("Failed to create package. Check your Firebase permissions.");
        }
    };

    const openEditModal = (pkg) => {
        setSelectedPackage(pkg);
        setFormData({
            description: pkg.description,
            weight: pkg.weight,
            senderName: pkg.sender.name,
            senderAddress: pkg.sender.address,
            recipientName: pkg.recipient.name,
            recipientAddress: pkg.recipient.address,
            recipientPhone: pkg.recipient.phone || "",
            estimatedDelivery: pkg.estimatedDelivery
        });
        setIsEditing(true);
    };

    const handleUpdatePackageDetails = async (e) => {
        e.preventDefault();
        try {
            const pkgRef = doc(db, "packages", selectedPackage.firestoreId);
            const updatedData = {
                description: formData.description,
                weight: formData.weight,
                sender: { ...selectedPackage.sender, name: formData.senderName, address: formData.senderAddress },
                recipient: { ...selectedPackage.recipient, name: formData.recipientName, address: formData.recipientAddress, phone: formData.recipientPhone },
                estimatedDelivery: formData.estimatedDelivery
            };

            await updateDoc(pkgRef, updatedData);
            setIsEditing(false);
            setSelectedPackage(null);
            resetForm();
        } catch (err) {
            console.error("Error updating package details:", err);
            alert("Failed to update package details.");
        }
    };

    const updatePackageStatus = async (pkgId, firestoreId, newStatus, location, description) => {
        if (newStatus === 'custom_clearance') {
            // Show customs warning popup instead of direct update
            setPendingStatusUpdate({ pkgId, firestoreId, location, description });
            setTempCustomsWarning(customsWarning);
            setShowCustomsPopup(true);
            return;
        }

        try {
            const pkgRef = doc(db, "packages", firestoreId);

            const newEvent = {
                status: newStatus,
                label: statusLabels[newStatus] || newStatus,
                description: description || `Package status updated to ${statusLabels[newStatus]}.`,
                location: location || "",
                timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            };

            await updateDoc(pkgRef, {
                currentStatus: newStatus,
                events: arrayUnion(newEvent),
            });

            setSelectedPackage(null);
            setStatusForm({ location: "", description: "" });
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status.");
        }
    };

    const confirmCustomsStatus = async () => {
        if (!pendingStatusUpdate) return;

        try {
            // Update the warning message in admin settings if changed
            if (tempCustomsWarning !== customsWarning) {
                const settingsRef = doc(db, "adminSettings", "customs_warning");
                await updateDoc(settingsRef, { message: tempCustomsWarning });
                setCustomsWarning(tempCustomsWarning);
            }

            // Proceed with package status update
            const pkgRef = doc(db, "packages", pendingStatusUpdate.firestoreId);
            const newEvent = {
                status: 'custom_clearance',
                label: statusLabels.custom_clearance || "Custom Clearance",
                description: pendingStatusUpdate.description || `Package status updated to ${statusLabels.custom_clearance}.`,
                location: pendingStatusUpdate.location || "",
                timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            };

            await updateDoc(pkgRef, {
                currentStatus: 'custom_clearance',
                events: arrayUnion(newEvent),
            });

            setSelectedPackage(null);
            setStatusForm({ location: "", description: "" });
        } catch (err) {
            console.error("Error confirming customs status:", err);
            alert("Failed to update customs status.");
        } finally {
            setShowCustomsPopup(false);
            setPendingStatusUpdate(null);
        }
    };


    return (
        <div className="admin-layout">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={isSidebarOpen}
                onToggle={setIsSidebarOpen}
                onLogout={handleLogout}
            />

            <main className="admin-main">
                <Topbar
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    onAddShipment={() => setIsAdding(true)}
                />

                <div className="admin-page-content">
                    {activeTab === 'support' ? (
                        <ChatHub
                            chats={chats}
                            chatSearchTerm={chatSearchTerm}
                            onChatSearchChange={setChatSearchTerm}
                            activeChatId={activeChatId}
                            onChatSelect={setActiveChatId}
                            activeMessages={activeMessages}
                            adminChatText={adminChatText}
                            onAdminSendMessage={handleAdminSendMessage}
                            adminFileInputRef={adminFileInputRef}
                            onAdminImageUpload={handleAdminImageUpload}
                            isAdminUploading={isAdminUploading}
                            onDeleteMessage={handleDeleteMessage}
                            onChatTextChange={setAdminChatText}
                        />
                    ) : activeTab === 'dashboard' || activeTab === 'shipments' ? (
                        <ShipmentsTable
                            packages={packages}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEdit={openEditModal}
                            onStatus={setSelectedPackage}
                            onReceipt={(pkg) => {
                                setReceiptData(pkg);
                                setShowReceipt(true);
                            }}
                            onDelete={handleDeletePackage}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🚧</div>
                            <h2>Section Under Construction</h2>
                            <p>The {activeTab} module is coming soon in the next update.</p>
                            <button className="submit-btn" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
                        </div>
                    )}
                </div>
            </main>

            <AddPackageModal
                isOpen={isAdding || isEditing}
                isEditing={isEditing}
                packageData={selectedPackage}
                formData={formData}
                onChange={setFormData}
                onSubmit={isAdding ? handleCreatePackage : handleUpdatePackageDetails}
                onClose={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    resetForm();
                }}
            />

            <StatusUpdaterModal
                pkg={selectedPackage}
                statusForm={statusForm}
                onStatusFormChange={setStatusForm}
                onStatusUpdate={updatePackageStatus}
                onClose={() => setSelectedPackage(null)}
            />

            <CustomsWarningModal
                isOpen={showCustomsPopup}
                customsWarning={customsWarning}
                tempCustomsWarning={tempCustomsWarning}
                onTempChange={setTempCustomsWarning}
                onConfirm={confirmCustomsStatus}
                onClose={() => {
                    setShowCustomsPopup(false);
                    setPendingStatusUpdate(null);
                }}
            />

            {showReceipt && receiptData && (
                <ProfessionalShipmentReceipt
                    pkg={receiptData}
                    onClose={() => setShowReceipt(false)}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
