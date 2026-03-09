export default function About() {
  return (
    <section id="about" className="py-32 px-6 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-blue-600 tracking-widest uppercase mb-4">
              About
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight mb-6">
              혁신의 시작점에서
              <br />
              함께합니다.
            </h2>
          </div>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              Open VC는 2012년에 설립된 한국의 대표 벤처캐피탈로, 스타트업 생태계의 
              성장과 함께 걸어온 파트너입니다.
            </p>
            <p>
              딥테크, 소비자 서비스, B2B SaaS 등 다양한 영역에서 시드부터 시리즈 C까지 
              투자하며, 단순한 자금 지원을 넘어 전략적 파트너로서의 역할을 다합니다.
            </p>
            <p>
              우리는 숫자보다 사람을 먼저 봅니다. 세상을 바꾸겠다는 강한 신념과 
              실행력을 가진 팀이라면, 언제든 문을 두드려주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
