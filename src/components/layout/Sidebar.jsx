import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import Logo from '../../assets/logo.svg';
import IconMoon from '../../assets/icon-moon.svg';
import IconSun from '../../assets/icon-sun.svg';
import AvatarImg from '../../assets/image-avatar.jpg';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from './ProfileModal';

const Sidebar = ({ isDarkMode, onToggleTheme }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {/* Avatar / Profile */}
        <div className={styles.avatarContainer}>
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
            title="Profile"
          >
            <img 
              src={user?.profilePic || AvatarImg} 
              alt="User profile" 
              className={styles.avatar} 
            />
          </button>
        </div>
      </div>

      {/* Render the Profile Modal */}
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
};

export default Sidebar;
