const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs')
const path = require('path')
const errorHandler = require('./middlewares/errorMiddleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
app.use(session({
    secret: 'GOG_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(express.static('public'));
app.use(cookieParser());
// app.use(morgan('common'));
// app.use(morgan(':method :url :status :response-time ms'));

morgan.token('user', (req) => {
    if (req.user) { return req.user.email; }
    return 'no user info';
});

function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        ip: tokens['remote-addr'](req, res),
        user: tokens.user(req, res),
        time: tokens.date(req, res, 'iso'),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        'http-version': tokens['http-version'](req, res),
        'status-code': tokens.status(req, res),
        'content-length': tokens.res(req, res, 'content-length'),
        // referrer: tokens.referrer(req, res),
        // 'user-agent': tokens['user-agent'](req, res),
        'response-time': tokens['response-time'](req, res) + ' ms',
        params: res.req.params,
        body: res.req.body,
        query: res.req.query
    });
}
const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
app.use(morgan(jsonFormat, { stream: accessLogStream }));

const mongoURL = 'mongodb+srv://hemanth0921:mongodbpassword@nodetut.ej60wid.mongodb.net/GOG';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const paymentRoutes = require('./routes/payment');
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/payment', paymentRoutes);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gadgetsofgalaxy123@gmail.com",
        pass: "hyymkyjuiycfsueu"
    }
});

