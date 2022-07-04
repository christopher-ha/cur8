import { useRouter } from "next/router";
import Head from "next/head";
import CreateCampaign from "@/components/Forms/CreateCampaign/CreateCampaign";
import Header from "@/components/Header/Header";

export default function Campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  return (
    <>
      <Head>
        <title>Create Campaign</title>
      </Head>
      <Header title={"Create Campaign"} logoVisible={false} />
      <CreateCampaign />
    </>
  );
}
