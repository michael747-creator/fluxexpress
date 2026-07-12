import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { db, storage } from "../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../user/styles/user.css";

function SupportChatWidget({ trackingCode }) {
    const [open, setOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [sending, setSending] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleOpenSupportChat = () => {
            setOpen(true);
        };

        window.addEventListener("openSupportChat", handleOpenSupportChat);
        return () => window.removeEventListener("openSupportChat", handleOpenSupportChat);
    }, []);

    useEffect(() => {
        const storedId = localStorage.getItem("fluxexpress_chat_id");
        const nextId = trackingCode || storedId || `chat_${Math.random().toString(36).slice(2, 11)}`;
        if (!storedId && !trackingCode) {
            localStorage.setItem("fluxexpress_chat_id", nextId);
        }
        setSessionId(nextId);
    }, [trackingCode]);

    useEffect(() => {
        if (!sessionId) return;
        const chatRef = doc(db, "chats", sessionId);
        getDoc(chatRef)
            .then((docSnap) => {
                if (!docSnap.exists()) {
                    return setDoc(chatRef, {
                        status: "active",
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        trackingCode: trackingCode || null,
                        lastMessage: "Support chat started",
                    });
                }
            })
            .catch((err) => console.error("Support chat init error:", err));
    }, [sessionId, trackingCode]);

    useEffect(() => {
        if (!open || !sessionId) return;
        const messagesQuery = query(
            collection(db, "chats", sessionId, "messages"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
        });
        return unsubscribe;
    }, [open, sessionId]);

    const toggleOpen = () => {
        setError(null);
        setOpen((prevOpen) => !prevOpen);
    };

    const handleSend = async (event) => {
        event.preventDefault();
        const text = messageText.trim();
        if (!text || !sessionId) return;

        setSending(true);
        setError(null);

        try {
            const chatRef = doc(db, "chats", sessionId);
            await addDoc(collection(chatRef, "messages"), {
                text,
                sender: "user",
                timestamp: serverTimestamp(),
            });
            await setDoc(
                chatRef,
                {
                    lastMessage: text.slice(0, 120),
                    updatedAt: serverTimestamp(),
                    trackingCode: trackingCode || null,
                },
                { merge: true }
            );
            setMessageText("");
        } catch (sendErr) {
            console.error("Support chat send failed:", sendErr);
            setError("Unable to send your message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !sessionId) return;

        setUploadingImage(true);
        setError(null);

        try {
            const storageRef = ref(storage, `chat_attachments/${sessionId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            const chatRef = doc(db, "chats", sessionId);
            await addDoc(collection(chatRef, "messages"), {
                text: "",
                imageUrl: url,
                sender: "user",
                timestamp: serverTimestamp(),
            });
            await setDoc(
                chatRef,
                {
                    lastMessage: "📷 Image sent",
                    updatedAt: serverTimestamp(),
                    trackingCode: trackingCode || null,
                },
                { merge: true }
            );
        } catch (uploadErr) {
            console.error("Support chat image upload failed:", uploadErr);
            setError("Unable to upload your image. Please try again.");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    };

    return (
        <>
            <button
                type="button"
                className="support-chat-toggle"
                onClick={toggleOpen}
                aria-label="Open support chat"
            >
                <MessageCircle size={22} />
            </button>

            {open && (
                <div className="support-chat-overlay" onClick={toggleOpen}>
                    <div className="support-chat-panel" onClick={(event) => event.stopPropagation()}>
                        <div className="support-chat-header">
                            <div>
                                <div className="support-chat-title">FluxExpress Support</div>
                                {trackingCode && (
                                    <div className="support-chat-subtitle">Shipment: {trackingCode}</div>
                                )}
                            </div>
                            <button
                                type="button"
                                className="support-chat-close"
                                onClick={toggleOpen}
                                aria-label="Close support chat"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="support-chat-body">
                            {messages.length === 0 ? (
                                <div className="support-chat-empty">
                                    Send a message and our support team will respond shortly.
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`support-chat-message ${message.sender === "admin"
                                            ? "support-chat-admin"
                                            : "support-chat-user"
                                            }`}
                                    >
                                        {message.imageUrl && (
                                            <div className="support-chat-image-wrapper">
                                                <img
                                                    src={message.imageUrl}
                                                    alt="attachment"
                                                    className="support-chat-image"
                                                    loading="lazy"
                                                    width="320"
                                                    height="240"
                                                />
                                            </div>
                                        )}
                                        {message.text && (
                                            <div className="support-chat-message-text">{message.text}</div>
                                        )}
                                        <div className="support-chat-message-meta">
                                            {message.sender === "admin" ? "Support" : "You"}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <form className="support-chat-input-row" onSubmit={handleSend}>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                className="support-chat-send"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                style={{ minWidth: '48px' }}
                            >
                                📷
                            </button>
                            <input
                                className="support-chat-input"
                                type="text"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(event) => setMessageText(event.target.value)}
                            />
                            <button
                                className="support-chat-send"
                                type="submit"
                                disabled={sending || !messageText.trim()}
                            >
                                Send
                            </button>
                        </form>
                        {uploadingImage && (
                            <div className="support-chat-error" style={{ color: '#d1fae5' }}>
                                Uploading image...
                            </div>
                        )}
                        {error && <div className="support-chat-error">{error}</div>}
                    </div>
                </div>
            )}
        </>
    );
}

export default SupportChatWidget;
