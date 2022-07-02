// import { getCsrfToken } from "next-auth/react";
import styles from "../styles/Form.module.scss";

export default function AuthForm({ csrfToken }) {
  return (
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
  );
}
