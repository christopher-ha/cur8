/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
import Wardrobe from "@/components/Wardrobe/Wardrobe.js";
// import styles from "@/styles/pages/Wardrobe.module.scss";
import styles from "@/styles/pages/LooksBuilder.module.scss";
import wardrobeStyles from "@/styles/pages/Wardrobe.module.scss";
import axios from "axios";
import { ConnectContactLens } from "aws-sdk";

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
  const [modalType, setModalType] = useState();
  const [activeBlock, setActiveBlock] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [isExistingItem, setIsExistingItem] = useState(false);
  const { asPath, basePath, pathname, query } = useRouter();

  const [face, setFace] = useState("");
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [shoes, setShoes] = useState("");
  const [accessories, setAccessories] = useState([]);

  console.log(query.campaignId);

  function openModal(type) {
    setIsOpen(true);
    setModalType(type);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    console.log("Click");
    e.preventDefault();
    axios
      .post("/api/looks-builder", {
        face: face.id,
        top1: top1.id,
        top2: top2.id,
        bottom: bottom.id,
        shoes: shoes.id,
        accessory1: accessory1.id,
        accessory2: accessory2.id,
        accessory3: accessory3.id,
        accessory4: accessory4.id,
        campaignId: query.campaignId,
      })
      .then((response) => {
        console.log(response);
        // Clear the UI.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(savedLooks);
  // console.log(items);

  // Since we are running two functions that take the same param, it was easier to combine them into one onClick.
  async function handleActive(category) {
    console.log(category);
    // Handles the data filtering, wait for this is finished before setActive which renders the component on screen.
    await handleFilter(category);
    // Handles conditional rendering (we need to know which one was clicked)
    await setActiveBlock(category);
  }

  // Filters the items based on the block that was selected
  function handleFilter(category) {
    console.log(category);

    switch (category) {
      case "faces":
        setItems(models);
        break;
      case "tops":
        setItems(
          wardrobe.filter((item) => item.category === "tops" && "dress")
        );
        break;
      case "bottoms":
        setItems(wardrobe.filter((item) => item.category === "bottoms"));
        break;
      case "shoes":
        setItems(wardrobe.filter((item) => item.category === "shoes"));
        break;
      case "accessories":
        setItems(wardrobe.filter((item) => item.category === "accessory"));
        break;
      default:
        console.log("Something went wrong.");
    }
  }

  function handleSelected(item) {
    // If the use selects an acccessory, but it is the + button, then add it to the end of the array
    if (activeBlock === "accessories" && isExistingItem === false) {
      setAccessories([...accessories, { id: item.id, url: item.url }]);
    } // If the user selects an existing accesory, find the index of the item by id
    else if (activeBlock === "accessories" && isExistingItem === true) {
      // const index = accessories.findIndex((item) => item.id === selectedItem);
      accessories.splice(selectedIndex, 1, { id: item.id, url: item.url });
    }

    // If the use selects a top, but it is the + button, then add it to the end of the array
    if (activeBlock === "tops" && isExistingItem === false) {
      setTops([...tops, { id: item.id, url: item.url }]);
    } // If the user selects an existing accesory, find the index of the item by id
    else if (activeBlock === "tops" && isExistingItem === true) {
      // const index = tops.findIndex((item) => item.id === selectedItem);
      tops.splice(selectedIndex, 1, { id: item.id, url: item.url });
    }

    // If the use selects a bottom, but it is the + button, then add it to the end of the array
    if (activeBlock === "bottoms" && isExistingItem === false) {
      setBottoms([...bottoms, { id: item.id, url: item.url }]);
    } // If the user selects an existing accesory, find the index of the item by id
    else if (activeBlock === "bottoms" && isExistingItem === true) {
      // const index = bottoms.findIndex((item) => item.id === selectedItem);
      bottoms.splice(selectedIndex, 1, { id: item.id, url: item.url });
    }

    // Conditions for face and shoes (single item)
    switch (activeBlock) {
      case "faces":
        setFace({ id: item.id, url: item.urlFace });
        break;
      case "shoes":
        setShoes({ id: item.id, url: item.url });
        break;
    }
  }

  return (
    <main className={`${modalIsOpen === true ? "blur" : ""}`}>
      <Head>
        <title>Looks Builder</title>
      </Head>
      <Header title={"Looks Builder"} />

      <form
        className={styles.looks}
        id="looks-builder"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className={styles.block__head__wrapper}>
          <div
            className={styles.block__head}
            style={{ backgroundColor: face ? "white" : "#f2f2f2" }}
            // onClick, open our modal and pass the category into our handleActive function which filters our data and renders our components in the modal.
            onClick={() => {
              openModal("wardrobe");
              handleActive("faces");
            }}
          >
            {!face ? (
              <h5>+ FACE </h5>
            ) : (
              <img className={styles.block__filled} src={face.url} alt="Face" />
            )}
          </div>
        </div>
        <div className={styles.block__accessory__wrapper}>
          {/* Here is the displayed accessories */}
          {accessories?.map((accessory, index) => {
            return (
              <div
                className={styles.block__accessory}
                style={{
                  backgroundColor: accessories.length > 0 ? "white" : "#f2f2f2",
                }}
                onClick={() => {
                  openModal("wardrobe");
                  // setSelectedItem(accessory.id);
                  setSelectedIndex(index);
                  setIsExistingItem(true);
                  handleActive("accessories");
                }}
                key={index}
              >
                <img
                  className={styles.block__filled__accessory}
                  src={accessory.url}
                  alt="Accessory"
                />
              </div>
            );
          })}
          <div
            className={styles.block__accessory}
            style={{
              backgroundColor: accessories.length > 0 ? "white" : "#f2f2f2",
            }}
            onClick={() => {
              openModal("wardrobe");
              handleActive("accessories");
            }}
          >
            {/* This is the placeholder accessory*/}
            {accessories.length === 0 ? <h5>+ ACCESSORY</h5> : "+"}
          </div>
        </div>

        <div className={styles.block__main}>
          <div className={styles.block__scroll}>
            {tops?.map((top, index) => {
              return (
                <div
                  className={styles.block__top}
                  style={{
                    backgroundColor: tops.length > 0 ? "white" : "#f2f2f2",
                  }}
                  onClick={() => {
                    openModal("wardrobe");
                    // setSelectedItem(top.id);
                    setSelectedIndex(index);
                    setIsExistingItem(true);
                    handleActive("tops");
                  }}
                  key={index}
                >
                  <img
                    className={styles.block__filled}
                    src={top.url}
                    alt="Top"
                  />
                </div>
              );
            })}
            <div
              className={styles.block__top}
              style={{ backgroundColor: tops.length > 0 ? "white" : "#f2f2f2" }}
              onClick={() => {
                openModal("wardrobe");
                handleActive("tops");
              }}
            >
              {!tops.length > 0 ? <h5>+ TOP</h5> : "+"}
            </div>
          </div>

          <div className={styles.block__scroll}>
            {bottoms?.map((bottom, index) => {
              return (
                <div
                  className={styles.block__bottom}
                  style={{
                    backgroundColor: bottoms.length > 0 ? "white" : "#f2f2f2",
                  }}
                  onClick={() => {
                    openModal("wardrobe");
                    // setSelectedItem(bottom.id);
                    setSelectedIndex(index);
                    setIsExistingItem(true);
                    handleActive("bottoms");
                  }}
                  key={index}
                >
                  <img
                    className={styles.block__filled}
                    src={bottom.url}
                    alt="Top"
                  />
                </div>
              );
            })}
            <div
              className={styles.block__bottom}
              style={{
                backgroundColor: bottoms.length > 0 ? "white" : "#f2f2f2",
              }}
              onClick={() => {
                openModal("wardrobe");
                handleActive("bottoms");
              }}
            >
              {bottoms.length === 0 ? <h5>+ BOTTOM</h5> : "+"}
            </div>
          </div>
          <div
            className={styles.block__shoes}
            style={{ backgroundColor: shoes ? "white" : "#f2f2f2" }}
            onClick={() => {
              openModal("wardrobe");
              handleActive("shoes");
            }}
          >
            {!shoes ? (
              <h5>+ SHOES</h5>
            ) : (
              <img
                className={styles.block__filled}
                src={shoes.url}
                alt="Shoes"
              />
            )}
          </div>
        </div>
      </form>

      <div className={styles.buttons}>
        <button>Clear</button>
        <button onClick={() => openModal("savedLooks")}>View Saved</button>
        <button type="submit" form="looks-builder">
          Save
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Wardrobe"
      >
        {/* <Wardrobe
          activeBlock={activeBlock}
          items={items}
          models={models}
          handleSelected={handleSelected}
          closeModal={closeModal}
          modalType={modalType}
        /> */}

        {(activeBlock === "tops" ||
          activeBlock === "bottoms" ||
          activeBlock === "accessories" ||
          activeBlock === "shoes") &&
          modalType === "wardrobe" && (
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
                      setIsExistingItem(false);
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
          )}

        {activeBlock === "faces" && modalType === "wardrobe" && (
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

        {modalType === "savedLooks" && (
          <p>This is where the saved looks will be</p>
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
      top1: {
        select: {
          url: true,
        },
      },
      top2: true,
      bottom: true,
      shoes: true,
      accessory1: true,
      accessory2: true,
      accessory3: true,
      accessory4: true,
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
