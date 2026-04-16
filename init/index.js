const mongoose=require('mongoose');
const initData=require("./data");
const Listing = require('../models/listing');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderluste";

main().then(()=>{
    console.log("connected to DB");
}).catch(error=>{
    console.log(error);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"69da3863cbd924d02934379e"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();