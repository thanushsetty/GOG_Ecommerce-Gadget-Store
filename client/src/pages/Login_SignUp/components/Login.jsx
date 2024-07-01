import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/Login.css";

export const Login = ({ setLoginUser }) => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const showAlert = (message) => {
        window.alert(message);
    };

    const formvalidate = async (event) => {
        event.preventDefault();

        const isNameValid = isSignUp ? validateName() : true;
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = isSignUp ? validateConfirmPassword() : true;

        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            try {
                let endpoint = "/login";
                if (isSignUp) {
                    endpoint = "/register";
                    formData.isUser = true;
                }

                const response = await axios.post(`https://gog-backend-t01u.onrender.com/api/user${endpoint}`, formData);

                if (response.status === 200) {
                    const { user, isUser, isAdmin } = response.data;
                    setLoginUser(user);
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    // localStorage.setItem('token', token);

                    if (isUser) {
                        navigate('/myAccount');
                    } else if (isAdmin) {
                        navigate('/admin');
                    } else {
                        showAlert("Role mismatch error");
                    }
                }
            } catch (error) {
                showAlert(`Error: ${error.response.data.message}`);
            }
        }
    };

    const validateName = () => {
        if (!/^[a-zA-Z]{3,}$/.test(formData.name)) {
            showAlert("Name should contain at least 3 characters, and only letters are allowed.");
            return false;
        }
        return true;
    };

    const validateEmail = () => {
        const emailField = document.getElementById("email");
        const email = emailField.value.trim();

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailRegex.test(email)) {
            showAlert("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,15}$/.test(formData.password)) {
            showAlert("Password should be 5-15 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special symbol.");
            return false;
        }
        return true;
    };

    const validateConfirmPassword = () => {
        if (formData.password !== formData.confirmPassword) {
            showAlert("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div>
            <section className="login-section">
                <div className="container">
                    <div className={ `user ${isSignUp ? "signupBx" : "signinBx"}` }>
                        <div className="formBx">
                            <form
                                name="validatelogin"
                                onSubmit={ formvalidate }
                            >
                                <h2>{ isSignUp ? "Sign Up" : "Log in" }</h2><br></br>

                                { isSignUp && (
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Username"
                                            value={ formData.name }
                                            onChange={ handleChange }
                                            onBlur={ validateName }
                                        />
                                        <br />
                                    </div>
                                ) }
                                <label htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={ formData.email }
                                    onChange={ handleChange }
                                    onBlur={ validateEmail }
                                />
                                <br />
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={ formData.password }
                                    onChange={ handleChange }
                                    onBlur={ validatePassword }
                                />
                                <br />
                                { isSignUp && (
                                    <div>
                                        <label htmlFor="confirmPassword">
                                            Confirm password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={ formData.confirmPassword }
                                            onChange={ handleChange }
                                            onBlur={ validateConfirmPassword }
                                        />
                                        <br />
                                    </div>
                                ) }
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="button"
                                />
                                <p className="signup">
                                    { isSignUp
                                        ? "Already have an account?"
                                        : "Don't have an account?" }
                                    <a onClick={ toggleForm }>
                                        { isSignUp ? " Login" : " Sign Up" }
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                    <div className="imgBx">
                        <img
                            src="https://thumbs.dreamstime.com/b/many-used-modern-electronic-gadgets-use-white-floor-reuse-recycle-concept-top-view-164230611.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
