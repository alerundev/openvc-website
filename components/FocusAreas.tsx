const areas = [
  {
    icon: "🔬",
    title: "Deep Tech",
    desc: "AI, 바이오, 반도체, 양자컴퓨팅 등 기술 기반의 깊은 해자를 가진 기업에 투자합니다.",
    tags: ["AI / ML", "바이오테크", "반도체", "양자컴퓨팅"],
  },
  {
    icon: "🛍️",
    title: "Consumer",
    desc: "새로운 소비 패턴을 만들어내는 브랜드와 플랫폼. 사람들의 일상을 바꾸는 서비스에 주목합니다.",
    tags: ["이커머스", "푸드테크", "헬스케어", "라이프스타일"],
  },
  {
    icon: "📊",
    title: "B2B SaaS",
    desc: "기업의 생산성을 높이는 소프트웨어. 반복 가능한 수익 모델과 강한 네트워크 효과를 가진 팀을 선호합니다.",
    tags: ["HR Tech", "핀테크", "물류", "협업 툴"],
  },
];

export default function FocusAreas() {
  return (
    <section id="focus" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-4">
            Investment Focus
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
            우리가 집중하는 분야
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div
              key={area.title}
              className="bg-[#f5f5f7] rounded-3xl p-8 hover:bg-gray-100 transition-colors group"
            >
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-2xl font-bold text-black mb-3">{area.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6">{area.desc}</p>
              <div className="flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-white text-gray-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
