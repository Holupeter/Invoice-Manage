import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '../../assets/logo.svg';
import IconMoon from '../../assets/icon-moon.svg';
import IconSun from '../../assets/icon-sun.svg';
import AvatarImg from '../../assets/image-avatar.jpg';

const Sidebar = ({ isDarkMode, onToggleTheme }) => {
  return (
    <aside className={styles.sidebar}>
      {/* Logo Area */}
      <div className={styles.logoContainer}>
        <img src={Logo} alt="Invoice App Logo" className={styles.logo} />
      </div>

      <div className={styles.actionsContainer}>
        {/* Theme Toggle */}
        <button className={styles.themeToggle} onClick={onToggleTheme} aria-label="Toggle Theme">
          <img src={isDarkMode ? IconSun : IconMoon} alt="Theme Toggle" />
        </button>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Avatar */}
        <div className={styles.avatarContainer}>
          <img src={AvatarImg} alt="User profile" className={styles.avatar} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
