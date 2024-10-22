import { getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth, googleProvider } from '../firebase/config'
import Loading from '../COMPONENTS/GENERAL-COMPONENTS/Loading'
import AuthForm from '../COMPONENTS/GENERAL-COMPONENTS/AuthForm'
import { functionsContext } from '../CONTEXTS/FunctionsContext'

const Auth = () => {
  const { users, setEnableSignIn, enableSignIn } = useContext(appContext)
  const { callError } = useContext(functionsContext)

  const [searchParams, setSearchParams] = useSearchParams()
  const [pageLoading, setPageLoading] = useState(true)
  const [authType, setAuthType] = useState('login')
  const [routedFrom, setRoutedFrom] = useState('/')
  const [showLoginForm, setShowLoginForm] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const isMobileOrTablet = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };


  useEffect(() => {
    if (location.state?.routedFrom) {
      setRoutedFrom(location.state.routedFrom)

    } else {
      setRoutedFrom('/')
    }
  }, [])



  
  

  useEffect(() => {
    if (localStorage.getItem('wowi-is-redirecting')) {
      // setShowLoading(true)
      setPageLoading(false)

      // console.log('this function is running')
      getRedirectResult(auth).then(result => {
        // console.log(result)

        if (result) {
          setPageLoading(false)
          // console.log(result)

          navigate('/')

        } else {
          callError(`Service unavailable. Please ${authType} with your email instead.`)
        }
    
      })
        
      //   .catch(err => {
      //   if (err.message === 'Firebase: Error (auth/account-exists-with-different-credential).') {
      //     const ref = doc(db, 'users', userId)
  
      //     getDoc(ref).then(doc => {
      //       const user = doc.data()
            
      //       if (user.userName) {
      //         navigate(from ? from : '/', {replace: true})
    
      //       } else {
      //         navigate(`/create-account?from=${from}`, { replace: true })
      //       }
      //     })
  
      //   } else {
      //     callError(`Couldn't complete ${type}. Please try again.`) 
      //   }   
  
      // }).finally(() => {
      //   localStorage.removeItem('wowi-is-redirecting')
      // })
    } 
  }, [])



  useEffect(() => {
    if (users) {
      setPageLoading(false)
    }
  }, [users])


  useEffect(() => {
    const type = searchParams.get('type')

    if (type) {
      setAuthType(type)
      setShowLoginForm(false)
    }
  }, [searchParams])
  
  
  

  const redirectFtn = () => { 
    // console.log("redirect ran, 119");
    localStorage.setItem('wowi-is-redirecting', JSON.stringify(true));
  }
  
  
  const googleAuth = async () => { 
    // console.log('ran, 125');
  
    if (isMobileOrTablet()) {
      redirectFtn();
      // console.log("auth ran, 129");
      await signInWithRedirect(auth, googleProvider);

    } else {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const { user } = result;
        const { uid } = user;
        
        const thisUser = users.find(user => user.id === uid);
  
        if (thisUser) {
          // localStorage.setItem('wowi-auth-token', JSON.stringify(uid));
          // setUser(thisUser);
          // navigate(routedFrom, { replace: true });
        } else {
          // navigate();
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          callError("This email is already linked to another account");
        }
      }
    }
  };
  


  

  if (pageLoading) {
    return <Loading />

  } else {
    return (
      <main className="auth-main">
        <h1>Link Up</h1>
  
        {enableSignIn &&
          <div role={'button'} onClick={() => enableSignIn && setEnableSignIn(false)} className='story-cancel'>
            <div></div>
            <div></div>
          </div>
        }
  
        <div className="sign-in-method-pick">
          {/* <button className='google-btn'
            onClick={() => googleAuth()}
          >
            Continue With Google
          </button> */}
  
          <button className='email-btn'
            onClick={() => setShowLoginForm(true)}
          >
            {authType === 'login' ?
              <>
                Login with Email
              </>
              :
              <>
                Sign up with Email
              </>
            }
          </button>
  
          <LinkToOtherType type={authType} />
        </div>
  
  
        <AuthForm
          showState={showLoginForm} formFor="auth" routedFrom={routedFrom}
          setShowState={setShowLoginForm} authType={authType}
        />
      </main>
    )
  }
}

export default Auth



const LinkToOtherType = ({ type }) => {
  const linkTo = type === 'login' ? '/auth?type=signup' :
    type === 'signup' && '/auth?type=login'

  const linkText =
    type === 'login' ? `Don't have an account? Sign up` :
      type === 'signup' && 
      `Already have an account? Log in`
  
  return (
    <Link to={linkTo}> {linkText} </Link>
  )
}