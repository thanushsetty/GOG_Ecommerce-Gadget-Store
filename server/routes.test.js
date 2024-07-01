const request = require('supertest');
const app = require('./server');
const bcrypt = require('bcrypt');
const Checkout = require('./models/Checkout');
const ContactUs = require('./models/ContactUs');
const User = require('./models/User');
const redisClient = require('./utils/redis');

describe("GET api/user/products/:id", () => {
    test("should return product data for valid product ID", (done) => {
        const validProductId = "6442336d45318afadbd6b66c";
        request(app)
            .get(`/api/user/products/${validProductId}`)
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                expect(res.body.product).toBeDefined();
                done();
            })
            .catch((err) => done(err));
    });

    test("should return 404 for invalid product ID", (done) => {
        const invalidProductId = "6442336d45318afadbd6b660";
        request(app)
            .get(`/api/user/products/${invalidProductId}`)
            .expect(404)
            .expect("Content-Type", /json/)
            .then((res) => {
                done();
            })
            .catch((err) => done(err));
    });
});

describe("GET api/seller/sellers/:id", () => {
  test("should return seller data for valid seller ID", (done) => {
      const validSellerId = "65d381e89749efcaeb9580bf";
      request(app)
          .get(`/api/seller/sellers/${validSellerId}`)
          .expect(200)
          .expect("Content-Type", /json/)
          .then((res) => {
              expect(res.body).toBeDefined();
              done();
          })
          .catch((err) => done(err));
  });

  test("should return 404 for invalid Seller ID", (done) => {
      const invalidSellerId = "65d381e89749efcaeb9580b";
      request(app)
          .get(`/api/seller/sellers/${invalidSellerId}`)
          .expect(500)
          .expect("Content-Type", /json/)
          .then((res) => {
              done();
          })
          .catch((err) => done(err));
  });
});

describe("POST api/user/login", () => {
  test("should validate email and password", async () => {
      const credentials = {
          email: "praveen@gmail.com",
          password: "123@Aa",
          name: "prawin"
      };

      const res = await request(app)
          .post("/api/user/login")
          .send(credentials);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", credentials.email);
      expect(res.body.user).toHaveProperty("isUser");
      expect(res.body.user).toHaveProperty("isSeller");
      expect(res.body.user).toHaveProperty("isAdmin");
  });

  test("should return 401 for invalid credentials", async () => {
      const credentials = {
          email: "ashok@gmail.com",
          password: "ashok@123",
      };

      const res = await request(app)
          .post("/api/user/login")
          .send(credentials);

      expect(res.status).toBe(401);
  });
});

//ADMIN

describe('Admin Endpoints', () => {


  describe('GET /api/admin/orders', () => {
    it('should get all orders', async () => {
      const res = await request(app).get('/api/admin/orders');
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('createdAt');
      expect(res.body[0]).toHaveProperty('items');
      expect(res.body[0]).toHaveProperty('totalCost');
      expect(res.body[0]).toHaveProperty('user');
    });
  });


  describe('GET /api/admin/messages', () => {
    it('should get all contact messages', async () => {
      const mockMessages = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: 1234567890, subject: 'Test Subject 1', message: 'Test message 1' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: 9876543210, subject: 'Test Subject 2', message: 'Test message 2' }
      ];
      ContactUs.find = jest.fn().mockResolvedValue(mockMessages);
      const response = await request(app).get('/api/admin/messages');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockMessages);
    });
  
    it('should return internal server error if fetching messages fails', async () => {
      ContactUs.find = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).get('/api/admin/messages');
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('DELETE /api/admin/contactUs/:id', () => {
    it('should delete a message by ID', async () => {
      const messageId = '1';
      ContactUs.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: messageId });

      const response = await request(app).delete(`/api/admin/contactUs/${messageId}`);
      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({ message: 'Message deleted successfully' });
    });
  
    it('should return "Message not found" if message with given ID does not exist', async () => {
      const messageId = '2';
  
      ContactUs.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  
      const response = await request(app).delete(`/api/admin/contactUs/${messageId}`);
  
      expect(response.statusCode).toBe(404);
  
      expect(response.body).toEqual({ message: 'Message not found' });
    });
  
    it('should return internal server error if deleting message fails', async () => {
      const messageId = '3';
  
      ContactUs.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).delete(`/api/admin/contactUs/${messageId}`);
  
      expect(response.statusCode).toBe(500);

      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });


  describe('DELETE /api/admin/deleUser/:id', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      User.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: userId });
      const response = await request(app).delete(`/api/admin/deleUser/${userId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: 'User deleted successfully' });
    });
  
    it('should return "User not found" if user with given ID does not exist', async () => {
      const userId = '2';
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      const response = await request(app).delete(`/api/admin/deleUser/${userId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ user: 'User not found' });
    });
  
    it('should return internal server error if deleting user fails', async () => {
      const userId = '3';
      User.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));
      const response = await request(app).delete(`/api/admin/deleUser/${userId}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ user: 'Internal server error' });
    });
  });
});




// describe("POST /api/seller/addproduct", () => {
//     test("should add a new product successfully", async () => {
//         const seller = {
//             username: "testseller",
//             email: "testjestseller@example.com",
//             password: "testpassword",
//             companyName: "Test Company",
//             address: "123 Test St"
//         };

//         const registerResponse = await request(app)
//             .post("/api/seller/register")
//             .send(seller);

//         expect(registerResponse.status).toBe(201);


//         const loginResponse = await request(app)
//             .post("/api/seller/login")
//             .send({ email: seller.email, password: seller.password });
    

//         expect(loginResponse.status).toBe(200);
//         expect(loginResponse.body.seller).toBeDefined();
//         // expect(loginResponse.body.seller.token).toBeDefined(); // Ensure token exists
    
//         // const token = loginResponse.body.seller.token;
    
//         const product = {
//             title: "Test Product",
//             imagePath : 'http://res.cloudinary.com/products-gog/image/upload/v1708361536/grhd1/nbdnpoiu5q2ptvjb8ugv.avif',
//             imagethumbnail1: "http://res.cloudinary.com/products-gog/image/upload/v1708361536/grhd1/nbdnpoiu5q2ptvjb8ugv.avif",
//             imagethumbnail2: "http://res.cloudinary.com/products-gog/image/upload/v1708361536/grhd1/nbdnpoiu5q2ptvjb8ugv.avif",
//             imagethumbnail3: "http://res.cloudinary.com/products-gog/image/upload/v1708361536/grhd1/nbdnpoiu5q2ptvjb8ugv.avif",    
//             description: "This is a test product",
//             features1:"SS",
//             features2:"SS",
//             features3:"SS",
//             features4:"SS",
//             productCode: "TEST123",
//             price: 99.99,
//             mrp: 99,
//             reveiwed: 23,
//             sold: 34,
//             stock: 10,
//             brand: "Test Brand",
//             manufacturer: "65d381e89749efcaeb9580bf", 
//             available: 34,
//             category: "Test Category",
//             rating: 0
//         };
    
//         // Make a request to add the product using the obtained token
//         const response = await request(app)
//             .post("/api/seller/addproduct")
//             // .set("Authorization", `Bearer ${token}`)
//             .send(product);
    
//         expect(response.status).toBe(201);
//     });
    
//     test("should return 500 if there's an internal server error", async () => {
//         const response = await request(app)
//             .post("/api/seller/addproduct")
//             .send({});
//         expect(response.status).toBe(500);
//     });
// });
