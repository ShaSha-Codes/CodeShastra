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


router.patch("/edit", (req, res, next) => {
    Worker.updateOne({fname:req.body.fname, lname:req.body.lname},{
        fname:req.body.fname1,
        lname:req.body.lname1,
        gender:req.body.gender,
        age:req.body.age,
        address:req.body.address
    },function(err){
        if(err) res.send("Something went wrong")
        else res.send("Worker Successfully Edited")
    })
});

router.get("/",(req,res)=>{
    Worker.find({},function(err,docs){
        if(err) throw err
        res.send(docs)
    })
})






module.exports=router;