import React from 'react';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
