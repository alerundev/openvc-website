const companies = [
  { name: "NeuralPath", stage: "Series B", sector: "AI / ML", desc: "기업용 AI 워크플로우 자동화 플랫폼" },
  { name: "GreenLoop", stage: "Series A", sector: "클라이밋테크", desc: "탄소 발자국 측정 및 감축 SaaS" },
  { name: "Mediflow", stage: "Series C", sector: "헬스케어", desc: "AI 기반 원격 진료 및 건강 관리" },
  { name: "Stackly", stage: "Seed", sector: "B2B SaaS", desc: "개발팀을 위한 인프라 비용 최적화 툴" },
  { name: "BiteBox", stage: "Series A", sector: "푸드테크", desc: "구독형 신선 식재료 배달 서비스" },
  { name: "Logiqs", stage: "Series B", sector: "물류", desc: "AI 기반 실시간 물류 최적화 플랫폼" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 px-6 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            함께 성장한 기업들
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-3xl p-7 hover:shadow-lg transition-all hover:-translate-y-1 cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600">
                  {c.name[0]}
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {c.stage}
                </span>
              </div>
              <h3 className="text-xl font-bold text-black mb-1">{c.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{c.sector}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
