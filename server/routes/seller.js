/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Endpoints for seller operations
 */

/**
 * @swagger
 * /api/seller:
 *   get:
 *     summary: Get all sellers
 *     tags: [Seller]
 *     responses:
 *       '200':
 *         description: Successfully retrieved sellers
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/sellers/{id}:
 *   get:
 *     summary: Get seller by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved seller
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/sellerRating/{sellerId}:
 *   get:
 *     summary: Get average rating of a seller
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to get the rating for
 *     responses:
 *       '200':
 *         description: Successfully retrieved seller rating
 *       '404':
 *         description: No products found for this seller
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/register:
 *   post:
 *     summary: Register a new seller
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               companyName:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Seller registered successfully
 *       '400':
 *         description: Seller already exists
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/login:
 *   post:
 *     summary: Login as a seller
 *     tags: [Seller]
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
 *       '200':
 *         description: Login successful
 *       '404':
 *         description: Seller not found
 *       '401':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/{id}/approve:
 *   put:
 *     summary: Approve a seller by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to approve
 *     responses:
 *       '200':
 *         description: Seller approved successfully
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/{id}/revoke:
 *   put:
 *     summary: Revoke approval of a seller by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to revoke approval for
 *     responses:
 *       '200':
 *         description: Seller approval revoked successfully
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/addproduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagePath:
 *                 type: string
 *                 format: binary
 *               imagethumbnail1:
 *                 type: string
 *                 format: binary
 *               imagethumbnail2:
 *                 type: string
 *                 format: binary
 *               imagethumbnail3:
 *                 type: string
 *                 format: binary
 *               productCode:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               features1:
 *                 type: string
 *               features2:
 *                 type: string
 *               features3:
 *                 type: string
 *               features4:
 *                 type: string
 *               mrp:
 *                 type: number
 *               price:
 *                 type: number
 *               reviewed:
 *                 type: boolean
 *               sold:
 *                 type: number
 *               stock:
 *                 type: number
 *               brand:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               available:
 *                 type: boolean
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Product added successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/checkouts/{id}:
 *   get:
 *     summary: Get all checkouts for a seller
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to get checkouts for
 *     responses:
 *       '200':
 *         description: Successfully retrieved checkouts
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/products/{id}:
 *   get:
 *     summary: Get all products of a seller
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to get products for
 *     responses:
 *       '200':
 *         description: Successfully retrieved products
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/reviews/{id}:
 *   get:
 *     summary: Get all reviews for a seller's products
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller to get reviews for
 *     responses:
 *       '200':
 *         description: Successfully retrieved reviews
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/seller/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */


const express = require('express');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Review = require('../models/Review');
const Seller = require('../models/Seller');
const bcrypt = require('bcrypt');

const { uploadToCloudinary, removeFromCloudinary } = require('./cloudinary');
const upload = require('../middlewares/multerMiddleware')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const sellers = await Seller.find({});
        res.status(200).json({ sellers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sellers' });
    }
});

router.get('/sellers/:id', async (req, res) => {
    try {
        const sellerId = req.params.id;
        const seller = await Seller.findById(sellerId);
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/sellerRating/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;
    try {
        const seller = await Seller.findById(sellerId);
        const products = await Product.find({ _id: { $in: seller.products } });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }
        let totalRating = 0;
        products.forEach(product => {
            totalRating += product.rating;
        });
        var averageRating = (totalRating / products.length);
        averageRating = Math.round(averageRating * 10) / 10;
        res.status(200).json({ sellerRating: averageRating });
    } catch (error) {
        console.error('Error fetching seller rating:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, companyName, address } = req.body;
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newSeller = new Seller({
            username,
            email,
            password: hashedPassword,
            companyName,
            address
        });
        await newSeller.save();
        newSeller.isSeller = true;
        await newSeller.save();
        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        const passwordMatch = await bcrypt.compare(password, seller.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', seller });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.approved = true;
        await seller.save();
        return res.status(200).json({ message: 'Seller approved successfully', seller });
    } catch (error) {
        console.error('Error approving seller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id/revoke', async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.approved = false;
        await seller.save();
        return res.status(200).json({ message: 'Seller approval revoked successfully', seller });
    } catch (error) {
        console.error('Error revoking seller approval:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addproduct', upload.fields([
    { name: 'imagePath', maxCount: 1 },
    { name: 'imagethumbnail1', maxCount: 1 },
    { name: 'imagethumbnail2', maxCount: 1 },
    { name: 'imagethumbnail3', maxCount: 1 }
]), async (req, res) => {
    const files = req.files;
    try {
        const cloudinaryResponses = await Promise.all([
            uploadToCloudinary(files['imagePath'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail1'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail2'][0].path, req.body.productCode),
            uploadToCloudinary(files['imagethumbnail3'][0].path, req.body.productCode)
        ]);
        const [imagePathResponse, thumbnail1Response, thumbnail2Response, thumbnail3Response] = cloudinaryResponses;
        const newProduct = new Product({
            productCode: req.body.productCode,
            title: req.body.title,
            imagePath: imagePathResponse.url,
            imagethumbnail1: thumbnail1Response.url,
            imagethumbnail2: thumbnail2Response.url,
            imagethumbnail3: thumbnail3Response.url,
            description: req.body.description,
            features1: req.body.features1,
            features2: req.body.features2,
            features3: req.body.features3,
            features4: req.body.features4,
            mrp: req.body.mrp,
            price: req.body.price,
            reviewed: req.body.reviewed,
            sold: req.body.sold,
            stock: req.body.stock,
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            available: req.body.available,
            category: req.body.category,
            rating: req.body.rating,
        });

        const savedProduct = await newProduct.save();
        await Seller.updateOne({ _id: req.body.manufacturer }, { $push: { products: savedProduct._id } });
        res.status(201).send('Image uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/checkouts/:id', async (req, res) => {
    try {
        const sellerId = req.params.id
        const sellerProducts = await Product.find({ 'manufacturer': sellerId });
        const sellerProductIds = sellerProducts.map(product => product._id);
        // console.log(sellerProductIds);
        const checkouts = await Checkout.find({ 'items.productId': { $in: sellerProductIds } })
            .populate('items.productId')
            .populate('user');

        res.json({ success: true, checkouts });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const sellerId = req.params.id
        const sellerProducts = await Product.find({ 'manufacturer': sellerId });
        res.json({ products: sellerProducts });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/reviews/:id', async (req, res) => {
    try {
        const sellerId = req.params.id
        const sellerProducts = await Product.find({ manufacturer: sellerId });

        let productsWithReviews = [];
        for (const product of sellerProducts) {
            if (product.reviews.length > 0) {
                productsWithReviews.push(product);
            }
        }

        let allReviews = [];
        for (const product of sellerProducts) {
            if (product.reviews.length > 0) {
                allReviews = allReviews.concat(product.reviews);
            }
        }
        const reviewsData = await Review.find({ _id: { $in: allReviews } })
            .select('product reviewText reviewRating createdAt');

        res.json({ productsData: productsWithReviews, reviewsData });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.delete('/deleteProduct/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        const deleteProduct = await Product.findByIdAndDelete(productId);
        if (!deleteProduct) {
            return res.status(404).json({ product: 'Product not found' });
        }
        const sellerId = product.manufacturer;
        await Seller.updateOne({ _id: sellerId }, { $pull: { products: productId } });
        res.status(200).json({ product: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting Product:', error);
        res.status(500).json({ product: 'Internal server error' });
    }
});

module.exports = router;