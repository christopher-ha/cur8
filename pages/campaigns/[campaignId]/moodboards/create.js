import { useRouter } from "next/router";
import Head from "next/head";
import CreateMoodboard from "@/components/Forms/CreateMoodboard/CreateMoodboard";
import Header from "@/components/Header/Header";
import { getSession } from "next-auth/react";

export default function MoodboardCreate() {
  const { asPath, basePath, pathname, query } = useRouter();
  // console.log(campaignId);
  return (
    <>
      <Head>
        <title>Create Moodboard</title>
      </Head>
      <Header
        title={"Create Moodboard"}
        logoVisible={false}
        menuVisible={false}
      />
      <CreateMoodboard campaignId={query.campaignId} />
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
