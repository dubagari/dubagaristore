import React from "react";

const Shopcommon = ({ title }) => {
  return (
    <section className="relative w-full py-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400 via-indigo-900 to-slate-900 pointer-events-none"></div>

      <div className="relative z-10 text-center space-y-2 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white uppercase bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="h-1 w-12 bg-purple-600 mx-auto rounded-full"></div>
      </div>
    </section>
  );
};

export default Shopcommon;
