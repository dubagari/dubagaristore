import { useEffect, useMemo, useState, useRef } from "react";
import { MessageCircle, Send, LoaderCircle } from "lucide-react";
import { io } from "socket.io-client";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(API_URL, {
  transports: ["websocket"],
  reconnection: true,
});

const LiveChatPanel = ({ userName = "Admin", room = "support-room" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const currentUserId = useMemo(() => `admin-${Date.now()}`, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/messages/history/${room}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setMessages(data?.data || []);
      } catch (error) {
        console.error("Failed to load chat history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

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
  }, [room]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit("send_message", {
      senderId: currentUserId,
      senderName: userName || "Admin",
      senderType: "admin",
      text: input.trim(),
      room,
    });

    setInput("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Support Chat</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {connected ? "Connected" : "Connecting..."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
          <MessageCircle className="h-3.5 w-3.5" />
          Live
        </div>
      </div>

      <div className="mb-4 h-72 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 flex flex-col space-y-2">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Start the conversation.</p>
        ) : (
          messages.map((message, index) => {
            const isAdmin =
              message.senderType === "admin" ||
              message.senderId?.startsWith("admin") ||
              message.senderName === userName ||
              message.senderName === "Admin";

            return (
              <div
                key={message._id || index}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  isAdmin
                    ? "self-end bg-purple-600 text-white rounded-tr-none"
                    : "self-start bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 rounded-tl-none"
                }`}
              >
                <div
                  className={`text-[10px] font-bold mb-1 ${
                    isAdmin
                      ? "text-purple-200 text-right"
                      : "text-purple-600 dark:text-purple-400"
                  }`}
                >
                  {message.senderName || (isAdmin ? "Admin" : "Customer")}
                </div>
                <div className="break-words">{message.text}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default LiveChatPanel;
