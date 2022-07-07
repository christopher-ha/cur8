import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import styles from "@/components/Blocks/Blocks.module.scss";
import Link from "next/link";
import Head from "next/head";

export default function Moodboards({ moodboards }) {
  const { asPath } = useRouter();
  // console.log(asPath);
  // console.log(moodboards);
  return (
    <main>
      <Head>
        <title>Moodboards</title>
      </Head>
      <Header title={"Moodboards"} />
      <section className={styles.container}>
        {moodboards.map((moodboard) => (
          <Link
            href={`${asPath}/${moodboard.id}`}
            passHref={true}
            key={moodboard.id}
          >
            <div className={styles.block}>
              <h4 className={styles.block__title}>{moodboard.name}</h4>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  // Get the campaignId from url params
  const campaignId = params.campaignId;

  // Find all the moodboards that match the campaignId
  const moodboards = await prisma.moodboards.findMany({
    where: {
      campaignId: campaignId,
    },
  });

  return {
    props: {
      moodboards: JSON.parse(JSON.stringify(moodboards)),
    },
  };
}
