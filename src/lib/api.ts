// lib/api.ts
import axios from "axios";

const API_BASE = typeof window !== "undefined" ? "/api" : `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getCourseById(slug: string) {
  try {
    const res = await axios.get(`${API_BASE}/courses/${slug}`);
    if (res.status === 200) {
      return res.data.data; // assume backend structure { data: course }
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch course:", err);
    return null;
  }
}
