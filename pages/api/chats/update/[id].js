import Chat from "@/models/Chat";
import { connectToDB } from "@/mongodb";


export default async function chatcreate(req, res) {
  const {
    method,
    query: { id },
  } = req;

  // Check if id is provided
  if (!id) {
    return res.status(400).json({ error: "Missing id parameter" });
  }

  await connectToDB();

  switch (method) {
    case "POST":
      try {
        const chatId = id;

        const { name, groupPhoto } = req.body;

        const updatedGroupChat = await Chat.findByIdAndUpdate(
          chatId,
          { name, groupPhoto },
          { new: true }
        );

        return res.status(200).json(updatedGroupChat);
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to update group chat info" });
      }
      break;
    default:
      // Send JSON response with status 400 if method is not supported
      res.status(400).json({ success: false });
      break;
  }
}
