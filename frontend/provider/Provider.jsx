'use client'
import store from '@/store/store';
import { SessionProvider } from 'next-auth/react';
import React from 'react'
import { Provider } from 'react-redux';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
    <SessionProvider>
          {children}
    </SessionProvider>
    </Provider>
  );
}
