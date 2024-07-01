import React, { useState } from 'react';
import "../styles/contactus.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const Contactus = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        phone: '',
        email: '',
        message: '',
    });

    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNameBlur = (e) => {
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(e.target.value)) {
            setError('Name should contain only letters');
            setIsValid(false);
        } else if (e.target.value.length < 3 || e.target.value.length > 30) {
            setError('Name should be between 3 and 30 characters');
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };
    

    const handleSubjectBlur = (e) => {
        if (e.target.value.length < 3 || e.target.value.length > 100) {
            setError('Subject should be between 3 and 100 characters');
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };

    const handlePhoneBlur = (e) => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(e.target.value)) {
            setError('Please enter a valid 10-digit phone number');
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };

    const handleEmailBlur = (e) => {
        const email = e.target.value;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            setError('Please enter a valid email address');
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };

    const handleMessageBlur = (e) => {
        if (e.target.value.length < 3 || e.target.value.length > 100) {
            setError('Message should be between 3 and 100 characters');
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValid) {
            setError('Please fix the validation errors before submitting.');
            return;
        }

        try {
            const response = await axios.post('https://gog-backend-t01u.onrender.com/api/user/contactus', formData);
            window.alert(response.data);
            setError('');
            navigate('/');
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (
        <>
            <div className="contact-cwrapper">
                <div className="cwrapper">
                    <h2>Contact us</h2>
                    <div id="error_message">{error}</div>
                    <form method="post" id="myform" onSubmit={handleSubmit}>
                        <div className="input_field">
                            <input type="text" placeholder="Name" name="name" id="name" value={formData.name} onChange={handleChange} onBlur={handleNameBlur} />
                        </div>
                        <div className="input_field">
                            <input type="text" placeholder="Subject" name="subject" id="subject" value={formData.subject} onChange={handleChange} onBlur={handleSubjectBlur} />
                        </div>
                        <div className="input_field">
                            <input type="text" placeholder="Phone" name="phone" id="phone" value={formData.phone} onChange={handleChange} onBlur={handlePhoneBlur} />
                        </div>
                        <div className="input_field">
                            <input type="text" placeholder="Email" name="email" id="email" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} />
                        </div>
                        <div className="input_field">
                            <textarea placeholder="Message" name="message" id="message" value={formData.message} onChange={handleChange} onBlur={handleMessageBlur}></textarea>
                        </div>
                        <div className="btn">
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
