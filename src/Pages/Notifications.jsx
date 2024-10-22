import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import Footer from '../COMPONENTS/Footer'
import Header from '../COMPONENTS/Header'
import Nav from '../COMPONENTS/Nav'
import Notification from '../COMPONENTS/Notification'
import { db } from '../firebase/config'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import noMedia from '../Images/no-media-found.jpg'
import LoginMessage from '../COMPONENTS/GENERAL-COMPONENTS/LoginMessage'
import NewPostIcon from '../ICONS/NewPostIcon'

const Notifications = () => {
  const {
    setNotificationCount, allPosts, users, user, userAuth, windowWidth, setShowPostForm, taggedPosts, setTaggedPosts, notifications, setNotiRed
  } = useContext(appContext)
  const time = new Date()
  const navigate = useNavigate()

  useEffect(() => {
    setNotiRed(false)
  }, [])

  useEffect(() => {
    if (user && user.id) {
      let some = false
      const userRef = doc(db, 'users', user.id)
      const arr = []
      notifications.map(noti => {
        if (noti.counter === undefined) {
          noti.counter = time.getTime()
          some = true
        }
      })
      if (some) {
        arr.push(...notifications)
        updateDoc(userRef, {
          notifications: {
            value: [...arr]
          }
        })
     }
    }
  }, [user])

 

  return (
    <main className='notifications-main' >
      {windowWidth > 700 && <Header />}
      <Nav />

      <LoginMessage />

      <section className="notifications-header">
        <div>
          <h1> Notifications </h1>
        </div>
        <div>
          {user?.avatarUrl === '' || !userAuth ?
            <div className='empty-notis-pfp'></div>
            :
            <img src={user?.avatarUrl} alt="" />
          }
        </div>
      </section>
      <section className="notifications">
        
        {userAuth && notifications?.length > 0 ?
          <>
            {notifications?.map((noti, index) => <Notification key={index} noti={noti} />)} 
          </>
          :
          <div className='no-media-div'>
            <img className='no-media' src={noMedia} alt="" />
            <p>Nothing to show here.</p>
          </div>
        }
      </section>
      
      <NewPostIcon />

      <Footer />
    </main>
  )
}

export default Notifications