import React from 'react'
import { getItem, KEY_ACCESS_TOKEN } from '../utils/localStorageManager'
import { Navigate, Outlet } from 'react-router-dom'

function NotLoggedInUser() {
    const user = getItem(KEY_ACCESS_TOKEN)
  return (
    user ? <Navigate to="/"/> : <Outlet/>
  )
}

export default NotLoggedInUser
