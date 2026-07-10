import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/user.css";

function SupportButton({ trackingCode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [showGreeting, setShowGreeting] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Show greeting after 3 seconds if chat is not already open
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowGreeting(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Determine session ID — tracking code takes priority over random ID
    useEffect(() => {
        if (trackingCode) {
            setSessionId(trackingCode);
        } else {
            let storedId = localStorage.getItem("chatSessionId");
            if (!storedId) {
                storedId = "chat_" + Math.random().toString(36).substr(2, 9);
                localStorage.setItem("chatSessionId", storedId);
            }
            setSessionId(storedId);
        }
    }, [trackingCode]);

    useEffect(() => {
        if (sessionId && isOpen) {
            const chatRef = doc(db, "chats", sessionId);
            getDoc(chatRef).then(docSnap => {
                if (!docSnap.exists()) {
                    setDoc(chatRef, {
                        status: "active",
                        updatedAt: serverTimestamp(),
                        lastMessage: trackingCode ? `Query about ${trackingCode}` : "Conversation started",
                        userEmail: "Guest User",
                        trackingCode: trackingCode || null,
                    });
                }
            });

            const q = query(
                collection(db, "chats", sessionId, "messages"),
                orderBy("timestamp", "asc")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [sessionId, isOpen, trackingCode]);

    const handleSendMessage = async (e, imageUrl = null) => {
        if (e) e.preventDefault();
        if (!inputText.trim() && !imageUrl) return;

        const text = inputText;
        setInputText("");

        try {
            const chatRef = doc(db, "chats", sessionId);
            await addDoc(collection(chatRef, "messages"), {
                text: text || "",
                imageUrl: imageUrl || null,
                sender: "user",
                timestamp: serverTimestamp()
            });
            await setDoc(chatRef, {
                lastMessage: imageUrl ? "📷 Image Sent" : text,
                updatedAt: serverTimestamp(),
                trackingCode: trackingCode || null,
            }, { merge: true });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const storageRef = ref(storage, `chat_attachments/${sessionId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            await handleSendMessage(null, url);
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Failed to send image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        setShowGreeting(false);
    };

    return (
        <div
            className="support-chat-widget-root"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.75rem',
            }}
        >
            {showGreeting && !isOpen && (
                <div
                    className="support-greeting-bubble"
                    onClick={handleOpenChat}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="greeting-close" onClick={(e) => {
                        e.stopPropagation();
                        setShowGreeting(false);
                    }}>×</div>
                    <div className="greeting-avatar">👋</div>
                    <div className="greeting-text">
                        <strong>Support Team</strong>
                        <p>👋 Welcome to FluxExpress Support! Need help tracking a shipment or have a question? We're here 24/7 — start a chat!</p>
                    </div>
                </div>
            )}

            <button
                className="support-floating-btn"
                onClick={handleOpenChat}
                title="Live Support"
                style={{ cursor: 'pointer' }}
            >
                💬
            </button>

            {isOpen && (
                <div
                    className="support-modal-overlay"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: '20px',
                    }}
                >
                    <div className="support-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="chat-header">
                            <div className="chat-status-dot"></div>
                            <div style={{ flex: 1 }}>
                                <h2>FluxExpress Support</h2>
                                {trackingCode && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        📦 Re: Shipment {trackingCode}
                                    </div>
                                )}
                            </div>
                            <button
                                className="support-close-btn"
                                style={{ position: 'relative', top: 0, right: 0, marginLeft: 'auto' }}
                                onClick={() => setIsOpen(false)}
                            >×</button>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 && (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                                    <p>{trackingCode
                                        ? `Ask us anything about shipment ${trackingCode}`
                                        : 'Welcome! How can we help you today?'
                                    }</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-bubble message-${msg.sender}`}>
                                    {msg.imageUrl && (
                                        <div className="chat-image-container">
                                            <img src={msg.imageUrl} alt="attachment" className="chat-bubble-image" />
                                        </div>
                                    )}
                                    {msg.text && <div>{msg.text}</div>}
                                    <span className="message-time">
                                        {msg.timestamp?.toDate
                                            ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : "Sending..."}
                                    </span>
                                </div>
                            ))}
                            {isUploading && (
                                <div className="message-bubble message-user" style={{ opacity: 0.7 }}>
                                    📷 Uploading image...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                className="chat-attach-btn"
                                onClick={() => fileInputRef.current.click()}
                                disabled={isUploading}
                            >
                                📷
                            </button>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder={trackingCode ? `Ask about ${trackingCode}...` : "Type a message..."}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" className="chat-send-btn">✈️</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupportButton;
