"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Zap,
  Target,
  Users,
  Trophy,
  Star,
  Play,
  Shuffle,
  Edit,
  Link,
} from "lucide-react";
import { BASE_URL } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const ICON_MAP = {
  Zap,
  Edit,
  Link,
  Shuffle,
  Target,
  Users,
  Star,
  Trophy,
  Play,
  Clock,
} as const;

type GameFromApi = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof ICON_MAP | string;
  difficulty: string;
  xp_reward: number;
  time_limit: number;
  color: string;
  created_at: string;
  questions?: Question[];
};

type GameUI = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: string;
  xpReward: number;
  timeLimit: number;
  color: string;
  createdAt: string;
};

// Định nghĩa kiểu dữ liệu cho các tùy chọn
type Option = {
  id: number;
  option_text: string;
  is_correct: boolean;
};

type MCQ = {
  type: "multiple-choice";
  question: string;
  options: Option[];
  correct: number;
};

type FillBlank = {
  type: "fill-blank";
  question: string;
  sentence: string;
  blank: string;
  options: string[];
};

type Matching = {
  type: "matching";
  question: string;
  chinese: string[];
  vietnamese: string[];
  correctPairs: [number, number][];
};

type WordOrder = {
  type: "word-order";
  question: string;
  words: string[];
  correctOrder: string[];
};

type GrammarFix = {
  type: "grammar-fix";
  question: string;
  incorrectSentence: string;
  correctSentence: string;
  explanation: string;
};

