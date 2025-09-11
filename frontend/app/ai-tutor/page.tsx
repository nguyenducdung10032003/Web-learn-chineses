"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Lightbulb, BookOpen, MessageSquare, Sparkles, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "example" | "explanation"
}

const quickQuestions = [
  "Cách sử dụng 的, 得, 地?",
  "Phân biệt 在 và 正在?",
  "Khi nào dùng 了?",
  "Cấu trúc câu cơ bản?",
  "Cách hỏi thời gian?",
  "Số đếm trong tiếng Trung?",
]

const exampleResponses = {
  "Cách sử dụng 的, 得, 地?": {
    explanation:
      "Ba từ này có cách sử dụng khác nhau:\n\n• 的 (de): Dùng để bổ nghĩa cho danh từ\n• 得 (de): Dùng sau động từ để chỉ mức độ\n• 地 (de): Dùng sau tính từ để bổ nghĩa cho động từ",
    examples: [
      "我的书 (wǒ de shū) - sách của tôi",
      "他跑得很快 (tā pǎo de hěn kuài) - anh ấy chạy rất nhanh",
      "她高兴地笑了 (tā gāoxìng de xiào le) - cô ấy cười vui vẻ",
    ],
  },
  "Phân biệt 在 và 正在?": {
    explanation:
      "• 在 (zài): Chỉ vị trí hoặc hành động đang diễn ra\n• 正在 (zhèngzài): Nhấn mạnh hành động đang diễn ra ngay lúc này",
    examples: [
      "我在家 (wǒ zài jiā) - tôi ở nhà",
      "我在看书 (wǒ zài kàn shū) - tôi đang đọc sách",
      "我正在吃饭 (wǒ zhèngzài chī fàn) - tôi đang ăn cơm (ngay bây giờ)",
    ],
  },
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là trợ lý AI của ChineseMaster. Tôi có thể giúp bạn giải đáp các câu hỏi về ngữ pháp tiếng Trung, cung cấp ví dụ và giải thích chi tiết. Bạn muốn hỏi gì?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputMessage,
    sender: "user",
    timestamp: new Date(),
    type: "text",
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputMessage("");
  setIsTyping(true);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // hoặc "gpt-3.5-turbo" nếu rẻ hơn
        messages: [
          { role: "system", content: "Bạn là trợ lý ngữ pháp tiếng Trung. Hãy sửa lỗi, giải thích, đưa ví dụ." },
          { role: "user", content: inputMessage },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "⚠️ Không nhận được phản hồi từ AI";

    const aiMessage: Message = {
      id: Date.now().toString(),
      content: answer,
      sender: "ai",
      timestamp: new Date(),
      type: "explanation",
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: "⚠️ Lỗi khi kết nối tới AI. Vui lòng thử lại.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  const generateAIResponse = (question: string): Message => {
    // Check if it's a predefined question
    const matchedQuestion = Object.keys(exampleResponses).find(
      (q) => question.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(question.toLowerCase()),
    )

    if (matchedQuestion) {
      const response = exampleResponses[matchedQuestion as keyof typeof exampleResponses]
      return {
        id: Date.now().toString(),
        content: `${response.explanation}\n\n**Ví dụ:**\n${response.examples.map((ex, i) => `${i + 1}. ${ex}`).join("\n")}`,
        sender: "ai",
        timestamp: new Date(),
        type: "explanation",
      }
    }

    // Default response for other questions
    return {
      id: Date.now().toString(),
      content:
        "Đây là một câu hỏi hay! Tôi sẽ giải thích chi tiết:\n\nTrong tiếng Trung, điều này thường được sử dụng theo cách sau... Bạn có thể cho tôi biết thêm chi tiết về ngữ cảnh cụ thể không?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    inputRef.current?.focus()
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatMessage = (content: string) => {
    // Simple formatting for bold text
    return content
      .split("\n")
      .map((line, index) => (
        <div key={index}>
          {line.startsWith("**") && line.endsWith("**") ? (
            <strong className="text-emerald-700">{line.slice(2, -2)}</strong>
          ) : (
            line
          )}
        </div>
      ))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trợ lý AI</h1>
        <p className="text-gray-600">Hỏi đáp ngữ pháp tiếng Trung với trợ lý AI thông minh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Questions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Câu hỏi thường gặp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 text-wrap bg-transparent"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Tính năng AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Giải thích ngữ pháp</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span>Ví dụ thực tế</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4 text-purple-500" />
                <span>Trả lời 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/ai-tutor-avatar.png" alt="AI Tutor" />
                  <AvatarFallback className="bg-emerald-100">
                    <Bot className="h-5 w-5 text-emerald-600" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Trợ lý AI ChineseMaster</CardTitle>
                  <p className="text-sm text-gray-600">Chuyên gia ngữ pháp tiếng Trung</p>
                </div>
                <Badge className="ml-auto bg-emerald-100 text-emerald-700">Trực tuyến</Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-emerald-100">
                          <Bot className="h-4 w-4 text-emerald-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-emerald-500 text-white"
                          : message.type === "explanation"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-gray-100"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{formatMessage(message.content)}</div>

                      {message.sender === "ai" && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Sao chép
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100">
                        <Bot className="h-4 w-4 text-emerald-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Hỏi về ngữ pháp tiếng Trung..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Nhấn Enter để gửi. AI có thể mắc lỗi, hãy kiểm tra thông tin quan trọng.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Features Info */}
      <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            Trợ lý AI có thể giúp bạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Giải thích ngữ pháp</h3>
              <p className="text-sm text-gray-600">Phân tích cấu trúc câu, cách sử dụng từ loại</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <MessageSquare className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Ví dụ thực tế</h3>
              <p className="text-sm text-gray-600">Cung cấp câu ví dụ với phiên âm và dịch nghĩa</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Mẹo học tập</h3>
              <p className="text-sm text-gray-600">Gợi ý phương pháp học và ghi nhớ hiệu quả</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
