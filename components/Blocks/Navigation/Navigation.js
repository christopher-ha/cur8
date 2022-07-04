import styles from "@/components/Blocks/Blocks.module.scss";
import Link from "next/link";
import React from "react";

// export default function Navigation({ name }) {
//   return (
//     <div className={styles.block}>
//       <h4 className={styles.block__title}>{name}</h4>
//     </div>
//   );
// }

const Navigation = React.forwardRef(({ onClick, href, name }, ref) => {
  return (
    <div>
      <h4 className={styles.block__title}>{name}</h4>
    </div>
  );
});
Navigation.displayName = "Navigation";

export default Navigation;
