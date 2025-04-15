
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage } from "@/components/community/ChatMessage";
import { Message } from "@/types";
import { MOCK_MESSAGES } from "@/constants";

const Community = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentUser) {
      alert("Please log in to send messages");
      return;
    }

    if (!newMessage.trim()) return;

    const message: Message = {
      id: `m${Date.now()}`,
      content: newMessage.trim(),
      user: currentUser,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Community Chat</h1>
        <p className="text-muted-foreground mb-8">
          Discuss papers, share tips, and connect with other students
        </p>

        <div className="border border-border rounded-lg shadow-sm overflow-hidden">
          {/* Chat area */}
          <div className="bg-card p-4 h-[600px] flex flex-col">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={
                    currentUser ? message.user.id === currentUser.id : false
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="relative">
              <Input
                placeholder={
                  currentUser
                    ? "Type your message..."
                    : "Please log in to send messages"
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-12"
                disabled={!currentUser}
              />
              <Button
                className="absolute right-1 top-1 h-8 w-8 p-0"
                size="icon"
                onClick={handleSendMessage}
                disabled={!currentUser || !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>

        {!currentUser && (
          <div className="mt-6 text-center p-4 bg-muted rounded-lg">
            <p className="text-sm">
              You need to be logged in to participate in the discussion.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Community;
