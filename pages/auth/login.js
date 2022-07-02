import { getCsrfToken } from "next-auth/react";
import AuthForm from "@/components/Forms/AuthLogin/AuthLogin";
import Header from "@/components/Header/Header";

export default function SignIn({ csrfToken }) {
  return (
    <>
      <Header text={"LOG IN"} />
      <AuthForm csrfToken={csrfToken} buttonText={"LOG IN WITH EMAIL"} />;
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
