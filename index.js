import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoute from './router/userRoute.js';
import boxRoute from './router/boxRoute.js'
const app = express();
const PORT = process.env.PORT||5002; 
import cors from 'cors';

app.use(cors());
app.use(express.json());

app.use("/api/user",userRoute)
app.use("/api/box",boxRoute)



connectDB()

// Starting the server
app.listen(PORT, () => {
    console.log(`App Running Successfully on PORT ${PORT}`);
});