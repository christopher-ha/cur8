import { getCsrfToken } from "next-auth/react";
import styles from "../../styles/Form.module.scss";

export default function SignIn({ csrfToken }) {
  return (
    <main>
      <form
        className={styles.form}
        id="login"
        method="post"
        action="/api/auth/signin/email"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className={styles.formGroup}>
          <label className={styles.formGroup__label} htmlFor="email">
            Email
          </label>
          <input type="email" id="email" name="email" placeholder="-" />
        </div>
      </form>
      <button className={styles.formGroup__button} form="login" type="submit">
        Sign in with Email
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
