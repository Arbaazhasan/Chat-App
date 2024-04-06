import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';


import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from './db/connectToMongdoDB.js';


const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// to parse the imcoming requests with JSON payloads (form req.body)
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);


// app.get('/', (req, res) => {
//     res.send("Working ");
// });


app.listen(PORT, (req, res) => {
    connectToMongoDB();
    console.log(`server running on port no. : ${PORT}`);
});