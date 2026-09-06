"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_CHATBOT_URL } from "@/lib/constant";

// Loading Dots Component
function LoadingDots({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gray-100 text-gray-800 self-start px-3 py-2 rounded-2xl rounded-tl-none inline-block",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
        <div
          className="w-1 h-1 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-1 h-1 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
}

// Fullscreen Chat Component
function FullscreenChat({
  messages,
  input,
  setInput,
  onSendMessage,
  onClose,
  isLoading,
}: {
  messages: { id: string; role: "user" | "ai"; content: string }[];
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add this useEffect after the existing messagesEndRef useEffect
  useEffect(() => {
    // Disable body scroll when fullscreen chat is open
    document.body.style.overflow = "hidden";

    // Re-enable body scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary to-primary-500 text-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <div className="bg-white text-primary-600 w-full h-full flex items-center justify-center text-sm font-bold">
              B
            </div>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">Besti - Chatbot UDINUS</h3>
            <p className="text-sm text-primary-100">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full text-white hover:text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <MessageCircle size={40} className="text-primary-600" />
            </div>
            <p className="text-gray-500 text-lg">
              Selamat datang! Ada yang bisa saya bantu?
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "ai" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <div className="bg-primary-600 text-white w-full h-full flex items-center justify-center text-xs font-bold">
                      B
                    </div>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <div className="bg-gray-600 text-white w-full h-full flex items-center justify-center text-xs font-bold">
                      U
                    </div>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && <LoadingDots />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t bg-gray-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 h-12 rounded-full border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-full"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "ai"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isFullscreen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isFullscreen]);

  const createSession = async () => {
    try {
      const res = await fetch(`${API_CHATBOT_URL}/session`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const session = data.data._id;
        setSessionId(session);
        fetchSessionHistory(session);
      }
    } catch (error) {
      console.error("Gagal membuat sesi:", error);
    }
  };

  const fetchSessionHistory = async (id: string) => {
    try {
      const res = await fetch(`${API_CHATBOT_URL}/${id}`);
      const data = await res.json();
      if (data.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history = data.data.message_history.map((msg: any) => ({
          id: msg._id,
          role: msg.role === "human" ? "user" : "ai",
          content: msg.content,
        }));
        setMessages(history);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
    }
  };

  const sendMessage = async () => {
    if (!sessionId || !input.trim()) return;

    const userMsg = {
      id: `${Date.now()}-user`,
      role: "user" as const,
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_CHATBOT_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, query: input }),
      });
      const data = await res.json();
      const botMsg = {
        id: `${Date.now()}-ai`,
        role: "ai" as const,
        content: data.data || "Maaf, saya tidak dapat menjawab saat ini.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }

    setIsLoading(false);
  };

  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && !sessionId) {
      createSession();
    }
    if (!newState) {
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsOpen(false);
  };

  if (isFullscreen) {
    return (
      <AnimatePresence>
        <FullscreenChat
          messages={messages}
          input={input}
          setInput={setInput}
          onSendMessage={sendMessage}
          onClose={() => setIsFullscreen(false)}
          isLoading={isLoading}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={toggleChat}
              className="rounded-full size-14 shadow-lg flex items-center justify-center bg-primary-600 hover:bg-primary-700"
            >
              <MessageCircle className="size-10" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-80 md:w-96 h-[500px] shadow-2xl flex flex-col overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <div className="bg-white text-primary-600 w-full h-full flex items-center justify-center text-sm font-bold">
                        B
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">
                        Besti - Chatbot UDINUS
                      </h3>
                      <p className="text-xs text-primary-100">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="h-8 w-8 rounded-full text-white hover:text-white hover:bg-white/20"
                    >
                      <Maximize2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="h-8 w-8 rounded-full text-white hover:text-white hover:bg-white/20"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <MessageCircle size={32} className="text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Selamat datang! Ada yang bisa saya bantu?
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "px-3 py-2 rounded-2xl text-sm leading-relaxed break-words",
                            message.role === "user"
                              ? "bg-primary-600 text-white rounded-tr-none max-w-[85%] sm:max-w-[70%]"
                              : "bg-gray-100 text-gray-800 rounded-tl-none max-w-[85%] sm:max-w-[70%]"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && <LoadingDots />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-3 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex w-full gap-2"
                >
                  <div className="flex w-full h-10 rounded-full border border-gray-300 bg-white overflow-hidden focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="flex-1 h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-4"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading || !input.trim()}
                      className="h-full rounded-none px-4 aspect-square"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
