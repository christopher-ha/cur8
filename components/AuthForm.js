// import { getCsrfToken } from "next-auth/react";
import styles from "../styles/Form.module.scss";

export default function AuthForm({ csrfToken, buttonText }) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
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
            <input
              className={styles.formGroup__input}
              type="email"
              id="email"
              name="email"
              placeholder="*"
            />
          </div>
        </form>
      </div>
      <button className={styles.form__button} form="login" type="submit">
        {buttonText}
      </button>
    </main>
  );
}
