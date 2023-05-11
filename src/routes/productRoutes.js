import Router from 'express';
import { ProductManager } from '../productManager.js';
import { validateNumber } from '../utils/helpers.js';
import { validateCodeNotRepeated, validateNumberParams, validateRequest } from './../middleware/validators.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async(req, res) => {
    try {
        const limit = req.query.limit;
        const products = await manager.getProducts();
        const isValidLimit = validateNumber(limit);
        (isValidLimit) ? 
            res.status(200).json(products.slice(0,limit))
        :   res.status(200).json(products);
    } catch (error) {
        res.status(error.status || 500).json({
            status: "error",
            payload: error.message,
        });
    }
});

router.get('/:id', validateNumberParams, async (req, res) => {
    try{
        const id = req.params.id;
        const product = await manager.getProductById(parseInt(id));
        if(product == 'Not Found') {
            res.status(404).json(product);
        }
        else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(error.status || 500).json({
            status: "error",
            payload: error.message,
        });
    }
});

router.post("/", validateRequest, validateCodeNotRepeated, async (req, res) => {
    try {
        const newProduct = req.body;
        const productCreated = await manager.addProduct(newProduct);
        productCreated
        ? res.status(201).json({
            status: "success",
            payload: productCreated,
          })
        : res.json({
            status: "error",
          });
    } catch (error) {
      res.status(error.status || 500).json({
        status: "error",
        payload: error.message,
      });
    }
});

router.put("/:id", validateRequest, validateNumberParams, async (req, res) => {
    try {
        const id = req.params.id;
        const newProduct = req.body;
        const productUpdated = await manager.updateProduct(id, newProduct);
        if(productUpdated == "The Product doesn't exist")
        res.status(404).json({
            status: "error",
            payload: productUpdated,
        });
        else{
            res.status(200).json({
                status: "success",
                payload: productUpdated,
            });
        }
    } catch (error) {
      res.status(error.status || 500).json({
        status: "error",
        payload: error.message,
      });
    }
});

router.delete("/:id", validateNumberParams, async (req, res) => {
    try {
      const id = req.params.id;
      const productDeleted = await manager.deleteProduct(id);
      if(productDeleted == "The Product doesn't exist"){
        res.status(404).json({
            status: "error",
            payload: productDeleted,
        });
      } else {
        res.status(200).json({
            status: "success",
            payload: productDeleted,
          });
      }
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  });


export default router;
