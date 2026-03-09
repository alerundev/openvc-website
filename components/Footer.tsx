interface FooterProps {
  onInvestClick: () => void;
}

export default function Footer({ onInvestClick }: FooterProps) {
  return (
    <footer className="bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            당신의 아이디어가
            <br />
            <span className="text-gray-500">세상을 바꿀 수 있습니다.</span>
          </h2>
          <button
            onClick={onInvestClick}
            className="bg-white text-black font-medium px-8 py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            투자 문의하기
          </button>
        </div>

        <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xl font-semibold">Open VC</p>
          <p className="text-sm text-gray-500">
            서울특별시 강남구 테헤란로 123, 오픈VC빌딩
          </p>
          <p className="text-sm text-gray-600">
            © 2024 Open VC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
