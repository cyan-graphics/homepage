import { headers } from "next/headers";
import BlogClient from "./BlogClient";

async function getData() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const response = await fetch(`${protocol}://${host}/api/posts?visible=true`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const error = payload.code === "MONGODB_NOT_CONFIGURED"
        ? "博客数据库尚未配置。请在 .env.local 中设置 MONGODB_URI，然后重启开发服务器。"
        : "文章暂时无法加载，请稍后重试。";
      return { posts: [], error };
    }

    const payload = await response.json();
    if (!Array.isArray(payload)) {
      return { posts: [], error: "文章数据格式异常，请稍后重试。" };
    }

    return { posts: payload, error: "" };
  } catch {
    return { posts: [], error: "文章服务暂时不可用，请稍后重试。" };
  }
}

export default async function Blog() {
  const { posts, error } = await getData();
  return <BlogClient data={posts} error={error} />;
}
