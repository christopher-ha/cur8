import { useRef, useState } from "react";
import styles from "@/components/Forms/Form.module.scss";

// import useInput from "@/hooks/use-input";

const isEmpty = (value) => value.trim() === "";
const isTenChars = (value) => value.trim().length === 10;

export default function AuthNewUser({ onSubmit }) {
  const [formValid, setFormValid] = useState({
    name: true,
    instagram: true,
    tel: true,
  });

  const nameRef = useRef();
  const instagramRef = useRef();
  const telRef = useRef();
  // const {
  //   value: name,
  //   isValid: nameIsValid,
  //   hasError: nameInputHasError,
  //   valueChangeHandler: nameChangedHandler,
  //   inputBlurHandler: nameBlurHandler,
  // } = useInput((value) => value.trim() !== "");

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredInstagram = instagramRef.current.value;
    const enteredTel = telRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredInstagramIsValid = !isEmpty(enteredInstagram);
    const enteredTelIsValid = isTenChars(enteredTel);

    setFormValid({
      name: enteredNameIsValid,
      instagram: enteredInstagramIsValid,
      tel: enteredTelIsValid,
    });

    const formIsValid =
      enteredNameIsValid && enteredInstagramIsValid && enteredTelIsValid;

    if (!formIsValid) {
      return;
    }

    // Submit form
    onSubmit({
      name: enteredName,
      instaram: enteredInstagram,
      tel: enteredTel,
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="profile"
          method="post"
          onSubmit={submitHandler}
          // action="/api/auth/signin/email"
        >
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="name">
              Name
            </label>
            <input
              className={styles.formGroup__input}
              type="name"
              id="name"
              name="name"
              placeholder="*"
              ref={nameRef}
            />
            {!formValid.name && <p>Please enter a valid name</p>}
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
              placeholder="-"
              ref={instagramRef}
            />
            {!formValid.instagram && (
              <p>Please enter a valid Instagram handle</p>
            )}
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
              ref={telRef}
            />
            {!formValid.tel && <p>Please enter a valid phone number.</p>}
          </div>
        </form>
      </div>
      <button className={styles.form__button} form="profile" type="submit">
        Save
      </button>
    </main>
  );
}
