"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { marked } from "marked";
import PostImage from "@/components/PostImage/PostImage";
import styles from "./page.module.css";

const EMPTY_POST = {
  title: "",
  desc: "",
  img: "",
  tag: "",
  externalArticle: false,
  showInBlog: true,
  isQuote: false,
  content: "",
};

async function fetcher(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("文章列表加载失败");
  return response.json();
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState(EMPTY_POST);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/dashboard/login");
  }, [router, status]);

  const username = session?.user?.name;
  const { data: posts = [], mutate, error, isLoading } = useSWR(
    status === "authenticated" && username
      ? `/api/posts?username=${encodeURIComponent(username)}`
      : null,
    fetcher,
    { keepPreviousData: true }
  );

  const previewDocument = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>body{font:16px/1.65 system-ui;margin:24px;color:#222}img{max-width:100%;height:auto}pre{overflow:auto;padding:14px;background:#f4f4f4;border-radius:4px}code{font-family:monospace}</style></head><body>${marked.parse(formData.content || "")}</body></html>`,
    [formData.content]
  );

  const availableTags = useMemo(
    () => [...new Set(posts.map((post) => post.tag?.trim()).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second)),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const query = tagQuery.trim().toLocaleLowerCase();
    if (!query) return posts;
    return posts.filter((post) => post.tag?.toLocaleLowerCase().includes(query));
  }, [posts, tagQuery]);

  function changeField(event) {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function startCreate() {
    setEditingId(null);
    setFormData(EMPTY_POST);
    setMessage("");
    setShowPreview(false);
  }

  function startEdit(post) {
    setEditingId(post._id);
    setFormData({
      title: post.title || "",
      desc: post.desc || "",
      img: post.img || "",
      tag: post.tag || "",
      externalArticle: Boolean(post.externalArticle),
      showInBlog: post.showInBlog !== false,
      isQuote: Boolean(post.isQuote),
      content: post.content || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function savePost(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, username }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "保存失败");
      await mutate();
      setMessage(editingId ? "文章已更新" : "文章已创建");
      if (!editingId) setFormData(EMPTY_POST);
    } catch (saveError) {
      setMessage(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post) {
    if (!window.confirm(`确定删除《${post.title}》吗？此操作无法撤销。`)) return;
    setDeletingId(post._id);
    setMessage("");
    try {
      const response = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "删除失败，请稍后重试");
      await mutate(posts.filter((item) => item._id !== post._id), { revalidate: false });
      if (editingId === post._id) startCreate();
      setMessage("文章已删除");
    } catch (deleteError) {
      setMessage(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return <p className={styles.status}>正在验证登录状态...</p>;
  }

  return (
    <main className={styles.container}>
      <section className={styles.editor} aria-labelledby="editor-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>{editingId ? "编辑文章" : "新建文章"}</p>
            <h1 id="editor-title">{editingId ? formData.title || "未命名文章" : "写一篇新博客"}</h1>
          </div>
          {editingId && <button type="button" className={styles.secondaryButton} onClick={startCreate}>取消编辑</button>}
        </div>

        <form className={styles.form} onSubmit={savePost}>
          <label>标题<input name="title" value={formData.title} onChange={changeField} required /></label>
          <label>摘要<textarea name="desc" value={formData.desc} onChange={changeField} rows="3" required /></label>
          <div className={styles.fieldRow}>
            <label>封面图片 URL<input type="url" name="img" value={formData.img} onChange={changeField} required /></label>
            <label>标签<input name="tag" value={formData.tag} onChange={changeField} /></label>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" name="externalArticle" checked={formData.externalArticle} onChange={changeField} />
            外部文章（内容填写跳转链接）
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" name="showInBlog" checked={formData.showInBlog} onChange={changeField} />
            在 Blogs 页面展示
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" name="isQuote" checked={formData.isQuote} onChange={changeField} />
            作为首页 Quote 展示
          </label>
          <label>{formData.externalArticle ? "外部文章链接" : "Markdown 内容"}
            <textarea name="content" value={formData.content} onChange={changeField} rows="16" required />
          </label>
          <div className={styles.actions}>
            {!formData.externalArticle && <button type="button" className={styles.secondaryButton} onClick={() => setShowPreview((value) => !value)}>{showPreview ? "关闭预览" : "预览"}</button>}
            <button className={styles.primaryButton} disabled={saving}>{saving ? "保存中..." : editingId ? "保存修改" : "发布文章"}</button>
          </div>
          {message && <p className={styles.message} role="status">{message}</p>}
        </form>
        {showPreview && !formData.externalArticle && <iframe title="Markdown 预览" className={styles.preview} sandbox="" srcDoc={previewDocument} />}
      </section>

      <section className={styles.library} aria-labelledby="library-title">
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>内容管理</p><h2 id="library-title">全部文章 <span>{filteredPosts.length} / {posts.length}</span></h2></div>
          <button type="button" className={styles.primaryButton} onClick={startCreate}>新建</button>
        </div>
        <div className={styles.filterBar}>
          <label htmlFor="tag-search">按标签搜索</label>
          <div className={styles.searchRow}>
            <input id="tag-search" type="search" list="dashboard-tags" value={tagQuery} onChange={(event) => setTagQuery(event.target.value)} placeholder="输入 tag..." />
            {tagQuery && <button type="button" onClick={() => setTagQuery("")}>清除</button>}
          </div>
          <datalist id="dashboard-tags">
            {availableTags.map((tag) => <option value={tag} key={tag} />)}
          </datalist>
        </div>
        {isLoading && <p className={styles.status}>正在加载文章...</p>}
        {error && <p className={styles.error}>文章加载失败，请刷新后重试。</p>}
        {!isLoading && !error && posts.length === 0 && <p className={styles.empty}>还没有文章，从左侧编辑器开始创作吧。</p>}
        {!isLoading && !error && posts.length > 0 && filteredPosts.length === 0 && <p className={styles.empty}>没有匹配该标签的文章。</p>}
        <div className={styles.posts}>
          {filteredPosts.map((post) => (
            <article className={`${styles.post} ${editingId === post._id ? styles.activePost : ""}`} key={post._id}>
              <div className={styles.thumbnail}><PostImage src={post.img} alt="" fill sizes="96px" className={styles.image} /></div>
              <div className={styles.postInfo}>
                <h3>{post.title}</h3>
                <p>
                  {post.tag || "未分类"} · {post.showInBlog === false ? "Blogs 已隐藏" : "Blogs 展示中"}
                  {post.isQuote ? " · 首页 Quote" : ""}
                </p>
              </div>
              <div className={styles.postActions}>
                <button type="button" onClick={() => startEdit(post)}>编辑</button>
                <button type="button" className={styles.dangerButton} disabled={deletingId === post._id} onClick={() => deletePost(post)}>{deletingId === post._id ? "删除中" : "删除"}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
