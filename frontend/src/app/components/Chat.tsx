"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { Send, Mic, Volume2, VolumeX, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import Link from "next/link";

// Function to get user initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export default function Chat() {
  const { user } = useUser(); // Get logged-in user
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [muted, setMuted] = useState(false);
  const recognitionRef = useRef<any | null>(null);

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

      const responseText = data.response;
      setMessages((prev) => [...prev, { role: "bot", text: responseText }]);

      if (!muted) speakText(responseText);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Unable to connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = () => {
    setMuted((prev) => {
      if (!prev) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  // Speech Recognition
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    setIsRecording(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      setMessage(event.results[0][0].transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text-to-Speech
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    if (muted) return;

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_~]/g, ""));
    utterance.lang = language;

    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((v) => v.lang.startsWith(language)) || voices[0];

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-lg">
        <CardContent className="p-4 sm:p-6">
          {/* Header: Title + Logout */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-3xl font-bold text-blue-800">Niramaya</h2>
            {user && (
              <div className="flex items-center gap-2">
                <img src={user.picture ?? "/default-avatar.png"} alt={user.name ?? "User"} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{user.name}</span>
                <Link href="/api/auth/logout">
                  <Button variant="outline" size="icon">
                    <LogOut size={20} />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="flex justify-end mb-3">
            <Select onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger className="w-36 sm:w-48">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {[
                  ["en", "English"],
                  ["as", "অসমীয়া (Assamese)"],
                  ["bn", "বাংলা (Bengali)"],
                  ["brx", "बड़ो (Bodo)"],
                  ["gu", "ગુજરાતી (Gujarati)"],
                  ["hi", "हिन्दी (Hindi)"],
                  ["kok", "कोंकणी (Konkani)"],
                  ["mai", "मैथिली (Maithili)"],
                  ["doi", "डोगरी (Dogri)"],
                  ["sat", "ᱥᱟᱱᱛᱟᱞᱤ (Santhali)"],
                  ["ks", "کشميري / कश्मीरी (Kashmiri)"],
                  ["kn", "ಕನ್ನಡ (Kannada)"],
                  ["ml", "മലയാളം (Malayalam)"],
                  ["mni", "ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)"],
                  ["mr", "मराठी (Marathi)"],
                  ["ne", "नेपाली (Nepali)"],
                  ["or", "ଓଡ଼ିଆ (Odia)"],
                  ["pa", "ਪੰਜਾਬੀ / پنجابی (Punjabi)"],
                  ["sa", "संस्कृतम् (Sanskrit)"],
                  ["sd", "سنڌي / सिन्धी (Sindhi)"],
                  ["ta", "தமிழ் (Tamil)"],
                  ["te", "తెలుగు (Telugu)"],
                  ["ur", "اردو (Urdu)"],
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
                  <ChatBubbleAvatar fallback={msg.role === "user" ? getInitials(user?.name || "Me") : "NI"} />
                  <ChatBubbleMessage variant={msg.role === "user" ? "sent" : "received"}>
                    {msg.text}
                  </ChatBubbleMessage>
                  {msg.role === "bot" && (
                    <Button variant="ghost" size="icon" onClick={() => speakText(msg.text)}>
                      <Volume2 size={20} />
                    </Button>
                  )}
                </ChatBubble>
              ))}

              {loading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar fallback="AI" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}

              <div ref={messagesEndRef} />
            </ChatMessageList>
          </div>

          {/* Chat Input & Controls */}
          <div className="flex mt-4 gap-2">
            <Button onClick={isRecording ? stopRecording : startRecording} variant="outline">
              {isRecording ? "🎤 Stop" : <Mic size={20} />}
            </Button>
            <ChatInput
              className="flex-1 p-2 sm:p-3"
              placeholder="Type or speak your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading}>
              <Send size={20} />
            </Button>
            <Button onClick={toggleMute} variant="outline">
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
