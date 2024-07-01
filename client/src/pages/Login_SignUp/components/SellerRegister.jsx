import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import "../styles/Login.css";

export const SellerRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        address: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const validateEmail = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        if (!password) return true;
        const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{5,}$/;
        return usernameRegex.test(username);
    };

    const validateCompanyName = (companyName) => {
        const companyNameRegex = /^[A-Za-z\s]+$/;
        return companyNameRegex.test(companyName);
    };

    const validateAddress = (address) => {
        return address.trim() !== '';
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';
        switch (name) {
            case 'email':
                errorMsg = !validateEmail(value) ? 'Email is invalid' : '';
                break;
                case 'password':
                    errorMsg = !value ? '' : !validatePassword(value) ? 'Password must contain at least one lowercase character, one uppercase character, one number, one special character, and be at least 8 characters long' : '';
                    break;
                
            case 'confirmPassword':
                errorMsg = value !== formData.password ? 'Passwords do not match' : '';
                break;
            case 'username':
                errorMsg = !validateUsername(value) ? 'Username must be at least 5 characters long and may contain alphabets and numbers' : '';
                break;
            case 'companyName':
                errorMsg = !validateCompanyName(value) ? 'Company Name must contain only alphabets' : '';
                break;
            case 'address':
                errorMsg = !validateAddress(value) ? 'Address is required' : '';
                break;
            default:
                break;
        }
        setError(errorMsg);
    };

    const validateForm = () => {
        const { email, password, confirmPassword, username, companyName, address } = formData;
        let isValid = true;

        if (!email || !password || !confirmPassword || !username || !companyName || !address) {
            setError('All fields are required');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('https://gog-backend-t01u.onrender.com/api/seller/register', formData);
                console.log(response.data);
                navigate('/SellerLogin');
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    };

    return (
        <div>
            <section className="login-section">
                <div className="container">
                    <div className={ "user signupBx" }>
                        <div className="formBx">
                            <form onSubmit={ handleSubmit }>
                                <h2>Register as a Seller</h2><br />
                                
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={ formData.username }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={ formData.email }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={ formData.password }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={ formData.confirmPassword }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                <label htmlFor="companyName">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={ formData.companyName }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={ formData.address }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    required
                                />
                                <br />
                                {error && <span className="error">{error}</span>}
                                <br />
                                <input
                                    type="submit"
                                    value="Register"
                                    className="button"
                                />
                                <p className="signup">Already a Seller? <Link to="/sellerLogin">Login</Link></p>
                            </form>
                        </div>
                    </div>
                    <div className="imgBx">
                        <img
                            src="https://assets.entrepreneur.com/content/3x2/2000/essential-elements-building-ecommerce-website.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SellerRegister;
