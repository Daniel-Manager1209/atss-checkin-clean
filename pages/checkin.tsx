import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckInPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState("출석을 기록 중입니다...");

  useEffect(() => {
    const name = params.get("name") || "Unknown";
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;

    fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, timestamp, userAgent }),
    })
      .then(() => setStatus(`✅ ${name}님의 출석이 완료되었습니다.`))
      .catch(() => setStatus("❌ 출석 기록에 실패했습니다. 다시 시도해주세요."));
  }, [params]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-xl font-bold mb-4">ATSS 출석 시스템</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}