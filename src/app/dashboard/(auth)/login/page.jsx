"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const session = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, session.status]);

  if (session.status === "loading" || session.status === "authenticated") {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setError("Email or password is incorrect.");
      } else if (result?.ok) {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back</h1>
      <h2 className={styles.subtitle}>Please sign in to see the dashboard.</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className={styles.input}
        />
        <button className={styles.button} disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
      {/* <button
        onClick={() => {
          signIn("google");
        }}
        className={styles.button + " " + styles.google}
      >
        Login with Google
      </button> */}
      {/* <span className={styles.or}>- OR -</span> */}
      {/* <Link className={styles.link} href="/dashboard/register">
        Create new account
      </Link> */}
      {/* !!!the above, because only me used, comment at sep10th,2023 */}
      {/* <button
        onClick={() => {
          signIn("github");
        }}
        className={styles.button + " " + styles.github}
      >
        Login with Github
      </button> */}
    </div>
  );
};

export default Login;
