import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Clock = () => {
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [munite, setMunite] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    // Set destination to 7 days in the future dynamically
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    const destination = targetDate.getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setDay(d);
        setHour(h);
        setMunite(m);
        setSecond(s);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center lg:items-start text-white p-6 sm:p-10 space-y-6">
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider uppercase text-purple-400">
        Limited Time Offer
      </h1>

      {/* Countdown Digits */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono select-none">
        <div className="flex flex-col items-center">
          <div className="bg-slate-800 text-white rounded-2xl w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-3xl font-black shadow-inner border border-slate-700">
            {day}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1.5">days</span>
        </div>
        <span className="text-2xl sm:text-4xl font-black text-purple-500 pb-5">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-slate-800 text-white rounded-2xl w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-3xl font-black shadow-inner border border-slate-700">
            {hour}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1.5">hours</span>
        </div>
        <span className="text-2xl sm:text-4xl font-black text-purple-500 pb-5">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-slate-800 text-white rounded-2xl w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-3xl font-black shadow-inner border border-slate-700">
            {munite}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1.5">min</span>
        </div>
        <span className="text-2xl sm:text-4xl font-black text-purple-500 pb-5">:</span>

        <div className="flex flex-col items-center">
          <div className="bg-slate-800 text-white rounded-2xl w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-3xl font-black shadow-inner border border-slate-700">
            {second}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1.5">sec</span>
        </div>
      </div>

      <h2 className="text-sm sm:text-base font-semibold text-slate-350 italic max-w-sm text-center lg:text-left">
        Grab your favorite HP computing gadgets and Apple watches at a massive discount this week only!
      </h2>

      <div>
        <Link to="/shop">
          <button className="px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-purple-655/30 transition-all duration-300 hover:-translate-y-0.5">
            Buy Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Clock;
