/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import UploadImages from "@/components/Upload/Upload";
import Header from "@/components/Header/Header";
import styles from "@/components/Moodboard/Moodboard.module.scss";
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

  const showOptions = (id) => {
    // We pass id of the image into the selected state.
    setSelected(id);
    // Then toggle to the opposite of it's current state (false -> true)
    setActive(!isActive);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete("/api/moodboards", {
        data: { selected: selected },
      });
      console.log(response);
      refreshData();
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(content);

  return (
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
              <div key={image.id}>
                <img
                  className={styles.moodboard__image}
                  src={image.url}
                  alt={image.text}
                  onClick={() => {
                    showOptions(image.id);
                  }}
                />
                {/* We set the state of selected onClick, so when we click one and it triggers a match to the image id, show the options. Only if the toggle is set to true, then we show options. Without this toggle, the edit buttons will always be there and have no state that breaks the condition. */}
                {selected === image.id && isActive === true ? (
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
                {selected === image.id && isActive === true ? (
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
