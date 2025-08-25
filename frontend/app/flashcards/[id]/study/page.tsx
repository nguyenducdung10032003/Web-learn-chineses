"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Shuffle,
  Target,
  Edit3,
  ArrowUpDown,
} from "lucide-react"

type ExerciseType = "flashcard" | "multiple-choice" | "fill-blank" | "sentence-match" | "sentence-order" | "grammar-fix"

export default function StudyPage({ params }: { params: { id: string } }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyResults, setStudyResults] = useState<{ [key: number]: "easy" | "good" | "hard" | "again" }>({})
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    xpEarned: 0,
    streak: 0,
  })
  const [exerciseType, setExerciseType] = useState<ExerciseType>("flashcard")
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [userInput, setUserInput] = useState<string>("")
  const [draggedItems, setDraggedItems] = useState<string[]>([])
  const [showExerciseResult, setShowExerciseResult] = useState(false)
  const [exerciseCorrect, setExerciseCorrect] = useState(false)

  const deck = {
    id: Number.parseInt(params.id),
    title: "HSK 1 - Từ vựng cơ bản",
    totalCards: 20,
  }

  const flashcards = [
    {
      id: 1,
      chinese: "你好",
      pinyin: "nǐ hǎo",
      vietnamese: "Xin chào",
      difficulty: "new",
      audio: "/audio/nihao.mp3",
    },
    {
      id: 2,
      chinese: "谢谢",
      pinyin: "xiè xiè",
      vietnamese: "Cảm ơn",
      difficulty: "learning",
      audio: "/audio/xiexie.mp3",
    },
    {
      id: 3,
      chinese: "再见",
      pinyin: "zài jiàn",
      vietnamese: "Tạm biệt",
      difficulty: "review",
      audio: "/audio/zaijian.mp3",
    },
    {
      id: 4,
      chinese: "学习",
      pinyin: "xué xí",
      vietnamese: "Học tập",
      difficulty: "new",
      audio: "/audio/xuexi.mp3",
    },
    {
      id: 5,
      chinese: "中文",
      pinyin: "zhōng wén",
      vietnamese: "Tiếng Trung",
      difficulty: "learning",
      audio: "/audio/zhongwen.mp3",
    },
  ]

  const currentCard = flashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100

  const generateMultipleChoice = () => {
    const correctAnswer = currentCard.vietnamese
    const wrongAnswers = ["Tạm biệt", "Học tập", "Tiếng Anh", "Chào buổi sáng"]
      .filter((a) => a !== correctAnswer)
      .slice(0, 3)
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
    return {
      question: `"${currentCard.chinese}" (${currentCard.pinyin}) có nghĩa là gì?`,
      options,
      correct: correctAnswer,
    }
  }

  const generateFillBlank = () => {
    const sentence = `Khi gặp bạn bè, tôi thường nói "${currentCard.chinese}"`
    const blankSentence = sentence.replace(currentCard.chinese, "____")
    return {
      sentence: blankSentence,
      correct: currentCard.chinese,
      hint: `Pinyin: ${currentCard.pinyin}`,
    }
  }

  const generateSentenceMatch = () => {
    const pairs = [
      { chinese: currentCard.chinese, vietnamese: currentCard.vietnamese },
      { chinese: "再见", vietnamese: "Tạm biệt" },
      { chinese: "学习", vietnamese: "Học tập" },
    ]
    return pairs
  }

  const generateSentenceOrder = () => {
    const words = currentCard.chinese.split("")
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    return {
      shuffled,
      correct: words.join(""),
    }
  }

  const generateGrammarFix = () => {
    const wrongSentence = `我很好你好吗` // Intentionally wrong grammar
    const correctSentence = `我很好，你好吗？`
    return {
      wrong: wrongSentence,
      correct: correctSentence,
      explanation: "Cần thêm dấu phẩy và dấu hỏi để câu đúng ngữ pháp",
    }
  }

  const playAudio = (audioSrc: string) => {
    console.log("Playing audio:", audioSrc)
  }

  const handleAnswer = (difficulty: "easy" | "good" | "hard" | "again") => {
    const newResults = { ...studyResults, [currentCard.id]: difficulty }
    setStudyResults(newResults)

    const isCorrect = difficulty === "easy" || difficulty === "good"
    const newStreak = isCorrect ? sessionStats.streak + 1 : 0

    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      xpEarned: prev.xpEarned + (isCorrect ? 10 + newStreak * 2 : 5),
      streak: newStreak,
    }))

    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      resetExerciseState()
    } else {
      console.log("Session complete!", sessionStats)
    }
  }

  const handleExerciseSubmit = () => {
    let isCorrect = false

    switch (exerciseType) {
      case "multiple-choice":
        isCorrect = selectedAnswer === generateMultipleChoice().correct
        break
      case "fill-blank":
        isCorrect = userInput.trim() === generateFillBlank().correct
        break
      case "sentence-order":
        isCorrect = draggedItems.join("") === generateSentenceOrder().correct
        break
      case "grammar-fix":
        isCorrect = userInput.trim() === generateGrammarFix().correct
        break
      default:
        isCorrect = false
    }

    setExerciseCorrect(isCorrect)
    setShowExerciseResult(true)

    const newStreak = isCorrect ? sessionStats.streak + 1 : 0
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      xpEarned: prev.xpEarned + (isCorrect ? 15 + newStreak * 3 : 5),
      streak: newStreak,
    }))
  }

  const resetExerciseState = () => {
    setIsFlipped(false)
    setShowAnswer(false)
    setSelectedAnswer("")
    setUserInput("")
    setDraggedItems([])
    setShowExerciseResult(false)
    setExerciseCorrect(false)
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setShowAnswer(true)
    }
  }

  const resetCard = () => {
    setIsFlipped(false)
    setShowAnswer(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "new":
        return "bg-blue-500"
      case "learning":
        return "bg-orange-500"
      case "review":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "new":
        return "Mới"
      case "learning":
        return "Đang học"
      case "review":
        return "Ôn tập"
      default:
        return "Không xác định"
    }
  }

  const ExerciseTypeSelector = () => (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <Button
        variant={exerciseType === "flashcard" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("flashcard")}
      >
        <Eye className="h-4 w-4 mr-2" />
        Flashcard
      </Button>
      <Button
        variant={exerciseType === "multiple-choice" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("multiple-choice")}
      >
        <Target className="h-4 w-4 mr-2" />
        Trắc nghiệm
      </Button>
      <Button
        variant={exerciseType === "fill-blank" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("fill-blank")}
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Điền từ
      </Button>
      <Button
        variant={exerciseType === "sentence-match" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("sentence-match")}
      >
        <ArrowUpDown className="h-4 w-4 mr-2" />
        Nối câu
      </Button>
      <Button
        variant={exerciseType === "sentence-order" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("sentence-order")}
      >
        <Shuffle className="h-4 w-4 mr-2" />
        Sắp xếp
      </Button>
      <Button
        variant={exerciseType === "grammar-fix" ? "default" : "outline"}
        size="sm"
        onClick={() => setExerciseType("grammar-fix")}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Sửa lỗi
      </Button>
    </div>
  )

  const renderExerciseContent = () => {
    switch (exerciseType) {
      case "multiple-choice":
        const mcq = generateMultipleChoice()
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">{mcq.question}</h3>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {mcq.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleExerciseSubmit} disabled={!selectedAnswer || showExerciseResult} className="w-full">
              Kiểm tra
            </Button>
          </div>
        )

      case "fill-blank":
        const fillBlank = generateFillBlank()
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Điền từ vào chỗ trống</h3>
            <p className="text-lg text-center">{fillBlank.sentence}</p>
            <p className="text-sm text-gray-600 text-center">{fillBlank.hint}</p>
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập từ tiếng Trung..."
              className="text-center text-lg"
              disabled={showExerciseResult}
            />
            <Button
              onClick={handleExerciseSubmit}
              disabled={!userInput.trim() || showExerciseResult}
              className="w-full"
            >
              Kiểm tra
            </Button>
          </div>
        )

      case "sentence-match":
        const pairs = generateSentenceMatch()
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Nối từ tiếng Trung với nghĩa tiếng Việt</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-center">Tiếng Trung</h4>
                {pairs.map((pair, index) => (
                  <div key={index} className="p-3 border rounded-lg text-center bg-blue-50">
                    {pair.chinese}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-center">Tiếng Việt</h4>
                {pairs.map((pair, index) => (
                  <div key={index} className="p-3 border rounded-lg text-center bg-green-50">
                    {pair.vietnamese}
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => handleAnswer("good")} className="w-full">
              Tiếp tục
            </Button>
          </div>
        )

      case "sentence-order":
        const sentenceOrder = generateSentenceOrder()
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Sắp xếp các chữ cái theo đúng thứ tự</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {sentenceOrder.shuffled.map((char, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-lg p-4 bg-transparent"
                  onClick={() => {
                    if (!draggedItems.includes(char)) {
                      setDraggedItems([...draggedItems, char])
                    }
                  }}
                  disabled={draggedItems.includes(char) || showExerciseResult}
                >
                  {char}
                </Button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Thứ tự đã chọn:</p>
              <div className="text-2xl font-bold min-h-[3rem] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {draggedItems.join("")}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setDraggedItems([])}
                variant="outline"
                className="flex-1"
                disabled={showExerciseResult}
              >
                Xóa
              </Button>
              <Button
                onClick={handleExerciseSubmit}
                disabled={draggedItems.length === 0 || showExerciseResult}
                className="flex-1"
              >
                Kiểm tra
              </Button>
            </div>
          </div>
        )

      case "grammar-fix":
        const grammarFix = generateGrammarFix()
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Sửa lỗi ngữ pháp trong câu sau</h3>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-lg text-center font-mono">{grammarFix.wrong}</p>
            </div>
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập câu đã sửa..."
              className="text-center text-lg"
              disabled={showExerciseResult}
            />
            <Button
              onClick={handleExerciseSubmit}
              disabled={!userInput.trim() || showExerciseResult}
              className="w-full"
            >
              Kiểm tra
            </Button>
          </div>
        )

      default:
        // Original flashcard content
        return (
          <Card
            className={`min-h-[400px] cursor-pointer transition-all duration-500 transform-gpu ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={flipCard}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
              {!isFlipped ? (
                <div className="space-y-6">
                  <div className="text-6xl font-bold text-primary mb-4">{currentCard.chinese}</div>
                  <div className="text-2xl text-muted-foreground">{currentCard.pinyin}</div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(currentCard.audio)
                    }}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Phát âm
                  </Button>
                  <div className="text-sm text-muted-foreground mt-8">Nhấn để xem nghĩa tiếng Việt</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-4xl font-bold text-primary mb-4">{currentCard.vietnamese}</div>
                  <div className="text-xl text-muted-foreground">{currentCard.chinese}</div>
                  <div className="text-lg text-muted-foreground">{currentCard.pinyin}</div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(currentCard.audio)
                    }}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Phát âm
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/flashcards" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">{deck.title}</h1>
              <p className="text-sm text-muted-foreground">
                Thẻ {currentCardIndex + 1}/{flashcards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {sessionStats.correct}/{sessionStats.total} đúng
            </div>
            {sessionStats.streak > 0 && <Badge className="bg-orange-500">🔥 {sessionStats.streak}</Badge>}
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Card Difficulty */}
        <div className="flex justify-center mb-6">
          <Badge className={getDifficultyColor(currentCard.difficulty)}>
            {getDifficultyText(currentCard.difficulty)}
          </Badge>
        </div>

        <ExerciseTypeSelector />

        {/* Exercise Content */}
        <div className="relative mb-8">
          {renderExerciseContent()}

          {/* Card Controls for flashcard mode */}
          {exerciseType === "flashcard" && (
            <div className="flex justify-center mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={resetCard}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {showExerciseResult && exerciseType !== "flashcard" && (
          <div
            className={`mb-6 p-4 rounded-lg ${exerciseCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{exerciseCorrect ? "✅" : "❌"}</div>
              <p className="font-medium">{exerciseCorrect ? "Chính xác!" : "Chưa đúng!"}</p>
              {!exerciseCorrect && (
                <p className="text-sm text-gray-600 mt-2">
                  Đáp án đúng:{" "}
                  <span className="font-medium">
                    {exerciseType === "multiple-choice"
                      ? generateMultipleChoice().correct
                      : exerciseType === "fill-blank"
                        ? generateFillBlank().correct
                        : exerciseType === "sentence-order"
                          ? generateSentenceOrder().correct
                          : exerciseType === "grammar-fix"
                            ? generateGrammarFix().correct
                            : ""}
                  </span>
                </p>
              )}
              <Button
                onClick={() => {
                  if (currentCardIndex < flashcards.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1)
                    resetExerciseState()
                  }
                }}
                className="mt-4"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {/* Answer Buttons for flashcard mode */}
        {showAnswer && exerciseType === "flashcard" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1 bg-red-50 hover:bg-red-100 border-red-200"
              onClick={() => handleAnswer("again")}
            >
              <X className="h-5 w-5 text-red-600" />
              <span className="text-sm">Sai</span>
              <span className="text-xs text-muted-foreground">&lt; 1 phút</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1 bg-orange-50 hover:bg-orange-100 border-orange-200"
              onClick={() => handleAnswer("hard")}
            >
              <span className="text-lg">😓</span>
              <span className="text-sm">Khó</span>
              <span className="text-xs text-muted-foreground">6 phút</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
              onClick={() => handleAnswer("good")}
            >
              <span className="text-lg">😊</span>
              <span className="text-sm">Tốt</span>
              <span className="text-xs text-muted-foreground">1 ngày</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex flex-col gap-1 bg-green-50 hover:bg-green-100 border-green-200"
              onClick={() => handleAnswer("easy")}
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Dễ</span>
              <span className="text-xs text-muted-foreground">4 ngày</span>
            </Button>
          </div>
        )}

        {/* Session Stats */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>Đúng: {sessionStats.correct}</span>
            <span>Tổng: {sessionStats.total}</span>
            <span>XP: +{sessionStats.xpEarned}</span>
            <span>Streak: {sessionStats.streak}</span>
          </div>
        </div>

        {/* Completion Check */}
        {currentCardIndex >= flashcards.length - 1 && sessionStats.total > 0 && (
          <div className="mt-8 text-center">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="space-y-4">
                <div className="text-2xl">🎉</div>
                <h3 className="font-semibold text-lg">Hoàn thành phiên học!</h3>
                <div className="text-sm text-muted-foreground">
                  Bạn đã học {flashcards.length} thẻ và đạt{" "}
                  {Math.round((sessionStats.correct / sessionStats.total) * 100)}% chính xác
                </div>
                {sessionStats.streak >= 5 && (
                  <div className="text-sm text-orange-600 font-medium">
                    🔥 Streak tuyệt vời: {sessionStats.streak} câu liên tiếp!
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  <Link href="/flashcards">
                    <Button variant="outline">Quay lại</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setCurrentCardIndex(0)
                      setSessionStats({ correct: 0, total: 0, xpEarned: 0, streak: 0 })
                      setStudyResults({})
                      resetExerciseState()
                    }}
                  >
                    Học lại
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
