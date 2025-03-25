import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperclip, FaRobot, FaUser, FaPaperPlane, FaImage } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if ((!input.trim() && !file && !image) || isLoading) return;

        let newMessages = [...messages, { 
            sender: 'user', 
            text: input, 
            file: file?.name,
            image: image?.name,
            timestamp: new Date().toLocaleTimeString()
        }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const formData = new FormData();
            if (input.trim()) formData.append('message', input);
            if (file) formData.append('file', file);
            if (image) formData.append('image', image);

            let response;
            if (image) {
                response = await axios.post('http://localhost:5000/chat', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else if (file) {
                const uploadRes = await axios.post('http://localhost:5000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                response = await axios.post('http://localhost:5000/chat', { 
                    message: input,
                    attachment: uploadRes.data.fileUrl
                });
            } else {
                response = await axios.post('http://localhost:5000/chat', { message: input });
            }

            setMessages([...newMessages, { 
                sender: 'bot', 
                text: response.data.reply, 
                file: file ? `/uploads/${file.name}` : null,
                image: response.data.imageUrl,
                timestamp: new Date().toLocaleTimeString()
            }]);
            setFile(null);
            setImage(null);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { 
                sender: 'bot', 
                text: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toLocaleTimeString(),
                error: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFileSelect = (e, type) => {
        const selectedFile = e.target.files[0];
        if (type === 'file') {
            setFile(selectedFile);
            setImage(null);
        } else {
            setImage(selectedFile);
            setFile(null);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <FaRobot className="me-2" />
                                AI Chat Assistant
                            </h4>
                        </div>
                        <div className="card-body chat-container">
                            <div className="messages-container">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                                        <div className="message-content">
                                            <div className="message-header">
                                                {msg.sender === 'user' ? (
                                                    <FaUser className="message-icon" />
                                                ) : (
                                                    <FaRobot className="message-icon" />
                                                )}
                                                <small className="text-muted ms-2">{msg.timestamp}</small>
                                            </div>
                                            <div className={`message-text ${msg.error ? 'text-danger' : ''}`}>
                                                {msg.text}
                                            </div>
                                            {msg.file && (
                                                <div className="message-attachment">
                                                    <a href={msg.file} 
                                                       target="_blank" 
                                                       rel="noopener noreferrer"
                                                       className="btn btn-sm btn-outline-primary">
                                                        <FaPaperclip className="me-1" />
                                                        View Attachment
                                                    </a>
                                                </div>
                                            )}
                                            {msg.image && (
                                                <div className="message-image mt-2">
                                                    <img 
                                                        src={msg.image} 
                                                        alt="Uploaded content"
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: '200px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="message bot-message">
                                        <div className="message-content">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="input-group">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleFileSelect(e, 'file')}
                                    className="d-none"
                                />
                                <input
                                    type="file"
                                    ref={imageInputRef}
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'image')}
                                    className="d-none"
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    title="Upload file"
                                >
                                    <FaPaperclip />
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => imageInputRef.current.click()}
                                    title="Upload image"
                                >
                                    <FaImage />
                                </button>
                                <textarea
                                    className="form-control"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message here..."
                                    rows="1"
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={sendMessage}
                                    disabled={isLoading || (!input.trim() && !file && !image)}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                            {(file || image) && (
                                <div className="selected-file mt-2">
                                    <small className="text-muted">
                                        Selected {image ? 'image' : 'file'}: {(image || file).name}
                                        <button
                                            className="btn btn-link btn-sm text-danger p-0 ms-2"
                                            onClick={() => image ? setImage(null) : setFile(null)}
                                        >
                                            Remove
                                        </button>
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App; 