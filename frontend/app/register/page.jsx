'use client'
import RegisterPage from '@/components/authantication/RegisterPage';
import store from '@/store/store';
import React from 'react';
import { Provider } from 'react-redux';

const page = () => {
  return (
    <div>
    <Provider store={store}>
        <RegisterPage/>
    </Provider>
    </div>
  );
};

export default page;