import "../styles/MyAccount.css"

export const UserProfile = ({user}) => {
    return (
        <div>
            <section className="home-section">
                <div className="home-content uprofilepage">
                    <h3 className="font-weight-bold userhead"> MY PROFILE</h3>
                    <hr className="userhead-hr" />
                    <div id="profile-info">
                        <div className="flex-item ">
                            <p className='key'>Name</p>
                            <p className='value'>
                                {user.name}
                            </p>
                        </div>
                        <div className="flex-item ">
                            <p className='key'>Email ID</p>
                            <p className='value'>
                                {user.email}
                            </p>
                        </div>
                        <div className="flex-item ">
                            <p className='key'>Mobile</p>
                            <p className='value'>
                                {user.mobileNumber}
                            </p>
                        </div>
                        <div className="flex-item ">
                            <p className='key'>Gender</p>
                            <p className='value'>
                                {user.gender}
                            </p>
                        </div>
                        <div className="flex-item ">
                            <p className='key'>Date of Birth</p>
                            <p className='value'>
                                {user.dob}
                            </p>
                        </div>
                        <div className="flex-item ">
                            <p className='key'>Location</p>
                            <p className='value'>
                                {user.location}
                            </p>
                        </div>
                    </div>
                    <a href="/editProfile">
                        <button type="button" id="edit-profile-btn" className="edit-button btn"
                            aria-label='edit button'>EDIT</button>
                    </a>
                </div>
            </section>
        </div>
    );
}