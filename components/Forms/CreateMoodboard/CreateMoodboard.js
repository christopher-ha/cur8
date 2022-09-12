import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from "@/components/Forms/Form.module.scss";
import axios from "axios";

export default function CreateCampaign(campaignId) {
  // Initialize next-router
  const router = useRouter();

  let { campaignId: id } = campaignId;

  // Initialize react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const submitData = async (formData, e) => {
    console.log(formData);

    const data = {
      ...formData,
      campaignId: id,
    };
    console.log("data:", data);

    axios
      .post("/api/moodboards", { data })
      .then((response) => {
        console.log(response);
        // Redirect to new moodboard on creation.
        router.push(`/campaigns/${id}/moodboards/${response.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <form
          className={styles.form}
          id="create-moodboard"
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
              placeholder="*"
              {...register("name", {
                required: "Enter a valid name",
              })}
            />
          </div>
        </form>
      </div>
      <div className={styles.form__errors}>
        <p>{errors?.name?.message}</p>
      </div>
      <button
        className={styles.form__button}
        form="create-moodboard"
        type="submit"
      >
        Start Creating
      </button>
    </main>
  );
}
