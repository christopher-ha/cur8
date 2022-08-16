import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";

export default function CreateWardrobeItem() {
  // Initialize next-router
  const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const submitData = async (formData, e) => {
    console.log(formData);
    // axios
    //   .post("/api/wardrobe", {
    //     formData,
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     // Redirect to create campaign page after info has been submitted.
    //     router.push("/campaigns");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <main className={styles.main} style={{ height: "auto" }}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="create-campaign"
          method="post"
          onSubmit={handleSubmit(submitData)}
        >
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="brand">
              Brand
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="*"
              {...register("brand", {
                required: "Enter a valid name",
              })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="description">
              Description
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="*"
              {...register("description", {
                required: "Enter a description of the item",
              })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="size">
              Size
            </label>
            <input
              className={styles.formGroup__input}
              type="text"
              placeholder="-"
              {...register("size", { required: false })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroup__label} htmlFor="category">
              Category
            </label>
            <select
              className={styles.formGroup__input}
              {...register("category", {
                required: "select one option",
              })}
            >
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
            </select>
            {/* <input
              className={`${styles.formGroup__input}`}
              type="date"
              placeholder="-"
              // tabIndex="-1"
              {...register("date", { required: false })}
            /> */}
          </div>
        </form>
      </div>
      <div className={styles.form__errors}>
        <p>{errors?.name?.message}</p>
      </div>
      <button
        className={styles.form__button}
        form="create-campaign"
        type="submit"
      >
        Add Item
      </button>
    </main>
  );
}
