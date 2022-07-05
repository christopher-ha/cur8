import { useRouter } from "next/router";
import { useState } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/components/Moodboard/Moodboard.module.scss";

export default function Images({ images }) {
  const [newImages, setNewImages] = useState();

  const router = useRouter();
  // const { campaignId, moodboardId } = router.query;
  // console.log(router.query);
  // console.log(images);

  const pull_data = async (data) => {
    await setNewImages(data);
    console.log(data);
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

  // Find all the campaigns where the user is a part of the team
  const imageURLs = await prisma.images.findMany({
    where: {
      moodboardId: moodboardId,
    },
  });
  await console.log(imageURLs);

  return {
    props: {
      images: JSON.parse(JSON.stringify(imageURLs)),
    },
  };
}
