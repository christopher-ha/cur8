import { useRouter } from "next/router";
import { prisma } from "@/utils/db";
import { getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import styles from "@/components/Blocks/Blocks.module.scss";
import Link from "next/link";

export default function Campaign({ campaigns }) {
  // console.log(campaigns);

  // const router = useRouter();
  // console.log(router);
  // const campaignId = router.query.campaignId;
  return (
    <main>
      <Header title={"Dashboard"} />
      <section className={styles.container}>
        {campaigns.map((campaign) => (
          <Link
            href={"/campaigns/" + campaign.id}
            passHref={true}
            key={campaign.id}
          >
            <div className={styles.block}>
              <h4 className={styles.block__title}>{campaign.name}</h4>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const session = await getSession({
    req,
  });
  const userId = session.user.id;

  // Find all the campaigns where the user is a part of the team
  const campaignIds = await prisma.teams.findMany({
    where: {
      userId: userId,
    },
  });

  // Find all the campaigns using the campaign-ids found in the teams table.
  const campaigns = await prisma.campaigns.findMany({
    where: {
      id: campaignIds.campaignId,
    },
  });

  return {
    props: {
      campaigns: JSON.parse(JSON.stringify(campaigns)),
    },
  };
}
