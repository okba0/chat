import User from "@/models/User";

import { connectToDB } from "@/mongodb";
export default async function handler(req, res) {
    const{
      method,
      query:{id}
      }=req;
      await connectToDB();

  switch(method)
  {
      case'GET':
      try{
          const data=await User.findById(id);
          if(!User)
          {
             return res.status(400).json({success:false});
          }
          res.status(200).json({success:true,data:data});
      }catch(error){
          res.status(400).json({success:false});
      }
      break;
      case 'PUT':
  try {
    const body = await req.body;
    const { username, profileimage } = body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        profileimage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

     res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Failed to update user" });
  }
  break;

      case'DELETE':
      try{
          const deleteUser=await User.deleteOne({_id:id});
          if(!deleteUser)
          {
             return res.status(400).json({success:false});
          }
          res.status(200).json({success:true,data:{}});
      }catch(error){
          res.status(400).json({success:false});
      }
      break;
      default:
          res.status(400).json({success:false});
      break;
  }
  
};
