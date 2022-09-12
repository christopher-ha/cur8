import Image from "next/future/image";
import styles from "@/styles/pages/LooksBuilder.module.scss";

export default function Page() {
  return (
    <section className={styles.test__grid}>
      <div className={styles.test__container}>
        <Image
          className={styles.test__image}
          src="https://cur8-images.s3.us-east-2.amazonaws.com/images/ff26ba87-2f4b-4ed6-bfa5-77d7e1f5912f/image_1662503449142.jpeg"
          fill
          objectFit
          alt="Testing next/image"
        />
        <Image
          className={styles.test__image}
          src="https://cur8-images.s3.us-east-2.amazonaws.com/images/ff26ba87-2f4b-4ed6-bfa5-77d7e1f5912f/image_1662503449142.jpeg"
          fill
          objectFit
          alt="Testing next/image"
        />
      </div>
    </section>
  );
}
