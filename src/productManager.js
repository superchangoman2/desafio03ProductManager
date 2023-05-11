import * as fs from 'fs';

export class ProductManager{
    
    constructor(){
        this.path = "src/db/products.json";
    }

    async readData(){
        let productsString = []
        try {
            if(this.verifyFileExistance()){
                productsString = await fs.promises.readFile(this.path, "utf-8");
                productsString = JSON.parse(productsString);
            }
            else{
                console.log("Error writting in file.");
            }
        } catch (error) {
            throw new Error(error.message);
        }
        return productsString;
    }

    async getProducts(){
        return await this.readData();
    }

    async getProductById(id) {
        try{
            let allProductsArray = await this.readData();
            const search = allProductsArray.find((product) => product.id == id);
            return !search ? `Not Found` : search;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async writeData(allProductsArray) {
        let allProductsString = JSON.stringify(allProductsArray);
        try {
          await fs.promises.writeFile(this.path, allProductsString);
        } catch (error) {
            throw new Error(error.message);
        }
      }

    async addProduct(newProduct){
        let products = await this.readData();
        let newProperties = {
            id: await this.getNextId(products),
            status: true
        } 

        newProduct = {...newProperties, ...newProduct};
        products.push(newProduct);

        try{
            await this.writeData(products);
            return newProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(id, newProduct) {
        let productsInFile = await this.readData();
        let search = productsInFile.find((item) => item.id == id);
        if(search){
            let index = productsInFile.findIndex((item) => item.id == id);
            try {
                productsInFile[index] = { ...productsInFile[index], ...newProduct };
                await this.writeData(productsInFile);
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Product: ${productsInFile[index].title} was updated. `);
            return newProduct;
        }
        else{
            return `The Product doesn't exist`;
        }
    }

    async deleteProduct(id) {
        let productsInFile = await this.readData();    
        let productToDelete = productsInFile.find((item) => item.id == id);
        if(productToDelete){
            let index = productsInFile.findIndex((item) => item.id == id);
            try {
                productsInFile.splice(index, 1);
                await this.writeData(productsInFile);
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Product: ${productsInFile[index].title} was deleted.`);
            return productToDelete;
        }
        else{
            return `The Product doesn't exist`;
        }
    }

    async getNextId(products) {
        let lastId = 0;
        const allIdsArray = products.map((product) => product.id);
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
