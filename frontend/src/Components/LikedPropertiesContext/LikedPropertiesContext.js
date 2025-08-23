// src/context/LikedPropertiesContext.js
import { createContext, useState, useEffect } from 'react';

export const LikedPropertiesContext = createContext();

export const LikedPropertiesProvider = ({ children }) => {
  const [likedProperties, setLikedProperties] = useState([]);

  // Load from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('likedProperties');
    if (saved) {
      setLikedProperties(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when likedProperties changes
  useEffect(() => {
    localStorage.setItem('likedProperties', JSON.stringify(likedProperties));
  }, [likedProperties]);

  /*const toggleLike = (propertyId) => {
    setLikedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId) 
        : [...prev, propertyId]
    );
  };*/

  const toggleLike = (propertyId) => {
        setLikedProperties((prev) => {
            const updated = prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId];
            localStorage.setItem("likedProperties", JSON.stringify(updated));
            return updated;
        });
    };

  return (
    <LikedPropertiesContext.Provider value={{ likedProperties, toggleLike }}>
      {children}
    </LikedPropertiesContext.Provider>
  );
};