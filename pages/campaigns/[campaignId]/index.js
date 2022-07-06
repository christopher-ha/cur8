import { useRouter } from "next/router";
import Menu from "@/components/Menu/Menu";
import styles from "@/components/Menu/Menu.module.scss";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <div>
      <img
        className={styles.menu__back}
        src="/icons/back-arrow.svg"
        alt="Back Arrow"
        onClick={() => router.back()}
      ></img>
      <Menu />
      {/* <p>This is a single campaign. Here is the ID: {campaignId}</p>
        <p>
          This will probably be the menu where people can go to all different
          places
        </p> */}
    </div>
  );
}
