"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  onInvestClick: () => void;
}

export default function Navbar({ onInvestClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-semibold tracking-tight text-black">
          Open VC
        </a>
        <div className="flex items-center gap-8">
          <a
            href="#about"
            className="text-sm text-gray-500 hover:text-black transition-colors hidden md:block"
          >
            소개
          </a>
          <a
            href="#focus"
            className="text-sm text-gray-500 hover:text-black transition-colors hidden md:block"
          >
            투자 분야
          </a>
          <a
            href="#portfolio"
            className="text-sm text-gray-500 hover:text-black transition-colors hidden md:block"
          >
            포트폴리오
          </a>
          <button
            onClick={onInvestClick}
            className="bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            투자 문의
          </button>
        </div>
      </div>
    </nav>
  );
}
