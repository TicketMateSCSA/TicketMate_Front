const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include", // 쿠키 포함 필수 (for 세션 로그인 구현)
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = response.json();

  return data;
}
