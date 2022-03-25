const express=require('express')
const router=express.Router();
const Contractor=require('../models/contractor')
const bcrypt=require("bcryptjs")
const passport=require("passport")




router.post("/login", (req, res, next) => {
    console.log(req.body)
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, err => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
  });

router.post('/register',(req,res)=>{
    Contractor.findOne({
        email:req.body.email
    },async(err,doc)=>{
        if(err) throw err;
        if(doc) {
            res.send("User already exists")
        }
        if(!doc){
            const hashedPassword=await bcrypt.hash(req.body.password,10)
            const newContractor=new Contractor({
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                password:hashedPassword
            })
            try{
                const savedContractor=await newContractor.save();
                res.send("Contractor registered successfully")
            }
            catch(err){
                res.send("Error occured while registering contractor")
            }
        }

    })
});


module.exports=router;