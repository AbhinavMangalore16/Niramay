"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">
          💬 Niramaya Assistant
        </h2>

        {/* Language Selection */}
        <div className="flex justify-end mb-3">
          <select
            className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {[
              ["en", "English"],
              ["as", "Assamese"],
              ["bn", "Bengali"],
              ["brx", "Bodo"],
              ["gu", "Gujarati"],
              ["hi", "Hindi"],
              ["kok", "Konkani"],
              ["mai", "Maithili"],
              ["doi", "Dogri"],
              ["sat", "Santhali"],
              ["ks", "Kashmiri"],
              ["kn", "Kannada"],
              ["ml", "Malayalam"],
              ["mni", "Manipuri"],
              ["mr", "Marathi"],
              ["ne", "Nepali"],
              ["or", "Odia"],
              ["pa", "Punjabi"],
              ["sa", "Sanskrit"],
              ["sd", "Sindhi"],
              ["ta", "Tamil"],
              ["te", "Telugu"],
              ["ur", "Urdu"],
            ].map(([code, lang]) => (
              <option key={code} value={code}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto border p-3 rounded bg-gray-50 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex my-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg text-sm max-w-[75%] transition-opacity ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-300 text-gray-800 rounded-bl-none"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-gray-500 text-sm italic animate-pulse">
              Bot is typing...
            </div>
          )}

          {/* Auto-scroll Reference */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex mt-4 gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className={`p-3 rounded-lg flex items-center transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={sendMessage}
            disabled={loading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
