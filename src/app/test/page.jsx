
import { headers } from "next/headers";
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import PostImage from "@/components/PostImage/PostImage";
async function getData() {
    const headersList = await headers();
    const host = headersList.get("host");
    // console.log(host);
    const res = await fetch(`http://${host}`+"/api/catelog?tag=test", {//http:jsonplaceholder.typicode.com/posts
      cache: "no-store",
    });
    // console.log(res);
    // if (!res.ok) {
    //   throw new Error("Failed to fetch data");
    // }
  
    return res.json();
  }

  
const Blog = async() => {
    
    const data  = await getData();
    // console.log(data);
    return(
        <div className={styles.mainContainer}>
      {data.map((item) => (
        <>
        <Link href={`/blog/${item._id}`} className={styles.container} key={item.id}>
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
        </>
      ))}
    </div>
    );
};

export default Blog;
