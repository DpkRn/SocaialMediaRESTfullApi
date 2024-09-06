const express=require('express')
const mongoose =require('mongoose')
const dotenv=require('dotenv')
const helmet=require('helmet')
const morgan=require('morgan')
const userRoute=require('./routers/users')
const userAuth=require('./routers/auth')
const postRoute=require('./routers/posts')



const app=new express()
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("connection done")).catch((err)=>console.log("errrr",err))

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use('/api/users',userRoute)
app.use('/api/auth',userAuth)
app.use('/api/posts',postRoute)





app.listen(8800,()=>{
    console.log('listening to port: 8800')
})