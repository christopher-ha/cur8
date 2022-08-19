import Link from "next/link";
import styles from "@/styles/pages/VerifyRequest.module.scss";

export default function verifyRequest({ baseUrl }) {
  return (
    <div className={styles.verify}>
      <h4>Check your email for a magic link</h4>
      <br></br>
      <a className={styles.verify__mail} href="mailto:hi@cur8.world">
        <button>Open Mail App</button>
      </a>
      <br></br>
      {/* <Link href="/">
        <button>Return home</button>
      </Link> */}
    </div>
  );
}
