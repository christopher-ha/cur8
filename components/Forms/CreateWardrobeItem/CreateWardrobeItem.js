import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";

export default function CreateWardrobeItem({
  transparentImageURLs,
  campaignId,
  rembgIsLoading,
  checkSubmit,
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
  console.log("array", transparentImageURLs);
  console.log("final", finalTransparentImage);
  console.groupEnd();

  const submitData = async (formData, e) => {
    // if (rembgIsLoading) {
    //   return console.log("Wait a few seconds");
    // }

    const data = {
      ...formData,
      url: finalTransparentImage.pop(),
      campaignId: campaignId,
    };
    console.log("data:", data);

    try {
      const response = await axios.post("/api/wardrobe", {
        data,
      });

      // If there is more than one result (ie. user crops multiple times)
      if (transparentImageURLs.length > 1) {
        // Remove the most recent item (the one we want to keep)
        transparentImageURLs.pop();

        // then map over the rest of the array and delete the items from S3 bucket
        transparentImageURLs.map(async (url) => {
          const responseAWS = await axios.delete("/api/s3", {
            data: { key: new URL(url).pathname },
          });
          return responseAWS;
        });
      }

      // Redirect to the campaign's wardrobe page after completion.
      router.push(`/campaigns/${campaignId}/wardrobe`);
    } catch (error) {
      console.log(error);
    }
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
                required: "Which brand created your item?",
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
                required: "What is the name of the item?",
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
                required: "Select a category for your item.",
              })}
              defaultValue={""}
            >
              <option value="" disabled hidden></option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dress">Dress</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>
        </form>
      </div>
      <div className={styles.form__errors}>
        <p>{errors?.brand?.message}</p>
        <p>{errors?.description?.message}</p>
        <p>{errors?.category?.message}</p>
      </div>
      <button
        onClick={checkSubmit}
        className={styles.form__button}
        form="create-campaign"
        type="submit"
        // disabled={rembgIsLoading === true}
      >
        {rembgIsLoading ? "Processing..." : "Add Item"}
      </button>
    </main>
  );
}
