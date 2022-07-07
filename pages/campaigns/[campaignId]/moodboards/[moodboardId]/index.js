/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/components/Moodboard/Moodboard.module.scss";
import { prisma } from "@/utils/db";
import Head from "next/head";

export default function Images({ content }) {
  const [newContent, setNewContent] = useState();

  const getContent = async (data) => {
    await setNewContent(data);
    console.log("New Content:", data);
  };

  function checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  console.log(content);

  return (
    // <main>
    <main className={styles.moodboard__container}>
      <Head>
        <title>Moodboard</title>
      </Head>
      <Header title={"Moodboard"} />
      <div className={styles.moodboard}>
        {/* Map over the images stored in database */}
        {content.map((image) => {
          if (image.url) {
            return (
              <img
                className={styles.moodboard__image}
                src={image.url}
                key={image.id}
                alt={image.text}
              />
            );
          } else {
            return (
              <p className={styles.moodboard__text} key={image.id}>
                {image.text}
              </p>
            );
          }
        })}

        {/* Map over the new images that user added*/}
        {newContent?.map((item, index) => {
          if (checkURL(item) === true) {
            return (
              <img
                className={styles.moodboard__image}
                src={item}
                key={index}
                alt="New Moodboard Image"
              />
            );
          } else {
            return (
              <p className={styles.moodboard__text} key={index}>
                {item}
              </p>
            );
          }
        })}
      </div>
      <UploadImages getContent={getContent} />
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const { moodboardId } = params;

  // Get all the images from the current moodboard.
  const items = await prisma.images.findMany({
    where: {
      moodboardId: moodboardId,
    },
  });

  return {
    props: {
      content: JSON.parse(JSON.stringify(items)),
    },
  };
}
