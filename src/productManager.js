import * as fs from 'fs';

export class ProductManager{
    
    constructor(){
        this.path = "src/products.json";
        this.id = 1;
        this.products = "[]";
    }

    async readData(){
        try {
            if(this.verifyFileExistance(this.products)){
                const productsString = await fs.promises.readFile(this.path, "utf-8");
                console.log(productsString);
                const products = JSON.parse(productsString);
                this.id = products.length + 1;
                this.products = products;
                return productsString;
            }
            else{
                console.log("Error writting in file.");
                return [];
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        if(!(title && description && price && thumbnail && code && stock))
            return `The product doesn't have all the properties`;

        if(await this.validateCode(code))
        {  
            const id = this.id;
            this.id++;
            const product = {id, title, description, price, thumbnail, code, stock};
            this.products.push(product);
            const productsString = JSON.stringify(this.products);
            try{
                await fs.promises.writeFile(this.path, productsString);
                return 'Product Added';
            } catch (error) {
                throw new Error(error.message);
            }
        }
        else{
            return 'Code found, try another one';
        }
    }

    async validateCode(code){
        let verifyCode = await this.products.find((item) => item.code === code);
        console.log(`Validating product code: ${code}`);
        return !verifyCode;
    }

    async verifyFileExistance(content){
        if(!fs.existsSync(this.path)){
            try {
                await fs.promises.writeFile(path,content, (err) => {
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

    getProducts(){
        return this.products;
    }

    async getProductById(id){
        console.log(`Searching product id: ${id}`)
        try {
            let data = await fs.promises.readFile(this.path, 'utf8');
            let productsInFile = JSON.parse(data);
            let search = productsInFile.find((item) => item.id === id);
            return !search ? `Not Found` : search;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(id, newProduct) {
        let productsInFile = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));
        let index = productsInFile.findIndex((item) => item.id === id);;
        let search = productsInFile.find((item) => item.id === id);
        if(search){
            try {
                productsInFile[index] = { ...productsInFile[index], ...newProduct };
                await fs.promises.writeFile(this.path, JSON.stringify(productsInFile));
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Product: ${productsInFile[index].title} was updated. `);
        }
        else{
            console.log(`The Product doesn't exist`);
        }
    }

    async deleteProduct(id) {
        const emptyProducto = {id: id, title:'', description:'', price:'', thumbnail:'', code:'', stock:''};
        let productsInFile = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));
        let index = productsInFile.findIndex((item) => item.id === id);;
        let search = productsInFile.find((item) => item.id === id);
        if(search){
            try {
                productsInFile[index] = { ...productsInFile[index], ...emptyProducto };
                await fs.promises.writeFile(this.path, JSON.stringify(productsInFile));
            } catch (error) {
                throw new Error(error.message);
            }
            console.log(`The Product: ${productsInFile[index].title} was deleted.`);
        }
        else{
            console.log(`The Product doesn't exist`);
        }
    }

}

// const product = new ProductManager();
// const idToDelete = 12;

// const asyncFn = async () => {
//     await product.readData();
//     try{
//         await product.deleteProduct(idToDelete);
//     } catch (error){
//         throw new Error(error.message);
//     }
//     console.log(product.getProducts());
// }

// asyncFn();
