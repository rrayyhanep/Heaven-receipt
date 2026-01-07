import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" legacyBehavior><a>Heaven Furniture</a></Link>
      </div>
      <div className={styles.links}>
        <Link href="/" legacyBehavior>
          <a className={router.pathname === '/' ? styles.active : ''}>Salary Slip</a>
        </Link>
        <Link href="/employees" legacyBehavior>
          <a className={router.pathname === '/employees' ? styles.active : ''}>Manage Employees</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
