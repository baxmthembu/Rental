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
    if(newUser){
      console.log('Setting worker:', newUser)
      setUser(newUser)
      localStorage.setItem('userId', newUser.id)
    }else{
      console.log('clearing worker')
      setUser(null)
      localStorage.removeItem('userId')
    }
  };


  return (
    <WorkerContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </WorkerContext.Provider>
  );
};

export { WorkerContext, WorkerProvider };
