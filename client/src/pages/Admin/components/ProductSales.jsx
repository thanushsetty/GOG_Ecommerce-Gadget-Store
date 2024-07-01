import "../styles/admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

export const ProductSales = () => {
    const [salesData, setSalesData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('week');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/admin/sales/${selectedOption}`);
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchData();
    }, [selectedOption]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const chartData = {
        labels: salesData?.labels || [],
        datasets: [
            {
                label: 'Total Sales',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: salesData?.data || [],
            },
        ],
        options: {
            scales: {
                x: {
                    type: 'category',
                    labels: salesData?.labels || [],
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Sales',
                    },
                },
            },
        },
    };


    return (
        <div>
            <AdminSidebar activeLink="productSales" />
            <section className="home-section">
                <nav>
                    <div className="sidebar-button">
                        <i className='bx bx-menu sidebarBtn'></i>
                        <span className="dashboard">Product Sales</span>
                    </div>
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                        <i className='bx bx-search'></i>
                    </div>
                </nav>

                <div className="home-content">
                    <AdminOverview />
                    <div>
                        <h2>Admin Dashboard</h2>
                        <label>Select Time Period:</label>
                        <select value={ selectedOption } onChange={ (e) => handleOptionChange(e.target.value) }>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>

                        <div>
                            { salesData ? (
                                <Line data={ chartData } />
                            ) : (
                                <p>Loading sales data...</p>
                            ) }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}