import styles from "@/components/Header/Header.module.scss";
import Link from "next/link";
import Modal from "react-modal";
import { useState } from "react";
import Menu from "@/components/Menu/Menu";

const modalStyle = {
  overlay: {},
  content: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "flex-direction": "column",
    position: "absolute",
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

export default function Header({ title, campaign, logoVisible }) {
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

  return (
    <div className={styles.header}>
      <Link href="/">
        <h3
          className={`${styles.header__logo} ${
            logoVisible === false ? `${styles.hidden}` : ""
          }`}
        >
          cur.8
        </h3>
      </Link>
      <h3 className={styles.header__title}>{title}</h3>
      <h3 className={styles.header__campaign}>{campaign}</h3>
      <h3 className={styles.header__menu}>MENU</h3>
      <div className={styles.header__menu__container}>
        <img
          className={styles.header__menu__mobile}
          src="/icons/hamburger-menu.svg"
          alt="Hamburger Menu"
          onClick={openModal}
        ></img>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Hamburger Menu"
      >
        <Menu />
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
}
