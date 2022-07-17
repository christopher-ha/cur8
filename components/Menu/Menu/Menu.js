import React from "react";
import styles from "@/components/Menu/Menu/Menu.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Menu() {
  const { asPath, basePath, pathname, query } = useRouter();
  console.log("---------------");
  console.log("asPath:", asPath);
  console.log("basePath:", basePath);
  console.log("pathname:", pathname);
  console.log("query:", query);

  if (pathname === "/campaigns") {
    return (
      <div className={styles.menu}>
        <Link href={`${basePath}/profile`}>
          <h1 className={styles.menu__item}>Profile</h1>
        </Link>
        <Link href={`${basePath}/auth/logout`}>
          <h1 className={styles.menu__item}>Logout</h1>
        </Link>
      </div>
    );
  }

  if (pathname === "/campaigns/[campaignId]") {
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

  return (
    <div className={styles.menu}>
      <Link href={`${basePath}/campaigns`}>
        <h1 className={styles.menu__item}>Dashboard</h1>
      </Link>
      <Link href={`${basePath}/campaigns/${query.campaignId}/moodboards`}>
        <h1 className={styles.menu__item}>Moodboards</h1>
      </Link>
      <Link href={`${basePath}/campaigns/${query.campaignId}/models`}>
        <h1 className={styles.menu__item}>Models</h1>
      </Link>
      <Link href={`${basePath}/campaigns/${query.campaignId}/looks-builder`}>
        <h1 className={styles.menu__item}>Looks Builder</h1>
      </Link>
      <Link href={`${basePath}/campaigns/${query.campaignId}/manage-team`}>
        <h1 className={styles.menu__item}>Manage Team</h1>
      </Link>
      <Link href={`${basePath}/campaigns/${query.campaignId}/call-sheet`}>
        <h1 className={styles.menu__item}>Call Sheet</h1>
      </Link>
    </div>
  );
}
