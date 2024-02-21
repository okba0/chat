import { pusherServer} from "@/lib/pusher"
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export default async function messagecreate(req, res) {
  const { method } = req;
  await connectToDB();
  switch (method) {
    case "POST":
      try {
        const { chatidtemp, currentUserId, text, photo } =await req.body;
        const currentUser = await User.findById(currentUserId);
        const newMessage = await Message.create({
          chat: chatidtemp,
          sender: currentUser,
          text,
          photo,
          seenBy: currentUserId,
        });
        const updatedChat = await Chat.findByIdAndUpdate(
          chatidtemp,
          {
            $push: { messages: newMessage._id },
            $set: { lastMessageAt: newMessage.createdAt },
          },
          { new: true }
        )
          .populate({
            path: "messages",
            model: Message,
            populate: { path: "sender seenBy", model: "User" },
          })
          .populate({
            path: "members",
            model: "User",
          })
          .exec();

        /* Trigger a Pusher event for a specific chat about the new message */
                await pusherServer.trigger(chatidtemp, "new-message", newMessage)
          
        /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
                const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
                updatedChat.members.forEach(async (member) => {
                  try {
                    await pusherServer.trigger(member._id.toString(), "update-chat", {
                      id: chatidtemp,
                      messages: [lastMessage]
                    });
                  } catch (err) {
                    console.error(`Failed to trigger update-chat event`);
                  }
                });
           
        return res.status(200).json(newMessage);
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({
            error: "Failed to create a new message",
            query: err.query || null,
          });
      }
      break;
    default:
      // Send JSON response with status 400 if method is not supported
      res.status(400).json({ success: false });
      break;
  }
}

export const POST = async (req) => {};
