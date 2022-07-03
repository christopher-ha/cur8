import { getCsrfToken } from "next-auth/react";
import AuthForm from "@/components/Forms/AuthLogin/AuthLogin";
import Header from "@/components/Header/Header";
import Head from "next/head";

export default function SignIn({ csrfToken }) {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Header title={"CREATE AN ACCOUNT"} logoVisible={false} />
      <AuthForm csrfToken={csrfToken} buttonText={"SIGN UP WITH EMAIL"} />;
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