app.post('/sendemail', async (req, res) => {
    console.log(req.body.to);

    const mailOptions = {
        from: "gadgetsofgalaxy123@gmail.com",
        to: req.body.to,
        subject: "Reply to your query",
        text: req.body.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
        } else {
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library Management API',
            version: '1.0.0',
            description: 'API for managing books and authors in a library',
        },
        servers: [
            {
                url: 'https://gog-backend-t01u.onrender.com',
                description: 'Development server',
            },
        ],
    },
    apis: ['./server.js', './routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.send('<h1>GOG</h1>');
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         mobileNumber:
 *           type: number
 *           description: The mobile number of the user.
 *         gender:
 *           type: string
 *           description: The gender of the user.
 *         dob:
 *           type: string
 *           format: date
 *           description: The date of birth of the user.
 *         location:
 *           type: string
 *           description: The location of the user.
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is active.
 *         isDeleted:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is deleted.
 *         isUser:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is a regular user.
 *         isSeller:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is a seller.
 *         isAdmin:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is an administrator.
 *         wishlists:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of wishlist IDs associated with the user.
 *         carts:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of cart IDs associated with the user.
 *       required:
 *         - name
 *         - email
 *         - password
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         password: hashedPassword
 *         mobileNumber: 1234567890
 *         gender: Male
 *         dob: 1990-01-01
 *         location: New York
 *         isActive: true
 *         isDeleted: false
 *         isUser: true
 *         isSeller: false
 *         isAdmin: false
 *         wishlists: []
 *         carts: []
 *     Seller:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the seller.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the seller.
 *         password:
 *           type: string
 *           description: The password of the seller.
 *         companyName:
 *           type: string
 *           description: The name of the company of the seller.
 *         address:
 *           type: string
 *           description: The address of the seller's company.
 *         products:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of product IDs associated with the seller.
 *         isSeller:
 *           type: boolean
 *           default: false
 *           description: Indicates if the user is a seller.
 *         approved:
 *           type: boolean
 *           default: false
 *           description: Indicates if the seller is approved.
 *       required:
 *         - username
 *         - email
 *         - password
 *         - companyName
 *         - address
 *       example:
 *         username: seller1
 *         email: seller1@example.com
 *         password: hashedPassword
 *         companyName: Company A
 *         address: 123 Main St, City, Country
 *         products: []
 *         isSeller: false
 *         approved: false
 *     Wishlist:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the wishlist.
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product in the wishlist.
 *               imagePath:
 *                 type: string
 *                 description: The image path of the product in the wishlist.
 *               price:
 *                 type: number
 *                 description: The price of the product in the wishlist.
 *               title:
 *                 type: string
 *                 description: The title of the product in the wishlist.
 *               productCode:
 *                 type: string
 *                 description: The product code of the product in the wishlist.
 *           description: Array of items in the wishlist.
 *         totalQty:
 *           type: number
 *           description: The total quantity of items in the wishlist.
 *         user:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the wishlist.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the wishlist was created.
 *       required:
 *         - name
 *         - items
 *         - totalQty
 *         - user
 *       example:
 *         name: My Wishlist
 *         items:
 *           - productId: 12345678-1234-1234-1234-123456789abc
 *             imagePath: /images/product1.jpg
 *             price: 10
 *             title: Product 1
 *             productCode: ABC123
 *           - productId: 87654321-4321-4321-4321-987654321cba
 *             imagePath: /images/product2.jpg
 *             price: 20
 *             title: Product 2
 *             productCode: XYZ456
 *         totalQty: 2
 *         user: abcdef12-abcd-abcd-abcd-abcdef123456
 *         createdAt: "2024-04-29T12:00:00Z"
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who wrote the review.
 *         username:
 *           type: string
 *           description: The username of the user who wrote the review.
 *         product:
 *           type: string
 *           format: uuid
 *           description: The ID of the product being reviewed.
 *         reviewRating:
 *           type: number
 *           description: The rating given in the review.
 *         reviewTitle:
 *           type: string
 *           description: The title of the review.
 *         reviewText:
 *           type: string
 *           description: The text content of the review.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the review was created.
 *       required:
 *         - user
 *         - username
 *         - product
 *         - reviewRating
 *         - reviewTitle
 *         - reviewText
 *       example:
 *         user: abcdef12-abcd-abcd-abcd-abcdef123456
 *         username: john_doe
 *         product: 12345678-1234-1234-1234-123456789abc
 *         reviewRating: 4.5
 *         reviewTitle: Great product!
 *         reviewText: This product exceeded my expectations.
 *         createdAt: "2024-04-29T12:00:00Z"
 *     Product:
 *       type: object
 *       properties:
 *         productCode:
 *           type: string
 *           description: The code of the product.
 *         title:
 *           type: string
 *           description: The title of the product.
 *         imagePath:
 *           type: string
 *           description: The image path of the product.
 *         imagethumbnail1:
 *           type: string
 *           description: The image thumbnail path of the product.
 *         imagethumbnail2:
 *           type: string
 *           description: The image thumbnail path of the product.
 *         imagethumbnail3:
 *           type: string
 *           description: The image thumbnail path of the product.
 *         description:
 *           type: string
 *           description: The description of the product.
 *         features1:
 *           type: string
 *           description: The first feature of the product.
 *         features2:
 *           type: string
 *           description: The second feature of the product.
 *         features3:
 *           type: string
 *           description: The third feature of the product.
 *         features4:
 *           type: string
 *           description: The fourth feature of the product.
 *         mrp:
 *           type: number
 *           description: The maximum retail price of the product.
 *         price:
 *           type: number
 *           description: The selling price of the product.
 *         reviewed:
 *           type: number
 *           description: The number of times the product has been reviewed.
 *         sold:
 *           type: number
 *           description: The number of times the product has been sold.
 *         stock:
 *           type: number
 *           description: The current stock of the product.
 *         category:
 *           type: string
 *           description: The category of the product.
 *         brand:
 *           type: string
 *           description: The brand of the product.
 *         manufacturer:
 *           type: string
 *           format: uuid
 *           description: The ID of the manufacturer of the product.
 *         available:
 *           type: boolean
 *           description: Indicates if the product is available.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was created.
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of review IDs associated with the product.
 *         rating:
 *           type: number
 *           description: The average rating of the product.
 *       required:
 *         - productCode
 *         - title
 *         - imagePath
 *         - imagethumbnail1
 *         - imagethumbnail2
 *         - imagethumbnail3
 *         - description
 *         - features1
 *         - features2
 *         - features3
 *         - features4
 *         - mrp
 *         - price
 *         - reviewed
 *         - sold
 *         - stock
 *         - category
 *         - brand
 *         - available
 *         - rating
 *       example:
 *         productCode: ABC123
 *         title: Sample Product
 *         imagePath: /images/sample-product.jpg
 *         imagethumbnail1: /thumbnails/sample-product-1.jpg
 *         imagethumbnail2: /thumbnails/sample-product-2.jpg
 *         imagethumbnail3: /thumbnails/sample-product-3.jpg
 *         description: This is a sample product description.
 *         features1: Feature 1
 *         features2: Feature 2
 *         features3: Feature 3
 *         features4: Feature 4
 *         mrp: 100
 *         price: 80
 *         reviewed: 10
 *         sold: 5
 *         stock: 20
 *         category: Electronics
 *         brand: Sample Brand
 *         manufacturer: 12345678-1234-1234-1234-123456789abc
 *         available: true
 *         createdAt: "2024-04-29T12:00:00Z"
 *         reviews: []
 *         rating: 4.5
 *     ContactUs:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the contact.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the contact.
 *         phone:
 *           type: number
 *           description: The phone number of the contact.
 *         subject:
 *           type: string
 *           description: The subject of the contact.
 *         message:
 *           type: string
 *           description: The message of the contact.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the contact was created.
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - subject
 *         - message
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         phone: 1234567890
 *         subject: Inquiry
 *         message: Hello, I have an inquiry regarding your products.
 *         createdAt: "2024-04-29T12:00:00Z"
 *     Checkout:
 *       type: object
 *       properties:
 *         totalQty:
 *           type: number
 *           description: The total quantity of items in the checkout.
 *         totalCost:
 *           type: number
 *           description: The total cost of items in the checkout.
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the checkout item.
 *               qty:
 *                 type: number
 *                 description: The quantity of the checkout item.
 *               price:
 *                 type: number
 *                 description: The price of the checkout item.
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product in the checkout item.
 *               title:
 *                 type: string
 *                 description: The title of the product in the checkout item.
 *               imagePath:
 *                 type: string
 *                 description: The image path of the product in the checkout item.
 *               productCode:
 *                 type: string
 *                 description: The product code of the product in the checkout item.
 *           description: Array of items in the checkout.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the checkout was created.
 *         user:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who performed the checkout.
 *       required:
 *         - totalQty
 *         - totalCost
 *         - items
 *         - user
 *       example:
 *         totalQty: 2
 *         totalCost: 30
 *         items:
 *           - _id: 12345678-1234-1234-1234-123456789abc
 *             qty: 1
 *             price: 10
 *             productId: 87654321-4321-4321-4321-987654321cba
 *             title: Product 1
 *             imagePath: /images/product1.jpg
 *             productCode: ABC123
 *           - _id: 98765432-9876-9876-9876-987654321cba
 *             qty: 1
 *             price: 20
 *             productId: 98765432-9876-9876-9876-987654321cba
 *             title: Product 2
 *             imagePath: /images/product2.jpg
 *             productCode: XYZ456
 *         createdAt: "2024-04-29T12:00:00Z"
 *         user: abcdef12-abcd-abcd-abcd-abcdef123456
 *     Category:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the category.
 *         slug:
 *           type: string
 *           unique: true
 *           description: The slugified title of the category.
 *       required:
 *         - title
 *       example:
 *         title: Electronics
 *         slug: electronics
 *     Cart:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product in the cart item.
 *               imagePath:
 *                 type: string
 *                 description: The image path of the product in the cart item.
 *               qty:
 *                 type: number
 *                 description: The quantity of the cart item.
 *               price:
 *                 type: number
 *                 description: The price of the cart item.
 *               title:
 *                 type: string
 *                 description: The title of the product in the cart item.
 *               productCode:
 *                 type: string
 *                 description: The product code of the product in the cart item.
 *           description: Array of items in the cart.
 *         totalQty:
 *           type: number
 *           description: The total quantity of items in the cart.
 *         totalCost:
 *           type: number
 *           description: The total cost of items in the cart.
 *         user:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who owns the cart.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the cart was created.
 *       required:
 *         - items
 *         - totalQty
 *         - totalCost
 *         - user
 *       example:
 *         items:
 *           - productId: 12345678-1234-1234-1234-123456789abc
 *             imagePath: /images/product1.jpg
 *             qty: 1
 *             price: 10
 *             title: Product 1
 *             productCode: ABC123
 *           - productId: 87654321-4321-4321-4321-987654321cba
 *             imagePath: /images/product2.jpg
 *             qty: 1
 *             price: 20
 *             title: Product 2
 *             productCode: XYZ456
 *         totalQty: 2
 *         totalCost: 30
 *         user: abcdef12-abcd-abcd-abcd-abcdef123456
 *         createdAt: "2024-04-29T12:00:00Z"
 */

/**
 * @swagger
 * /sendemail:
 *   post:
 *     summary: Send an email
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: The email address of the recipient.
 *               text:
 *                 type: string
 *                 description: The content of the email.
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *       '500':
 *         description: Error sending email
 */

// Error Middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



module.exports = app; 
