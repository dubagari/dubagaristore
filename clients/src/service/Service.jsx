import React from "react";
import serviceData from "../assets/data/serviceData";

const Service = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full py-8">
      {serviceData.map((item, index) => (
        <div
          className="flex items-start gap-4 p-6 rounded-2xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          key={index}
          style={{ backgroundColor: item.bg }}
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 text-2xl text-white">
            <i className={item.icon}></i>
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold tracking-wide uppercase">{item.title}</h2>
            <h3 className="text-xs font-semibold text-white/80">{item.subtitle}</h3>
            <p className="text-[11px] text-white/60 font-medium leading-relaxed">{item.pragra}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Service;
