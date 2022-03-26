const mongoose=require("mongoose");

const attendance=new mongoose.Schema({
    date:{
        type:String,
        require:true
    },
    workers:[{
        name:String,
        attendance:Boolean
    }]

})

module.exports=mongoose.model("Attendance",attendance)

