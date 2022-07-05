import styles from "@/components/Menu/Menu.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Menu({ dashboardVisible }) {
  const { asPath } = useRouter();
  console.log(asPath);
  return (
    <div className={styles.menu}>
      <Link href={`${asPath}/moodboards`}>
        <h1 className={styles.menu__item}>Moodboards</h1>
      </Link>
      <Link href={`${asPath}/models`}>
        <h1 className={styles.menu__item}>Models</h1>
      </Link>
      <Link href={`${asPath}/looks-builder`}>
        <h1 className={styles.menu__item}>Looks Builder</h1>
      </Link>
      <Link href={`${asPath}/manage-team`}>
        <h1 className={styles.menu__item}>Manage Team</h1>
      </Link>
      <Link href={`${asPath}/call-sheet`}>
        <h1 className={styles.menu__item}>Call Sheet</h1>
      </Link>
    </div>
  );
}
