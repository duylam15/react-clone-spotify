import { getUserInfo, handleUnauthorized } from "@/services/user";
import React, { useState, useEffect, useRef } from "react";

const ChatButton = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const isDragging = useRef(false);
    const isSend = useRef(false);
    const [position, setPosition] = useState({ x: 20, y: 300 });
    const [loading, setLoading] = useState(false);
    const buttonRef = useRef(null);
    const dragStart = useRef(null);
    const messagesEndRef = useRef(null);

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        avatar_url: ""
    })

    const fetchUserDatas = async () => {
        
    
    }

    useEffect(() => {
        // if (userData.email == "") { setIsOpen(false); return; }
        if (isOpen) {
            const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

            ws.onopen = () => console.log("WebSocket Connected!");

            ws.onmessage = (event) => {
                console.log("Received message:", event.data);

                const data = JSON.parse(event.data);

                const newMessage = {
                    ...data,
                    timestamp: data.timestamp || new Date().toISOString()
                };

                if (data.messages) {
                    setMessages(data.messages.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp || new Date().toISOString()
                    })));
                } else {
                    setMessages((prev) => [...prev, newMessage]);
                }
            };
            ws.onerror = (error) => console.error("WebSocket Error:", error);
            ws.onclose = () => console.log("WebSocket Disconnected!");

            setSocket(ws);

            return () => {
                ws.close();
            };
        }
    }, [isOpen, loading]);

    useEffect(() => {
        // if (userData.email == "") { setIsOpen(false); return; }
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if(localStorage.getItem("idLogin") == undefined)
        {
            handleUnauthorized();
            return ;
        }
        if (socket && message.trim()) {
            const userData = await getUserInfo("");
            setUserData({
                username: userData.ten_hien_thi,
                email: userData.email,
                avatar_url: userData.avatar_url
            });
            const dataToSend = {
                username: userData.username,
                email: userData.email,
                avatar_url: userData.avatar_url,
                message: message,
                timestamp: new Date().toISOString(),
            };
            console.log("Sending message:", dataToSend); // ✅ Debug
            setMessages((prev) => [...prev, dataToSend]);
            setLoading(!loading)
            socket.send(JSON.stringify(dataToSend));
            setMessage("");
        }
    };

    const handleMouseDown = (e) => {
        isDragging.current = false; // Reset trạng thái kéo
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        isDragging.current = true; // Khi di chuyển, đánh dấu là đang kéo
        if (!dragStart.current) return;

        // Lấy kích thước thực tế của phần tử
        const elementWidth = buttonRef.current?.clientWidth || 70;
        const elementHeight = buttonRef.current?.clientHeight || 50;

        // Tính toán vị trí mới
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        // Giới hạn trong phạm vi màn hình
        const maxX = window.innerWidth - elementWidth;
        const maxY = window.innerHeight - elementHeight;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        });
    };



    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        dragStart.current = null;

    };

    return (
        <div style={{ position: "fixed", left: position.x, top: position.y, zIndex: 10000 }}>
            <button
                ref={buttonRef}
                onMouseDown={handleMouseDown}
                onClick={() => {
                    if (!isDragging.current) {
                        setIsOpen(!isOpen);
                    }
                }}
                style={{
                    padding: "12px 20px",
                    background: "#1DB954",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "grab",
                    fontSize: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}
            >
                💬 Chat
            </button>
    
            {isOpen && (
                <div style={{
                    width: "400px",
                    height: "500px",
                    background: "#212121",  // Xám đậm, dễ phân biệt nền Spotify
                    border: "1px solid #282828",
                    padding: "15px",
                    borderRadius: "12px",
                    marginTop: "10px",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
                }}>
                    {/* Phần danh sách tin nhắn */}
                    <div
                        ref={messagesEndRef}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            borderBottom: "1px solid #333",
                            paddingBottom: "10px",
                            paddingRight: "5px"
                        }}
                    >
                        {messages.length === 0 ? (
                            <p style={{ textAlign: "center", color: "#aaa" }}>Không có tin nhắn nào!</p>
                        ) : null}
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                                padding: "5px",
                                borderRadius: "5px",
                                background: "#282828"  // Màu tin nhắn
                            }}>
                                <img src={msg.avatar_url} alt="Avatar" style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    marginRight: "10px"
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <strong style={{ color: "white" }}>{msg.username}</strong>
                                        <span style={{ fontSize: "12px", color: "#bbb" }}>{new Date(msg.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p style={{ fontSize: "14px", color: "white", margin: "3px 0" }}>{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
    
                    {/* Phần input + nút gửi */}
                    <div style={{
                        display: "flex",
                        marginTop: "10px"
                    }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "20px",
                                border: "none",
                                background: "#3E3E3E",
                                color: "white",
                                marginRight: "10px",
                                outline: "none"
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                background: "#1DB954",
                                border: "none",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                color: "white",
                                fontWeight: "bold",
                                cursor: "pointer"
                            }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default ChatButton;
