import Link from "next/link";
import styles from "./ArticleDetail.module.css";

export default function GetStartedBtn() {
  return (
    <Link
      href="https://calendly.com/ingversionsdigital/30min"
      className={styles["cta-button"]}
    >
      Get Started
    </Link>
  );
}
