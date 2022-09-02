/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/styles/pages/Moodboard.module.scss";
import { prisma } from "@/utils/db";
import Head from "next/head";
import axios from "axios";

export default function Images({ content }) {
  const router = useRouter();
  const [selected, setSelected] = useState();
  const [isActive, setActive] = useState(false);

  const refreshData = () => {
    // (url to navigate to, url to display, options: no scroll)
    router.replace(router.asPath, router.asPath, { scroll: false });
    setSelected("");
    setActive(false);
  };

  const showOptions = (id, url) => {
    // We pass id of the image into the selected state.
    setSelected({ id, url });
    // Then toggle to the opposite of it's current state (false -> true)
    setActive(!isActive);
  };

  const handleDelete = async () => {
    if (
      selected.url?.startsWith(
        "https://cur8-images.s3.us-east-2.amazonaws.com/"
      )
    ) {
      try {
        const responseDB = await axios.delete("/api/moodboards", {
          data: { selected: selected.id },
        });
        const responseAWS = await axios.delete("/api/s3", {
          data: { key: new URL(selected.url).pathname },
        });
        console.log("Database Delete:", responseDB);
        console.log("AWS Delete:", responseAWS);

        refreshData();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.delete("/api/moodboards", {
          data: { selected: selected.id },
        });
        console.log(response);
        refreshData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(content);

  return (
    <main>
      <Head>
        <title>Moodboard</title>
      </Head>
      <Header title={"Moodboard"} />
      {content.length > 0 ? (
        <div className={styles.moodboard}>
          {/* Map over the images stored in database */}
          {content.map((image) => {
            if (image.url) {
              return (
                <div key={image.id} className={styles.moodboard__item}>
                  <img
                    className={styles.moodboard__image}
                    src={image.url}
                    alt={image.text}
                    onClick={() => {
                      showOptions(image.id, image.url);
                    }}
                  />
                  {/* We set the state of selected onClick, so when we click one and it triggers a match to the image id, show the options. Only if the toggle is set to true, then we show options. Without this toggle, the edit buttons will always be there and have no state that breaks the condition. */}
                  {selected?.id === image.id && isActive === true ? (
                    <div className={styles.moodboard__image__options}>
                      <h4 className={styles.moodboard__image__option}>Edit</h4>
                      <h4
                        className={styles.moodboard__image__option}
                        onClick={handleDelete}
                      >
                        Delete
                      </h4>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            } else {
              return (
                <div key={image.id}>
                  <p
                    className={styles.moodboard__text}
                    onClick={() => {
                      showOptions(image.id);
                    }}
                  >
                    {image.text}
                  </p>
                  {selected?.id === image.id && isActive === true ? (
                    <div className={styles.moodboard__image__options}>
                      <h4 className={styles.moodboard__image__option}>Edit</h4>
                      <h4
                        className={styles.moodboard__image__option}
                        onClick={handleDelete}
                      >
                        Delete
                      </h4>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div>
          <p>You can add images in many ways </p>
          <p>File Picker</p>
          <p>Copy & Paste</p>
          <p>Drag & Drop</p>
          <p>Screenshots</p>
          <p>Image URLs</p>
        </div>
      )}

      <UploadImages />
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
