import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import LoadPosts from '../Components/LoadPosts'
import Nav from '../Components/Nav'
import Post from '../Components/Post'
import Stories from '../Components/Stories'
import { FaPlus } from 'react-icons/fa'
import Form from '../Components/Form'
import { db } from '../firebase/config'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user, allPosts, setShowForm, setShowOptionsDiv, userAuth, setShowShareMenu, showShareMenu, homeLoading, windowWidth, notifications, userStories, notiRed, setNotiRed } = useContext(appContext)
  const postId = useRef('')
  const loadArr = [1, 2, 3, 4]
  const navigate = useNavigate()
  
  const time = new Date()

  const expireStory = () => {
    const arr = []
    userStories.map(story => {
      time.getTime() - story.createdAt > 86400000 && arr.push(story.id)
    })
    for (let i = 0; i < arr.length; i++) {
      const docRef = doc(db, 'users', userAuth, 'stories', arr[i])
      deleteDoc(docRef)
    }
  }

  //correct delete function
  const expireNotification = () => {
    const arr = notifications.filter(noti => time.getTime() - noti.counter < 86400000)
    const docRef = doc(db, 'users', userAuth)
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
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showShareMenu) {
      setShowShareMenu(false)
    }
  }, [windowWidth])

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main?.querySelectorAll('video')
      allVideos?.forEach(video => video.pause())
    }
  }, [])

  
  if(homeLoading) {
    return (
      <main className="home-main-loading home-main" role={'button'} onClick={() => {
        setShowForm(false)
        showShareMenu && setShowShareMenu(false)
      }} >
        <Header />
        <Nav /> 
        <Stories />
        <section className="posts-section-loading">
        {loadArr.map((item, index) => <LoadPosts key={index} />)}
        </section>
        {windowWidth < 800 && <Footer />}
      </main>
    )
  } else {
    return (
      <main className="home-main" role={'button'} onClick={() => {
        // setShowForm(false)
        if (showShareMenu) {
          setShowShareMenu(false)
        }
      }} >
        <Header />
        <Nav /> 
        <Stories />
        <div className="overlay" role={'button'} onClick={() => setShowOptionsDiv(false)}>
        </div>
  
        <section className="posts-section">
          {allPosts?.map((post, index) => {
            const { creator } = post
            if (creator === userAuth) {
              return (
                <div key={index} className='post-div'>
                  {index !== 0 && <hr />}
                  <Post key={post.id} post={post} postId={postId}
                    func={[
                      { id: postId.current, text: 'Bookmark post', prop: 'bookmark-post' },
                      { id: postId.current, text: 'Delete post', prop: 'delete-post red' }
                    ]}
                  />
                </div>
              ) 
            } else {
              return (
                <div key={index} className='post-div'>
                  {index !== 0 && <hr />}
                  <Post key={post.id} post={post} postId={postId}
                    func={[
                      { id: postId.current, text: 'Bookmark post', prop: 'bookmark-post' }
                    ]}
                  />
                </div>
              ) 
            }
            
          } ) }
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
 
}



export default Home