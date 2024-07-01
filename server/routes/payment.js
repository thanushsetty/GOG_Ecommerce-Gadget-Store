/**
 * @swagger
 * tags:
 *   name: Razorpay
 *   description: Endpoints for interacting with Razorpay API
 */

/**
 * @swagger
 * /api/payment/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Razorpay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the order
 *     responses:
 *       '200':
 *         description: Successfully created an order
 *       '500':
 *         description: Something went wrong
 */

/**
 * @swagger
 * /api/payment/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Razorpay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 description: The order ID from Razorpay
 *               razorpay_payment_id:
 *                 type: string
 *                 description: The payment ID from Razorpay
 *               razorpay_signature:
 *                 type: string
 *                 description: The signature from Razorpay
 *     responses:
 *       '200':
 *         description: Payment verified successfully
 *       '400':
 *         description: Invalid signature sent
 *       '500':
 *         description: Internal Server Error
 */

const express = require('express');
const router = express();
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_test_Gj1HHlsQFVyVat",
            key_secret: "CPbCpVzcBIiDUgf3QKknEDcn",
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

module.exports = router;
