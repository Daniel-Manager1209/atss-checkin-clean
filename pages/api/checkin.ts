import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase/firebase";
import { ref, get, set, child } from "firebase/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, timestamp, userAgent } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  const attendancePath = `attendance/${today}/${name}`;

  try {
    const snapshot = await get(child(ref(db), attendancePath));
    if (snapshot.exists()) {
      return res.status(200).json({ message: "이미 출석이 기록되어 있습니다." });
    }

    await set(ref(db, attendancePath), {
      timestamp,
      userAgent
    });

    res.status(200).json({ message: "출석이 저장되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "출석 저장 중 오류 발생" });
  }
}