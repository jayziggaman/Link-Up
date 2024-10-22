import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import LoginMessage from "../COMPONENTS/GENERAL-COMPONENTS/LoginMessage"
import Footer from '../COMPONENTS/Footer'
import Header from '../COMPONENTS/Header'
import LoadPosts from '../COMPONENTS/LoadPosts'
import Nav from '../COMPONENTS/Nav'
import Post from '../COMPONENTS/Post'
import Stories from '../COMPONENTS/Stories'
import { db, usersRef } from '../firebase/config'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import NewPostIcon from '../ICONS/NewPostIcon'

const Home = () => {
  const { user, allPosts, setShowPostForm, setShowOptionsDiv, setShowShareMenu, showShareMenu, homeLoading, windowWidth, notifications, userStories, users, processingPosts } = useContext(appContext)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const navigate = useNavigate()
  
  const time = new Date()
  

  
  const expireStory = () => {
    const arr = []
    userStories.map(story => {
      time.getTime() - story.createdAt > 86400000 && arr.push(story.id)
    })
    for (let i = 0; i < arr.length; i++) {
      const docRef = doc(db, 'users', user.id, 'stories', arr[i])
      deleteDoc(docRef)
    }


    if (users) {
      users.map(user => {
        const { id, username } = user
        
        const ref = doc(usersRef, id)

        // const userLikes = user.likes.value

        // const newLikes = userLikes.filter(like => {
        //   if (like.type) return like
        // })

        updateDoc(ref, {
          username: username.trim()
        })
      })
    }
  }



  const expireVisitedRoute = () => {
    if (user?.id) {
      const visitedRoutes = user.visitedRoutes.value

      visitedRoutes.map(route => {
        const { createdAt, value } = route
        
        if ((time.getTime() - createdAt) > 86400000) {
          const ref = doc(db, 'users', user.id)
          updateDoc(ref, {
            visitedRoutes: {
              value: visitedRoutes.filter(url => url.value !== value)
            }
          })
        }
      })
    }
  }



  //correct delete function
  const expireNotification = () => {
    const arr = notifications.filter(noti => time.getTime() - noti.counter < 86400000)
    const docRef = doc(db, 'users', user.id)
    updateDoc(docRef, {
      notifications: {
        value: [...arr]
      }
    })
  }


  useEffect(() => {
    const interval = setInterval(() => {
      if (userStories?.length > 0) {
        expireStory()
      }

      if (notifications?.length > 0) {
        expireNotification()
      }
    }, 60000)

    expireVisitedRoute()


    return () => clearInterval(interval)
  }, [user])


  useEffect(() => {
    if (showShareMenu) {
      setShowShareMenu(false)
    }
  }, [windowWidth])



  if(homeLoading) {
    return (
      <main className="home-main-loading home-main" role={'button'}
        onClick={() => {
          setShowPostForm(false)
          showShareMenu && setShowShareMenu(false)
        }}
      >
        <Header />
        <Nav /> 
        <Stories />

        <section className="posts-section-loading">
          {loadArr.map((_, index) => <LoadPosts key={index} />)}
        </section>

        {windowWidth < 700 && <Footer />}
      </main>
    )
  } else {
    return (
      <main className="home-main" role={'button'} onClick={() => {
        if (showShareMenu) {
          setShowShareMenu(false)
        }
      }} >
        <Header />
        <Nav /> 

        <LoginMessage />

        <Stories />
        <div className="overlay" role={'button'} onClick={() => setShowOptionsDiv(false)}>
        </div>
  
        <section className="posts-section">
          {processingPosts.map((post, ind) => {
            return (
              <Post key={ind} post={post} 
                isProcessing={true} opacity={0.5}
              />
            )
          })}

          {allPosts?.map((post, index) => {
            return (
              <div key={index} className='post-div'>
                {index !== 0 && <hr key={index} />}
                <Post 
                  key={post.id} post={post} 
                />
              </div>
            ) 
          })}
        </section>

        <NewPostIcon />
        
        <Footer />
      </main>
    )
  }
 
}



export default Home