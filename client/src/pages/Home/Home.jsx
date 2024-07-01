import { useEffect, useState } from "react";
import { Slider } from "./components/Slider";
import { ShopCategories } from "./components/ShopCategories";
import { HomeBestDeals } from "./components/HomeBestDeals";
import { BestSellingProducts } from "./components/BestSellingProducts";
import { Footer } from "../CommonComponents/components/Footer";
import axios from "axios";
import { Brands } from "./components/Brands";

export const Home = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    localStorage.removeItem('loggedInSeller');
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/products");
        if (response.status === 200) {
          setProducts(response.data.products);
          // console.log("products: ", response.data.products);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error while fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchpProducts = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/products");
        if (response.status === 200) {
          const sortedProducts = response.data.products.sort((a, b) => b.rating - a.rating);
          setFeaturedProducts(sortedProducts);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error while fetching products:", error);
      }
    };

    fetchpProducts();
  }, []);
  
  useEffect(() => {
    const fetchbProducts = async () => {
      try {
        const response = await axios.get("https://gog-backend-t01u.onrender.com/api/user/products");
        if (response.status === 200) {
          const sortedProducts = response.data.products.sort((a, b) => b.sold - a.sold);
          setBestSellingProducts(sortedProducts);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error while fetching products:", error);
      }
    };

    fetchbProducts();
  }, []);

  return (
    <div>
      <Slider />
      <Brands />
      <HomeBestDeals products={ featuredProducts } user={ user } />
      <BestSellingProducts products={ bestSellingProducts } user={ user } />
      <Footer />
    </div>
  );
};
