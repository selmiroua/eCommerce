const request = require('supertest');
const app = require('../app'); // Assurez-vous que votre app Express est exportée depuis app.js

describe('Product API Tests', () => {
  // Test GET /api/products
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  // Test GET /api/products/:id
  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      // Supposons que nous avons un ID valide
      const productId = 'REMPLACER_PAR_UN_ID_VALIDE';
      const res = await request(app)
        .get(`/api/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/nonexistentid')
        .expect(404);
    });
  });

  // Test POST /api/products
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Robe Test',
        price: 99.99,
        description: 'Une belle robe de test',
        image: '/images/products/test.jpg',
        sizes: ['S', 'M', 'L'],
        colors: ['Noir', 'Blanc'],
        categories: {
          style: ['Hijab'],
          fabric: ['Coton'],
          occasion: ['Casual'],
          type: ['Mi-longue']
        }
      };

      const res = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(newProduct.name);
    });
  });
});
