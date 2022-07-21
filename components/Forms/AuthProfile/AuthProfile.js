import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";
// import { useSession } from "next-auth/react";

export default function AuthProfile({ user }) {
  // const { data: session, status } = useSession();
  // console.log(session?.user.id, status);

  // Initialize next-router
  const router = useRouter();
  console.log(router.asPath);
  console.log(router.asPath.includes("?callbackUrl"));

  // Initialize react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const submitData = async (formData, e) => {
    axios
      .post("/api/profile", {
        formData,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    if (router.asPath.includes("?callbackUrl")) {
      // Redirect to create campaign page after info has been submitted.
      router.push("/campaigns/create");
    }

    if (!router.asPath.includes("?callbackUrl")) {
      // If the user is already logged in, send them back to the campaigns page.
      router.push("/campaigns");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="profile"
          method="post"
          onSubmit={handleSubmit(submitData)}
        >
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="name">
              Name
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder={"*"}
              value={user ? user.name : ""}
              {...register("name", {
                required: "Enter a valid name",
              })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="role">
              Role
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="-"
              value={user ? user.role : ""}
              maxLength="50"
              {...register("role", { required: false })}
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
              value={user ? user.instagram : ""}
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
              value={user ? user.number : ""}
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
