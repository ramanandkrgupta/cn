"use client"
import React, { useState, useEffect, useRef } from 'react';
import styles from './StickyBottomMenu.module.css';

const StickyBottomMenu = () => {
  const [isSticky, setIsSticky] = useState(false);
  const menuRef = useRef(null);

  const handleSticky = () => {
    if (menuRef.current) {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleSticky);
    return () => window.removeEventListener('scroll', handleSticky);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Your main content goes here */}
      </div>
      <div className={`${styles.menu} ${isSticky ? styles.sticky : ''}`} ref={menuRef}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>Home</a>
          </li>
          <li className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>Activity</a>
          </li>
          <li className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>Promotion</a>
          </li>
          <li className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>Wallet</a>
          </li>
          <li className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>Account</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StickyBottomMenu;