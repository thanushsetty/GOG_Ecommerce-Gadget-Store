import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import "../styles/Login.css";

export const SellerLogin = ({ setLoginSeller }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [approvalStatus, setApprovalStatus] = useState(null);

    
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

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return false;
        } else if (!validateEmail(formData.email)) {
            setError('Email is invalid');
            return false;
        }
        setError('');
        return true;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';
        switch (name) {
            case 'email':
                errorMsg = !validateEmail(value) ? 'Email is invalid' : '';
                break;
            case 'password':
                errorMsg = !value ? 'Password is required' : '';
                break;
            default:
                break;
        }
        setError(errorMsg);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('https://gog-backend-t01u.onrender.com/api/seller/login', formData);
                const seller = response.data.seller;
                setLoginSeller(seller);
                localStorage.setItem('loggedInSeller', JSON.stringify(seller));
                setApprovalStatus(seller.approved);
                if (seller.approved) {
                    navigate('/seller');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };

    // useEffect(() => {
    //     if (approvalStatus === false) {
    //         navigate('/');
    //     }
    // }, [approvalStatus, navigate]);

    return (
        <div>
            { approvalStatus === false ? (
                <div className="container1">
                    <p>You are not yet approved by the admin</p>
                    <p>Return to <Link to="/">Home</Link></p>
                </div>
            ) : (
                <section className="login-section">
                    <div className="container">
                        <div className={ "user signinBx" }>
                            <div className="formBx">
                                <form onSubmit={ handleSubmit }>
                                    <h2>Seller Login</h2><br />
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
                                    {error && <span className="error">{error}</span>}
                                    <br />
                                    <input
                                        type="submit"
                                        value="Login"
                                        className="button"
                                    />
                                    <p className="signup">Don't have a Seller account? <Link to="/SellerRegister">Register</Link></p>
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
            ) }
        </div>
    );
};

export default SellerLogin;
