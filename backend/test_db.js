require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./models/Order");

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    const orders = await Order.find().sort({createdAt: -1}).limit(5);
    console.log("Recent Orders:");
    orders.forEach(o => {
        console.log(`ID: ${o._id}, paymentScreenshot: ${o.paymentScreenshot}`);
    });
    process.exit();
}).catch(console.error);
