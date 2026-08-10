import React, { useState } from 'react';
import NotificationsDropdown from './NotificationsDropdown';
import PatientDropdown from './PatientDropdown';

export default function Header({ uploadedFilesCount }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen && isAccountOpen) setIsAccountOpen(false);
  };

  const toggleAccount = () => {
    setIsAccountOpen(prev => !prev);
    if (!isAccountOpen && isNotificationsOpen) setIsNotificationsOpen(false);
  };

  return (
    <header className="hidden lg:flex justify-end items-center gap-3 px-8 py-4 border-b border-gray-200 bg-white relative">
      <NotificationsDropdown 
        isOpen={isNotificationsOpen} 
        onToggle={toggleNotifications} 
      />
      <PatientDropdown 
        isOpen={isAccountOpen} 
        onToggle={toggleAccount} 
        uploadedFilesCount={uploadedFilesCount} 
      />
    </header>
  );
}
