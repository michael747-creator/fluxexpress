import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { statusLabels, statusColors } from "../../data/packages";
import { db, auth, storage } from "../../firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import ShipmentReceipt from "./ShipmentReceipt";
import Logo from "../../components/Logo";
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
    const navigate = useNavigate();
    const adminMessagesEndRef = useRef(null);
    const adminFileInputRef = useRef(null);

    const scrollToBottom = () => {
        adminMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    // Fetch Chats List with unread counts
    React.useEffect(() => {
        const q = collection(db, "chats");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Add unread count logic for admin messages
            const chatsWithCounts = chatList.map(chat => ({
                ...chat,
                unreadCount: chat.lastAdminMessageAt && chat.updatedAt && chat.lastAdminMessageAt.seconds < chat.updatedAt.seconds ? 1 : 0
            }));
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

    const handleAdminSendMessage = async (e, imageUrl = null) => {
        if (e) e.preventDefault();
        if (!adminChatText.trim() && !imageUrl || !activeChatId) return;

        const text = adminChatText;
        setAdminChatText("");

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
            };

            await addDoc(collection(db, "packages"), newPackage);

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

    const filteredPackages = packages.filter(pkg =>
        pkg.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <Logo light={true} />
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                    >
                        <span className="sidebar-nav-icon">📊</span> Overview
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'shipments' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('shipments'); setIsSidebarOpen(false); }}
                    >
                        <span className="sidebar-nav-icon">📦</span> Shipments
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'support' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }}
                    >
                        <span className="sidebar-nav-icon">💬</span> Support Chat
                    </button>
                    <button
                        className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                    >
                        <span className="sidebar-nav-icon">⚙️</span> Settings
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
                        <h1>Operations Dashboard</h1>
                    </div>
                    <div className="admin-topbar-right">
                        <button className="add-package-btn" onClick={() => setIsAdding(true)}>
                            <span>➕</span> Add Shipment
                        </button>
                        <div className="admin-user-badge">
                            <div className="admin-user-avatar">A</div>
                            <span>Administrator</span>
                        </div>
                    </div>
                </header>

                <div className="admin-page-content">
                    {activeTab === 'support' ? (
                        <div className="chat-hub-container">
                            <aside className="chat-inbox">
                                <div className="inbox-header">
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3>Live Conversations ({chats.length})</h3>
                                        <input
                                            type="text"
                                            className="chat-search-input"
                                            placeholder="Search chats..."
                                            onChange={(e) => setChatSearchTerm(e.target.value)}
                                            style={{ padding: '0.5rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Active sessions</p>
                                </div>
                                <div className="inbox-list">
                                    {chats.filter(chat =>
                                        chat.trackingCode?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
                                        chat.userEmail?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
                                        chat.lastMessage?.toLowerCase().includes(chatSearchTerm.toLowerCase())
                                    ).length > 0 ? (
                                        chats.filter(chat =>
                                            chat.trackingCode?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
                                            chat.userEmail?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
                                            chat.lastMessage?.toLowerCase().includes(chatSearchTerm.toLowerCase())
                                        ).map(chat => (
                                            <div
                                                key={chat.id}
                                                className={`inbox-item ${activeChatId === chat.id ? 'active' : ''}`}
                                                onClick={() => setActiveChatId(chat.id)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <h4>
                                                        {chat.trackingCode
                                                            ? <><span style={{ color: '#0d6efd' }}>📦</span> {chat.trackingCode}</>
                                                            : chat.userEmail || "Guest User"
                                                        }
                                                    </h4>
                                                    <button
                                                        className="chat-status-toggle"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Toggle chat status
                                                            updateDoc(doc(db, "chats", chat.id), {
                                                                status: chat.status === 'active' ? 'closed' : 'active'
                                                            });
                                                        }}
                                                        style={{
                                                            padding: '2px 8px',
                                                            fontSize: '0.7rem',
                                                            borderRadius: '4px',
                                                            background: chat.status === 'active' ? '#e6fffa' : '#fee2e2',
                                                            color: chat.status === 'active' ? '#198754' : '#dc3545',
                                                            border: '1px solid',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {chat.status === 'active' ? 'Active' : 'Closed'}
                                                    </button>
                                                </div>
                                                <p>{chat.lastMessage}</p>
                                                {chat.unreadCount > 0 && (
                                                    <span style={{ background: '#e94560', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                                <small style={{ fontSize: '0.7rem', color: '#aaa' }}>
                                                    {chat.updatedAt?.toDate ? chat.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                </small>
                                            </div>
                                        ))
                                    ) : (

                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#ccc' }}>
                                            No active chats
                                        </div>
                                    )}
                                </div>
                            </aside>

                            <section className="active-chat-window">
                                {activeChatId ? (
                                    <>
                                        <div className="chat-thread">
                                            {activeMessages.map(msg => (
                                                <div key={msg.id} className={`chat-msg-wrapper ${msg.sender === 'admin' ? 'wrapper-admin' : 'wrapper-user'}`}>
                                                    <button
                                                        className="msg-delete-btn"
                                                        title="Delete message"
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                    >🗑️</button>
                                                    <div className={msg.sender === 'admin' ? 'admin-bubble' : 'user-bubble'}>
                                                        {msg.imageUrl && (
                                                            <img src={msg.imageUrl} alt="attachment" className="chat-bubble-image" style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />
                                                        )}
                                                        {msg.text && <div>{msg.text}</div>}
                                                        <span className="chat-time">
                                                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={adminMessagesEndRef} />
                                            {isAdminUploading && (
                                                <div className="admin-bubble" style={{ opacity: 0.7 }}>
                                                    📷 Uploading image...
                                                </div>
                                            )}
                                            {activeMessages.length === 0 && (
                                                <div style={{ textAlign: 'center', color: '#ccc', marginTop: '20%' }}>
                                                    Starting conversation...
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                            <button type="button" className="quick-reply-btn" onClick={() => setAdminChatText(prev => prev ? prev + ' ' : '') + 'Your package is on schedule 📦'}>On Schedule</button>
                                            <button type="button" className="quick-reply-btn" onClick={() => setAdminChatText('We\'re investigating the delay 🔍')}>Investigating Delay</button>
                                            <button type="button" className="quick-reply-btn" onClick={() => setAdminChatText('Package delivered successfully ✅')}>Delivered</button>
                                            <button type="button" className="quick-reply-btn" onClick={() => setAdminChatText('Estimated delivery updated 📅')}>ETA Updated</button>
                                        </div>
                                        <form className="admin-chat-footer" onSubmit={handleAdminSendMessage}>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                ref={adminFileInputRef}
                                                accept="image/*"
                                                onChange={handleAdminImageUpload}
                                            />
                                            <button
                                                type="button"
                                                className="admin-attach-btn"
                                                onClick={() => adminFileInputRef.current.click()}
                                                disabled={isAdminUploading}
                                                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                                            >
                                                📷
                                            </button>
                                            <input
                                                type="text"
                                                className="admin-chat-input"
                                                placeholder="Type your response or use quick replies above..."
                                                value={adminChatText}
                                                onChange={(e) => setAdminChatText(e.target.value)}
                                            />
                                            <button type="submit" className="admin-send-btn" disabled={isAdminUploading}>Send</button>
                                        </form>
                                    </>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                        <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</span>
                                        <p>Select a conversation to start chatting</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : activeTab === 'dashboard' || activeTab === 'shipments' ? (
                        <>
                            <div className="dashboard-stats">
                                <div className="stat-card">
                                    <div className="stat-card-icon" style={{ background: '#e8f0fe', color: '#0d6efd' }}>📦</div>
                                    <div className="stat-card-info">
                                        <h3>{packages.length}</h3>
                                        <p>Total Shipments</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-icon" style={{ background: '#fff4e5', color: '#fd7e14' }}>🚚</div>
                                    <div className="stat-card-info">
                                        <h3>{packages.filter(p => p.currentStatus !== 'delivered').length}</h3>
                                        <p>Active Deliveries</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-icon" style={{ background: '#e6fffa', color: '#198754' }}>✅</div>
                                    <div className="stat-card-info">
                                        <h3>{packages.filter(p => p.currentStatus === 'delivered').length}</h3>
                                        <p>Completed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="table-card">
                                <div className="table-card-header">
                                    <h2>Shipment Registry</h2>
                                    <input
                                        type="text"
                                        className="table-search"
                                        placeholder="Search Shipment..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="packages-table">
                                        <thead>
                                            <tr>
                                                <th className="sticky-column-left">Tracking ID</th>
                                                <th>Recipient</th>
                                                <th>Status</th>
                                                <th>Destination</th>
                                                <th className="sticky-column-right" style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPackages.length > 0 ? (
                                                filteredPackages.map(pkg => (
                                                    <tr key={pkg.id}>
                                                        <td className="tracking-code-cell">{pkg.trackingCode}</td>
                                                        <td>{pkg.recipient.name}</td>
                                                        <td>
                                                            <span
                                                                className="status-badge"
                                                                style={{
                                                                    backgroundColor: statusColors[pkg.currentStatus] + '20',
                                                                    color: statusColors[pkg.currentStatus]
                                                                }}
                                                            >
                                                                {statusLabels[pkg.currentStatus]}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: '0.82rem', color: '#666' }}>{pkg.recipient.address.split(',')[1] || "Global"}</td>
                                                        <td className="actions-cell">
                                                            <button
                                                                className="table-action-btn edit-btn"
                                                                onClick={(e) => { e.stopPropagation(); openEditModal(pkg); }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="table-action-btn receipt-btn"
                                                                onClick={(e) => { e.stopPropagation(); setReceiptData(pkg); setShowReceipt(true); }}
                                                            >
                                                                Receipt
                                                            </button>
                                                            <button
                                                                className="table-action-btn status-btn"
                                                                onClick={(e) => { e.stopPropagation(); setSelectedPackage(pkg); }}
                                                            >
                                                                Status
                                                            </button>
                                                            <button
                                                                className="table-action-btn delete-btn"
                                                                onClick={(e) => { e.stopPropagation(); handleDeletePackage(pkg.firestoreId, pkg.trackingCode); }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No shipments found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
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

            {/* Modals */}
            {(isAdding || isEditing) && (
                <div className="modal-overlay" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}>
                    <div className="add-package-form" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem' }}>
                            <h2 style={{ margin: 0 }}>{isAdding ? "Register Shipment" : `Edit: ${selectedPackage?.trackingCode}`}</h2>
                            <button onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <form onSubmit={isAdding ? handleCreatePackage : handleUpdatePackageDetails}>
                            <div className="form-grid">
                                <div className="form-group-light">
                                    <label>Description</label>
                                    <input required type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="form-group-light">
                                    <label>Weight (kg)</label>
                                    <input required type="text" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                                </div>
                                <div className="form-group-light">
                                    <label>Est. Delivery</label>
                                    <input type="text" value={formData.estimatedDelivery} onChange={e => setFormData({ ...formData, estimatedDelivery: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                                <div className="address-section-form">
                                    <h3 style={{ fontSize: '0.85rem', marginBottom: '0.8rem', color: '#1a1a2e' }}>Sender</h3>
                                    <div className="form-group-light" style={{ marginBottom: '0.6rem' }}>
                                        <input required type="text" placeholder="Name" value={formData.senderName} onChange={e => setFormData({ ...formData, senderName: e.target.value })} />
                                    </div>
                                    <div className="form-group-light">
                                        <textarea required placeholder="Address" value={formData.senderAddress} onChange={e => setFormData({ ...formData, senderAddress: e.target.value })}></textarea>
                                    </div>
                                </div>

                                <div className="address-section-form">
                                    <h3 style={{ fontSize: '0.85rem', marginBottom: '0.8rem', color: '#1a1a2e' }}>Recipient</h3>
                                    <div className="form-group-light" style={{ marginBottom: '0.6rem' }}>
                                        <input required type="text" placeholder="Name" value={formData.recipientName} onChange={e => setFormData({ ...formData, recipientName: e.target.value })} />
                                    </div>
                                    <div className="form-group-light" style={{ marginBottom: '0.6rem' }}>
                                        <input type="text" placeholder="Phone" value={formData.recipientPhone} onChange={e => setFormData({ ...formData, recipientPhone: e.target.value })} />
                                    </div>
                                    <div className="form-group-light">
                                        <textarea required placeholder="Address" value={formData.recipientAddress} onChange={e => setFormData({ ...formData, recipientAddress: e.target.value })}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions" style={{ marginTop: '1.5rem', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="submit-btn">{isAdding ? "Register" : "Save Changes"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedPackage && !isEditing && (
                <div className="modal-overlay" onClick={() => setSelectedPackage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="status-updater" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f0f2f5', paddingBottom: '0.8rem' }}>
                            <h2 style={{ margin: 0 }}>Update Status: {selectedPackage?.trackingCode}</h2>
                            <button onClick={() => setSelectedPackage(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="form-group-light" style={{ marginBottom: '1rem' }}>
                                <label>Current Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. London Hub, UK"
                                    value={statusForm.location}
                                    onChange={(e) => setStatusForm({ ...statusForm, location: e.target.value })}
                                />
                            </div>
                            <div className="form-group-light">
                                <label>Status Description (Optional)</label>
                                <textarea
                                    placeholder="Add more details about this status update..."
                                    value={statusForm.description}
                                    onChange={(e) => setStatusForm({ ...statusForm, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>Select operational status to apply:</p>
                        <div className="status-options" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <div
                                    key={key}
                                    className={`status-option ${selectedPackage.currentStatus === key ? 'selected' : ''}`}
                                    onClick={() => updatePackageStatus(selectedPackage.id, selectedPackage.firestoreId, key, statusForm.location, statusForm.description)}
                                    style={{ padding: '0.8rem' }}
                                >
                                    <div className="status-option-label" style={{ fontSize: '0.75rem' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                            <button className="cancel-btn" onClick={() => setSelectedPackage(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            {showReceipt && receiptData && (
                <ShipmentReceipt
                    pkg={receiptData}
                    onClose={() => setShowReceipt(false)}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
