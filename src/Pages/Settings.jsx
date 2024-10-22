import { signOut } from 'firebase/auth'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import Footer from '../COMPONENTS/Footer'
import AuthForm from '../COMPONENTS/GENERAL-COMPONENTS/AuthForm'
import BackButton from '../COMPONENTS/GENERAL-COMPONENTS/BackButton'
import LoginMessage from '../COMPONENTS/GENERAL-COMPONENTS/LoginMessage'
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'
import Header from '../COMPONENTS/Header'
import Nav from '../COMPONENTS/Nav'
import { auth, db } from '../firebase/config'

const Settings = () => {
  const { users, user, userAuth, windowWidth, darkMode, setDarkMode } = useContext(appContext)

  const [showLoginForm, setShowLoginForm] = useState(false)
  const formFor = useRef('')
  
  const toggleRefs = useRef([])
  const toggleRef = el => toggleRefs.current.push(el)

  const navigate = useNavigate()

  useEffect(() => {
    const click = (e) => {
      e.currentTarget.classList.toggle('active')
    }

    toggleRefs.current.forEach(toggle => {
      if (toggle) {
        toggle.addEventListener('click', e => click(e))
      }
    })

    return () => {
      toggleRefs.current.forEach(toggle => {
        if (toggle) {
          toggle.removeEventListener('click', e => click(e))
        }
      })
    }
  }, [])

  // function getAuthMethod() {
  //   const user = auth.currentUser; // Get the currently signed-in user

  //   if (user) {
  //     // Check the provider data
  //     user.providerData.forEach((profile) => {
  //       console.log("Provider ID:", profile.providerId);
  //       console.log("Display Name:", profile.displayName);
  //       console.log("Email:", profile.email);
  //       console.log("Photo URL:", profile.photoURL);
  //     });

  //     // Example: Check if the user signed in with Google
  //     const isGoogleSignIn = user.providerData.some((profile) => profile.providerId === "google.com");
  //     console.log("Signed in with Google:", isGoogleSignIn);
  //   } else {
  //     console.log("No user is signed in.");
  //   }
  // }
  

  return (
    <main className="settings-main" >
      {windowWidth >= 700 && <Header />}
      {windowWidth >= 700 && <Nav />}
      <Footer />
      
      <LoginMessage />

      <header className="settings-header-div">
        <BackButton navigateLink={-1}/>

        <h3>Settings</h3>

        <div className="user-pfp">
          <UserPfp user={user} />
        </div>
      </header>

      <section className="settings-options-div">
        <div className="settings-options dm-toggle">
        <h3> Dark mode </h3>
          <button
            onClick={e => setDarkMode(!darkMode)}
          >
            <span className={darkMode ? 'dm' : ''}></span>
          </button>
        </div>

        <div className="settings-options">
          <Link to={userAuth && '/bookmarked-posts'}>
            <h3> Post Bookmarks </h3>
          </Link>
        </div>

        <div className="settings-options">
          <Link to={userAuth && '/bookmarked-pages'}>
            <h3> Saved Pages </h3>
          </Link>
        </div>

        <div className="settings-options">
          <Link to={userAuth && '/settings/edit-profile'}>
            <h3> Edit Profile </h3>
          </Link>
        </div>
      </section>

      {user && user.id &&
        <>
          <button className="delete-account red"
            onClick={() => {
              formFor.current = "delete-acct"
              setShowLoginForm(true)
            }}
          >
            Delete Account
          </button>

          <button className='log-out-btn' 
            onClick={() => {
              formFor.current = "logout"
              setShowLoginForm(true)
              // getAuthMethod()
            }}
          >
            Log Out
          </button>
        </>
      }

      <AuthForm
        showState={showLoginForm} formFor={formFor.current}
        setShowState={setShowLoginForm} 
      />
    </main>
  )
}

export default Settings