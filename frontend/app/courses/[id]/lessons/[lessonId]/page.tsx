"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, X, RotateCcw, BookOpen } from "lucide-react"

export default function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [fillAnswer, setFillAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)

  const lesson = {
    id: Number.parseInt(params.lessonId),
    title: "Thì hiện tại",
    course: "Ngữ pháp cơ bản",
    totalSteps: 5,
  }

  const lessonContent = [
    {
      type: "theory",
      title: "Lý thuyết: Thì hiện tại trong tiếng Trung",
      content: `
        Thì hiện tại trong tiếng Trung được sử dụng để diễn tả:
        • Hành động đang diễn ra tại thời điểm nói
        • Thói quen, sở thích
        • Sự thật hiển nhiên
        
        Cấu trúc cơ bản:
        主语 + 动词 + 宾语
        (Chủ ngữ + Động từ + Tân ngữ)
      `,
      examples: [
        { chinese: "我学习中文。", pinyin: "Wǒ xuéxí zhōngwén.", vietnamese: "Tôi học tiếng Trung." },
        { chinese: "他喜欢音乐。", pinyin: "Tā xǐhuān yīnyuè.", vietnamese: "Anh ấy thích âm nhạc." },
        { chinese: "我们吃饭。", pinyin: "Wǒmen chīfàn.", vietnamese: "Chúng tôi ăn cơm." },
      ],
    },
    {
      type: "multiple-choice",
      title: "Bài tập trắc nghiệm",
      question: "Chọn câu dịch đúng của '我喝茶':",
      options: [
        { id: "a", text: "Tôi uống trà", correct: true },
        { id: "b", text: "Tôi uống cà phê", correct: false },
        { id: "c", text: "Tôi ăn cơm", correct: false },
        { id: "d", text: "Tôi đi học", correct: false },
      ],
    },
    {
      type: "fill-blank",
      title: "Điền từ vào chỗ trống",
      question: "Điền từ thích hợp: 我___中文。(Tôi học tiếng Trung)",
      correctAnswer: "学习",
      hint: "Từ này có nghĩa là 'học tập'",
    },
    {
      type: "audio",
      title: "Luyện phát âm",
      content: "Nghe và lặp lại các câu sau:",
      sentences: [
        { chinese: "我学习中文。", pinyin: "Wǒ xuéxí zhōngwén.", audio: "/audio/sentence1.mp3" },
        { chinese: "他喜欢音乐。", pinyin: "Tā xǐhuān yīnyuè.", audio: "/audio/sentence2.mp3" },
      ],
    },
    {
      type: "summary",
      title: "Tóm tắt bài học",
      content: `
        Bạn đã hoàn thành bài học "Thì hiện tại"!
        
        Những điều đã học:
        • Cấu trúc câu cơ bản với thì hiện tại
        • Cách sử dụng động từ trong câu
        • Phát âm chuẩn các câu mẫu
        
        Điểm số: ${score}/2
      `,
    },
  ]

  const currentContent = lessonContent[currentStep]

  const handleAnswer = () => {
    if (currentContent.type === "multiple-choice") {
      const correct = currentContent.options.find((opt) => opt.id === selectedAnswer)?.correct || false
      setIsCorrect(correct)
      if (correct) setScore(score + 1)
    } else if (currentContent.type === "fill-blank") {
      const correct = fillAnswer.trim() === currentContent.correctAnswer
      setIsCorrect(correct)
      if (correct) setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
    setSelectedAnswer("")
    setFillAnswer("")
    setShowResult(false)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setShowResult(false)
  }

  const playAudio = (audioSrc: string) => {
    // Simulate audio playback
    console.log("Playing audio:", audioSrc)
  }

  const resetExercise = () => {
    setSelectedAnswer("")
    setFillAnswer("")
    setShowResult(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/courses/${params.id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground">{lesson.course}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {currentStep + 1}/{lesson.totalSteps}
            </div>
            <Progress value={((currentStep + 1) / lesson.totalSteps) * 100} className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {currentContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theory Content */}
            {currentContent.type === "theory" && (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-foreground">{currentContent.content}</div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Ví dụ:</h3>
                  {currentContent.examples?.map((example, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">{example.chinese}</span>
                          <Button variant="ghost" size="sm" onClick={() => playAudio(`/audio/example${index}.mp3`)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-muted-foreground">{example.pinyin}</div>
                        <div className="text-foreground">{example.vietnamese}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Choice */}
            {currentContent.type === "multiple-choice" && (
              <div className="space-y-6">
                <div className="text-lg font-medium">{currentContent.question}</div>

                {!showResult ? (
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {currentContent.options?.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentContent.options?.map((option) => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          option.correct
                            ? "bg-green-50 border-green-200"
                            : selectedAnswer === option.id && !option.correct
                              ? "bg-red-50 border-red-200"
                              : "bg-muted/30"
                        }`}
                      >
                        <span>{option.text}</span>
                        {option.correct && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {selectedAnswer === option.id && !option.correct && <X className="h-5 w-5 text-red-600" />}
                      </div>
                    ))}
                  </div>
                )}

                {showResult && (
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                  >
                    {isCorrect ? "Chính xác! Bạn đã chọn đúng đáp án." : "Sai rồi! Hãy xem lại đáp án đúng."}
                  </div>
                )}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentContent.type === "fill-blank" && (
              <div className="space-y-6">
                <div className="text-lg font-medium">{currentContent.question}</div>

                {!showResult ? (
                  <div className="space-y-4">
                    <Input
                      value={fillAnswer}
                      onChange={(e) => setFillAnswer(e.target.value)}
                      placeholder="Nhập đáp án..."
                      className="text-lg"
                    />
                    <div className="text-sm text-muted-foreground">💡 Gợi ý: {currentContent.hint}</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-lg">
                      Đáp án của bạn:{" "}
                      <span className={isCorrect ? "text-green-600" : "text-red-600"}>{fillAnswer}</span>
                    </div>
                    <div className="text-lg">
                      Đáp án đúng: <span className="text-green-600">{currentContent.correctAnswer}</span>
                    </div>
                  </div>
                )}

                {showResult && (
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                  >
                    {isCorrect ? "Chính xác! Bạn đã điền đúng." : "Chưa đúng! Hãy ghi nhớ đáp án đúng."}
                  </div>
                )}
              </div>
            )}

            {/* Audio Practice */}
            {currentContent.type === "audio" && (
              <div className="space-y-6">
                <div className="text-lg">{currentContent.content}</div>

                <div className="space-y-4">
                  {currentContent.sentences?.map((sentence, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary">{sentence.chinese}</span>
                          <Button variant="outline" size="sm" onClick={() => playAudio(sentence.audio)}>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Phát âm
                          </Button>
                        </div>
                        <div className="text-muted-foreground">{sentence.pinyin}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {currentContent.type === "summary" && (
              <div className="space-y-6 text-center">
                <div className="text-6xl">🎉</div>
                <div className="whitespace-pre-line text-foreground">{currentContent.content}</div>
                <Badge className="text-lg px-4 py-2">Hoàn thành bài học</Badge>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>

              <div className="flex gap-2">
                {(currentContent.type === "multiple-choice" || currentContent.type === "fill-blank") && !showResult && (
                  <Button
                    onClick={handleAnswer}
                    disabled={
                      (currentContent.type === "multiple-choice" && !selectedAnswer) ||
                      (currentContent.type === "fill-blank" && !fillAnswer.trim())
                    }
                  >
                    Kiểm tra
                  </Button>
                )}

                {(currentContent.type === "multiple-choice" || currentContent.type === "fill-blank") && showResult && (
                  <Button variant="outline" onClick={resetExercise}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm lại
                  </Button>
                )}

                {currentStep < lesson.totalSteps - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (currentContent.type === "multiple-choice" || currentContent.type === "fill-blank") && !showResult
                    }
                  >
                    Tiếp theo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Link href={`/courses/${params.id}`}>
                    <Button>
                      Hoàn thành
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
