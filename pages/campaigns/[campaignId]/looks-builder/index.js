/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback } from "react";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
// import styles from "@/styles/pages/Wardrobe.module.scss";
import styles from "@/styles/pages/LooksBuilder.module.scss";
import wardrobeStyles from "@/styles/pages/Wardrobe.module.scss";

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    // display: "flex",
    // justifyContent: "flex-end",
    // alignItems: "center",
    flexDirection: "column",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",
    top: "0px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "1rem",
    border: "none",
    display: "grid",
  },
};

Modal.setAppElement("#__next");

export default function LooksBuilder({ wardrobe, models, savedLooks }) {
  // items is our wardrobe data, default to the original dataset.
  const [items, setItems] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState();
  const { asPath, basePath, pathname, query } = useRouter();

  const [face, setFace] = useState();
  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();
  const [shoes, setShoes] = useState();
  const [accessory, setAccessory] = useState();

  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
  }

  console.log(savedLooks);
  // console.log(items);

  // Since we are running two functions that take the same param, it was easier to combine them into one onClick.
  async function handleActive(category) {
    // Handles the data filtering, wait for this is finished before setActive which renders the component on screen.
    await handleFilter(category);
    // Handles conditional rendering (we need to know which one was clicked)
    await setActiveBlock(category);
  }

  // Filters the items based on the block that was selected
  function handleFilter(category) {
    console.log(category);
    if (
      category === "tops" ||
      category === "bottoms" ||
      category === "accessory" ||
      category === "shoes"
    ) {
      return setItems(wardrobe.filter((item) => item.category === category));
    } else {
      return setItems(models);
    }
  }

  function handleSelected(item) {
    console.log(activeBlock);
    console.log(item);

    switch (activeBlock) {
      case "faces":
        setFace({ id: item.id, url: item.urlFace });
        break;
      case "tops":
        setTop({ id: item.id, url: item.url });
        break;
      case "bottoms":
        setBottom({ id: item.id, url: item.url });
        break;
      case "shoes":
        setShoes({ id: item.id, url: item.url });
        break;
      case "accessory":
        setAccessory({ id: item.id, url: item.url });
        break;
    }
  }

  return (
    <main className={`${modalIsOpen === true ? "blur" : ""}`}>
      <Head>
        <title>Looks Builder</title>
      </Head>
      <Header title={"Looks Builder"} />

      <section className={styles.looks}>
        <div className={styles.block__head__wrapper}>
          <div
            className={styles.block__head}
            style={{ backgroundColor: face ? "white" : "" }}
            // onClick, open our modal and pass the category into our handleActive function which filters our data and renders our components in the modal.
            onClick={() => {
              openModal();
              handleActive("faces");
            }}
          >
            {!face ? (
              <h5>+ FACE </h5>
            ) : (
              <img className={styles.block__filled} src={face.url} />
            )}
          </div>
        </div>
        <div
          className={styles.block__accessory}
          style={{ backgroundColor: accessory ? "white" : "" }}
          onClick={() => {
            openModal();
            handleActive("accessory");
          }}
        >
          {!accessory ? (
            <h5>+ ACCESSORY</h5>
          ) : (
            <img
              className={styles.block__filled__accessory}
              src={accessory.url}
            />
          )}
        </div>
        <div
          className={styles.block__top}
          style={{ backgroundColor: top ? "white" : "" }}
          onClick={() => {
            openModal();
            handleActive("tops");
          }}
        >
          {!top ? (
            <h5>+ TOP</h5>
          ) : (
            <img className={styles.block__filled} src={top.url} />
          )}
        </div>
        <div
          className={styles.block__bottom}
          style={{ backgroundColor: bottom ? "white" : "" }}
          onClick={() => {
            openModal();
            handleActive("bottoms");
          }}
        >
          {!bottom ? (
            <h5>+ BOTTOM</h5>
          ) : (
            <img className={styles.block__filled} src={bottom.url} />
          )}
        </div>
        <div
          className={styles.block__shoes}
          style={{ backgroundColor: shoes ? "white" : "" }}
          onClick={() => {
            openModal();
            handleActive("shoes");
          }}
        >
          {!shoes ? (
            <h5>+ SHOES</h5>
          ) : (
            <img className={styles.block__filled} src={shoes.url} />
          )}
        </div>
      </section>

      <div className={styles.buttons}>
        <button>Clear</button>
        <button>View Saved</button>
        <button>Save</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Wardrobe"
      >
        {activeBlock === "tops" ||
        activeBlock === "bottoms" ||
        activeBlock === "accessory" ||
        activeBlock === "shoes" ? (
          // If the user selected the tops / bottoms / accessories / shoes block, then render this.
          // We group these together because they all come from the wardrobe and have the same data structure (object/key pairs), unlike the models data
          <div className={wardrobeStyles.wardrobe}>
            {items?.map((item) => {
              return (
                <div
                  className={wardrobeStyles.wardrobe__item}
                  key={item.id}
                  onClick={() => {
                    handleSelected(item);
                    closeModal();
                  }}
                >
                  <img
                    className={wardrobeStyles.wardrobe__image}
                    src={item.url}
                    alt={item.description}
                  />
                  <div className={wardrobeStyles.wardrobe__text}>
                    <h5 className={wardrobeStyles.wardrobe__brand}>
                      {item.brand}
                    </h5>
                    <p className={wardrobeStyles.wardrobe__description}>
                      {item.description} — {item.size}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // If the activeBlock isn't any of those, then it must be the faces. Render the list of faces.
          <div className={wardrobeStyles.wardrobe}>
            {models?.map((model) => {
              return (
                <div
                  className={wardrobeStyles.wardrobe__item}
                  key={model.id}
                  onClick={() => {
                    handleSelected(model);
                    closeModal();
                  }}
                >
                  <img
                    className={wardrobeStyles.wardrobe__image}
                    src={model.urlFace}
                    alt={model.name}
                  />
                  <div className={wardrobeStyles.wardrobe__text}>
                    <h5 className={wardrobeStyles.wardrobe__brand}>
                      {model.name}
                    </h5>
                    <p className={wardrobeStyles.wardrobe__description}>
                      {model.agency} — {model.instagram}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <button
            className={styles.button__close}
            src="/icons/meatball-menu.svg"
            alt="Close Wardrobe"
            onClick={closeModal}
          >
            CLOSE
          </button>
        </div>
      </Modal>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  // Get the campaignId from url params
  const campaignId = params.campaignId;

  // Find all the items that match the campaignId
  const wardrobe = await prisma.wardrobe.findMany({
    where: {
      campaignId: campaignId,
    },
  });

  // Find all the models that match the campaignId
  const models = await prisma.models.findMany({
    where: {
      campaignId: campaignId,
    },
  });

  const savedLooks = await prisma.savedLooks.findMany({
    where: {
      campaignId: campaignId,
    },
    include: {
      top: {
        select: {
          url: true,
        },
      },
      bottom: true,
      shoes: true,
      accessory1: true,
      accessory2: true,
      models: true,
    },
  });

  return {
    props: {
      wardrobe: JSON.parse(JSON.stringify(wardrobe)),
      models: JSON.parse(JSON.stringify(models)),
      savedLooks: JSON.parse(JSON.stringify(savedLooks)),
      campaignId: campaignId,
    },
  };
}
