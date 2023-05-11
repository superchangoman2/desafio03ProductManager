import Router from 'express';
import { CartManager } from '../cartManager.js';
import { validateNumber } from '../utils/helpers.js';

const router = Router();
const manager = new CartManager();

router.get('/', async(req, res) => {
    try {
        const limit = req.query.limit;
        const carts = await manager.getCarts();
        const isValidLimit = validateNumber(limit);
        (isValidLimit) ? 
            res.status(200).json(carts.slice(0,limit))
        :   res.status(200).json(carts);
    } catch (error) {
        res.status(error.status || 500).json({
            status: "error",
            payload: error.message,
        });
    }
});

router.get('/:idCart/products', async (req, res) => {
    try{
        const id = req.params.idCart;
        const cart = await manager.getCartById(parseInt(id));
        if(cart == 'Not Found') {
            res.status(404).json(cart);
        }
        else {
            res.status(200).json(cart);
        }
    } catch (error) {
        res.status(error.status || 500).json({
            status: "error",
            payload: error.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = req.body;
        const cartCreated = await manager.addCart(newCart);
        cartCreated
        ? res.status(201).json({
            status: "success",
            payload: cartCreated,
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

router.put("/:idCart/products/:idProduct", async (req, res) => {
    try {
        const idCart = req.params.idCart;
        const idProduct = req.params.idProduct;
        const cartUpdated = await manager.addProductToCart(
          idCart,
          idProduct
        );
        cartUpdated
          ? res.status(200).json({
              status: "success",
              payload: cartUpdated,
            })
          : res.status(404).json({
              status: "error",
              message: "Sorry, could not add product to cart",
              payload: {},
            });
      } catch (err) {
        res.status(err.status || 500).json({
          status: "error",
          payload: err.message,
        });
      }
    });

router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const cartDeleted = await manager.deleteCart(id);
      if(cartDeleted == "The Cart doesn't exist"){
        res.status(404).json({
            status: "error",
            payload: cartDeleted,
        });
      } else {
        res.status(200).json({
            status: "success",
            payload: cartDeleted,
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
