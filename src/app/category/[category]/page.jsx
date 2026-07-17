import { Fragment } from "react";
import { headers } from "next/headers";
import styles from "./page.module.css";
import Button from "@/components/Button/Button";
import Link from "next/link";
import PostImage from "@/components/PostImage/PostImage";
import { items } from "./data.js";
import { notFound } from "next/navigation";

async function getDatas(category) {
  const headersList = await headers();
  const host = headersList.get("host");
  // console.log(host);
  const res = await fetch(`http://${host}`+`/api/catelog?tag=${category}`, {//http:jsonplaceholder.typicode.com/posts
    cache: "no-store",
  });
  // console.log(res);
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }

  return res.json();
}

const getData = (cat) => {

  
  const data = items[cat];

  if (data) {
    return data;
  }

  return notFound();
};

const Category = async({ params }) => {
  const { category } = await params;
  const data = await getDatas(category);
  return (
    <div className={styles.mainContainer}>
      {data.map((item) => (
        <Fragment key={item._id}>
        <Link href={`/blog/${item._id}`} className={styles.container}>
          <div className={styles.imageContainer}>
            <PostImage
              src={item.img}
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.desc}>{item.desc}</p>
          </div>
          
          
        </Link>
        <hr className={styles.articleSeparator} />
        </Fragment>
      ))}
    </div>
  );
};

export default Category;
