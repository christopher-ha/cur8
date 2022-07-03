import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";
// import { useSession } from "next-auth/react";

export default function AuthNewUser() {
  // const { data: session, status } = useSession();
  // console.log(session?.user.id, status);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const submitData = async (values) => {
    let config = {
      method: "POST",
      url: `http://localhost:3000/api/profile`,
      headers: {
        "Content-Type": "application/json",
      },
      data: values,
    };

    try {
      const response = await axios(config);
      console.log(response);
      if (response.data.status == 200) {
        console.log("Success");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   try {
  //   const response = await axios.post(
  //     "http://localhost:3000/api/test",
  //     values
  //   );
  //   console.log(response);
  //   if (response.data.status == 200) {
  //     console.log("Success");
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="profile"
          method="post"
          onSubmit={handleSubmit(submitData)}
          // action="/api/auth/signin/email"
        >
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="name">
              Name
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="*"
              {...register("name", {
                required: "Enter a valid name",
              })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="instagram">
              Instagram
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="-"
              maxLength="30"
              {...register("instagram", { required: false })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="number">
              Tel
            </label>
            <input
              className={styles.formGroup__input}
              type="tel"
              maxLength="15"
              // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="*"
              {...register("number", {
                required: "Enter a valid phone number.",
                // minLength: {
                //   value: 10,
                //   message: "This phone number is too short.",
                // },
              })}
            />
          </div>
        </form>
      </div>
      <div className={styles.form__errors}>
        <p>{errors?.name?.message}</p>
        <p>{errors?.number?.message}</p>
      </div>
      <button className={styles.form__button} form="profile" type="submit">
        Save
      </button>
    </main>
  );
}
