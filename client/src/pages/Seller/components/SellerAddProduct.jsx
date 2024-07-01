import "../styles/seller.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { SellerSidebar } from "./SellerSidebar";
import "../styles/SellerAddProduct.css";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SellerAddProduct = ({seller}) => {
  const navigate = useNavigate();
  const initialFormData = {
    productCode: "",
    title: "",
    imagePath: "",
    imagethumbnail1: "",
    imagethumbnail2: "",
    imagethumbnail3: "",
    description: "",
    features1: "",
    features2: "",
    features3: "",
    features4: "",
    mrp: "",
    price: "",
    reviewed: 0,
    sold: 100,
    stock: "",
    brand: "",
    manufacturer: seller._id,
    available: true,
    category: "",
    rating: 0
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        [name]: files[0], 
      });
    } else if (name === "category") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data to send: ", formData);

    try {
      const response = await axios.post(
        "https://gog-backend-t01u.onrender.com/api/seller/addproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        window.alert("Product Added successfully!");
        navigate('/seller/products');

      } else {
        console.error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      category: categoryId,
    });
  };
  const categories = [
    {
      _id: "641055d82b79b731a80f92c5",
      name: "Mobiles",
    },
    {
      _id: "641055f82b79b731a80f92c6",
      name: "Laptops",
    },
    {
      _id: "6410560c2b79b731a80f92c7",
      name: "Wearables",
    },
    {
      _id: "641056312b79b731a80f92c8",
      name: "Audio Store",
    },
    {
      _id: "641056f32b79b731a80f92ca",
      name: "Smart Gadgets",
    },
  ];
  const [imageUrls, setImageUrls] = useState([]);

  const handleInputImageChange = (event, name, index) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = reader.result;
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = imageUrl;
      setImageUrls(newImageUrls);
      setFormData({
        ...formData,
        [name]: file,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // console.log(isPopupOpen);

  return (
    <>
    <div>
    
      <SellerSidebar activeLink="addproduct" />
      
      <section className="home-section">
      {/* <button onClick={openPopup}>Test</button> */}
        <div className="seller-content">
          <div className="seller-selection">
            <h3>Products</h3>
            <h3>Add Product</h3>
          </div>
          <div>
            <form
              className="edit-profile-form"
              action="/api/seller/addProduct"
              method="post"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="seller-form">
                <div className="form-left">
                  <h1>Add Products</h1>
                  <div className="product_name all_inputs">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="title"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="product_category all_inputs">
                    <label>Category</label>
                    <select
                      className="title-input"
                      name="category"
                      required
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="product_prices">
                    <div className="product_price all_inputs">
                      <label>MRP</label>
                      <input
                        placeholder="MRP"
                        type="text"
                        name="mrp"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="product_price all_inputs">
                      <label>Price</label>
                      <input
                        placeholder="Discounted Price"
                        type="text"
                        name="price"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="product_brand all_inputs">
                    <label>Brand</label>
                    <input
                      placeholder="Brand"
                      type="text"
                      name="brand"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="product_description all_inputs">
                    <label>Description</label>
                    <textarea
                      type="text"
                      name="description"
                      placeholder="My product is all about..."
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-right">
                  <h3>Product Image</h3>
                  <div className="product-images">
                    <div className="product-images-left">
                      <div className="drag_image">
                        {!imageUrls[0] && (
                          <h3 className="dynamic_message">
                            Drag your image here or
                          </h3>
                        )}
                        <label className="label">
                          <span className="browse-files">
                            {!imageUrls[0] && (
                              <FontAwesomeIcon
                                className="header-right-icon"
                                icon={faImage}
                              />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="default-file-input"
                              name="imagePath"
                              required
                              onChange={(e) =>
                                handleInputImageChange(e, "imagePath", 0)
                              }
                            />
                            {!imageUrls[0] && (
                              <span className="browse-files-text">
                                browse file
                              </span>
                            )}
                            {!imageUrls[0] && (
                              <span className="text-small">from device</span>
                            )}
                          </span>
                        </label>
                        {imageUrls[0] && (
                          <img src={imageUrls[0]} alt="Product 1" />
                        )}
                      </div>
                      <div className="drag_image">
                      {!imageUrls[1] && (<h3 className="dynamic_message">Drag your image here or</h3>)}
                        <label className="label">
                          <span className="browse-files">
                          {!imageUrls[1] && (<FontAwesomeIcon
                              className="header-right-icon"
                              icon={faImage}
                            />)}
                            <input
                              type="file"
                              accept="image/*"
                              className="default-file-input"
                              name="imagethumbnail1"
                              required
                              onChange={(e) =>
                                handleInputImageChange(e, "imagethumbnail1", 1)
                              }
                            />
                            {!imageUrls[1] && (<span className="browse-files-text">browse file</span>)}
                            {!imageUrls[1] && (<span className="text-small">from device</span>)}
                          </span>
                        </label>
                        {imageUrls[1] && (
                          <img src={imageUrls[1]} alt="Product 1" />
                        )}
                      </div>
                    </div>
                    <div className="product-images-right">
                      <div className="drag_image2">
                      {!imageUrls[2] && <h3 className="dynamic_message2">
                          Drag your image here or
                        </h3>}
                        <label className="label">
                          <span className="browse-files">
                          {!imageUrls[2] && <FontAwesomeIcon
                              className="image2"
                              icon={faImage}
                            />}
                            <input
                              type="file"
                              accept="image/*"
                              className="default-file-input"
                              name="imagethumbnail2"
                              required
                              onChange={(e) =>
                                handleInputImageChange(e, "imagethumbnail2", 2)
                              }
                            />
                            {!imageUrls[2] &&  <span className="browse-files-text2">browse file</span>}
                            {!imageUrls[2] && <span className="text-small2">from device</span>}
                          </span>
                        </label>
                        {imageUrls[2] && (
                          <img src={imageUrls[2]} alt="Product 1" />
                        )}
                      </div>
                      <div className="drag_image2">
                      {!imageUrls[3] && <h3 className="dynamic_message2">
                          Drag your image here or
                        </h3>}
                        <label className="label">
                          <span className="browse-files">
                          {!imageUrls[3] &&<FontAwesomeIcon
                              className="image2"
                              icon={faImage}
                            />}
                            <input
                              type="file"
                              accept="image/*"
                              className="default-file-input2"
                              name="imagethumbnail3"
                              required
                              onChange={(e) =>
                                handleInputImageChange(e, "imagethumbnail3", 3)
                              }
                            />
                            {!imageUrls[3] &&<span className="browse-files-text2">browse file</span>}
                            {!imageUrls[3] &&<span className="text-small2">from device</span>}
                          </span>
                        </label>
                        {imageUrls[3] && (
                          <img src={imageUrls[3]} alt="Product 1" />
                        )}
                      </div>
                    </div>
                  </div>
                  <h4 className="product-feauters">Features</h4>
                  <div className="form-right-bottom">
                    <div className="feauters-left">
                      <div className="product_feauters all_inputs">
                        <input
                          type="text"
                          className="title-input"
                          name="features1"
                          placeholder="Feature 1"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="product_feauters all_inputs">
                        <input
                          type="text"
                          className="title-input"
                          placeholder="Feature 2"
                          name="features2"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="feauters-right">
                      <div className="product_feauters all_inputs">
                        <input
                          type="text"
                          className="title-input"
                          placeholder="Feature 3"
                          name="features3"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="product_feauters all_inputs">
                        <input
                          type="text"
                          className="title-input"
                          placeholder="Feature 4"
                          name="features4"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="product-details-right">
                      <div className="product_code all_inputs">
                        <label>Product Code</label>
                        <input
                          placeholder="ProductCode"
                          type="text"
                          className="title-input"
                          name="productCode"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="product_stock all_inputs">
                        <label>Stock</label>
                        <input
                          placeholder="Stock"
                          type="number"
                          className="title-input"
                          name="stock"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="button_container">
                      <input
                        className="add-product_button"
                        value="Add Product"
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      
    </div>
    {isPopupOpen && <AddProductPopUp onClose={closePopup} />}
    </>
  );
};