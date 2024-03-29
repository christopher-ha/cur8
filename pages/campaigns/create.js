import { useRouter } from "next/router";
import Head from "next/head";
import CreateCampaign from "@/components/Forms/CreateCampaign/CreateCampaign";
import Header from "@/components/Header/Header";
import { getSession } from "next-auth/react";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <>
      <Head>
        <title>Create Campaign</title>
      </Head>
      <Header
        title={"Create Campaign"}
        logoVisible={false}
        menuVisible={false}
      />
      <CreateCampaign />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
