import React, { useRef, useEffect } from 'react';
import '../../admin/styles/admin.css';

const ChatHub = ({
    chats = [],
    chatSearchTerm,
    onChatSearchChange,
    activeChatId,
    onChatSelect,
    activeMessages = [],
    adminChatText,
    onAdminSendMessage,
    adminFileInputRef,
    onAdminImageUpload,
    isAdminUploading,
    onDeleteMessage,
    onChatTextChange
}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages]);

    const filteredChats = chats.filter(chat =>
        chat.trackingCode?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
        chat.userEmail?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(chatSearchTerm.toLowerCase())
    );

    const quickReplies = [
        'Your package is currently in transit and on schedule. 📦',
        'We are investigating the delay with the local hub. 🔍',
        'Your shipment has been successfully delivered. ✅',
        'Estimated delivery has been updated. Please check your tracking. 📅'
    ];

    return (
        <div className="chat-hub-container">
            <aside className="chat-inbox">
                <div className="inbox-header">
                    <h3>Conversations</h3>
                    <input
                        type="text"
                        className="chat-search-input"
                        placeholder="Search chats..."
                        value={chatSearchTerm}
                        onChange={(e) => onChatSearchChange(e.target.value)}
                    />
                </div>

                <div className="inbox-list">
                    {filteredChats.length > 0 ? (
                        filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                className={`inbox-item ${activeChatId === chat.id ? 'active' : ''}`}
                                onClick={() => onChatSelect(chat.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                                        {chat.trackingCode || 'Guest User'}
                                    </h4>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                                        {chat.updatedAt?.toDate ? chat.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {chat.lastMessage}
                                </p>
                                {chat.unreadCount > 0 && (
                                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.625rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>NEW</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>
                            No active conversations
                        </div>
                    )}
                </div>
            </aside>

            <section className="active-chat-window">
                {activeChatId ? (
                    <>
                        <div style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Support Session</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● Active Now</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {activeMessages.map(msg => (
                                <div 
                                    key={msg.id} 
                                    style={{ 
                                        alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{ 
                                        padding: '0.75rem 1rem', 
                                        borderRadius: '16px', 
                                        background: msg.sender === 'admin' ? 'var(--primary)' : 'white',
                                        color: msg.sender === 'admin' ? 'white' : 'var(--gray-800)',
                                        boxShadow: 'var(--shadow-sm)',
                                        borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '16px',
                                        borderBottomLeftRadius: msg.sender === 'admin' ? '16px' : '4px',
                                        position: 'relative'
                                    }}>
                                        {msg.imageUrl && (
                                            <img src={msg.imageUrl} alt="attachment" style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }} />
                                        )}
                                        <div style={{ fontSize: '0.925rem', lineHeight: 1.5 }}>{msg.text}</div>
                                        <div style={{ 
                                            fontSize: '0.625rem', 
                                            marginTop: '0.25rem', 
                                            opacity: 0.7, 
                                            textAlign: 'right' 
                                        }}>
                                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                        </div>
                                        <button 
                                            onClick={() => onDeleteMessage(msg.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: msg.sender === 'admin' ? 'auto' : '-8px',
                                                left: msg.sender === 'admin' ? '-8px' : 'auto',
                                                background: 'var(--danger)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                fontSize: '10px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 'var(--shadow)'
                                            }}
                                            title="Delete message"
                                        >✕</button>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{ padding: '1rem 2rem', background: 'white', borderTop: '1px solid var(--gray-100)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                        onClick={() => onAdminSendMessage(null, null, reply)}
                                    >
                                        {reply.length > 30 ? reply.substring(0, 30) + '...' : reply}
                                    </button>
                                ))}
                            </div>

                            <form style={{ display: 'flex', gap: '1rem' }} onSubmit={(e) => onAdminSendMessage(e)}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => adminFileInputRef.current?.click()}
                                    disabled={isAdminUploading}
                                    style={{ padding: '0.75rem' }}
                                >
                                    📷
                                </button>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={adminFileInputRef}
                                    accept="image/*"
                                    onChange={onAdminImageUpload}
                                />
                                <input
                                    type="text"
                                    className="form-group-light"
                                    style={{ flex: 1, margin: 0 }}
                                    placeholder="Type your message..."
                                    value={adminChatText}
                                    onChange={(e) => onChatTextChange(e.target.value)}
                                    disabled={isAdminUploading}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isAdminUploading || !adminChatText?.trim()}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                        <p>Select a conversation to start helping customers</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ChatHub;
