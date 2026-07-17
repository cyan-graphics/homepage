import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Portfolio = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.selectTitle}>Choose a gallery</h1>
      <div className={styles.items}>
        <Link href="/category/life" className={styles.item}>
          <span className={styles.title}>Life</span>
        </Link>
        <Link href="/category/cs" className={styles.item}>
          <span className={styles.title}>
            Software<br />Development
          </span>
        </Link>
        <Link href="/category/graphics" className={styles.item}>
          <span className={styles.title}>Computer<br />Graphics</span>
        </Link>
        <Link href="/category/poetry" className={styles.item}>
          <span className={styles.title}>Poetry</span>
        </Link>
        <Link href="/category/quote" className={styles.item}>
          <span className={styles.title}>Quote</span>
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
