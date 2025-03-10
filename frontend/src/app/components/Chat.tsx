"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input"
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper, ChatBubbleTimestamp, chatBubbleMessageVariants, chatBubbleVariant } from "@/components/ui/chat/chat-bubble";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:8080/get",
        { msg: message, language },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Unable to connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-lg">
        <CardContent className="p-4 sm:p-6">
          {/* Chatbot Title */}
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-4 text-blue-800">
            Niramaya
          </h2>

          {/* Language Selection */}
          <div className="flex justify-end mb-3">
            <Select onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-36 sm:w-48">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {[
                  ["en", "English"], ["as", "অসমীয়া (Assamese)"], ["bn", "বাংলা (Bengali)"], ["brx", "बड़ो (Bodo)"],
                  ["gu", "ગુજરાતી (Gujarati)"], ["hi", "हिन्दी (Hindi)"], ["kok", "कोंकणी (Konkani)"], ["mai", "मैथिली (Maithili)"],
                  ["doi", "डोगरी (Dogri)"], ["sat", "ᱥᱟᱱᱛᱟᱲᱤ (Santhali)"], ["ks", "کٲشُر (Kashmiri)"], ["kn", "ಕನ್ನಡ (Kannada)"],
                  ["ml", "മലയാളം (Malayalam)"], ["mni", "ꯃꯅꯤꯄꯨꯔꯤ (Manipuri)"], ["mr", "मराठी (Marathi)"], ["ne", "नेपाली (Nepali)"],
                  ["or", "ଓଡ଼ିଆ (Odia)"], ["pa", "ਪੰਜਾਬੀ (Punjabi)"], ["sa", "संस्कृतम् (Sanskrit)"], ["sd", "سنڌي (Sindhi)"],
                  ["ta", "தமிழ் (Tamil)"], ["te", "తెలుగు (Telugu)"], ["ur", "اردو (Urdu)"]
                ].map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chat Messages */}
          <div className="h-80 sm:h-[500px] overflow-y-auto border p-3 rounded bg-gray-50 space-y-2">
            <ChatMessageList>
              {messages.map((msg, index) => (
                <ChatBubble key={index} variant={msg.role === "user" ? "sent" : "received"}>
                  <ChatBubbleAvatar fallback={msg.role === "user" ? "Me" : "NI"} />
                  <ChatBubbleMessage variant={msg.role === "user" ? "sent" : "received"}>
                    {msg.text}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}

              {/* Auto-scroll Reference */}
              <div ref={messagesEndRef} />
            </ChatMessageList>
          </div>

          {/* Chat Input */}
          <div className="flex mt-4 gap-2">
            <ChatInput
              className="flex-1 text-sm sm:text-base p-2 sm:p-3"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading} className="p-2 sm:p-3">
              <Send size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}