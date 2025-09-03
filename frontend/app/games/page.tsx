"use client";

import { useState, useEffect, useRef } from "react";
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
  icon: React.ComponentType<any>; // mapped component
  difficulty: string;
  xpReward: number;
  timeLimit: number;
  color: string;
  createdAt: string;
};
type MCQ = {
  type: "multiple-choice";
  question: string;
  options: string[];
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

// const games = [
//   {
//     id: 1,
//     title: "Tốc độ ánh sáng",
//     description: "Trả lời nhanh các câu hỏi ngữ pháp trong 10 giây",
//     icon: Zap,
//     difficulty: "Dễ",
//     xpReward: 50,
//     timeLimit: 10,
//     color: "bg-yellow-500",
//   },
//   {
//     id: 2,
//     title: "Điền từ tốc độ",
//     description: "Điền từ vào chỗ trống trong câu tiếng Trung",
//     icon: Edit,
//     difficulty: "Trung bình",
//     xpReward: 75,
//     timeLimit: 15,
//     color: "bg-blue-500",
//   },
//   {
//     id: 3,
//     title: "Nối câu nhanh",
//     description: "Ghép đúng câu tiếng Trung với nghĩa tiếng Việt",
//     icon: Link,
//     difficulty: "Trung bình",
//     xpReward: 75,
//     timeLimit: 12,
//     color: "bg-green-500",
//   },
//   {
//     id: 4,
//     title: "Sắp xếp từ",
//     description: "Sắp xếp các từ thành câu đúng ngữ pháp",
//     icon: Shuffle,
//     difficulty: "Khó",
//     xpReward: 100,
//     timeLimit: 20,
//     color: "bg-purple-500",
//   },
//   {
//     id: 5,
//     title: "Sửa lỗi tốc độ",
//     description: "Tìm và sửa lỗi ngữ pháp trong câu",
//     icon: Target,
//     difficulty: "Khó",
//     xpReward: 100,
//     timeLimit: 18,
//     color: "bg-red-500",
//   },
//   {
//     id: 6,
//     title: "Đấu 1v1",
//     description: "Thách đấu với người chơi khác trong thời gian thực",
//     icon: Users,
//     difficulty: "Khó",
//     xpReward: 150,
//     timeLimit: 30,
//     color: "bg-orange-500",
//   },
// ];

// const gameQuestions: Record<number, Question[]> = {
//   1: [
//     // Multiple choice
//     {
//       type: "multiple-choice",
//       question: 'Từ "你好" có nghĩa là gì?',
//       options: ["Tạm biệt", "Xin chào", "Cảm ơn", "Xin lỗi"],
//       correct: 1,
//     },
//     {
//       type: "multiple-choice",
//       question: 'Cách nói "Tôi yêu bạn" trong tiếng Trung là?',
//       options: ["我爱你", "我喜欢你", "我想你", "我需要你"],
//       correct: 0,
//     },
//     {
//       type: "multiple-choice",
//       question: 'Từ "学习" có nghĩa là gì?',
//       options: ["Làm việc", "Học tập", "Chơi", "Nghỉ ngơi"],
//       correct: 1,
//     },
//   ],
//   2: [
//     // Fill in the blank
//     {
//       type: "fill-blank",
//       question: "我___学生。(Tôi là học sinh)",
//       sentence: "我___学生。",
//       blank: "是",
//       options: ["是", "在", "有", "会"],
//     },
//     {
//       type: "fill-blank",
//       question: "他___中国人。(Anh ấy là người Trung Quốc)",
//       sentence: "他___中国人。",
//       blank: "是",
//       options: ["是", "在", "有", "会"],
//     },
//     {
//       type: "fill-blank",
//       question: "我___北京。(Tôi ở Bắc Kinh)",
//       sentence: "我___北京。",
//       blank: "在",
//       options: ["是", "在", "有", "会"],
//     },
//   ],
//   3: [
//     // Sentence matching
//     {
//       type: "matching",
//       question: "Ghép câu tiếng Trung với nghĩa tiếng Việt:",
//       chinese: ["你好吗？", "我很好", "谢谢你"],
//       vietnamese: ["Cảm ơn bạn", "Bạn khỏe không?", "Tôi rất khỏe"],
//       correctPairs: [
//         [0, 1],
//         [1, 2],
//         [2, 0],
//       ], // chinese[0] matches vietnamese[1], etc.
//     },
//     {
//       type: "matching",
//       question: "Ghép câu tiếng Trung với nghĩa tiếng Việt:",
//       chinese: ["我爱你", "再见", "对不起"],
//       vietnamese: ["Xin lỗi", "Tạm biệt", "Tôi yêu bạn"],
//       correctPairs: [
//         [0, 2],
//         [1, 1],
//         [2, 0],
//       ],
//     },
//   ],
//   4: [
//     // Word ordering
//     {
//       type: "word-order",
//       question: "Sắp xếp các từ thành câu đúng: 'Tôi là học sinh'",
//       words: ["学生", "我", "是"],
//       correctOrder: ["我", "是", "学生"],
//     },
//     {
//       type: "word-order",
//       question: "Sắp xếp các từ thành câu đúng: 'Anh ấy ở Trung Quốc'",
//       words: ["中国", "在", "他"],
//       correctOrder: ["他", "在", "中国"],
//     },
//     {
//       type: "word-order",
//       question: "Sắp xếp các từ thành câu đúng: 'Tôi học tiếng Trung'",
//       words: ["中文", "学", "我"],
//       correctOrder: ["我", "学", "中文"],
//     },
//   ],
//   5: [
//     // Grammar correction
//     {
//       type: "grammar-fix",
//       question: "Tìm và sửa lỗi trong câu sau:",
//       incorrectSentence: "我在是学生",
//       correctSentence: "我是学生",
//       explanation: "Không cần dùng '在' trước '是' khi nói về nghề nghiệp",
//     },
//     {
//       type: "grammar-fix",
//       question: "Tìm và sửa lỗi trong câu sau:",
//       incorrectSentence: "他很喜欢很中文",
//       correctSentence: "他很喜欢中文",
//       explanation: "Không cần dùng hai '很' trong cùng một câu",
//     },
//     {
//       type: "grammar-fix",
//       question: "Tìm và sửa lỗi trong câu sau:",
//       incorrectSentence: "我有在北京",
//       correctSentence: "我在北京",
//       explanation: "Dùng '在' để chỉ vị trí, không cần '有'",
//     },
//   ],
// };

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

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${BASE_URL}/games`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameFromApi[] = await res.json();

        // Chuẩn hoá về camelCase + map icon
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

        // nếu /games trả kèm questions trong từng game, preload vào map
        const qMap: Record<number, Question[]> = {};
        data.forEach((g) => {
          if (Array.isArray(g.questions)) qMap[g.id] = g.questions;
        });
        setGameQuestions(qMap);
      } catch (error) {
        console.error("Lỗi fetch games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const games = gamesList;
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0 && !gameFinished) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, gameFinished]);
  const fetchGameDetail = async (gameId: number) => {
    const res = await fetch(`${BASE_URL}/games/${gameId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: GameFromApi = await res.json();
    return data;
  };
  const getCurrentQuestions = () =>
    selectedGame ? gameQuestions[selectedGame] || [] : [];

  const startGame = async (gameId: number) => {
    setSelectedGame(gameId);
    setIsPlaying(true);
    setCurrentQuestion(0);
    setScore(0);
    const limit = games.find((g) => g.id === gameId)?.timeLimit || 10;
    setTimeLeft(games.find((g) => g.id === gameId)?.timeLimit || 10);
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
        // nếu lỗi, dừng game
        setIsPlaying(false);
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
    if (!selectedGame) return;

    if (answeredRef.current) return;
    answeredRef.current = true;

    const qs = getCurrentQuestions();
    const question = qs[currentQuestion];
    if (!question) return;

    let isCorrect = false;

    switch (question.type) {
      case "multiple-choice": {
        setSelectedAnswer(answerIndex!);
        const option = question.options[answerIndex!];
        isCorrect = option?.is_correct === true;
        break;
      }
      case "fill-blank":
        isCorrect = userInput.trim() === (question as any).blank;
        break;
      case "matching":
        isCorrect =
          selectedPairs.filter((v) => v !== undefined).length ===
            question.matching_pairs.length &&
          selectedPairs.every((vietIndex, chineseIndex) => {
            const chineseItem = question.matching_pairs[chineseIndex];
            const vietnameseItem = question.matching_pairs[vietIndex];
            return (
              chineseItem &&
              vietnameseItem &&
              chineseItem.pair_index === vietnameseItem.pair_index
            );
          });
        break;
      case "word-order":
        const correctOrder = (question.word_order || [])
          .sort((a, b) => a.position - b.position)
          .map((item) => item.word);

        isCorrect =
          wordOrder.length === correctOrder.length &&
          wordOrder.every((word, index) => word === correctOrder[index]);

        break;
      case "grammar-fix":
        isCorrect =
          correctedSentence.trim() === (question as any).correctSentence;
        break;
    }

    if (isCorrect) setScore((s) => s + 5);

    setTimeout(() => {
      if (currentQuestion < qs.length - 1) {
        setCurrentQuestion((i) => i + 1);
        const limit = games.find((g) => g.id === selectedGame)?.timeLimit || 10;
        setTimeLeft(limit);
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
      const limit = games.find((g) => g.id === selectedGame)?.timeLimit || 10;
      setTimeLeft(limit);
      resetAnswerStates();
    } else {
      setGameFinished(true);
      setIsPlaying(false);
    }
  };

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

  const handleWordClick = (word: string, index: number) => {
    if (wordOrder.includes(word)) {
      setWordOrder(wordOrder.filter((w) => w !== word));
    } else {
      setWordOrder([...wordOrder, word]);
    }
  };

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
                {question.questionText}
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
                          ? index ===
                            (question as any).options.findIndex(
                              (o) => o.is_correct
                            )
                            ? "default"
                            : "destructive"
                          : (question as any).options[index].is_correct
                          ? "default"
                          : "outline"
                      }
                      className={`p-4 h-auto text-left justify-start`}
                      onClick={() => {
                        if (!answeredRef.current) handleAnswer(index);
                      }}
                      disabled={selectedAnswer !== null || answeredRef.current}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option.option_text}
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
                    {question.options.map((option, index) => (
                      <Button
                        key={index}
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
                          key={index}
                          onClick={() => setActiveChinese(index)} // chọn Chinese
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
                      {question.matching_pairs.map((pair, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start h-auto p-3 bg-transparent"
                          onClick={() => {
                            if (
                              activeChinese !== null &&
                              selectedPairs[activeChinese] === undefined
                            ) {
                              handlePairSelection(activeChinese, index);
                              setActiveChinese(null); // reset sau khi ghép xong
                            }
                          }}
                          disabled={selectedPairs.includes(index)}
                        >
                          {pair.vietnamese_text}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Nút xác nhận */}
                  <Button
                    onClick={() => handleAnswer()}
                    disabled={
                      selectedPairs.filter((v) => v !== undefined).length !==
                      question.matching_pairs.length
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
                    {(question.word_order || []).map((item, index) => (
                      <Button
                        key={item.id}
                        variant={
                          wordOrder.includes(item.word)
                            ? "secondary"
                            : "outline"
                        }
                        onClick={() => handleWordClick(item.word, index)}
                        disabled={wordOrder.includes(item.word)}
                      >
                        {item.word}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleAnswer()}
                    disabled={wordOrder.length !== question.word_order.length}
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
                {games.find((g) => g.id === selectedGame)?.title}
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
                <Button
                  onClick={async () => await startGame(selectedGame as number)}
                >
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

      {/* Daily Challenge */}
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
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {games.map((game) => {
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

      {/* Recent Scores */}
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
      </Card>
    </div>
  );
}
