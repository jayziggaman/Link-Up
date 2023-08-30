import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth, googleProvider, usersRef } from '../firebase/config'
import { FaTimes } from 'react-icons/fa'
import SignIn from '../Components/SignIn'
import SignInImg from '../Images/signup-bg.jpeg'
import { onSnapshot } from 'firebase/firestore'

const Auth = () => {
  const { setGlobalError, gError, users, setEnableSignIn, enableSIgnIn, cookies } = useContext(appContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  

  useEffect(() => {
    const authForm = document.querySelector('.auth-form')
    const checkBox = authForm.querySelector('.check-input')


    const handleAuth = (e) => {
      e.preventDefault()

      if (checkBox.checked) {
        signInWithEmailAndPassword(auth, email, password).then(() => {
          cookies.set('wowi-auth-token', auth.currentUser.uid)
          localStorage.setItem('wowi-auth-token', JSON.stringify(auth.currentUser.uid))
          navigate('/', {replace: true})
        }).catch(err => {
          setGlobalError(err.message)
          gError.current.classList.add('show-error')
          setTimeout(() => {
            gError.current.classList.remove('show-error')
          }, 3000 )
        } )
        
      } else {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
          const condition = users.find(user => user.id === auth.currentUser.uid)
          if (condition) {
            navigate('/', {replace: true})
          } else {
            setEnableSignIn(true)
          }
        }).catch(err => {
          setGlobalError('Email already in use')
          gError.current.classList.add('show-error')
          setTimeout(() => {
            gError.current.classList.remove('show-error')
          }, 3000 )
        } )
      }
    }

    authForm.addEventListener('submit', handleAuth)

    return () => authForm.removeEventListener('submit', handleAuth)
  })
  

  useEffect(() => {
    const authForm = document.querySelector('.auth-form-div')
    const emailBtn = document.querySelector('.email-btn')
    const googleBtn = document.querySelector('.google-btn')
    const cancelBtn = document.querySelector('.cancel-btn')

    const showForm = () => {
      authForm.style.visibility = 'visible'
    }

    const hideForm = () => {
      authForm.style.visibility = 'hidden'
    }

    const googleSignIn = async () => {
      signInWithPopup(auth, googleProvider).then(() => {
        onSnapshot(usersRef, snap => {
          let users = []
          snap.docs.forEach(doc => {
            users.push({ ...doc.data(), id: doc.id })
            const condition = users.find(user => user.id === auth.currentUser?.uid)
            if (condition) {
              cookies.set('wowi-auth-token', auth.currentUser.uid)
              localStorage.setItem('wowi-auth-token', JSON.stringify(auth.currentUser.uid))
              navigate('/', {replace: true})
            } else {
              setEnableSignIn(true)
            }
          })
        })
       
      })
      
    }

    emailBtn.addEventListener('click', showForm)
    googleBtn.addEventListener('click', googleSignIn)
    cancelBtn.addEventListener('click', hideForm)

    return () => {
      emailBtn.removeEventListener('click', showForm)
      googleBtn.removeEventListener('click', googleSignIn)
      cancelBtn.removeEventListener('click', hideForm)
    }
  }, [])
  

  return (
    <main className="auth-main">
      {/* <h1>WorldWide</h1> */}
      {enableSIgnIn &&
        <div role={'button'} onClick={() => enableSIgnIn && setEnableSignIn(false)} className='story-cancel'>
          <div></div>
          <div></div>
        </div>
      }

      <SignIn type='auth'/>

      <div className="sign-in-method-pick">
        <button className='google-btn'  > Sign In WIth Google </button>
        <button className='email-btn' > Sign In With Email </button>
        <span>(preferred for mobile)</span>
      </div>


      <div className="auth-form-div">
        <button className='cancel-btn' > <FaTimes /> </button>
        <form action="submit" className='auth-form'>
          <input autoComplete='off' value={email} onChange={e => setEmail(e.target.value)} className='text-input' type="email" placeholder='Email' /> 
          
          <input autoComplete='off' value={password} onChange={e => setPassword(e.target.value)} className='text-input' type="password" placeholder='Password' />
          
          <div className="form-check">
            <input autoComplete='off' type="checkbox" name='has-account' className='check-input' />
            <label htmlFor="has-account"> I have an account already </label>
          </div>
          <button>
            Submit
          </button>
        </form>
      </div>
    </main>
  )
}

export default Auth