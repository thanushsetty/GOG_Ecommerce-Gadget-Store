const redis = require('redis');
const client = require('../utils/redis');



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for admin operations
 */



/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     responses:
 *       '200':
 *         description: Successfully retrieved orders
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/messages:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Admin]
 *     responses:
 *       '200':
 *         description: Successfully retrieved messages
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/contactUs/{id}:
 *   delete:
 *     summary: Delete a contact message by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to delete
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *       '404':
 *         description: Message not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/deleUser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */



const express = require('express');
const moment = require('moment');
const router = express();

const User = require('../models/User');
const Checkout = require('../models/Checkout');
const ContactUs = require('../models/ContactUs');

router.get('/orders', async (req, res) => {
    try {
        const cacheKey = 'orders-data';
        let orders = await client.get(cacheKey);

        if (!orders) {
            orders = await Checkout.find();
            client.set(cacheKey,JSON.stringify(orders));
            console.log('Orders data set into Redis cache');
        } else {
            orders = JSON.parse(orders);
            console.log('Orders data retrieved from Redis cache');
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactUs.find({});
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/contactUs/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const deletedMessage = await ContactUs.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ user: 'User not found' });
        }
        res.status(200).json({ user: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).json({ user: 'Internal server error' });
    }
});

module.exports = router;