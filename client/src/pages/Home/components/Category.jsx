import { useState, useEffect } from "react";
import { Header } from "../../CommonComponents/components/Header";
import { Footer } from "../../CommonComponents/components/Footer";
import "../styles/ProductItemSmall.css";
import "../styles/Category.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import { CategoryProduct } from "./CategoryProduct";

export const Category = ({ sortedProducts }) => {
  const [products, setProducts] = useState(sortedProducts);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState(sortedProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://gog-backend-t01u.onrender.com/api/user/products');
        setAllProducts(response.data.products);
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
  // console.log("Categories", categories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const uniqueCategories = Array.isArray(categories)
    ? categories.filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.title === category.title)
    )
    : [];

  let allbrands = [];
  for (const product of products) {
    if (product.length > 0) {
      allbrands = allbrands.concat(product.brand);
    }
  }

  const allBrands = products.map((product) => product.brand) || allbrands;
  const uniqueBrandsSet = new Set(allBrands);
  const brands = Array.from(uniqueBrandsSet);

  const [sortBy, setSortBy] = useState("");
  const [productsToShow, setProductsToShow] = useState(12);

  const filteringOptions = [
    ...brands.map((brand, index) => ({
      id: `brand${index + 1}`,
      label: brand,
    }))
  ];

  const handleSortByChange = (event) => {
    const selectedSortBy = event.target.value;
    const sortingFunction = (a, b) => {
      switch (selectedSortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "mostsold":
          return b.sold - a.sold;
        case "rating(desc)":
          return b.rating - a.rating;
        case "rating(asc)":
          return a.rating - b.rating;
        default:
          return 0;
      }
    };
    const newSortedProducts = products.slice().sort(sortingFunction);
    setProducts(newSortedProducts);
  };

  const handleProductsToShowChange = (event) => {
    setProductsToShow(parseInt(event.target.value, 10));
  };

  const handleCategoryChange = (categoryTitle) => {
    const updatedCategories = selectedCategories.includes(categoryTitle)
      ? selectedCategories.filter((category) => category !== categoryTitle)
      : [...selectedCategories, categoryTitle];

    setSelectedCategories(updatedCategories);

    const updatedProducts = applyFilters(updatedCategories, selectedBrands);
    setProducts(updatedProducts);
  };

  const handleBrandChange = (brandLabel) => {
    const updatedBrands = selectedBrands.includes(brandLabel)
      ? selectedBrands.filter((brand) => brand !== brandLabel)
      : [...selectedBrands, brandLabel];

    setSelectedBrands(updatedBrands);

    const updatedProducts = applyFilters(selectedCategories, updatedBrands);
    setProducts(updatedProducts);
  };

  // console.log(sortedProducts);
  const applyFilters = (categories, brands) => {
    return sortedProducts.filter(
      (product) =>
        (categories.length === 0 || categories.includes(product.title)) &&
        (brands.length === 0 || brands.includes(product.brand))
    );
  };
  return (
    <>
      {/* <Header user={ user } onFilteredProducts={ handleFilteredProducts } /> */ }
      <div id="page" className="site page-category">
        <div className="content-container">
          <div className="filters">
            {/* <div className="filter-block">
            <h4>Category</h4>
            { uniqueCategories.map((category) => (
              <ul key={ category.title }>
                <li>
                  <label htmlFor={ category.title } className="category-label">
                    <input
                      type="checkbox"
                      name="checkbox"
                      id={ category.title }
                      checked={ selectedCategories.includes(category.title) }
                      onChange={ () => handleCategoryChange(category.title) }
                    />
                    <span className="checked"></span>
                    <span className="category-name">{ category.title }</span>
                  </label>
                </li>
              </ul>
            )) }
          </div> */}
            <div className="filter-block">
              <h4>Brands</h4>
              { filteringOptions
                .map((option) => (
                  <ul key={ option.id }>
                    <li>
                      <input
                        type="checkbox"
                        name="checkbox"
                        id={ option.id }
                        checked={ selectedBrands.includes(option.label) }
                        onChange={ () => handleBrandChange(option.label) }
                      />
                      <label htmlFor={ option.id } className="brand-label">
                        <span className="checked">{ option.label }</span>
                      </label>
                    </li>
                  </ul>
                )) }
            </div>

          </div>
        </div>
        <div className="top-right-filters">
          <div className="sort-by">
            <h4>Sort By</h4>
            <select value={ sortBy } onChange={ handleSortByChange }>
              <option value="">Select</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="mostsold">Most Sold</option>
              <option value="rating(desc)">Rating (High to Low)</option>
              <option value="rating(asc)">Rating (Low to High)</option>
            </select>
          </div>
          <div className="toshow">
            <h4>Products to Show</h4>
            <select
              value={ productsToShow }
              onChange={ handleProductsToShowChange }
            >
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>
        <div className="products">
          <div className="products category-products main flexwrap">
            { !products || products.length === 0
              ? allProducts.slice(0, productsToShow).map((product) => (
                <CategoryProduct key={ product._id } product={ product } />
              ))
              : products.slice(0, productsToShow).map((product) => (
                <CategoryProduct key={ product._id } product={ product } />
              )) }

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Category;
