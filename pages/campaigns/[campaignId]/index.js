/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import Menu from "@/components/Menu/Menu/Menu";
import styles from "@/components/Menu/Menu/Menu.module.scss";
import Head from "next/head";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <div>
      <Head>
        <title>Navigate</title>
      </Head>
      <img
        className={styles.menu__back}
        src="/icons/back-arrow.svg"
        alt="Back Arrow"
        onClick={() => router.back()}
      ></img>
      <Menu />
    </div>
  );
}
