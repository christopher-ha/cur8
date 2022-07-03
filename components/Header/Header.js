import styles from "@/components/Header/Header.module.scss";
import Link from "next/link";

export default function Header({ title, campaign, logoVisible }) {
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
    </div>
  );
}
