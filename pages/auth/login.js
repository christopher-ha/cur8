import { getCsrfToken } from "next-auth/react";
import AuthForm from "@/components/Forms/AuthLogin/AuthLogin";
import Header from "@/components/Header/Header";
import Head from "next/head";

export default function SignIn({ csrfToken }) {
  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <Header
        title={"Log In"}
        campaign={"Test"}
        logoVisible={false}
        menuVisible={false}
      />
      <AuthForm csrfToken={csrfToken} buttonText={"LOG IN WITH EMAIL"} />
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
