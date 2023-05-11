import { ProductManager } from '../productManager.js';

const manager = new ProductManager();

export const validateRequest = (req, res, next) => {
    const keysBody = Object.keys(req.body);
    const requiredKeys = [
        "title",
        "description",
        "code",
        "price",
        "stock",
        "category",
    ];
    const isValidRequest = requiredKeys.every((key) => keysBody.includes(key));
    console.log(req.body);
    if(!isValidRequest){
        res.status(400).json({
            status: "error",
            payload: "Invalid request body. Missing Fields",
        });
        return;
    }
    next();
}

export const validateCodeNotRepeated = async(req, res, next) => {
    const {code} = req.body;
    const allProducts = await manager.getProducts();
    const product = allProducts.find((product) => product.code == code);
    if(product){
        res.status(400).json({
            status: "error",
            payload: `Invalid request body. Code already exists: ${code}`
        });
        return;
    }
    next();
}

export const validateNumberParams = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      res.status(400).json({
        status: "error",
        payload: "Invalid id: " + id,
      });
      return;
    }
    next();
};