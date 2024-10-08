const express=require('express')
const mongoose =require('mongoose')
const dotenv=require('dotenv')
const helmet=require('helmet')
const morgan=require('morgan')
const userRoute=require('./routers/users')
const userAuth=require('./routers/auth')
const postRoute=require('./routers/posts')
const port=process.env.PORT || 8800



const app=new express()
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("connection done")).catch((err)=>console.log("errrr",err))

//middleware

app.get('/',(req,res)=>{
    return res.json("working fine")
})
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you need credentials like cookies
    next();
  });
app.use(helmet())
app.use(morgan('common'))
app.use('/api/users',userRoute)
app.use('/api/auth',userAuth)
app.use('/api/posts',postRoute)





app.listen(port,()=>{
    console.log('listening to port: 8800')
})