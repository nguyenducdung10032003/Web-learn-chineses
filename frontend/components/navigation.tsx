"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BookOpen,
  CreditCard,
  Gamepad2,
  Trophy,
  Star,
  Target,
  Users,
  ShoppingCart,
  Bot,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";

const coreItems = [
  { href: "/games", label: "Mini Games", icon: Gamepad2 },
  // { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/flashcards", label: "Flashcard", icon: CreditCard },
  { href: "/ai-tutor", label: "Trợ lý AI", icon: Bot },
];

const achievementItems = [
  { href: "/achievements", label: "Thành tích", icon: Trophy },
  { href: "/leaderboard", label: "Bảng xếp hạng", icon: Star },
  { href: "/missions", label: "Nhiệm vụ", icon: Target, badge: "3" },
];

const socialItems = [
  { href: "/courses", label: "Khóa học", icon: BookOpen },
  { href: "/community", label: "Cộng đồng", icon: Users },
  { href: "/shop", label: "Cửa hàng", icon: ShoppingCart },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  if (loading) {
    return null;
  }

  const NavLink = ({ href, label, icon: Icon, badge }: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-emerald-100 text-emerald-700 font-medium"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {badge && (
          <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-xs">
            {badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">中</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              ChineseMaster
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {user && (
              <NavLink href="/dashboard" label="Dashboard" icon={Home} />
            )}
            {coreItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            {user && (
              <>
                {/* Nhóm thành tích (DropdownMenu shadcn) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 mr-1" /> Thành tích{" "}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-56 p-1"
                  >
                    {achievementItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Nhóm xã hội (DropdownMenu shadcn) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                      <Users className="h-4 w-4 mr-1" /> Cộng đồng{" "}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-56 p-1"
                  >
                    {socialItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {!loading &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> Hồ sơ{" "}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 p-1"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center w-full"
                      >
                        <User className="h-4 w-4 mr-2" /> Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="h-4 w-4 mr-2" /> Cài đặt
                  </Link>
                </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                      }}
                      className="flex items-center w-full cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </>
              ))}
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">中</span>
                    </div>
                    ChineseMaster
                  </SheetTitle>
                  <SheetDescription>
                    Điều hướng ứng dụng học tiếng Trung
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg mb-4">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-gray-900">2,450 XP</span>
                    <Badge className="ml-auto">Level 12</Badge>
                  </div>

                  {/* Nhóm core */}
                  <div>
                    <h4 className="font-semibold mb-2">Chính</h4>
                    {user && (
                      <NavLink
                        href="/dashboard"
                        label="Dashboard"
                        icon={Home}
                      />
                    )}
                    {coreItems.map((item) => (
                      <NavLink key={item.href} {...item} />
                    ))}
                  </div>

                  {/* Nhóm thành tích */}
                  <div>
                    <h4 className="font-semibold mb-2">Thành tích</h4>
                    {achievementItems.map((item) => (
                      <NavLink key={item.href} {...item} />
                    ))}
                  </div>

                  {/* Nhóm xã hội */}
                  <div>
                    <h4 className="font-semibold mb-2">Cộng đồng</h4>
                    {socialItems.map((item) => (
                      <NavLink key={item.href} {...item} />
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    {user ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/dashboard">
                          <User className="h-4 w-4 mr-3" />
                          Hồ sơ cá nhân
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Đăng nhập
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                            Đăng ký
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
