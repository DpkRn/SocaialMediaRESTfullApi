const router=require('express').Router();
const Post=require('../model/Post')
const User=require('../model/User')

//create post
router.post('/',async (req,res)=>{
    try{
        const post= new Post(req.body)
        const savedPost=await post.save()
        console.log("post created",savedPost)
        return res.status(201).json("post created")     
    }catch(err){
        return res.status(408).json(err)
    }
})
//delete a post
router.delete('/:id',async (req,res)=>{
    try{
        const oldPost= await Post.findById(req.params.id)
        if(req.body.userId===oldPost.userId){
            await oldPost.deleteOne({new:true})
            return res.status(201).json("post deleted")
        }else{
            return res.status(403).json("you cant delete of others post")
        }     
    }catch(err){
        return res.status(408).json(err)
    }
})
//update a post
router.put('/:id',async (req,res)=>{
    try{
        const oldPost= await Post.findById(req.params.id)
        if(req.body.userId===oldPost.userId){
            const newPost=await oldPost.updateOne({$set:req.body})
            console.log(newPost)
            return res.status(201).json("post updated")
        }else{
            return res.status(403).json("you cant edit of others post")
        }     
    }catch(err){
       return res.status(408).json(err)
    }
})

//like 
router.put('/:id/like',async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            return res.status(200).json("liked post")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            return res.status(200).json("unliked post")
        }  
    }catch(err){
        return res.status(408).json(err)
    }
})

//timeline all
router.get('/timeline/all',async (req,res)=>{
 try{
    const currUser=await User.findById(req.body.userId)
    let userPosts=await Post.find({userId:currUser._id})
    const friendPosts=await Promise.all(currUser.followings.map((fId)=>Post.find({userId:fId})))
    return res.status(200).json(userPosts.concat(...friendPosts))
 }catch(err){
    return res.status(408).json(err)
 }
})

module.exports=router