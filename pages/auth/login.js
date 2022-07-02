import { getCsrfToken } from "next-auth/react";
import styles from "../../styles/Form.module.scss";
import AuthForm from "../../components/AuthForm";
import Header from "../../components/Header";

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
