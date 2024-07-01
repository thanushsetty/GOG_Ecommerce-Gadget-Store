import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const EditProfileComponent = ({ user }) => {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        mobileNumber: user.mobileNumber,
        gender: user.gender,
        dob: user.dob,
        location: user.location,
    });

    useEffect(() => {
        setUserInput({
            mobileNumber: user.mobileNumber || '',
            gender: user.gender || '',
            dob: user.dob || '',
            location: user.location || '',
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`https://gog-backend-t01u.onrender.com/api/user/editprofile/${user._id}`, userInput);
            console.log(response.data);
            navigate('/myAccount');
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    return (
        <div>
            <section className="home-section">
                <div className="uprofilepage">
                    <h3 className="font-weight-bold userhead">EDIT PROFILE</h3>
                    <hr className="userhead-hr"/>
                    <form className='edit-profile-form' onSubmit={ handleSubmit }>
                        <div className="mb-3">
                            <label htmlFor="profileInputFullname" className="form-label">Full Name</label>
                            <input placeholder="Enter your full name" type="text" className="form-control" value={ user.name }
                                id="profileInputFullname" name="profileInputFullname" readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileInputEmail1" className="form-label">Email</label>
                            <input type="email" className="form-control" placeholder="Enter your email id" id="profileInputEmail1" name="profileInputEmail1" value={ user.email }
                                aria-label="Email" readOnly />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileInputMobileNum" className="form-label">Mobile Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={ userInput.mobileNumber }
                                onChange={ handleInputChange }
                                id="profileInputMobileNum"
                                name="mobileNumber"
                                aria-label="contactnumber"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileInputGender" className="form-label">Gender</label>
                            <input
                                type="text"
                                className="form-control"
                                value={ userInput.gender }
                                onChange={ handleInputChange }
                                id="profileInputGender"
                                name="gender"
                                aria-label="Gender"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileInputBirthday" className="form-label">Birthday (dd/mm/yyyy)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your birthday based on above format"
                                value={ userInput.dob }
                                onChange={ handleInputChange }
                                pattern="[0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9]"
                                id="profileInputBirthday"
                                name="dob"
                                aria-label="Birthday"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileInputLocation" className="form-label">Location</label>
                            <input
                                placeholder="Enter your current location"
                                type="text"
                                className="form-control"
                                value={ userInput.location }
                                onChange={ handleInputChange }
                                id="profileInputLocation"
                                aria-label="Location"
                                name="location"
                            />
                        </div>
                        <div className="button-group d-flex flex-column mt-3" id="btn-group">
                            <input type="submit" value="Submit" className="edit-button" />
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}