import { signOut } from 'firebase/auth'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth, db } from '../firebase/config'

const Settings = () => {
  const { users, user, userAuth, allPosts, cookies } = useContext(appContext)
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('wowi-app-mode')))
  const navigate = useNavigate()

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('wowi-app-mode'))) {
      setDarkMode(true)
    } else {
      setDarkMode(false)
    }
  }, [])

  useEffect(() => {
    const app = document.querySelector('.App')
    if (JSON.parse(localStorage.getItem('wowi-app-mode'))) {
      app.classList.add('dark-mode')
    } else {
      app.classList.remove('dark-mode')
    }
  }, [darkMode])

  const logOut = async () => {
    signOut(auth).then(() => {
      navigate('/login')
      window.location.reload(true)
    }).then(() => {
      cookies.set('wowi-auth-token', '')
      localStorage.setItem('wowi-auth-token', '')
      cookies.remove('wowi-auth-token')
      localStorage.removeItem('wowi-auth-token')
    })
  }

  const deleteAccount = () => {
    const docRef = doc(db, 'users', userAuth)

    const id = userAuth
    users.map(user => {
      const ref = doc(db, 'users', user?.id)

      updateDoc(ref, {
        followers: {
          value: [...user?.followers.value.filter(follower => follower !== id)]
        },

        following: {
          value: [...user?.following.value.filter(follow => follow !== id)]
        },

        friends: {
          value: [...user?.friends.value.filter(friend => friend !== id)]
        },

        pageSaves: {
          value: [...user?.pageSaves.value.filter(save => save !== id)]
        }
      })
    })

    allPosts.map(post => {
      const ref  = doc(db, 'posts', post?.id)

      updateDoc(ref, {
        likes: {
          value: [...post.likes.value.filter(like => like === id)]
        }
      })

      if (post.creator === id) {
        deleteDoc(ref)
      }
    })

    deleteDoc(docRef).then(() => {
      navigate('/authorization')
    })
  }

  return (
    <main className="settings-main" >
      <header className="settings-header-div">
        <button className="back-btn" onClick={ () => navigate(-1) } >
          <FaArrowLeft />
        </button>

        <div className="settings-header">
          <h3>Settings</h3>
        </div>

        <div className="user-pfp">
          <img src={user?.avatarUrl} alt="" />
        </div>
      </header>

      <section className="settings-options-div">
        <div className="settings-options dm-toggle">
        <h3> Dark mode </h3>
          <button onClick={() => {
            setDarkMode(!darkMode)
            if (JSON.parse(localStorage.getItem('wowi-app-mode'))) {
              localStorage.setItem('wowi-app-mode', JSON.stringify(false))
            } else {
              localStorage.setItem('wowi-app-mode', JSON.stringify(true))
            }
          }}>
            <span className={darkMode ? 'dm' : ''}></span>
          </button>
        </div>

        <div className="settings-options">
          <Link to='/profile/settings/bookmarked-posts'>
            <h3> Post Bookmarks </h3>
          </Link>
        </div>

        <div className="settings-options">
          <Link to='/profile/settings/bookmarked-pages'>
            <h3> Saved Pages </h3>
          </Link>
        </div>

        <div className="settings-options">
          <Link to='/profile/settings/edit-profile'>
            <h3> Edit Profile </h3>
          </Link>
        </div>
      </section>

      <button className="delete-account red" onClick={deleteAccount}>
        Delete Account
      </button>

      <button className='log-out-btn' onClick={logOut}>
        Log Out
      </button>
    </main>
  )
}

export default Settings