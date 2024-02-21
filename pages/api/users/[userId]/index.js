import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export default async function GetUserschat(req, res) {
  const { method, query: { id } } = req;
  await connectToDB();

  switch (method) {
    case 'GET':
      try {
        const userId = id; 
        
        const allChats = await Chat.find({ members: userId })
          .sort({ lastMessageAt: -1 })
          .populate({
            path: "members",
            model: User,
          })
          .exec();

        return res.status(200).json(allChats);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to get all chats of current user" });
      }
    default:
      return res.status(400).json({ success: false });
  }
};
