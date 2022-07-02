import { getCsrfToken } from "next-auth/react";
import styles from "../../styles/Form.module.scss";
import AuthForm from "../../components/AuthForm";

export default function SignIn({ csrfToken }) {
  return (
    <main className={styles.main}>
      <AuthForm csrfToken={csrfToken} />
      <button className={styles.form__button} form="login" type="submit">
        Log in with Email
      </button>
    </main>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
