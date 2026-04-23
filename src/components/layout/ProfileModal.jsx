import React, { useRef, useEffect } from 'react';
import styles from './ProfileModal.module.css';
import { useAuth } from '../../context/AuthContext';
import defaultAvatar from '../../assets/image-avatar.jpg';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout, updateProfilePic } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Profile Details</h2>
        
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <img 
              src={user.profilePic || defaultAvatar} 
              alt="User Avatar" 
              className={styles.largeAvatar} 
            />
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name || 'Anonymous User'}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button 
            className={styles.uploadBtn} 
            onClick={() => fileInputRef.current.click()}
          >
            Upload Picture
          </button>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button className={styles.cancelBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
