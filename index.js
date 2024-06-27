// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./database');
const Product = require('./models/product');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


// Sincronizar el modelo con la base de datos
sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

// Get all products
app.get('/api', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
      dateAdded: new Date(),
    });
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedProduct = await Product.findOne({ where: { id: id } });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { id: id }
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
