import Chat from "@/models/Chat";
import User from "@/models/User";
import Message from "@/models/Message";
import { connectToDB } from "@/mongodb";


export default async function chatcreate(req, res) {
  const { method, query: { id } } = req;
  
  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  await connectToDB();
  
  switch (method) {
    case 'GET':
      try {
        const chatId = id;
    
        const chat = await Chat.findById(chatId)
          .populate({
            path: "members",
            model: User,
          })
          .populate({
            path: "messages",
            model: Message,
            populate: {
              path: "sender seenBy",
              model: User,
            },
          })
          .exec();

        // Check if chat with provided id exists
        if (!chat) {
          return res.status(404).json({ error: "Chat not found" });
        }

        // Send chat as JSON response
        res.status(200).json(chat);
      } catch (err) {
        console.error(err);
        // Send JSON response with status 500 and error details
        res.status(500).json({ error: "Failed to get chat", query: err.query || null });
      }
      break;
      case 'POST':
        try {

          const chatId = id;
      
          const { currentUserId } = req.body;
      
          await Message.updateMany(
            { chat: chatId },
            { $addToSet: { seenBy: currentUserId } },
            { new: true }
          )
            .populate({
              path: "sender seenBy",
              model: User,
            })
            .exec();
      
          return  res.status(200).json("Seen all messages by current user");
        } catch (err) {
          console.log(err);
          return  res.status(500).json({ error: "Failed to update seen messages" });
        }


        break;
    default:
      // Send JSON response with status 400 if method is not supported
      res.status(400).json({ success: false });
      break;
  }
}
