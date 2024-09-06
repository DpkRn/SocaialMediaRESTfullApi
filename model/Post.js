const mongoose=require('mongoose');
const postSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        maxLength:50
    },
    image:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    }
},{timestamps:true})
const Post=mongoose.model('post',postSchema)
module.exports=Post