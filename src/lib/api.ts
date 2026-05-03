// lib/api.ts
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function getCourseById(courseId: string) {
  try {
    const res = await axios.get(`${API_BASE}/courses/${courseId}`);
    if (res.status === 200) {
      return res.data.data; // assume backend structure { data: course }
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch course:", err);
    return null;
  }
}
