import React, { useContext } from 'react'
import { appContext } from '../../App'
import { Link, useLocation } from 'react-router-dom'

const LoginMessage = () => {
  const { user, homeLoading } = useContext(appContext)

  const location = useLocation()
  
  return (
    <>
      {!user?.id && !homeLoading &&
        <div className="login-message">
          <Link to='/auth?type=login'
            state={{ routedFrom: location.pathname }} 
          >
            Log in
          </Link>
    
          <Link to='/auth?type=signup'
            state={{ routedFrom: location.pathname }} 
          >
            Sign up
          </Link>
        </div>
      }
    </>
  )
}

export default LoginMessage