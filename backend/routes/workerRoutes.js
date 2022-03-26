const express=require('express')
const router=express.Router();
const Worker=require('../models/worker')
const bcrypt=require("bcryptjs")
const passport=require("passport")


router.post("/add", async (req, res) => {
    console.log(req.body)
    const newWorker=new Worker({
        fname:req.body.fname,
        lname:req.body.lname,
        gender:req.body.gender,
        age:req.body.age,
        address:req.body.address,
        aadhar:req.body.aadhar,
        image:req.body.image
        
    })
    try{
        const savedWorker=await newWorker.save();
        res.send("Worker registered successfully")
    }
    catch(err){
        res.send("Error occured while registering Worker")
    }
  });

router.delete("/delete/:fname", (req, res) => {
    Worker.deleteOne({ fname:req.params.fname}, function (err) {
        if (err) res.send("Something went wrong")
        else res.send("Worker Successfully Removed")
      });
});

router.get("/get/:fname",async (req,res)=>{
    Worker.findOne({"fname":req.params.fname}).then((worker)=>{
        res.send(worker)
    }).catch((err)=>{
        res.send("Something went Wrong")
    })
})


router.patch("/edit/:fname", (req, res) => {
    console.log(req.body)
    console.log(req.params.fname)
    Worker.updateOne({fname:req.params.fname},{
        fname:req.body.fname,
        lname:req.body.lname,
        gender:req.body.gender,
        age:req.body.age,
        address:req.body.address,
        aadhar:req.body.aadhar,
        image:req.body.image
    },function(err){
        if(err) res.send("Something went wrong")
        else res.send("Worker Successfully Edited")
    })
});

router.get("/",(req,res)=>{
    Worker.find({date:req.params.date},function(err,docs){
        if(err) throw err
        res.send(docs)
    })
})






module.exports=router;