import { getCsrfToken } from "next-auth/react";
import styles from "../../styles/Form.module.scss";
import AuthForm from "../../components/AuthForm";
import Header from "../../components/Header";

export default function SignIn({ csrfToken }) {
  return (
    <>
      <Header text={"CREATE AN ACCOUNT"} />
      <main className={styles.main}>
        <AuthForm csrfToken={csrfToken} />
        <button className={styles.form__button} form="login" type="submit">
          Sign up with Email
        </button>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
