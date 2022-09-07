/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
import styles from "@/styles/pages/Wardrobe.module.scss";

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  content: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
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
  },
};

Modal.setAppElement("#__next");

export default function Wardrobe({ wardrobe, campaginId }) {
  // items is our wardrobe data, default to the original dataset
  const router = useRouter();
  const [items, setItems] = useState(wardrobe);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { asPath, basePath, pathname, query } = useRouter();

  console.log(router);
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
  }

  // Filtering the wardrobe for the category that was chosen. Set data to all the items of that category using setItems.
  function handleFilter(category) {
    return setItems(wardrobe.filter((item) => item.category === category));
  }

  // Only for the modal -> Removes duplicate categories from the list.
  const wardrobeSet = new Set(wardrobe.map((item) => item.category));

  // If there are no items (means it's the user's first time here) redirect to the add item page -- https://nextjs.org/docs/messages/no-router-instance
  useEffect(() => {
    if (items.length === 0) {
      router.push(`${asPath}/create`);
    }
  }, [items]);

  return (
    <main className={`${modalIsOpen === true ? "blur" : ""}`}>
      <Head>
        <title>Wardrobe</title>
      </Head>
      <Header title={"Wardrobe"} />

      <div className={styles.wardrobe}>
        {items?.map((item) => {
          return (
            <div className={styles.wardrobe__item} key={item.id}>
              <img
                className={styles.wardrobe__image}
                src={item.url}
                alt={item.description}
              />
              <div className={styles.wardrobe__text}>
                <h5 className={styles.wardrobe__brand}>{item.brand}</h5>
                <p className={styles.wardrobe__description}>
                  {item.description} — {item.size}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <img
          className="meatball__toggle"
          src="/icons/meatball-menu.svg"
          alt="Meatball Menu"
          onClick={openModal}
        ></img>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="meatball Menu"
      >
        <div className="meatball__menu">
          <h4
            className="meatball__item"
            // Set the items data to the original data (list of all items)
            onClick={() => {
              setItems(wardrobe);
              closeModal();
            }}
          >
            ALL ITEMS
          </h4>
          {[...wardrobeSet].map((category, index) => {
            return (
              <h4
                className="meatball__item"
                key={index}
                // pass in the category.
                onClick={() => {
                  handleFilter(category);
                  closeModal();
                }}
              >
                {category}
              </h4>
            );
          })}
          <Link href={`${asPath}/create`}>
            <h4 className="meatball__add">+ ADD A NEW ITEM</h4>
          </Link>
        </div>
        <div>
          <img
            className="meatball__toggle"
            src="/icons/meatball-menu.svg"
            alt="Meatball Menu"
            onClick={closeModal}
          ></img>
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

  return {
    props: {
      wardrobe: JSON.parse(JSON.stringify(wardrobe)),
      campaignId: campaignId,
    },
  };
}
