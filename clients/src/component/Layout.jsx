import React from "react";
import Header from "./Header";
import Routers from "../router/Routers";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        <Routers />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
