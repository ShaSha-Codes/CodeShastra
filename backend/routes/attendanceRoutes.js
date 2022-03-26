const express=require('express')
const router=express.Router();
const Attendance=require('../models/Attendance')



router.post("/add/:date", async (req, res) => {
    console.log(req.body.attendance)
    const newAttendance=new Attendance({
        date:req.params.date,
        workers:req.body.attendance
    })
    try{
        const savedAttendance=await newAttendance.save();
        res.send("Attendance saved successfully")
    }
    catch(err){
        res.send("Error occured while saving Attendance")
    }
  });


router.get("/:date",(req,res)=>{
    console.log(req.params.date)
    Attendance.find({date:req.params.date},function(err,docs){
        if(err) throw err
        res.send(docs)
    })
})






module.exports=router;