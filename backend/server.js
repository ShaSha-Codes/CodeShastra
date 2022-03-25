const mongoose=require('mongoose')
const express=require('express')
const cors=require('cors')
const passport=require("passport")
const passportLocal=require("passport-local").Strategy
const cookieParser=require("cookie-parser")
const session =require("express-session")
const bodyParser=require("body-parser")
const userRoutes=require('./routes/userRoutes')
const contractorRoutes=require('./routes/contractorRoutes')

const app=express();

mongoose.connect("mongodb+srv://root:root@cluster0.zygth.mongodb.net/CodeShastra?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log("Connected to MongoDB")
})



//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(session({
    secret:"Big Secret",
    resave:true,
    saveUninitialized:true
}))


app.use(cookieParser("Big Secret"))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)




app.use('/user',userRoutes)
app.use('/contractor',contractorRoutes)







app.listen(4000,()=>{
    console.log("Server has Started")
})

