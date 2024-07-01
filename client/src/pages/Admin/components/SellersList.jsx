import { useState, useEffect } from 'react';
import "../styles/adminLists.css"
import { AdminSidebar } from "./AdminSidebar";
import axios from 'axios';

export const SellersList = () => {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get('https://gog-backend-t01u.onrender.com/api/seller');
                setSellers(response.data.sellers);
            } catch (error) {
                console.error('Error fetching Sellers:', error);
            }
        };
        fetchSellers();
    }, []);

    const [filteredSellers, setFilteredSellers] = useState(sellers);
    const [sellerList, setSellerList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (sellers) {
            const filtered = sellers.filter(seller =>
                seller.username.toLowerCase().includes(query) ||
                seller.email.toLowerCase().includes(query) ||
                seller.companyName.toLowerCase().includes(query)
            );
            setFilteredSellers(filtered);
        }
    };

    const handleApprove = async (sellerId) => {
        try {
            await axios.put(`https://gog-backend-t01u.onrender.com/api/seller/${sellerId}/approve`);
            const updatedSellers = sellerList.map(seller => {
                if (seller._id === sellerId) {
                    return { ...seller, approved: true };
                } else {
                    return seller;
                }
            });
            setSellerList(updatedSellers);
            window.alert('Seller approved successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error approving seller:', error)
            window.alert('Error approving seller. Please try again.');
        }
    };

    const handleRevoke = async (sellerId) => {
        try {
            await axios.put(`https://gog-backend-t01u.onrender.com/api/seller/${sellerId}/revoke`);
            const updatedSellers = sellerList.map(seller => {
                if (seller._id === sellerId) {
                    return { ...seller, isSeller: false };
                } else {
                    return seller;
                }
            });
            setSellerList(updatedSellers);
            window.alert('Seller approval revoked successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error revoking seller approval:', error);
            window.alert('Error revoking seller approval. Please try again.');
        }
    };

    if (!sellers || sellers.length === 0) {
        return (
            <div>
                <AdminSidebar />
                <section className="orders-section">
                    <div className="orders-content">
                        <h2 className="orders-heading">Sellers List:</h2>
                        <p className="no-data">No Sellers found.</p>
                    </div>
                </section>
            </div>
        );
    }

    let serialNumber = 1;


    return (
        <div>
            <AdminSidebar activeLink="sellerslist" />
            <section className="orders-section">
                <div className="orders-content">
                    <h2 className="orders-heading">Sellers List:</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by username, email, company name, or address"
                            value={ searchQuery }
                            onChange={ handleSearch }
                        />
                    </div>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th><b>S.No</b></th>
                                <th><b>Seller Name</b></th>
                                <th><b>Email</b></th>
                                <th><b>Company</b></th>
                                <th><b>Rating</b></th>
                                <th><b>Status</b></th>
                                <th><b>Action</b></th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredSellers && filteredSellers.length > 0 ? filteredSellers.map((seller) => (
                                <tr key={ seller._id } className="orders-row">
                                    <td>{serialNumber++}</td>
                                    <td>{ seller.username }</td>
                                    <td>{ seller.email }</td>
                                    <td>{ seller.companyName }</td>
                                    <td>{ seller.address }</td>
                                    <td style={ { backgroundColor: seller.approved ? 'lightgreen' : 'yellow' } }>
                                        { seller.approved ? 'Approved' : 'Not Approved' }
                                    </td>
                                    <td>
                                        { seller.approved ? (
                                            <button className="revoke-button" onClick={ () => handleRevoke(seller._id) }>Revoke</button>
                                        ) : (
                                            <button className="approve-button" onClick={ () => handleApprove(seller._id) }>Approve</button>
                                        ) }
                                    </td>
                                </tr>
                            )) : sellers.map((seller) => (
                                <tr key={ seller._id } className="orders-row">
                                    <td>{serialNumber++}</td>
                                    <td>{ seller.username }</td>
                                    <td>{ seller.email }</td>
                                    <td>{ seller.companyName }</td>
                                    <td>{ seller.address }</td>
                                    <td style={ { backgroundColor: seller.approved ? 'lightgreen' : 'yellow' } }>
                                        { seller.approved ? 'Approved' : 'Not Approved' }
                                    </td>
                                    <td>
                                        { seller.approved ? (
                                            <button className="revoke-button" onClick={ () => handleRevoke(seller._id) }>Revoke</button>
                                        ) : (
                                            <button className="approve-button" onClick={ () => handleApprove(seller._id) }>Approve</button>
                                        ) }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
    
};
