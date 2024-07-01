import React, { useState, useEffect } from 'react';
import "../styles/adminLists.css";
import { AdminSidebar } from "./AdminSidebar";

import axios from 'axios';

export const Users = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/users/');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`https://gog-backend-t01u.onrender.com/api/admin/deleUser/${userId}`);
            window.alert(response.data.user);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            <AdminSidebar activeLink="userslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Users List:</h2>
                    <div className="search-bar search-margin">
                        <input
                            type="text"
                            placeholder="Search by username or email"
                            value={ searchQuery }
                            onChange={ handleSearch }
                        />
                    </div>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>Username</b></th>
                                <th><b>Email</b></th>
                                <th><b>Created At</b></th>
                                {/* <th><b>Action</b></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            { filteredUsers && filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={ user._id } className="orders-row">
                                    <td>{ user.name }</td>
                                    <td>{ user.email }</td>
                                    <td>{ formatDate(user.createdAt) }</td>
                                    {/* <td>
                                        <button className="delete-button" onClick={ () => deleteUser(user._id) }>Delete</button>
                                    </td> */}
                                </tr>
                            )) : (
                                users.map((user) => (
                                    <tr key={ user._id } className="orders-row">
                                        <td>{ user.name }</td>
                                        <td>{ user.email }</td>
                                        <td>{ formatDate(user.createdAt) }</td>
                                        {/* <td>
                                            <button className="delete-button" onClick={ () => deleteUser(user._id) }>Delete</button>
                                        </td> */}
                                    </tr>
                                ))
                            ) }
                        </tbody>

                    </table>
                </div>
            </section>
        </div>
    );
};
