import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";

export default function CreateWardrobeItem({
  transparentImageURLs,
  campaignId,
}) {
  // Initialize next-router
  const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Get the last image url in the array
  const finalTransparentImage = transparentImageURLs.slice(-1);
  console.group("transparentImageURLs ");
  console.log(transparentImageURLs);
  console.log(finalTransparentImage);
  console.log(campaignId);
  console.groupEnd();

  const submitData = async (formData, e) => {
    // pop it out of the array to get the string
    console.log(router);
    const data = {
      ...formData,
      url: finalTransparentImage.pop(),
      campaignId: campaignId,
    };
    console.log("data:", data);

    axios
      .post("/api/wardrobe", {
        data,
      })
      .then((response) => {
        console.log(response);
        // Redirect to the campaign's wardrobe page after completion.
        router.push(`/campaigns/${campaignId}/wardrobe`);
      })
      .catch((error) => {
        console.log(error);
      });
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
              defaultValue={""}
            >
              <option value="" disabled hidden></option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
            </select>
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
