"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import { BASE_URL } from "@/constants";

export default function CreateFlashcardPage() {
  const [deckInfo, setDeckInfo] = useState({
    title: "",
    description: "",
    category: "Cá nhân",
  });

  const [cards, setCards] = useState([
    { id: 1, chinese: "", pinyin: "", vietnamese: "" },
  ]);

  const [previewCard, setPreviewCard] = useState<number | null>(null);

  const addCard = () => {
    const newCard = {
      id: cards.length + 1,
      chinese: "",
      pinyin: "",
      vietnamese: "",
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const updateCard = (id: number, field: string, value: string) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const updateDeckInfo = (field: string, value: string) => {
    setDeckInfo({ ...deckInfo, [field]: value });
  };

  const saveDeck = async () => {
    if (!deckInfo.title.trim()) {
      alert("Vui lòng nhập tên bộ thẻ");
      return;
    }

    const validCards = cards
      .filter((card) => card.chinese.trim() && card.vietnamese.trim())
      .map(({ id, ...rest }) => rest);

    try {
      const res = await fetch(`${BASE_URL}/decks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // 👈 lấy token đã login
        },
        body: JSON.stringify({
          ...deckInfo,
          flashcards: validCards,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save deck");
      }

      const data = await res.json();
      alert(
        `✅ Đã tạo bộ thẻ "${data.title}" với ${data.flashcards.length} thẻ!`
      );
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu bộ thẻ");
    }
  };

  const previewDeck = () => {
    console.log("Preview deck:", { deckInfo, cards });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/flashcards"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Tạo bộ thẻ mới</h1>
              <p className="text-sm text-muted-foreground">
                Tạo bộ flashcard cá nhân của bạn
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={previewDeck}>
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </Button>
            <Button onClick={saveDeck}>
              <Save className="h-4 w-4 mr-2" />
              Lưu bộ thẻ
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Deck Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Thông tin bộ thẻ</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản cho bộ flashcard của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên bộ thẻ *</Label>
                <Input
                  id="title"
                  placeholder="Ví dụ: Từ vựng HSK 1"
                  value={deckInfo.title}
                  onChange={(e) => updateDeckInfo("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Input
                  id="category"
                  placeholder="Ví dụ: HSK, Thường dùng"
                  value={deckInfo.category}
                  onChange={(e) => updateDeckInfo("category", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn về bộ thẻ này..."
                value={deckInfo.description}
                onChange={(e) => updateDeckInfo("description", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Thẻ flashcard</CardTitle>
                <CardDescription>Tạo các thẻ học từ vựng</CardDescription>
              </div>
              <Badge variant="secondary">{cards.length} thẻ</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {cards.map((card, index) => (
              <Card key={card.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Thẻ {index + 1}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPreviewCard(previewCard === card.id ? null : card.id)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCard(card.id)}
                      disabled={cards.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tiếng Trung *</Label>
                    <Input
                      placeholder="你好"
                      value={card.chinese}
                      onChange={(e) =>
                        updateCard(card.id, "chinese", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinyin</Label>
                    <Input
                      placeholder="nǐ hǎo"
                      value={card.pinyin}
                      onChange={(e) =>
                        updateCard(card.id, "pinyin", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tiếng Việt *</Label>
                    <Input
                      placeholder="Xin chào"
                      value={card.vietnamese}
                      onChange={(e) =>
                        updateCard(card.id, "vietnamese", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Preview */}
                {previewCard === card.id &&
                  (card.chinese || card.vietnamese) && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {card.chinese || "..."}
                        </div>
                        {card.pinyin && (
                          <div className="text-muted-foreground">
                            {card.pinyin}
                          </div>
                        )}
                        <div className="text-lg">
                          {card.vietnamese || "..."}
                        </div>
                      </div>
                    </div>
                  )}
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addCard}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thẻ mới
            </Button>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/flashcards">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button onClick={saveDeck} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Lưu bộ thẻ (
            {
              cards.filter((c) => c.chinese.trim() && c.vietnamese.trim())
                .length
            }{" "}
            thẻ)
          </Button>
        </div>
      </div>
    </div>
  );
}
