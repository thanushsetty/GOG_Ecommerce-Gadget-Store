import { useState, useEffect } from "react";
import favorite from "../assets/favorite.png";
import "../styles/ProductItemSmall.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const ProductItemSmall = (props) => {
    const navigate = useNavigate();
    
    const user = props.user ? props.user : null;
    const productId = props.product._id;
    const imagePath = props.product.imagePath;
    const price = props.product.price;
    const productcode = props.product.productcode
    const title = props.product.title
    const [showWishlistOptions, setShowWishlistOptions] = useState(false);
    const [wishlistName, setWishlistName] = useState('');
    const [createNewWishlist, setCreateNewWishlist] = useState(true);
    const [userWishlists, setUserWishlists] = useState([]);
    const [useExistingWishlist, setUseExistingWishlist] = useState(false);
    const [selectedWishlist, setSelectedWishlist] = useState('');

    const fetchUserWishlists = async () => {
        try {
            const response = await axios.get(`https://gog-backend-t01u.onrender.com/api/user/wishlists/${user._id}`);
            if (response.status === 200) {
                // console.log(response.data.wishlists[0]);
                // console.log(response.data);
                setUserWishlists(response.data);
            } else {
                console.error('Failed to fetch user wishlists.');
            }
        } catch (error) {
            console.error('Error while fetching user wishlists:', error);
        }
    };
    useEffect(() => {
        if (user !== null) {
            fetchUserWishlists();
        }
    }, []);

    const handleWishlistClick = () => {
        console.log(user);
        if (user) {
            fetchUserWishlists();
            setShowWishlistOptions(!showWishlistOptions);
        } else {
            navigate('/login');
        }
    };
    

    const handleCreateNewWishlist = () => {
        setCreateNewWishlist(true);
        setUseExistingWishlist(false);
    };

    const handleUseExistingWishlist = () => {
        setCreateNewWishlist(false);
        setUseExistingWishlist(true);
    };


    const handleSaveWishlist = async () => {
        if (createNewWishlist) {
            try {
                const response = await axios.post(`https://gog-backend-t01u.onrender.com/api/user/wishlists/create/${user._id}`, {
                    name: wishlistName,
                });

                if (response.status === 200) {
                    console.log('Wishlist created successfully');
                    fetchUserWishlists();
                    const newWishlistId = response.data.wishlistId;
                    addProductToWishlist(newWishlistId);
                    setWishlistName('');
                } else {
                    console.error('Failed to create wishlist.');
                }
            } catch (error) {
                console.error('Error while creating wishlist:', error);
            }
        } else {
            if (selectedWishlist) {
                addProductToWishlist(selectedWishlist);
            } else {
                console.error('Please select a wishlist');
            }
        }
        setShowWishlistOptions(false);
    };

    const addProductToWishlist = async (wishlistId) => {
        try {
            const response = await axios.post(`https://gog-backend-t01u.onrender.com/api/user/wishlists/addProduct/${wishlistId}`, {
                productId: productId,
                imagePath: imagePath,
                price: price,
                productcode: productcode,
                title: title
            });

            if (response.status === 200) {
                console.log('Product added to wishlist successfully');
            } else {
                console.error('Failed to add product to wishlist.');
            }
        } catch (error) {
            console.error('Error while adding product to wishlist:', error);
        }
    };

    const maxRating = 5;
    const solidStars = Math.floor(props.product.rating);
    const hasHalfStar = props.product.rating % 1 !== 0;

    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        if (i <= solidStars) {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ solidStar } className="solid-star" />
            );
        } else if (hasHalfStar && i === solidStars + 1) {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ halfStar } className="half-star" />
            );
        } else {
            stars.push(
                <FontAwesomeIcon key={ i } icon={ regularStar } className="regular-star" />
            );
        }
    }

    return (
        <div className="product-item-s">
            <div className="product-thumbnail">
                <img src={ props.product.imagePath }
                    alt="product-thumbnail"
                    className="deal-image"
                />
                <div className="product-wishlist">
                    <img src={ favorite } alt="favorite" onClick={ handleWishlistClick } />
                </div>
                { showWishlistOptions && (
                    <div className="wishlist-options active">
                        <button onClick={ handleCreateNewWishlist }>
                            <i className="fas fa-plus"></i> Create New Wishlist
                        </button>

                        <button onClick={ handleUseExistingWishlist }>
                            <i className="fas fa-list-alt"></i> Use Existing Wishlist
                        </button>
                        { useExistingWishlist ? (
                            <select value={ selectedWishlist } onChange={ (e) => setSelectedWishlist(e.target.value) }>
                                <option value="">Select an existing wishlist</option>
                                { Array.isArray(userWishlists.wishlists) && userWishlists.wishlists.map((wishlist) => (
                                    <option key={ wishlist._id } value={ wishlist._id }>
                                        { wishlist.name }
                                    </option>
                                )) }
                            </select>
                        ) : (
                            <input
                                className='input-name'
                                type="text"
                                placeholder="Enter wishlist name"
                                value={ wishlistName }
                                onChange={ (e) => setWishlistName(e.target.value) }
                            />
                        ) }
                        <button onClick={ handleSaveWishlist } className='save-btn'>
                            { !useExistingWishlist ? (
                                <span><i className="fas fa-plus"></i> Create Wishlist</span>
                            ) : (
                                <span><i className="fas fa-list-alt"></i> Save to Wishlist</span>
                            ) }
                        </button>
                    </div>
                ) }
            </div>
            <div className="product-content">
                <div className="product-title-wrap">
                    <Link to={ `/product/${props.product._id}` } className="product-link">
                        <h3 className="product-title">{ props.product.title }</h3>
                    </Link>
                </div>
                <div className="product-rating">
                    <div className="rating-stars">
                        <p>
                            <span>{ stars }</span> ({ props.product.rating })
                        </p>
                    </div>
                </div>
                <div className="product-price">
                    <span className="text-span">INR. { props.product.price }</span>
                    <span className="text-cancel">INR. { props.product.mrp }</span>
                </div>
            </div>
        </div>
    );
}