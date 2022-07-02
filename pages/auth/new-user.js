import styles from "../../styles/Form.module.scss";

export default function newUser({ baseUrl }) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="profile"
          method="post"
          action="/api/auth/signin/email"
        >
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
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="instagram">
              Instagram
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              id="instagram"
              name="instagram"
              placeholder="*"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="number">
              Tel
            </label>
            <input
              className={styles.formGroup__input}
              type="tel"
              id="number"
              name="number"
              // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="*"
              maxLength="10"
            />
          </div>
        </form>
      </div>
      <button className={styles.form__button} form="profile" type="submit">
        Save
      </button>
    </main>
  );
}
