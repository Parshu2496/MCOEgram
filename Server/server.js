require("dotenv").config();
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const app = express()
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json())
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => res.send('MOCEgram API Running'));

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))