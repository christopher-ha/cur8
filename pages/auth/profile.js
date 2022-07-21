import Head from "next/head";
import AuthProfile from "@/components/Forms/AuthProfile/AuthProfile";
import Header from "@/components/Header/Header";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function NewUser() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header title={"Profile"} logoVisible={false} menuVisible={false} />
      <AuthProfile user={session.user} />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);

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
