const express = require("express");
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator =require('express-validator');
require('dotenv').config();

//import Routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const categoryRoutes = require('./routes/category');
// const productRoutes = require('./routes/product');
const imageRoutes = require('./routes/image');
const sellerRequestRoutes = require('./routes/sellerRequest');
const agentRequestRoutes = require('./routes/agentRequest');
const adminAuthRoutes = require("./routes/admin");
const sellerAuthRoutes = require("./routes/seller");
const agentAuthRoutes = require("./routes/agent");
// const orderRoutes = require('./routes/order');


//app
const app = express();

//db

mongoose.connect(process.env.NODE_MONGODB_DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log('DATABASE connected'))
.catch((err)=> console.log("Error Connecting DATABASE",err));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
// app.use("/api",authRoutes);
// app.use("/api",userRoutes);
// app.use("/api",categoryRoutes);
// app.use("/api",productRoutes);
app.use("/api",imageRoutes);
app.use("/api",sellerRequestRoutes);
app.use("/api",agentRequestRoutes);
app.use("/api",adminAuthRoutes);
app.use("/api",sellerAuthRoutes);
app.use("/api",agentAuthRoutes);

const port = process.env.PORT|| 8000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});