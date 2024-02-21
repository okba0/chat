import TopBar from "@/Components/TopBar";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from "@/Components/Provider";
import BottomBar from "@/Components/BottomBar";
export default function App({ Component, pageProps }) {
  return (
    <div className="bg-blue-2">
      <Provider >
        <TopBar/>
        <Component {...pageProps} />
        <BottomBar/>
      </Provider>
    </div>
  );
}
