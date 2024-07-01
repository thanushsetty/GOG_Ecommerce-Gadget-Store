import React, { useState, useEffect } from "react";
import "../styles/adminLists.css";
import { AdminSidebar } from "./AdminSidebar";
import axios from "axios";

export const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [replyToEmail, setReplyToEmail] = useState("");
    const [replyFormVisible, setReplyFormVisible] = useState(false);
    const [repliedMessageId, setRepliedMessageId] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(
                    "https://gog-backend-t01u.onrender.com/api/admin/messages/"
                );
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching admin messages:", error);
            }
        };
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter(
        (message) =>
            message.name.toLowerCase().includes(searchQuery) ||
            message.email.toLowerCase().includes(searchQuery) ||
            message.subject.toLowerCase().includes(searchQuery) ||
            message.message.toLowerCase().includes(searchQuery)
    );

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const handleReply = (email, messageId) => {
        setReplyToEmail(email);
        setReplyFormVisible(true);
        setRepliedMessageId(messageId);
    };

    const handleSendReply = async () => {
        try {
            const response = await axios.post("https://gog-backend-t01u.onrender.com/sendemail", {
                to: replyToEmail,
                subject: "Reply to your message",
                text: replyMessage,
            });
            if (response.status === 200) {
                window.alert("Reply Sent successfully!");
                setReplyFormVisible(false);
                setRepliedMessageId(null);
                setReplyMessage("");
            } else {
                console.error("Sending reply failed.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    const handleReplyChange = (e) => {
        setReplyMessage(e.target.value);
    };

    const deleteMessage = async (messageId) => {
        try {
            const response = await axios.delete(
                `https://gog-backend-t01u.onrender.com/api/admin/contactUs/${messageId}`
            );
            window.alert(response.data.message);
            // After deleting the message, update messages state
            setMessages(messages.filter((message) => message._id !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div>
            <AdminSidebar activeLink="messageslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Customer Messages:</h2>
                    <div className="search-bar search-margin">
                        <input
                            type="text"
                            placeholder="Search by name, email, subject, or message"
                            value={ searchQuery }
                            onChange={ handleSearch }
                        />
                    </div>
                    <br />
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>
                                    <b>S.No</b>
                                </th>
                                <th>
                                    <b>Name</b>
                                </th>
                                <th>
                                    <b>Email</b>
                                </th>
                                <th>
                                    <b>Subject</b>
                                </th>
                                <th>
                                    <b>Message</b>
                                </th>
                                <th>
                                    <b>Action</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { filteredMessages.map((message, index) => (
                                <tr key={ index } className="orders-row">
                                    <td>{ index + 1 }</td>
                                    <td>{ message.name }</td>
                                    <td>{ message.email }</td>
                                    <td>{ message.subject }</td>
                                    <td>{ message.message }</td>
                                    <td>
                                        <button
                                            className="reply-button"
                                            type="button"
                                            onClick={ () => handleReply(message.email) }
                                        >
                                            Reply
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={ () => deleteMessage(message._id) }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                    { replyFormVisible && (
                        <div className="message-reply-container">
                            <form onSubmit={ handleSendReply } className="message-form">
                                <div className="message-reply">
                                    <label>Write a reply</label>
                                    <textarea
                                        value={ replyMessage }
                                        onChange={ handleReplyChange }
                                    ></textarea>
                                </div>
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    ) }
                </div>
            </section>
        </div>
    );
};