import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth } from '../firebase/config'

const RequireAuth = ({children}) => {
  const {userAuth} = useContext(appContext)
  const navigate = useNavigate()

  if (!auth?.currentUser?.uid && !userAuth) {
    navigate('/login')
  } else {
    return (
      <>{children}</>
    )
  }
}

export default RequireAuth