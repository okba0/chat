import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export default async function Getid(req, res) {
  const{
      method,
      query:{id}
      }=req;
      await connectToDB()
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
      case'PUT':
      try{
          const data=await User.findByIdAndUpdate(id,req.body,
              {
                  new:true,
                  runValidators:true
              });
          if(!User)
          {
             return res.status(400).json({success:false});
          }
          res.status(200).json({success:true,data:data});
      }catch(error){
          res.status(400).json({success:false,error});
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
}