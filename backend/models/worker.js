const mongoose=require("mongoose");

const worker=new mongoose.Schema({
    image:{
        type:String,
        require:true
    },
    fname:{
        type:String,
        require:true
    },
    lname:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    age:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    aadhar:{
        type:String,
        require:true
    }

})

module.exports=mongoose.model("Worker",worker)

