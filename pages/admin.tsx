import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, get, child } from "firebase/database";

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchData = async () => {
      try {
        const snapshot = await get(child(ref(db), `attendance/${today}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(([name, value]) => ({
            name,
            ...(value as object)
          }));
          setRecords(list);
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.error("불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 오늘의 출석 현황</h1>
      {loading ? (
        <p>불러오는 중...</p>
      ) : records.length === 0 ? (
        <p>출석 기록이 없습니다.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">이름</th>
              <th className="border p-2">시간</th>
              <th className="border p-2">기기 정보</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx} className="border-b">
                <td className="border p-2">{rec.name}</td>
                <td className="border p-2">
                  {
