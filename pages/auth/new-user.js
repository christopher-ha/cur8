import Head from "next/head";
import AuthNewUser from "@/components/Forms/AuthNewUser/AuthNewUser";
import Header from "@/components/Header/Header";
import { getSession } from "next-auth/react";

export default function NewUser() {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header title={"Profile"} logoVisible={false} menuVisible={false} />
      <AuthNewUser />
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
