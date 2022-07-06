import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/components/Moodboard/Moodboard.module.scss";
import { prisma } from "@/utils/db";
import { useDropzone } from "react-dropzone";

export default function Images({ images }) {
  const [newImages, setNewImages] = useState();

  const pull_data = async (data) => {
    await setNewImages(data);
    console.log("New Images:", data);
  };

  // // const onDrop = useCallback(async (acceptedFiles) => {
  // //   let passUpload = (acceptedFiles) => {};
  // //   // console.log(acceptedFiles);
  // //   // const files = Array.from(acceptedFiles);

  // //   // for (const file of files) {
  // //   //   // console.log(file);
  // //   //   const { url } = await uploadToS3(file);
  // //   //   submitData(url);
  // //   //   setUrls((current) => [...current, url]);
  // //   // }
  // // }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   noClick: true,
  // });

  return (
    // <main>
    <main className={styles.moodboard__container}>
      <Header title={"Moodboard"} />
      <div className={styles.moodboard}>
        {/* <input {...getInputProps()} /> */}
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
