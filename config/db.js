const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        process.env.MONGO_URI,
        async(err)=>{
            if(err) throw err;
            console.log("conncted to db")
        }
    );
};

module.exports = connectDB;