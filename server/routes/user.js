const express = require('express');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const ContactUs = require('../models/ContactUs');
const Category = require('../models/Category');
const Review = require('../models/Review');
const bcrypt = require('bcrypt');
const client = require('../utils/redis');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const encryptPassword = (password) => {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };

        const hashedPassword = encryptPassword(password);

        let userRoles = { isUser: false, isSeller: false, isAdmin: false };
        userRoles.isUser = true;

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            ...userRoles
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
        console.log("Successfully created");
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({
            message: 'login successful',
            user,
            isUser: user.isUser,
            isSeller: user.isSeller,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const cacheKey = 'categories-data';
        let categories = await client.get(cacheKey);

        if (!categories) {
            categories = await Category.find({});
            client.set(cacheKey, JSON.stringify(categories));
            console.log('Categories data set into Redis cache');
        } else {
            categories = JSON.parse(categories);
            console.log('Categories data retrieved from Redis cache');
        }

        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Products' });
    }
});

router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Product' });
    }
});

router.post('/carts/addToCart', async (req, res) => {
    const { productId, userId } = req.body;

    try {
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [], totalQty: 0, totalCost: 0 });
        }
        const existingProductIndex = userCart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (existingProductIndex !== -1) {
            userCart.items[existingProductIndex].qty += 1;
        } else {
            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const product = {
                productId,
                qty: 1,
                price: productDetails.price,
                title: productDetails.title,
                imagePath: productDetails.imagePath,
                productCode: productDetails.productCode
            };
            userCart.items.push(product);
        }
        userCart.totalQty = userCart.items.reduce((total, item) => total + item.qty, 0);
        userCart.totalCost = userCart.items.reduce((totalCost, item) => {
            return totalCost + (item.price * item.qty);
        }, 0);
        await userCart.save();

        res.status(200).json({ message: 'Product added to cart successfully', cartId: userCart._id });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/wishlists/:wishlistId/removeProduct/:productId', async (req, res) => {
    const { wishlistId, productId } = req.params;

    try {
        let userWishlist = await Wishlist.findById(wishlistId);
        if (!userWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        const productIndex = userWishlist.items.findIndex(item => item._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in wishlist' });
        }

        userWishlist.items.splice(productIndex, 1);
        userWishlist.totalQty -= 1;

        if (userWishlist.items.length === 0) {
            await Wishlist.findByIdAndDelete(wishlistId);
            return res.status(200).json({ message: 'Wishlist deleted as no products are left' });
        }

        await userWishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/carts/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json({ cartItems: userCart.items });
    } catch (error) {
        console.error('Error fetching user cart items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/carts/:userId/deleteItem/:itemId', async (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    try {
        const userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        userCart.items = userCart.items.filter(item => item._id.toString() !== itemId);
        // console.log(userCart.items.length);
        await userCart.save();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/checkout', async (req, res) => {
    try {
        const { totalQty, totalCost, items, user } = req.body;
        // console.log(items);
        const checkout = new Checkout({
            totalQty,
            totalCost,
            items,
            user
        });
        await checkout.save();
        for (const item of items) {
            await Product.updateOne(
                { _id: item.productId },
                { 
                    $inc: { sold: item.qty, stock: -item.qty } 
                }
            );
            
        }
        client.del('orders-data');
        console.log("key pair deleted from cache due to update")
        res.status(201).json({ message: 'Checkout successful', checkout });
        await Cart.deleteMany({ user: user });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/checkouts/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userCheckouts = await Checkout.find({ user: userId });
        // console.log(userCheckouts);
        if (!userCheckouts || userCheckouts.length === 0) {
            return res.status(404).json({ error: 'Checkouts not found' });
        }
        const checkoutItems = userCheckouts.flatMap(checkout => checkout.items);
        res.status(200).json({ checkoutItems });
    } catch (error) {
        console.error('Error fetching user checkout items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/checkouts', async (req, res) => {
    try {
        const checkouts = await Checkout.find({});
        if (!checkouts || checkouts.length === 0) {
            return res.status(404).json({ error: 'Checkouts not found' });
        }
        res.status(200).json({ checkouts: checkouts });
    } catch (error) {
        console.error('Error fetching checkout items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/wishlists/:userId', async (req, res) => {
    const userId = req.params.userId;
    // console.log(userId);
    try {
        const wishlists = await Wishlist.find({ user: userId });
        if (wishlists) {
            res.json({ wishlists });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlists' });
    }
});

router.post('/wishlists/create/:id', async (req, res) => {
    const wishlistName = req.body.name;
    const userId = req.params.id;

    try {
        const newWishlist = new Wishlist({ name: wishlistName, user: userId });
        await newWishlist.save();

        const user = await User.findById(userId);
        user.wishlists.push(newWishlist);
        await user.save();

        res.status(200).json({ message: 'Wishlist created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wishlist' });
    }
});

router.post('/wishlists/addProduct/:wishlistId', async (req, res) => {
    const wishlistId = req.params.wishlistId;
    const productId = req.body.productId;
    try {
        const wishlist = await Wishlist.findById(wishlistId);
        if (!wishlist) {
            // alert("Wishlist not found or Select an Existing wishlist");
            return res.status(404).json({ error: 'Wishlist not found' });
        }
        const existingProduct = wishlist.items.find(item => item.productId.toString() === productId);

        if (existingProduct) {
            // alert("Product already in wishlist");
            return res.status(400).json({ error: 'Product already exists in the wishlist' });
        }
        wishlist.items.push({
            productId: productId,
            imagePath: req.body.imagePath,
            price: req.body.price,
            productCode: req.body.productcode,
            title: req.body.title,
        });
        wishlist.totalQty = wishlist.items.length;
        await wishlist.save();

        // alert("Product added to wishlist successfully");
        res.status(200).json({ message: 'Product added to wishlist successfully', wishlist });
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ error: 'Failed to add product to wishlist' });
    }
});

router.post('/editprofile/:id', async (req, res) => {
    const user_id = req.params.id;
    // console.log(req.body);

    try {
        const updatedUser = await User.findById(user_id);
        // console.log(updatedUser);

        if (!updatedUser) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        updatedUser.mobileNumber = req.body.mobileNumber;
        updatedUser.gender = req.body.gender;
        updatedUser.dob = req.body.dob.toString();
        updatedUser.location = req.body.location;

        // console.log(updatedUser.mobileNumber);

        await updatedUser.save();

        // console.log('Updated User:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/contactus', (req, res) => {
    const { name, subject, phone, email, message } = req.body;
    const newContactUs = new ContactUs({
        name,
        subject,
        phone,
        email,
        message,
    });

    newContactUs.save()
        .then(() => res.status(200).send('Message sent to Admin!'))
        .catch((error) => res.status(500).send(`Error: ${error}`));
});

router.get('/products/category/:categoryTitle', async (req, res) => {
    try {
        const categoryTitle = req.params.categoryTitle;
        const category = await Category.findOne({ title: categoryTitle });
        if (!category) {
            return res.status(404).json({ error: `Category '${categoryTitle}' not found` });
        }
        const products = await Product.find({ category: category._id });
        // console.log(products);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.json({ reviews });
        // console.log(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

router.put('/carts/:cartItemId/updateQuantity', async (req, res) => {
    const cartItemId = req.params.cartItemId;
    const { newQty } = req.body; // Assuming newQty is provided in the request body

    try {
        // Find the cart item by ID and update the quantity directly using assignment
        const cartItem = await Cart.findById(cartItemId);
        console.log(cartItem);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Update the quantity of the cart item
        cartItem.qty = newQty;

        // Save the updated cart item back to the database
        const updatedCartItem = await cartItem.save();

        res.status(200).json({ message: 'Cart item quantity updated successfully', updatedCartItem });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/reviews', async (req, res) => {
    const { productId, userId, reviewRating, reviewText, reviewTitle } = req.body;
    // console.log(req.body);
    try {
        const newReview = new Review({
            user: userId,
            product: productId,
            username: req.body.username,
            reviewRating,
            reviewText,
            reviewTitle,
        });
        await newReview.save();

        let averageRating = 0;
        const reviews = await Review.find({ product: productId });
        if (reviews.length > 0) {
            const totalRatings = reviews.reduce((acc, curr) => acc + curr.reviewRating, 0);
            averageRating = totalRatings / reviews.length;
            averageRating = Math.round(averageRating * 10) / 10;
        } else {
            averageRating = rating;
        }
        await Product.findByIdAndUpdate(productId, { $inc: { reviewed: 1 }, rating: averageRating, $push: { reviews: newReview._id } });
        res.status(201).json({ message: 'Review submitted successfully', review: newReview });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for the newly registered user
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login as a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                 isUser:
 *                   type: boolean
 *                   description: Indicates if the user is a regular user
 *                 isSeller:
 *                   type: boolean
 *                   description: Indicates if the user is a seller
 *                 isAdmin:
 *                   type: boolean
 *                   description: Indicates if the user is an admin
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retrieved categories successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Failed to fetch categories

/**
 * @swagger
 * /api/user/products:
 *   get:
 *     summary: Get all products
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retrieved products successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to fetch products
 */

/**
 * @swagger
 * /api/user/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to get
 *     responses:
 *       200:
 *         description: Retrieved product successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 */


/**
 * @swagger
 * /api/user/carts/addToCart:
 *   post:
 *     summary: Add a product to the user's shopping cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - productId
 *               - userId
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartId:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/carts/{userId}:
 *   get:
 *     summary: Get the user's shopping cart items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user's cart to fetch
 *     responses:
 *       200:
 *         description: Retrieved user's cart items successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/carts/{userId}/deleteItem/{itemId}:
 *   delete:
 *     summary: Delete an item from the user's shopping cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user's cart from which the item will be deleted
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to be deleted from the cart
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Cart not found or item not found in the cart
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/checkout:
 *   post:
 *     summary: Process checkout for user's cart items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalQty:
 *                 type: integer
 *               totalCost:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     qty:
 *                       type: integer
 *             required:
 *               - totalQty
 *               - totalCost
 *               - items
 *     responses:
 *       201:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 checkout:
 *                   $ref: '#/components/schemas/Checkout'
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/checkouts/{userId}:
 *   get:
 *     summary: Get the checkout items for a specific user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose checkout items are to be fetched
 *     responses:
 *       200:
 *         description: Retrieved user's checkout items successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CheckoutItem'
 *       404:
 *         description: Checkouts not found for the user
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/checkouts:
 *   get:
 *     summary: Get all checkout items
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved all checkout items successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkouts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Checkout'
 *       404:
 *         description: Checkouts not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/wishlists/{wishlistId}/removeProduct/{productId}:
 *   delete:
 *     summary: Remove a product from a wishlist
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the wishlist
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from the wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       404:
 *         description: Wishlist or product not found
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/wishlists/{userId}:
 *   get:
 *     summary: Get wishlists of a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Retrieved wishlists successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wishlists:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wishlist'
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/wishlists/create/{id}:
 *   post:
 *     summary: Create a new wishlist for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Wishlist created successfully
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/wishlists/addProduct/{wishlistId}:
 *   post:
 *     summary: Add a product to a wishlist
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               imagePath:
 *                 type: string
 *               price:
 *                 type: number
 *               productCode:
 *                 type: string
 *               title:
 *                 type: string
 *             required:
 *               - productId
 *               - imagePath
 *               - price
 *               - productCode
 *               - title
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *       400:
 *         description: Product already exists in the wishlist
 *       404:
 *         description: Wishlist not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/editprofile/{id}:
 *   post:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *               location:
 *                 type: string
 *             required:
 *               - mobileNumber
 *               - gender
 *               - dob
 *               - location
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Retrieved user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retrieved users successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/contactus:
 *   post:
 *     summary: Contact admin
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - name
 *               - subject
 *               - phone
 *               - email
 *               - message
 *     responses:
 *       200:
 *         description: Message sent to Admin successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/products/category/{categoryTitle}:
 *   get:
 *     summary: Get products by category
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: categoryTitle
 *         required: true
 *         schema:
 *           type: string
 *         description: Title of the category
 *     responses:
 *       200:
 *         description: Retrieved products by category successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Retrieved reviews successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error

/**
 * @swagger
 * /api/user/reviews:
 *   post:
 *     summary: Submit a review for a product
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               reviewRating:
 *                 type: number
 *               reviewText:
 *                 type: string
 *               reviewTitle:
 *                 type: string
 *             required:
 *               - productId
 *               - userId
 *               - reviewRating
 *               - reviewText
 *               - reviewTitle
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error
 */


module.exports = router;
