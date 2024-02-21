import User from "@/models/User";
import { connectToDB } from "@/mongodb";


export default async function GetUsers(req, res) {
  const{method}=req;
  await connectToDB()
  switch(method)
  {
      case'GET':
      try{
          const data=await User.find({});
          res.status(200).json({success:true,data:data});
      }catch(error){
          res.status(400).json({success:false});
      }
      break;
      case'POST':
      try{
          const data=await User.create(req.body);
          res.status(201).json({success:true,data:data});
      }catch(error){
          res.status(400).json({success:false});
      }
      break;
      default:
          res.status(400).json({success:false});
      break;
  }
}
