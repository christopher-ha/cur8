import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import { useState, useCallback } from "react";
import Header from "@/components/Header/Header";
import Modal from "react-modal";
import Link from "next/link";
import Head from "next/head";
import styles from "@/components/Models/Models.module.scss";

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

export default function Models({ models }) {
  const [model, setModel] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
  }

  // Find the model that has the same id as the one we selected.
  const findModel = (modelId) => {
    return models.filter((model) => model.id === modelId);
  };
  // Selected Model, or default to first model in list.
  const selectedModel = findModel(model)[0] || models[0];

  // console.log(models);
  return (
    <main className={`${modalIsOpen === true ? `${styles.blur}` : ""}`}>
      <Head>
        <title>Models</title>
      </Head>
      <Header title={"Models"} />
      {/* <p>{model}</p> */}

      {/* // if modal is open, add blur class */}
      <div className={`container`}>
        <div className={styles.images}>
          <img
            className={styles.image}
            src={selectedModel.urlFace}
            alt={`${selectedModel.name}'s Face`}
          />
          <img
            className={styles.image}
            src={selectedModel.urlBody}
            alt={`${selectedModel.name}'s Body`}
          />
        </div>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.table__row}>
              <td className={styles.table__label}>Name</td>
              <td className={styles.table__info}>{selectedModel.name}</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Instagram</td>
              <td className={styles.table__info}>{selectedModel.instagram}</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Agency</td>
              <td className={styles.table__info}>{selectedModel.agency}</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Contact</td>
              <td className={styles.table__info}>{selectedModel.contact}</td>
            </tr>
            <tr>
              <td className={styles.table__label}>
                <br></br>
              </td>
            </tr>
            <tr>
              <td className={styles.table__label}>Height</td>
              <td className={styles.table__info}>{selectedModel.height} CM</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Bust</td>
              <td className={styles.table__info}>{selectedModel.bust} CM</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Waist</td>
              <td className={styles.table__info}>{selectedModel.waist} CM</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Hip</td>
              <td className={styles.table__info}>{selectedModel.hip} CM</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Shoe</td>
              <td className={styles.table__info}>{selectedModel.shoe} US</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Dress</td>
              <td className={styles.table__info}>{selectedModel.dress} US</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Hair</td>
              <td className={styles.table__info}>{selectedModel.hair}</td>
            </tr>
            <tr>
              <td className={styles.table__label}>Eyes</td>
              <td className={styles.table__info}>{selectedModel.eyes}</td>
            </tr>
          </tbody>
        </table>
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
          {models.map((model) => {
            return (
              <h4
                className="meatball__item"
                key={model.id}
                onClick={() => {
                  setModel(model.id);
                  closeModal();
                }}
              >
                {model.name}
              </h4>
            );
          })}
          <h4 className="meatball__add">+ ADD A NEW MODEL</h4>
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

  // Find all the models that match the campaignId
  const models = await prisma.models.findMany({
    where: {
      campaignId: campaignId,
    },
  });

  return {
    props: {
      models: JSON.parse(JSON.stringify(models)),
    },
  };
}
