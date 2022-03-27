const mongoose=require("mongoose");

const location=new mongoose.Schema({
    img:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    long:{
        type:String,
        require:true
    },
    lati:{
        type:String,
        require:true    
    }

})

module.exports=mongoose.model("Location",location)

