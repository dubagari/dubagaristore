import { useEffect, useMemo, useState, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
});

const CustomerLiveChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const room = "support-room";

  const currentUser = useMemo(() => {
    if (user && user._id) {
      return { id: user._id, name: user.name || "Customer" };
    }
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser && savedUser._id) {
      return { id: savedUser._id, name: savedUser.name || "Customer" };
    }
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `customer-${Date.now()}`;
      localStorage.setItem("guestId", guestId);
    }
    return { id: guestId, name: "Customer" };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/messages/history/${room}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setMessages(data?.data || []);
      } catch (error) {
        console.error("Could not load chat history", error);
      }
    };

    loadHistory();

    const onConnect = () => {
      setConnected(true);
      socket.emit("join_room", { room });
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("send_message", {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: "customer",
      text: input.trim(),
      room,
    });

    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        {open ? "Close Chat" : "Live Chat"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[92vw] max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-3 dark:border-slate-800">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Support Chat</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {connected ? "Online now" : "Connecting..."}
            </div>
          </div>

          <div className="h-64 space-y-2 overflow-y-auto bg-slate-50 p-3 dark:bg-slate-950 flex flex-col">
            {messages.map((message, index) => {
              const isCustomer =
                message.senderType === "customer" ||
                message.senderId?.startsWith("customer") ||
                (message.senderName !== "Admin" && !message.senderId?.startsWith("admin"));

              return (
                <div
                  key={message._id || index}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    isCustomer
                      ? "self-end bg-purple-600 text-white rounded-br-none"
                      : "self-start bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 rounded-bl-none"
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold mb-1 ${
                      isCustomer
                        ? "text-purple-200 text-right"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {message.senderName || (isCustomer ? "Customer" : "Support")}
                  </div>
                  <div className="break-words">{message.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask us anything..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CustomerLiveChat;
