import { AppRouter } from '@routes/AppRouter';
import React from 'react';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer limit={2} />
      <AppRouter />
    </>
  );
};

export default App;
