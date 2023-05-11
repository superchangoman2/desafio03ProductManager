import * as fs from 'fs';
import { ProductManager } from './productManager.js';

const productManager = new ProductManager();

export class CartManager{
    
    constructor(){
        this.path = "src/db/carts.json";
    }

    async readData(){
        let cartsString = [];
        try {
            if(this.verifyFileExistance()){
                cartsString = await fs.promises.readFile(this.path, "utf-8");
                if(cartsString.length > 0)
                    cartsString = JSON.parse(cartsString);
            }
            else{
                console.log("Error writting in file.");
            }
        } catch (error) {
            throw new Error(error.message);
        }
        return cartsString;
    }

    async getCarts(){
        return await this.readData();
    }

    async getCartById(id) {
        try{
            let allCartsArray = await this.readData();
            const search = allCartsArray.find((cart) => cart.id == id);
            return !search ? `Not Found` : search;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findProductInCart(cartToUpdate, idProduct) {
        return cartToUpdate.products.find((product) => product.id == idProduct);
      }

    async writeData(allCartsArray) {
        let allCartsString = JSON.stringify(allCartsArray);
        try {
          await fs.promises.writeFile(this.path, allCartsString);
        } catch (error) {
            throw new Error(error.message);
        }
      }

    async addCart(){
        let carts = await this.readData();
        const nextId = await this.getNextId(carts);
        const newCart = {
          id: nextId,
          products: [],
        };

        carts.push(newCart);
        try{
            await this.writeData(carts);
            return newCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //woow
    async addProductToCart(idCart, idProduct) {
        const allCartsArray = await this.readData();
        /**Busco el carrito a actualizar */
        const cartToUpdate = allCartsArray.find((cart) => cart.id == idCart);
        console.log("cartToUpdate", cartToUpdate);
        if (!cartToUpdate) {
          return {
            status: "error",
            message: "Sorry, no cart found by id: " + idCart,
            payload: {},
          };
        }
        /**Busco el producto a agregar. Tiene que existir en mi lista de products.json */
        const allProductsArray = await productManager.readData();
        const productToAdd = allProductsArray.find(
          (product) => product.id == idProduct
        );
        console.log("productToAdd", productToAdd);
        if (!productToAdd) {
          return {
            status: "error",
            message: "Sorry, no product found by id: " + idProduct,
            payload: {},
          };
        }
        /**Agrego el producto al carrito */
        /**verifico si el producto ya existe en el carrito */
        const productAlreadyInCart = await this.findProductInCart(
          cartToUpdate,
          idProduct
        );
        console.log("productAlreadyInCart", productAlreadyInCart);
    
        if (productAlreadyInCart) {
          const index = cartToUpdate.products.indexOf(productAlreadyInCart);
          /**Altualizo el producto en el carrito */
          const productData = {
            id: productAlreadyInCart.id,
            quantity: productAlreadyInCart.quantity + 1,
          };
          cartToUpdate.products[index] = productData;
          /**Actualizo el carrito en el array de carritos*/
          const indexCart = allCartsArray.indexOf(cartToUpdate);
          allCartsArray[indexCart] = cartToUpdate;
          await this.writeData(allCartsArray);
          return cartToUpdate;
        }
        /**si el producto no existe lo agrego */
        const productData = {
          id: productToAdd.id,
          quantity: 1,
        };
        cartToUpdate.products.push(productData);
        /**Actualizo el archivo carts.json */
        const index = allCartsArray.indexOf(cartToUpdate);
        allCartsArray[index] = cartToUpdate;
        await this.writeData(allCartsArray);
        return cartToUpdate;
    }

    async updateCart(id, newCart) {
        let cartsInFile = await this.readData();
        let search = cartsInFile.find((item) => item.id == id);
        if(search){
            let index = cartsInFile.findIndex((item) => item.id == id);
            try {
                cartsInFile[index] = { ...cartsInFile[index], ...newCart };
                await this.writeData(cartsInFile);
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Cart: ${cartsInFile[index].title} was updated. `);
            return newCart;
        }
        else{
            return `The Cart doesn't exist`;
        }
    }

    async deleteCart(id) {
        let cartsInFile = await this.readData();    
        let cartToDelete = cartsInFile.find((item) => item.id == id);
        if(cartToDelete){
            let index = cartsInFile.findIndex((item) => item.id == id);
            try {
                cartsInFile.splice(index, 1);
                await this.writeData(cartsInFile);
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Cart: ${cartsInFile[index].title} was deleted.`);
            return cartToDelete;
        }
        else{
            return `The Cart doesn't exist`;
        }
    }

    async getNextId(carts) {
        let lastId = 0;
        const allIdsArray = carts.map((cart) => cart.id);
        // 🤯 Filtrado de id no numericos 
        allIdsArray.filter((id) => typeof id === "number");
        if (allIdsArray.length > 0) {
          lastId = Math.max(...allIdsArray);
        }
        return lastId + 1;
    }

    async verifyFileExistance(){
        if(!fs.existsSync(this.path)){
            try {
                await fs.promises.writeFile(path, (err) => {
                    if (err) {
                        console.log("Error:"+ err);
                        return false;
                    } else
                        console.log("File created succesfully.");
                });
            } catch (error) {
                throw new Error(error.message);
            }
        }
        else
            console.log("File exist.");
        return true;
    }

}
