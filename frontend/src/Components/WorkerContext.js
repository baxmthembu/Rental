import React, { createContext, useState, useEffect } from 'react';

const WorkerContext = createContext();

const WorkerProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUser({id: userId, role: 'owner'});
    }
  }, []);

  const updateUser = (newUser) => {
    console.log('Setting worker:', newUser);  // Add this line to log user info
    setUser(newUser);
    localStorage.setItem('userId', newUser.id); // Update localStorage when user is set
  };


  return (
    <WorkerContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </WorkerContext.Provider>
  );
};

export { WorkerContext, WorkerProvider };
