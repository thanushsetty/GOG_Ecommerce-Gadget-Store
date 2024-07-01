import { useState, useEffect } from 'react'
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Header } from './pages/CommonComponents/components/Header';
import { Home } from './pages/Home/Home';
import { CheckoutPage } from './pages/User/components/CheckoutPage';
import { Aboutus } from './pages/Home/components/Aboutus';
import { Contactus } from './pages/Home/components/Contactus';
import ProductDetailsPage from './pages/Home/components/ProductDetailsPage';
import { Category } from './pages/Home/components/Category';

import { MyAccount } from './pages/User/components/MyAccount';
import { EditProfile } from './pages/User/components/EditProfile';
import { MyWishlists } from './pages/User/components/MyWishlists';
import { MyCart } from './pages/User/components/MyCart';
import { MyOrders } from './pages/User/components/MyOrders';

import { Login } from './pages/Login_SignUp/components/Login';
import { SellerLogin } from './pages/Login_SignUp/components/SellerLogin';
import SellerRegister from './pages/Login_SignUp/components/SellerRegister';

import { AdminDashboard } from './pages/Admin/components/AdminDashboard';
import { AdminMessages } from './pages/Admin/components/AdminMessages';
import { Products } from './pages/Admin/components/Products';
import { Users } from './pages/Admin/components/Users';
import { OrdersList } from './pages/Admin/components/OrdersList';

import { SellerDashboard } from './pages/Seller/components/SellerDashboard';
import { SellerAddProduct } from './pages/Seller/components/SellerAddProduct';
import { SellersList } from './pages/Admin/components/SellersList';
import { SellerProducts } from './pages/Seller/components/SellerProducts';
import { SellerOrdersList } from './pages/Seller/components/SellerOrdersList';
import { SellerReviews } from './pages/Seller/components/SellerReviews';
import { PageNotFound } from './pages/CommonComponents/components/PageNotFound';

function App() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [loginuser, setLoginUser] = useState(storedUser || null);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoginUser(storedUser);
    }
  }, []);

  const storedSeller = JSON.parse(localStorage.getItem('loggedInSeller'));
  const [loginSeller, setLoginSeller] = useState(storedSeller || null);
  
  useEffect(() => {
    const storedSeller = JSON.parse(localStorage.getItem('loggedInSeller'));
    if (storedSeller) {
      setLoginSeller(storedSeller);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/users/' + loginuser._id);
        setUser(response.data);
        // console.log(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (loginuser) {
      fetchUser();
    }
  }, [loginuser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching Orders:', error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/admin/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };
    fetchMessages();
  }, []);

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


  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (loginuser) {
          const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/user/users/${loginuser._id}`);
          setLoginUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        if (loginSeller) {
          const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/seller/sellers/${loginSeller._id}`);
          setLoginSeller(response.data);
        }
      } catch (error) {
        console.error('Error fetching seller:', error);
      }
    };
    fetchSeller();
  }, []);

  const [sortedProducts, setSortedProducts] = useState([]);

  const handleSearchedProducts = (searchedData) => {
    setSortedProducts(searchedData);
  };

  // console.log(loginSeller);
  // console.log(loginuser);
  // console.log(products);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><Home user={ loginuser } /></> } />
          <Route path="/login" element={ <Login setLoginUser={ setLoginUser } /> } />
          <Route path="/product/:productId" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><ProductDetailsPage user={ loginuser } /></> } />
          <Route path="/category" element={ <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><Category sortedProducts={ sortedProducts } /></> } />
          <Route path='/Aboutus' element={ <Aboutus user={ loginuser } /> } />
          <Route path='/Contactus' element={ <Contactus user={ loginuser } /> } />
          <Route path="/myAccount" element={ loginuser?.isUser? <MyAccount /> : <Navigate to="/login" /> } />

          <Route path="/editProfile" element={ loginuser?.isUser? <EditProfile user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/wishlist' element={ loginuser?.isUser?  <MyWishlists user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/cart' element={ loginuser?.isUser?  <><Header user={ loginuser } onFilteredProducts={ handleSearchedProducts } /><MyCart user={ loginuser } /></> : <Navigate to="/login" /> } />
          <Route path='/myOrders' element={ loginuser?.isUser?  <MyOrders user={ loginuser } /> : <Navigate to="/login" /> } />
          <Route path='/checkout' element={ loginuser?.isUser?  <CheckoutPage user={ loginuser } /> : <Navigate to="/login" /> } />

          <Route path='/admin' element={ loginuser?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" /> } />
          <Route path='/admin/productDetails' element={ loginuser?.isAdmin ? <Products products={ products } /> : <Navigate to="/login" /> } />
          <Route path='/admin/userDetails' element={ loginuser?.isAdmin ? <Users users={ users }/> : <Navigate to="/login" /> } />
          <Route path='/admin/ordersList' element={ loginuser?.isAdmin ? <OrdersList orders={ orders } /> : <Navigate to="/login" /> } />
          <Route path='/admin/messages' element={ loginuser?.isAdmin ? <AdminMessages messages={ messages } /> : <Navigate to="/login" /> } />
          <Route path='/admin/sellersList' element={ loginuser?.isAdmin ? <SellersList/> : <Navigate to="/login" /> } />

          <Route path="/sellerLogin" element={ <SellerLogin setLoginSeller={setLoginSeller}/> } />
          <Route path="/sellerRegister" element={ <SellerRegister /> } />
          <Route path='/seller' element={ loginSeller?.approved ?<SellerDashboard seller={loginSeller}/> : <Navigate to="/sellerLogin" /> } />
          <Route path='/seller/addproduct' element={ loginSeller?.approved ?<SellerAddProduct seller={loginSeller}/> : <Navigate to="/sellerLogin" /> } />
          <Route path="/seller/products" element={ loginSeller?.approved ?<SellerProducts seller={loginSeller}/> : <Navigate to="/sellerLogin" /> } />
          <Route path="/seller/ordersList" element={ loginSeller?.approved ?<SellerOrdersList seller={loginSeller}/> : <Navigate to="/sellerLogin" /> } />
          <Route path="/seller/reviews" element={ loginSeller?.approved ?<SellerReviews seller={loginSeller}/> : <Navigate to="/sellerLogin" /> } />

          
          <Route path="*" element={ <PageNotFound /> } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
