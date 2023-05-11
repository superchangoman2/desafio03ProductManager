import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8080 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

try{
    app.listen(PORT, () =>
    console.log(`Server is online on PORT ${PORT} at ${new Date().toLocaleString()}`));

} catch (error) {
    console.log(`Error starting server ${error}`);
}
