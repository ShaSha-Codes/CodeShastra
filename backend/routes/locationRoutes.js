const express=require('express')
const router=express.Router();
const Location=require('../models/location')



router.post("/add", async (req, res) => {
    const newLocation=new Location({
        img:req.body.img,
        long:req.body.long,
        lati:req.body.lati
    })
    try{
        const savedLocation=await newLocation.save();
        res.send("Location saved successfully")
    }
    catch(err){
        res.send("Error occured while saving Location")
    }
  });


router.get("/",(req,res)=>{
    Location.find({},function(err,docs){
        if(err) throw err
        res.send(docs)
    })
})


module.exports=router;