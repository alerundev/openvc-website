"use client";

import { useState, useRef, useEffect } from "react";

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestModal({ isOpen, onClose }: InvestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setFile(null);
    setFileError("");
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    if (selected.size > MAX_SIZE) {
      setFileError("용량이 초과되었습니다. 20MB 이하의 PDF 파일을 업로드해주세요.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selected.type !== "application/pdf") {
      setFileError("PDF 형식의 파일만 업로드 가능합니다.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileError("");
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      if (file) formData.append("file", file);

      const res = await fetch("/api/invest", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        resetForm();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-black mb-2">투자 문의</h2>
        <p className="text-gray-500 text-sm mb-8">
          IR 자료와 함께 문의주시면 빠르게 검토 후 연락드리겠습니다.
        </p>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-black mb-2">문의가 접수되었습니다!</h3>
            <p className="text-gray-500 text-sm mb-6">
              검토 후 영업일 기준 2~3일 내로 연락드리겠습니다.
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="홍길동"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="010-0000-0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hello@company.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                IR 자료 <span className="text-gray-400 font-normal">(PDF, 최대 20MB)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-all ${
                  file
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">📄</span>
                    <span className="text-sm font-medium text-black truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">클릭하여 파일 선택</p>
                    <p className="text-xs text-gray-400 mt-1">PDF 형식, 최대 20MB</p>
                  </div>
                )}
              </div>
              {fileError && (
                <p className="text-red-500 text-xs mt-2">{fileError}</p>
              )}
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center">
                전송에 실패했습니다. 잠시 후 다시 시도해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-medium py-3.5 rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "전송 중..." : "문의 보내기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
