//import { pusherServer } from "@lib/pusher";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";
import { pusherServer } from "@/lib/pusher";

export default async function chatcreate(req, res) {
  const { method } = req;
  await connectToDB();
  switch (method) {
    case 'POST':
      try {
        const { currentUserId, members, isGroup, name } = req.body;

        // Define "query" to find the chat
        const query = isGroup
          ? { isGroup, name, members: [currentUserId, ...members] }
          : { members: { $all: [currentUserId, ...members], $size: 2 } };

        let chat = await Chat.findOne(query);
          if (!chat) {
          chat = await new Chat(
            isGroup ? query : { members: [currentUserId, ...members] }
          );

          await chat.save();

          // Update chats for all members
          const updateAllMembers = chat.members.map(async (memberId) => {
            await User.findByIdAndUpdate(
              memberId,
              {
                $addToSet: { chats: chat._id },
              },
              { new: true }
            );
          });
          await Promise.all(updateAllMembers);

          /* Trigger a Pusher event for each member to notify a new chat */
          chat.members.map(async (member) => {
            await pusherServer.trigger(member._id.toString(), "new-chat", chat)
          })
          
        }

        // Send JSON response with status 200
        res.status(200).json(chat);
      } catch (err) {
        console.error(err);
        // Send JSON response with status 500 if an error occurs
        res.status(500).json({ error: "Failed to create a new chat", query: err.query || null });
            }
      break;
    default:
      // Send JSON response with status 400 if method is not supported
      res.status(400).json({ success: false });
      break;
  }
};
