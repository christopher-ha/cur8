import { useRouter } from "next/router";
import { useState } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/components/Moodboard/Moodboard.module.scss";
import { prisma } from "@/utils/db";

export default function Images({ images }) {
  const [newImages, setNewImages] = useState();

  const pull_data = async (data) => {
    await setNewImages(data);
    console.log("New Images:", data);
  };

  return (
    <main>
      <Header title={"Moodboard"} />
      <div className={styles.moodboard}>
        {images.map((image) => {
          return (
            <img
              className={styles.moodboard__image}
              src={image.url}
              key={image.id}
            />
          );
        })}
        {newImages?.map((image, index) => {
          return (
            <img className={styles.moodboard__image} src={image} key={index} />
          );
        })}
      </div>
      <UploadImages getURLs={pull_data} />
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const { moodboardId } = params;

  // Get all the images from the current moodboard.
  const imageURLs = await prisma.images.findMany({
    where: {
      moodboardId: moodboardId,
    },
  });

  return {
    props: {
      images: JSON.parse(JSON.stringify(imageURLs)),
    },
  };
}
