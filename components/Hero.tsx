interface HeroProps {
  onInvestClick: () => void;
}

export default function Hero({ onInvestClick }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 bg-white">
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-6">
          Venture Capital
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight mb-6">
          미래를 만드는 기업에
          <br />
          <span className="text-gray-400">투자합니다.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Open VC는 한국의 차세대 혁신 기업을 발굴하고,
          <br className="hidden md:block" />
          그들의 성장 여정에 함께합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onInvestClick}
            className="bg-black text-white font-medium px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
          >
            투자 문의하기
          </button>
          <a
            href="#portfolio"
            className="bg-gray-100 text-black font-medium px-8 py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
          >
            포트폴리오 보기
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-24 grid grid-cols-3 gap-12 border-t border-gray-100 pt-12 w-full max-w-2xl animate-fade-up">
        {[
          { value: "120+", label: "투자 기업" },
          { value: "₩8,000억", label: "운용 자산" },
          { value: "12년", label: "운용 경험" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-black">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
