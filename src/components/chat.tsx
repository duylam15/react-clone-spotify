import { UserInfo } from "@/services/user";
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
        const userData = await UserInfo();
        
        if (!userData.email) { // Chỉ đóng khi dữ liệu trả về thực sự không có email
            setIsOpen(false);
        } else {
            setUserData({
                username: userData.ten_hien_thi,
                email: userData.email,
                avatar_url: userData.avatar_url
            });
        }
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
            fetchUserDatas()
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

    const sendMessage = () => {
        // if (userData.email == "") { setIsOpen(false); return; }
        if (socket && message.trim()) {
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
                style={{ padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "grab", fontSize: "16px" }}
            >
                💬 Chat
            </button>
            {isOpen && (
                <div style={{ width: "400px", height: "500px", background: "white", border: "1px solid black", padding: "15px", borderRadius: "8px", marginTop: "10px", color: "black", display: "flex", flexDirection: "column" }}>
                    <div
                        ref={messagesEndRef}
                        style={{ flex: 1, overflowY: "auto", borderBottom: "1px solid gray", paddingBottom: "10px", paddingRight: "5px" }}
                    >
                        {messages.length === 0 ? <p style={{ textAlign: "center" }}>Không có tin nhắn nào!</p> : null}
                        {messages.map((msg, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", padding: "5px", borderRadius: "5px", background: "#f1f1f1" }}>
                                <img src={msg.avatar_url} alt="Avatar" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <strong>{msg.username}</strong>
                                        <span style={{ fontSize: "12px", color: "gray" }}>{new Date(msg.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p style={{ fontSize: "14px", color: "black", margin: "3px 0" }}>{msg.message}</p>
                                </div>
                            </div>

                        ))}
                    </div>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid gray", marginTop: "10px" }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{ width: "100%", padding: "10px", fontSize: "16px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" }}
                    >
                        Gửi
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatButton;
