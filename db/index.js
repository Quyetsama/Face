const mongoose  = require("mongoose");


async function connect(){

    try{
        await mongoose.connect('mongodb+srv://quyetsama:HaPAYHhvuT9BGGWh@filmnodejs.ump4j.mongodb.net/film?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
        });
        console.log("Connect successfully!!!");
    } catch(error){
        console.log("Connect failure!!!");
    }

}

module.exports = {connect};