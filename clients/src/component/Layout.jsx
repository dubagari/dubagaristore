import React from "react";
import Header from "./Header";
import Routers from "../router/Routers";
import Footer from "./Footer";
import CustomerLiveChat from "../components/chat/CustomerLiveChat";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <main className="flex-grow">
        <Routers />
      </main>
      <CustomerLiveChat />
      <Footer />
    </div>
  );
};

export default Layout;
