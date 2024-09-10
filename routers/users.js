const router=require('express').Router()
const User=require('../model/User')
const bcrypt=require('bcrypt')

//get all users

//update profile
router.put('/:id',async (req,res)=>{
if(req.body.userId===req.params.id||req.body.isAdmin){
 if(req.body.password){
    try{
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt);
    }catch(err){
        return res.status(400).json(err)
    }
 }
 try{
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
    return res.status(200).json(user);
    console.log("updated")
 }catch(err){
    return res.status(404).json(err);
 }

}else{
    return res.status(400).json("you can update only your profile !");
}
})
//delete user
router.delete('/:id',async (req,res)=>{
if(req.body.userId===req.params.id||req.body.isAdmin){
 try{
    const user=await User.findByIdAndDelete(req.params.id,req.body)
    return res.status(200).json("user deleted");
 }catch(err){
    return res.status(404).json(err);
 }

}else{
    return res.status(400).json("you can delete only your profile !");
}
})

//get user profile
router.get('/:id',async (req,res)=>{
    
    try{
        const user=await User.findById(req.params.id)
        // console.log(user)
        // console.log(user._doc)
        console.log(user) //it will only show user._doc data because browser hides the meta data about document even as user have contained all things
        const {password,createdAt,updatedAt,...other}=user._doc; //user.toObject will also work it excludes the methods or meta data of document
        console.log(other)
        return res.status(200).json(other);
    }catch(err){
        return res.status(404).json(err);
    }    
})

//follow the user 
router.put('/:id/follow',async (req,res)=>{

    if(req.body.userId!==req.params.id){
        try{
            const currUser=await User.findById(req.body.userId);
            const user=await User.findById(req.params.id);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currUser.updateOne({$push:{followings:req.params.id}})
                return res.status(200).json(`${user.username} has been followed`);
            }else{
                return res.status(400).json("you are already following user.")
            }

        }catch(err){
            return res.status(400).json(err)
        }
    }else{
        return res.status(403).json("you cant follow your self");
    }
})
//Unfollow the user 
router.put('/:id/unfollow',async (req,res)=>{

    if(req.body.userId!==req.params.id){
        try{
            const currUser=await User.findById(req.body.userId);
            const user=await User.findById(req.params.id);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currUser.updateOne({$pull:{followings:req.params.id}})
                return res.status(200).json(`${user.username} has been unfollowed`);
            }else{
                return res.status(400).json("you are not following already.")
            }

        }catch(err){
            return res.status(400).json(err)
        }
    }else{
        return res.status(403).json("you cant Unfollow your self");
    }
})
module.exports=router