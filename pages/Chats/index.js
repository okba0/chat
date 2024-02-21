import ChatList from "@/Components/ChatList";
import Contacts from "@/Components/Contacts";
import Provider from "@/Components/Provider";
import TopBar from "@/Components/TopBar";
import { useSession } from "next-auth/react";
export default function Chats() {

  return (
    <>
      <div className="main-container">
        <div className="w-1/3 max-lg:w-1/2 max-md:w-full"><ChatList/></div>
        <div className="w-2/3 max-lg:w-1/2 max-md:hidden"><Contacts/> </div>
      </div>
    </>
  );
}
