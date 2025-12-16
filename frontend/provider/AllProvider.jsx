// 'use client'
// import store from '@/store/store';
// import { SessionProvider } from 'next-auth/react';
// import React from 'react'
// import { Provider } from 'react-redux';

// export default function ReduxProvider({ children }) {
//   return (
//     <Provider store={store}>
//     <SessionProvider>
//           {children}
//     </SessionProvider>
//     </Provider>
//   );
// }

"use client";

import store from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";


export default function AllProvider({ children }) {
  // Check if we're in development and NextAuth isn't set up
  const isAuthConfigured =
    process.env.NEXTAUTH_URL && process.env.NEXTAUTH_SECRET;

  if (!isAuthConfigured) {
    // Return children without SessionProvider if auth isn't configured
    return <>{children}</>;
  }

  return <SessionProvider>
    
<Provider store={store}>

      {children}
</Provider>
    
    
    
    </SessionProvider>;
}
