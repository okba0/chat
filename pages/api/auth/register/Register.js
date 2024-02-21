import User from "@/models/User";
import { connectToDB } from "@/mongodb";
import { hash } from "bcryptjs";


export default async function addtest(req, res) {
    const { method } = req;
    await connectToDB()
    switch (method) {
        case 'GET':
            try {
                const data = await User.find({});
                res.status(200).json({ success: true, data: data });
            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ success: false, error: "Server Error" });
            }
            break;
        case 'POST':
            try {
                const { username, email, password } = req.body;
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ success: false, error: "User already exists" });
                }
    
                const hashedPassword = await hash(password, 10);
                const newUser = await User.create({
                    username,
                    email,
                    password: hashedPassword,
                });
    
                return res.status(200).json({ success: true, data: newUser });
            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ success: false, error: "Server Error" });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}