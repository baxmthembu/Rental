import React, { createContext, useState, useEffect } from 'react';

const WorkerContext = createContext();

const WorkerProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId');
    if (workerId) {
      setWorker({id: workerId, role: 'owner'});
    }
  }, []);

  const updateUser = (newWorker) => {
    console.log('Setting worker:', newWorker);  // Add this line to log user info
    setWorker(newWorker);
  };


  return (
    <WorkerContext.Provider value={{ worker, setWorker: updateUser }}>
      {children}
    </WorkerContext.Provider>
  );
};

export { WorkerContext, WorkerProvider };
