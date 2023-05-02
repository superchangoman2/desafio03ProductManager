import express from 'express';
import { ProductManager } from './productManager.js';

const manager = new ProductManager();

const app = express();
const port = 8080;

app.get('/products', async(req, res) => {
    const limit = req.query.limit;
    await manager.readData();
    const products = manager.getProducts();
    if (limit) {
        res.json(products.slice(0,limit));
    } else {
        res.json(products);
    }
});

app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = await manager.getProductById(parseInt(id));
    if(product) {
        res.json(product);
    }
});

app.listen(port, () => {
    console.log(`Server online in port ${port}`);
});