type Question = MCQ | FillBlank | Matching | WordOrder | GrammarFix;

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userInput, setUserInput] = useState("");
  const [selectedPairs, setSelectedPairs] = useState<number[]>([]);
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [correctedSentence, setCorrectedSentence] = useState("");
  const [gamesList, setGamesList] = useState<GameUI[]>([]);
  const [gameQuestions, setGameQuestions] = useState<
    Record<number, Question[]>
  >({});
  const [loading, setLoading] = useState(true);
  const answeredRef = useRef(false);
  const [activeChinese, setActiveChinese] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Hàm ghi lại kết quả game
  const recordGamePlay = useCallback(
    async (
      gameId: number,
      correct: number,
      total: number,
      timeSpent: number
    ) => {
      if (!user) {
        console.log("User not logged in, skipping game record");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/users/${gameId}/play`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            correct,
            total,
            timeSpent,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Game result recorded:", result);

        toast({
          title: "Kết quả đã được lưu!",
          description: `Bạn đã nhận được ${result.xpEarned || correct * 10} XP`,
        });
      } catch (error) {
        console.error("Error recording game play:", error);
        toast({
          title: "Lỗi",
          description: "Không thể lưu kết quả game",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );
  useEffect(() => {
    // reset khi sang câu hỏi mới
    setShowResult(false);
    setIsCorrect(null);
    setCorrectedSentence("");
    setWordOrder([]);
    setSelectedPairs([]);
    setUserInput("");
  }, [currentQuestion]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${BASE_URL}/games`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameFromApi[] = await res.json();

        const normalized: GameUI[] = data.map((g) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          icon: ICON_MAP[g.icon as keyof typeof ICON_MAP] ?? Star,
          difficulty: g.difficulty,
          xpReward: g.xp_reward,
          timeLimit: g.time_limit,
          color: g.color,
          createdAt: g.created_at,
        }));

        setGamesList(normalized);

        const qMap: Record<number, Question[]> = {};
        data.forEach((g) => {
          if (Array.isArray(g.questions)) qMap[g.id] = g.questions;
        });
        setGameQuestions(qMap);
      } catch (error) {
        console.error("Lỗi fetch games:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách game",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [toast]);

  useEffect(() => {
    if (gameFinished && selectedGame) {
      const totalQuestions = getCurrentQuestions().length;
      const correctAnswers = Math.floor(score / 5);
      const totalTime =
        totalQuestions *
          (gamesList.find((g) => g.id === selectedGame)?.timeLimit || 10) -
        timeLeft;

      recordGamePlay(selectedGame, correctAnswers, totalQuestions, totalTime);
    }
  }, [gameFinished, selectedGame, score, timeLeft, gamesList, recordGamePlay]);

  const getCurrentQuestions = () =>
    selectedGame ? gameQuestions[selectedGame] || [] : [];

  const fetchGameDetail = async (gameId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/games/${gameId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: GameFromApi = await res.json();
      return data;
    } catch (error) {
      console.error("Lỗi fetch game detail:", error);
      throw error;
    }
  };

  const startGame = async (gameId: number) => {
    setSelectedGame(gameId);
    setIsPlaying(true);
    setCurrentQuestion(0);
    setScore(0);
    const game = gamesList.find((g) => g.id === gameId);
    setTimeLeft(game?.timeLimit || 10);
    setGameFinished(false);
    resetAnswerStates();

    if (!gameQuestions[gameId]) {
      try {
        const detail = await fetchGameDetail(gameId);
        setGameQuestions((prev) => ({
          ...prev,
          [gameId]: detail.questions || [],
        }));
      } catch (e) {
        console.error("Lỗi fetch game detail:", e);
        setIsPlaying(false);
        toast({
          title: "Lỗi",
          description: "Không thể tải câu hỏi cho game này",
          variant: "destructive",
        });
      }
    }
  };

  const resetAnswerStates = () => {
    setSelectedAnswer(null);
    setUserInput("");
    setSelectedPairs([]);
    setWordOrder([]);
    setCorrectedSentence("");
    answeredRef.current = false;
  };

  const handleAnswer = (answerIndex?: number) => {
    let result = false;
    if (!selectedGame || answeredRef.current) return;
    answeredRef.current = true;

    const qs = getCurrentQuestions();
    const question = qs[currentQuestion];
    if (!question) return;

    let isCorrect = false;

    switch (question.type) {
      case "multiple-choice":
        setSelectedAnswer(answerIndex!);
        // Tìm index của option có is_correct = true
        const correctIndex = question.options.findIndex(
          (opt) => opt.is_correct
        );
        isCorrect = answerIndex === correctIndex;
        break;
      case "fill-blank":
        isCorrect = userInput.trim() === question.blank;
        break;
      case "matching":
        isCorrect = selectedPairs.every((vietIndex, chineseIndex) => {
          // Lấy pair đúng theo chineseIndex
          const correctVietnamese =
            question.matching_pairs[chineseIndex].vietnamese_text;
          const chosenVietnamese =
            question.matching_pairs[vietIndex].vietnamese_text;
          return correctVietnamese === chosenVietnamese;
        });
        break;
      case "word-order":
        const correctOrder = (question.word_order ?? [])
          .sort((a, b) => a.position - b.position) // sắp xếp theo position
          .map((w) => w.word); // chỉ lấy text

        isCorrect = wordOrder.join(" ") === correctOrder.join(" ");
        break;

      case "grammar-fix":
        isCorrect =
          correctedSentence.trim() === (question.correctSentence ?? "").trim();
        break;
    }
    setIsCorrect(isCorrect);
    setShowResult(true);
    if (isCorrect) setScore((s) => s + 5);

    setTimeout(() => {
      if (currentQuestion < qs.length - 1) {
        setCurrentQuestion((i) => i + 1);
        const game = gamesList.find((g) => g.id === selectedGame);
        setTimeLeft(game?.timeLimit || 10);
        resetAnswerStates();
      } else {
        setGameFinished(true);
        setIsPlaying(false);
        answeredRef.current = false;
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!selectedGame) return;
    const qs = getCurrentQuestions();

    if (currentQuestion < qs.length - 1) {
      setCurrentQuestion((i) => i + 1);
      const game = gamesList.find((g) => g.id === selectedGame);
      setTimeLeft(game?.timeLimit || 10);
      resetAnswerStates();
    } else {
      setGameFinished(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0 && !gameFinished) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, gameFinished]);

  const resetGame = () => {
    setSelectedGame(null);
    setIsPlaying(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(10);
    setGameFinished(false);
    resetAnswerStates();
  };

  const handlePairSelection = (
    chineseIndex: number,
    vietnameseIndex: number
  ) => {
    const newPairs = [...selectedPairs];
    newPairs[chineseIndex] = vietnameseIndex;
    setSelectedPairs(newPairs);
  };

  const handleWordClick = (word: string) => {
    if (wordOrder.includes(word)) {
      setWordOrder(wordOrder.filter((w) => w !== word));
    } else {
      setWordOrder([...wordOrder, word]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p className="text-gray-600">Đang tải danh sách game...</p>
      </div>
    );
  }

  if (selectedGame && isPlaying) {
    const questions = gameQuestions[selectedGame] || [];
    const question = questions[currentQuestion];

    if (!question) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={resetGame}>
              Thoát game
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{score} điểm</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span className="font-bold text-red-500">{timeLeft}s</span>
              </div>
            </div>
          </div>

          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="mb-6"
          />

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                Câu {currentQuestion + 1}/{questions.length}
              </CardTitle>
              <CardDescription className="text-lg">
                {question.question}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {question.type === "multiple-choice" && (
                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={option.id}
                      variant={
                        selectedAnswer === null
                          ? "outline"
                          : selectedAnswer === index
                          ? option.is_correct
                            ? "default"
                            : "destructive"
                          : option.is_correct
                          ? "default"
                          : "outline"
                      }
                      className="p-4 h-auto text-left justify-start"
                      onClick={() => {
                        if (!answeredRef.current) handleAnswer(index);
                      }}
                      disabled={selectedAnswer !== null || answeredRef.current}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option.option_text}{" "}
                      {/* Sửa ở đây: hiển thị option_text thay vì object */}
                    </Button>
                  ))}
                </div>
              )}

              {question.type === "fill-blank" && (
                <div className="space-y-4">
                  <div className="text-xl font-mono bg-gray-50 p-4 rounded-lg">
                    {question.sentence.replace(
                      "___",
                      `[${userInput || "___"}]`
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Nhập từ vào đây..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAnswer()}
                    />
                    <Button onClick={() => handleAnswer()}>Xác nhận</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option: any, index) => (
                      <Button
                        key={option.id ?? index}
                        variant="outline"
                        onClick={() => setUserInput(option.option_text)}
                        className="text-sm"
                      >
                        {option.option_text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {question.type === "matching" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cột Tiếng Trung */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Tiếng Trung</h4>
                      {question.matching_pairs.map((pair, index) => (
                        <div
                          key={pair.id}
                          onClick={() => setActiveChinese(index)}
                          className={`p-3 border rounded-lg cursor-pointer ${
                            selectedPairs[index] !== undefined
                              ? "bg-emerald-50 border-emerald-300"
                              : activeChinese === index
                              ? "bg-blue-50 border-blue-400"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {pair.chinese_text}
                          {selectedPairs[index] !== undefined && (
                            <span className="ml-2 text-sm text-emerald-600">
                              →{" "}
                              {
                                question.matching_pairs[selectedPairs[index]]
                                  .vietnamese_text
                              }
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Cột Tiếng Việt */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Tiếng Việt</h4>
                      {question.matching_pairs.map((pair, viIndex) => (
                        <Button
                          key={pair.id}
                          variant="outline"
                          className="w-full justify-start h-auto p-3 bg-transparent"
                          onClick={() => {
                            if (activeChinese !== null) {
                              handlePairSelection(activeChinese, viIndex);
                              setActiveChinese(null);
                            }
                          }}
                          disabled={selectedPairs.includes(viIndex)}
                        >
                          {pair.vietnamese_text}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAnswer()}
                    disabled={
                      selectedPairs.length !== question.matching_pairs.length
                    }
                    className="w-full"
                  >
                    Xác nhận ghép cặp
                  </Button>
                </div>
              )}

              {question.type === "word-order" && (
                <div className="space-y-4">
                  <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Câu của bạn:</p>
                    <div className="flex flex-wrap gap-2">
                      {wordOrder.map((word, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="cursor-pointer"
                          onClick={() =>
                            setWordOrder(
                              wordOrder.filter((_, i) => i !== index)
                            )
                          }
                        >
                          {word} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(question.word_order ?? []).map((w, index) => (
                      <Button
                        key={w.id ?? index}
                        variant={
                          wordOrder.includes(w.word) ? "secondary" : "outline"
                        }
                        onClick={() => handleWordClick(w.word)}
                        disabled={wordOrder.includes(w.word)}
                      >
                        {w.word}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleAnswer()}
                    disabled={
                      wordOrder.length !== (question.word_order?.length ?? 0)
                    }
                    className="w-full"
                  >
                    Xác nhận thứ tự
                  </Button>
                </div>
              )}

              {question.type === "grammar-fix" && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 mb-2">Câu có lỗi:</p>
                    <p className="font-mono text-lg">
                      {question.incorrectSentence}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={correctedSentence}
                      onChange={(e) => setCorrectedSentence(e.target.value)}
                      placeholder="Nhập câu đã sửa..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAnswer()}
                    />
                    {showResult && isCorrect === false && (
                      <p className="text-sm text-red-600 mt-2">
                        ❌ Sai rồi. Đáp án đúng:{" "}
                        <span className="font-mono">
                          {question.correctSentence}
                        </span>
                        <br />
                        Giải thích: {question.explanation}
                      </p>
                    )}

                    {showResult && isCorrect === true && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ Chính xác!
                      </p>
                    )}

                    <Button onClick={() => handleAnswer()}>Xác nhận</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const finalXP = Math.floor(score * 1.5);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl">Hoàn thành!</CardTitle>
              <CardDescription>
                Bạn đã hoàn thành trò chơi{" "}
                {gamesList.find((g) => g.id === selectedGame)?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                  <p className="text-sm text-gray-600">Điểm số</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">
                    +{finalXP}
                  </p>
                  <p className="text-sm text-gray-600">XP nhận được</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => startGame(selectedGame as number)}>
                  Chơi lại
                </Button>
                <Button
                  variant="outline"
                  onClick={resetGame}
                  className="flex-1 bg-transparent"
                >
                  Về trang chính
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mini Games</h1>
        <p className="text-gray-600">
          Học tiếng Trung qua các trò chơi thú vị và kiếm XP
        </p>
      </div>

      {/* Daily Challenge
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Thử thách hàng ngày
          </CardTitle>
          <CardDescription>
            Hoàn thành để nhận phần thưởng đặc biệt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Trả lời đúng 20 câu hỏi ngữ pháp</p>
              <p className="text-sm text-gray-600">Tiến độ: 12/20 câu</p>
              <Progress value={60} className="w-64 mt-2" />
            </div>
            <div className="text-right">
              <Badge className="bg-purple-500 hover:bg-purple-600 mb-2">
                +200 XP
              </Badge>
              <p className="text-sm text-gray-600">Phần thưởng</p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {gamesList.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Độ khó:</span>
                    <Badge
                      variant={
                        game.difficulty === "Dễ"
                          ? "secondary"
                          : game.difficulty === "Trung bình"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {game.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">{game.timeLimit}s/câu</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phần thưởng:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">+{game.xpReward} XP</span>
                    </div>
                  </div>
                  <Button onClick={() => startGame(game.id)} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Chơi ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Scores
      <Card>
        <CardHeader>
          <CardTitle>Điểm số gần đây</CardTitle>
          <CardDescription>Lịch sử chơi game của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                game: "Tốc độ ánh sáng",
                score: 85,
                xp: 127,
                time: "2 giờ trước",
              },
              {
                game: "Điền từ tốc độ",
                score: 92,
                xp: 138,
                time: "1 ngày trước",
              },
              { game: "Sắp xếp từ", score: 78, xp: 117, time: "2 ngày trước" },
            ].map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{record.game}</p>
                  <p className="text-sm text-gray-600">{record.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{record.score} điểm</p>
                  <p className="text-sm text-emerald-600">+{record.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
