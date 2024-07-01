import { useState, useEffect } from "react";
import "../styles/Header.css";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Search } from "./Search";
import axios from "axios";

import {
  faXmark,
  faSearch,
  faHeart,
  faCartShopping,
  faBars,
  faAngleRight,
  faMobile,
  faLaptop,
  faLifeRing,
  faMicrochip,
  faFirstAid,
  faHeadphones,
  faStar,
  faMale,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Header = ({ user, onFilteredProducts }) => {
  const [products, setProducts] = useState([]);
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

  const categories = [
    {
      category: "Mobiles",
      icon: faMobile,
    },
    {
      category: "Laptops",
      icon: faLaptop,
    },
    {
      category: "Wearables",
      icon: faLifeRing,
    },
    {
      category: "Audio Store",
      icon: faHeadphones,
    },
    {
      category: "Speakers",
      icon: faMicrochip,
    },
    {
      category: "Smart Gadgets",
      icon: faStar,
    },
    // {
    //   category: "Health Gadgets",
    //   icon: faFirstAid,
    // },
    // {
    //   category: "Personal Care",
    //   icon: faMale,
    // },
  ];
  const categoriess = [
    {
      category: "Health Gadgets",
      icon: faFirstAid,
    },
    {
      category: "Personal Care",
      icon: faMale,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(isHomePage);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isHomePage && isMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [location.pathname]);

  const handleSearch = async (query) => {
    try {
      const allProducts = products;
      const filteredProducts = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      // console.log(filteredProducts);
      onFilteredProducts(filteredProducts);
      navigate("/category");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  async function handlecategoryProducts(event) {
    const categoryTitle = event.currentTarget.querySelector('.category-list .category-left').textContent.trim();
    try {
      const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/user/products/category/${encodeURIComponent(categoryTitle)}`);
      // console.log(response.data);
      if (response.status === 200) {
        const products = await response.data;
        console.log(`Products in category '${categoryTitle}':`, products);
        onFilteredProducts(products);
        navigate("/category");
      } else {
        throw new Error(`Failed to fetch products for category '${categoryTitle}'`);
      }
    } catch (error) {
      console.error("Error handling category products:", error);
    }
  }

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-top-left">
          <div className="header-title">
            <Link to="/"><h1>GOG</h1></Link>
          </div>
          <div className="header-list">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Gadgets</Link>
              </li>
              <li>{ !user && <Link to="/login">Login</Link> }</li>
            </ul>
          </div>
        </div>
        <div className="header-right">
          <Link to="/sellerRegister">Become a seller</Link>
          { user && (
            <Link to="/myAccount">
              <p>My Account</p>
            </Link>
          ) }
          <Link to="/wishlist">
            <FontAwesomeIcon className="header-right-icon" icon={ faHeart } />
          </Link>
          <Link to="/cart">
            <FontAwesomeIcon
              className="header-right-icon"
              icon={ faCartShopping }
            />
          </Link>
        </div>
      </div>
      <div className="header-search-container">
        <div className="wrapper flexitem">
          <div className="left">
            <div className="dpt-cat">
              <div className="dpt-head">
                <div className="dpt-head-top">
                  <div className="main-text">All Departments</div>
                  <div className="mini-text mobile-hide">
                    Total { products.length } Products
                  </div>
                </div>
                <a
                  href="#"
                  className="dpt-trigger mobile-hide"
                  onClick={ toggleMenu }
                >
                  { !isMenuOpen && (
                    <FontAwesomeIcon className="header-bars" icon={ faBars } />
                  ) }
                  { isMenuOpen && (
                    <FontAwesomeIcon className="header-bars" icon={ faXmark } />
                  ) }
                </a>
              </div>

              <div className="categories">
                { isMenuOpen &&
                  categories.map((category, index) => (
                    <div key={ index } className="category has-child">
                      <button className="category-button" onClick={ handlecategoryProducts }>
                        <div className="category-list">
                          <div className="category-left">
                            <FontAwesomeIcon
                              className="category-icon"
                              icon={ category.icon }
                            />
                            { category.category }
                          </div>
                          <div className="category-right">
                            <FontAwesomeIcon icon={ faAngleRight } />
                          </div>
                        </div>
                      </button>
                    </div>
                  )) }
                  { isMenuOpen &&
                  categoriess.map((category, index) => (
                    <div key={ index } className="category has-child">
                      <button className="category-button" >
                        <div className="category-list">
                          <div className="category-left">
                            <FontAwesomeIcon
                              className="category-icon"
                              icon={ category.icon }
                            />
                            { category.category }
                          </div>
                          <div className="category-right">
                            <FontAwesomeIcon icon={ faAngleRight } />
                          </div>
                        </div>
                      </button>
                    </div>
                    
                  )) }
              </div>
            </div>
          </div>
          <Search handleSearch={ handleSearch } />
        </div>
      </div>
    </div>
  );
};
