import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";
import { getSession } from "next-auth/react";
import Message from "@/models/Message";



export default async function Getid(req, res) {
  const{
      method,
      query:{id}
      }=req;
      await connectToDB()
  switch(method)
  {
      case'GET':
      try {
        const session = await getSession({ req });
        const userId = session?.user?.id;        
        const  query  = id;
    
        const searchedChat = await Chat.find({
          members: userId,
          name: { $regex: query, $options: "i" },
        })
          .populate({
            path: "members",
            model: User,
          }).populate({
            path: "messages",
            model: Message,
            populate: {
              path: "sender seenBy",
              model: User,
            },
          })
          .exec();
    
          return res.status(200).json(searchedChat);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to search chat" });
            }
      break;
      default:
          res.status(400).json({success:false});
      break;
  }
}