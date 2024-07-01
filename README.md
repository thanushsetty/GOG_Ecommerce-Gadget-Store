# GOG - Gadgets of Galaxy
# E-commerce Project using MERN Stack

Welcome to our E-commerce project built using the MERN stack (MongoDB, Express, React, Node.js). This README will guide you through the project structure, setup, and features.

## Table of Contents
- [Introduction](#introduction)
- [Deployment Links](#deployment-links)
- [How to Run](#how-to-run)
- [Users](#users)
- [Features](#features)

## Introduction
This E-commerce application provides a robust platform for users to buy and sell products online, with distinct roles for buyers, sellers, and administrators.

## Deployment Links
- Frontend: https://gogfrontend.vercel.app
- Backend: https://gog-backend-t01u.onrender.com
- API DOCS: https://gog-backend-t01u.onrender.com/api-docs

## How to Run
To get started you can simply clone this `GOG` repository and install the dependencies.
1. Clone the `Ecommerce-React` repository using git:
```bash
git clone https://github.com/HemanthA0921/Ecommerce-React.git
```
2. Open your terminal and navigate to the cloned directory.

3. Install `node modules` for both the client and server:
```bash
cd client
npm install
```
```bash
cd server
npm install
```

4. Run the application`(for client)` with this command:
```bash
npm run dev
```
5. Run the application`(for server)` with this command:
```bash
npx nodemon server
```

6. Access the website at http://localhost:5173

## Users
- Buyer
- Seller
- Admin

## Features
### Common Features
- Anyone who access this website can see the available products
- Can see the product's descriptions
- They can see reviews and ratings for the products
- Can see the categories and brands available in our website

## Admin Functionalities
- Can Access Admin Dashboard to see the analytics of sales and top selling products
- Manage the sellers which include access control i.e, Approve or block sellers
- Reply for customer querries
- Can see all the products available and user details

### User Functionalities
- Implemented authenication system using jwt tokens
- Authorized and authenticated users can see their dashboards, edit the details.
- They can Add reviews and ratings for the products
- In dashboards they can have details of their orders, faviorite items and cart items.
- They can add products to wishlist, cart and can proceed to checkout and payment(razorpay test mode)

## Seller Functionalities
- After seccessfully approved by the admin seller can do following fuctions:
- Add products to the website
- Can access their dashboards to see the sales data and analyze the products performance.
- They can see the reviews of their products.
