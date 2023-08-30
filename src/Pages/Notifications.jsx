import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaPlus } from 'react-icons/fa'
import Footer from '../Components/Footer'
import Form from '../Components/Form'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import Notification from '../Components/Notification'
import { db } from '../firebase/config'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const {
    setNotificationCount, allPosts, users, user, userAuth, windowWidth, setShowForm, taggedPosts, setTaggedPosts, notifications, setNotiRed
  } = useContext(appContext)
  const time = new Date()
  const navigate = useNavigate()

  //know when the notification was sent

  // console.log(notifications)

  useEffect(() => {
    setNotiRed(false)
  }, [])

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.id)
      const arr = []
      notifications.map(noti => {
        if (noti.counter === undefined) {
          noti.counter = time.getTime()
        }
      })
      arr.push(...notifications)
      updateDoc(userRef, {
        notifications: {
          value: [...arr]
        }
      })
    }
  }, [user])

 


  return (
    <main className='notifications-main' >
      {windowWidth > 800 && <Header />}
      <Nav />
      <section className="notifications-header">
        <div>
          <h1> Notifications </h1>
        </div>
        <div>
          <img src={user?.avatarUrl} alt="" />
        </div>
      </section>
      <section className="notifications">
        { notifications?.map((noti, index) => <Notification key={index} noti={noti}/>)}
      </section>
      <button className='new-post-icon' onClick={() => {
        if (userAuth) {
          setShowForm(true)
        } else {
          navigate('/login')
        }
      } }>
        <FaPlus />
      </button>

      <Form />

      <Footer />
    </main>
  )
}

export default Notifications