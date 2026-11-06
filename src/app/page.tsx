"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { categoryApi } from "@/lib/api/categories";
import { mapApi } from "@/lib/api/map";

export default function HomePage() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [categories, setCategories] = useState<string[]>([]);
  const [pinCount, setPinCount] = useState(0);

  useEffect(() => {
    const run = async () => {
      try {
        // 1. Health check
        await apiClient.get("/health");
        // 2. Categories
        const cats = await categoryApi.getAll();
        setCategories(cats.map((c) => c.name));
        // 3. Map pins
        const pins = await mapApi.getPins();
        setPinCount(pins.length);
        setStatus("ok");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    };
    run();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-amber-50">
      <h1 className="text-4xl font-bold text-amber-900">
        🏺 vCraft — Gốm Bát Tràng
      </h1>

      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">Kiểm tra kết nối Backend</h2>

        {status === "loading" && (
          <p className="text-gray-400 animate-pulse">Đang kiểm tra...</p>
        )}

        {status === "ok" && (
          <>
            <p className="text-green-600 font-medium">✅ Backend kết nối thành công!</p>
            <p className="text-sm text-gray-600">📦 Danh mục ({categories.length}): {categories.join(", ")}</p>
            <p className="text-sm text-gray-600">📍 Nghệ nhân trên bản đồ: {pinCount}</p>
          </>
        )}

        {status === "error" && (
          <p className="text-red-500 font-medium">
            ❌ Không kết nối được backend. <br />
            Hãy chắc chắn Docker đang chạy tại localhost:8080.
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Backend API: {process.env.NEXT_PUBLIC_API_URL}
      </p>
    </main>
  );
}
