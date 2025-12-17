'use client'
import LoginPage from '@/components/authantication/LoginPage'
import AllProvider from '@/provider/AllProvider'
import store from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'

export default function page() {
  return (
    <div>

<Provider store={store}>

            <LoginPage/>
</Provider>

    </div>
  )
}
