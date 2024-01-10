import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');
  const sunIcon = "https://www.uplooder.net/img/image/55/7aa9993fc291bc170abea048589896cf/sun.svg";
  const moonIcon = "https://www.uplooder.net/img/image/2/addf703a24a12d030968858e0879b11e/moon.svg";

  useEffect(() => {
    document.body.setAttribute('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    console.log(`Theme: ${theme}`);
  }, [theme]);

  return (
    <div className={`theme-container ${theme === 'dark' ? 'shadow-dark' : 'shadow-light'}`} onClick={toggleTheme}>
      <img
        id="theme-icon"
        src={theme === 'dark' ? moonIcon : sunIcon}
        alt={theme === 'dark' ? 'Moon Icon' : 'Sun Icon'}
        className={`icon-circle ${theme === 'dark' ? 'change' : ''}`}
      />
    </div>
  );
};

export default ThemeToggle;