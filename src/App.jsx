import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { auth, messageRoomsRef, postsRef, usersRef } from './firebase/config'

import Home from './PAGES/Home'
import PostView from './PAGES/PostView'
import Profile from './PAGES/Profile'
import Notifications from './PAGES/Notifications'
import Search from './PAGES/Search'
import Auth from './PAGES/Auth'
import Settings from './PAGES/Settings'
import BookmarkedPages from './PAGES/BookmarkedPages'
import BookmarkedPosts from './PAGES/BookmarkedPosts'
import StoryLayout from './PAGES/StoryLayout'

import ShareMenu from './COMPONENTS/ShareMenu'
import VerifiedMessage from './COMPONENTS/VerifiedMessage'
import PostForm from './COMPONENTS/PostForm'
import NewStoryLayout from './PAGES/NewStoryLayout';
import CreateAccount from './PAGES/CreateAccount';
import Loading from './COMPONENTS/GENERAL-COMPONENTS/Loading';
import FunctionsContext from './CONTEXTS/FunctionsContext';
import MessagesMain from './PAGES/MessagesMain'


export const appContext = React.createContext()
const App = () => {
  const [ALLUSERNAMES, SETALLUSERNAMES] = useState(null)
  const [showLoading, setShowLoading] = useState(false)
  const [showSignUpForm, setShowSignUpForm] = useState(false)
  const [homeLoading, setHomeLoading] = useState(true)
  const [enableSignIn, setEnableSignIn] = useState(false)
  const [allPosts, setAllPosts] = useState()
  const [users, setUsers] = useState()
  const [user, setUser] = useState()
  const [userStories, setUserStories] = useState([])
  const [followingStories, setFollowingStories] = useState([])
  const [searchedUser, setSearchedUser] = useState()
  const [messageRooms, setMessageRooms] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationCount, setNotificationCount] = useState(notifications.length)
  const [commentId, setCommentId] = useState('')
  const [replyId, setReplyId] = useState('')
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState({
    postId: "", commentId: "", replyId: "", storyId: "", post: {}, creator: {}
  })

  const [userPosts, setUserPosts] = useState([])

  const [showPostForm, setShowPostForm] = useState(false)
  const [postFormFor, setPostFormFor] = useState('')
  const [PostFormIDs, setPostFormIDs] = useState({
    postId: "", commentId: "", replyId: ""
  })
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('wowi-app-mode') ?
    JSON.parse(localStorage.getItem('wowi-app-mode')) : false
  )
  const navigate = useNavigate()
  const footerRef = useRef()
  const newIconRef = useRef()
  const [userAuth, setuserAuth] = useState(
    localStorage.getItem('wowi-auth-token') ?
    JSON.parse(localStorage.getItem('wowi-auth-token')) : 
    auth.currentUser?.uid ? auth.currentUser?.uid : null
  )
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [sssMenu, setSssMenu] = useState(false)
  const [showNewMessageForm, setShowNewMessageForm] = useState()
  const [processingPosts, setProcessingPosts] = useState([])
  const [processing, setProcessing] = useState(false)
  const processingType = useRef()
  const appRef = useRef()
  const leavingTime = useRef()
  const VerifiedMessageRef = useRef()
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false)
  const [taggedPosts, setTaggedPosts] = useState([])
  const [showChatModal, setShowChatModal] = useState(false)
  const [notiRed, setNotiRed] = useState(false) 
  const [messagesRed, setMessagesRed] = useState(false)
  const [suggestedAccounts, setSuggestedAccounts] = useState([])


  
  const splitRegex = /\b\w+\b/



  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()

  const time = new Date()
  let hours = time.getHours()
  let mins = time.getMinutes()

  mins = mins < 10 ? `0${mins}` : mins

  const period = hours < 12 ? 'AM' : 'PM'

  hours = hours > 12 ? hours - 12 : hours
  hours = hours === 0 ? hours = 12 : hours



  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem('wowi-app-mode', JSON.stringify(darkMode))
    }


    const html = document.querySelector('html')
    const body = document.querySelector('body')
    const root = document.getElementById('root')

    const black = `#222222`

    if (darkMode) {
      html.style.backgroundColor = black
      body.style.backgroundColor = black
      root.style.backgroundColor = black
      
    } else {
      html.style.backgroundColor = 'white'
      body.style.backgroundColor = 'white'
      root.style.backgroundColor = 'white'
    }
  }, [darkMode])



  function fetchData() {
    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'))
    onSnapshot(postsQuery, snap => {
      const tempPosts = []
      snap.docs.forEach(doc => {
        tempPosts.push({ ...doc.data(), id: doc.id })
      })
      setAllPosts(tempPosts)
      localStorage.setItem('wowi-posts', JSON.stringify(tempPosts))
    })

    onSnapshot(usersRef, snap => {
      const tempUsers = []
      snap.docs.forEach(doc => {
        tempUsers.push({ ...doc.data(), id: doc.id })
      })
      setUsers(tempUsers)
      localStorage.setItem('wowi-users', JSON.stringify(tempUsers))
    })


    onSnapshot(messageRoomsRef, snap => {
      const tempDMs = []
      snap.docs.forEach(doc => {
        tempDMs.push({ ...doc.data(), id: doc.id })
      })
      setMessageRooms(tempDMs)
      localStorage.setItem('wowi-dm-rooms', JSON.stringify(tempDMs))
    })
  }



  
  useEffect(() => {
    if (user && user.id) {
      const userRef = doc(usersRef, user.id)
      updateDoc(userRef, {
        posts: {
          value: [...userPosts]
        }
      })
    }


    if (user && user.id) {
      if (navigator.onLine) {
        const storyRef = collection(usersRef, user.id, 'stories')
        const storyQuery = query(storyRef, orderBy('createdAt', 'asc'))
        onSnapshot(storyQuery, snap => {
          const arr = []
          snap.docs.forEach(doc => {
            arr.push({...doc.data(), id: doc.id})
          })
          setUserStories([...arr])
          localStorage.setItem('wowi-user-stories', JSON.stringify(arr))
        })
      }
    }
  }, [user, userPosts])



  useEffect(() => {
    if (user && user.id && navigator.onLine) {
      const arr = []

      for (let i = 0; i < user.following.value.length; i++) {
        const follow = users.find(person => person.id === user.following.value[i])

        if (follow) {
          const userRef = collection(usersRef, follow.id, 'stories')
          const q = query(userRef, orderBy("createdAt", "asc"));
          
          onSnapshot(q, snap => {
            const userArr = []
            snap.docs.forEach(doc => {
              userArr.push({ ...doc.data(), id: doc.id })
            })

            if (userArr[0]) {
              arr.push({
                creatorId: follow.id,
                creatorUsername: follow.username,
                creatorStories: [...userArr],
              })
            }

            setFollowingStories([...arr])
            localStorage.setItem('wowi-otherUser-stories', JSON.stringify(arr))
          })
        }
      }
    }
  }, [users, user])



  const checkerRef = useRef(false)
  useEffect(() => {
    if (!checkerRef.current) {
      if (navigator.onLine) {
        fetchData()
  
      } else {
        checkerRef.current = true
        setUsers(JSON.parse(localStorage.getItem('wowi-users')))
        setAllPosts(JSON.parse(localStorage.getItem('wowi-posts')))
        setMessageRooms(JSON.parse(localStorage.getItem('wowi-dm-rooms')))
        setUserStories(JSON.parse(localStorage.getItem('wowi-user-stories')))
        setFollowingStories(JSON.parse(localStorage.getItem('wowi-otherUser-stories')))
      }
    }
  }, [])
  


  useEffect(() => {
    setTimeout(() => {
      setShowError(false)
    }, 5000 )
  }, [showError])
  


  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])



  useEffect(() => {
    if (users) {
      const thisUser = users.find(person => {
        return person.id === userAuth
      })

      if (thisUser) {
        setUser(thisUser)

      } else {
        setUser({})
      }
    }

    if (allPosts) {
      setUserPosts(allPosts.filter(post => post.creator === userAuth))
    }
  }, [userAuth, allPosts, users])


  

  useEffect(() => {
    if (user && user.id) {
      const arr = user.notifications.value?.sort((a, b) => b.sentAt - a.sentAt)
      setNotifications([...arr])
    }
  }, [user])



  useEffect(() => {
    const main = document.querySelector('.home-main')
    
    if (main) {
      if (showSignUpForm) {
        main.style.opacity = 0.5
        // main.classList.add('show')
      } else {
        main.style.opacity = 1
        // main.classList.remove('show')
      }
    }
  }, [showSignUpForm])


  useEffect(() => {
    if (notifications.length > 0) {
      const cond = notifications.find(noti => noti.counter === undefined)
      if (cond) {
        setNotiRed(true)
      } else {
        setNotiRed(false)
      }
    } else {
      setNotiRed(false)
    }
    
    const interval = setInterval(() => {
      if (notifications.length > 0) {
        const cond = notifications.find(noti => noti.counter === undefined)
        if (cond) {
          setNotiRed(true)
        } else {
          setNotiRed(false)
        }
      } else {
        setNotiRed(false)
      }
    }, 60000);

    return () => clearInterval(interval)
  }, [notifications])


  useEffect(() => {
    if (allPosts && users) {
      setHomeLoading(false)
    }

    
    if (users) {
      const usernameArray = []
      users.map(user => {
        if (user) {
          usernameArray.push(user.username)
        }
      })
      SETALLUSERNAMES([...usernameArray])

      const firstUser = users.find(user => user.id === "eh5HIhxxzqPV86xQhvB4ofdx7C22")
      const otherUsers = users.filter(user => user.id !== "eh5HIhxxzqPV86xQhvB4ofdx7C22")


      if (firstUser) {
        setSuggestedAccounts(
          [firstUser, ...otherUsers.slice(otherUsers.length - 11, otherUsers.length - 1)]
        )

      } else {
        setSuggestedAccounts([...otherUsers])
      }
    }
  }, [allPosts, users])


  
  



  return (
    <div ref={appRef} role={'button'}
      className={darkMode ? "App dark-mode" : "App"}
    >
      <appContext.Provider value={{
        allPosts, users, user, setShowPostForm, setError, userPosts, setUserPosts, location, searchedUser, setSearchedUser, messageRooms, footerRef, newIconRef, notificationCount, setNotificationCount, notifications, showPostForm, commentId, setCommentId, replyId, setReplyId, day, month, year, hours, mins, period, showShareMenu, setShowShareMenu, selectedMessage, setSelectedMessage, windowWidth, windowHeight, enableSignIn, setEnableSignIn, userStories, homeLoading, setHomeLoading, processing, setProcessing, processingType, followingStories, leavingTime, VerifiedMessageRef, showVerifiedMessage, setShowVerifiedMessage, taggedPosts, setTaggedPosts, sssMenu, setSssMenu, showNewMessageForm, setShowNewMessageForm, showChatModal, setShowChatModal, notiRed, setNotiRed, messagesRed, setMessagesRed, darkMode, setDarkMode, setShowSignUpForm, showSignUpForm, postFormFor, setPostFormFor, PostFormIDs, setPostFormIDs, processingPosts, setProcessingPosts, splitRegex, userAuth, setUser, showLoading, setShowLoading, ALLUSERNAMES, showError, setShowError, suggestedAccounts
      }} >
        <FunctionsContext>
          <h3 className={showError ? 'global-error show-error' : 'global-error'}>
            {error}
          </h3>

          {showLoading && <Loading />}
          
          <Routes>
            <Route exact path='/auth' element={<Auth />} />
            <Route exact path='/create-account' element={<CreateAccount />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/bookmarked-posts' element={<BookmarkedPosts />} />
            <Route exact path='/bookmarked-pages' element={<BookmarkedPages />} />
            <Route exact path='/posts/:postId/comments/:commentId' element={<PostView viewFor="comment" />} />
            <Route exact path='/posts/:postId/comments/:commentId/replies/:replyId'
              element={<PostView viewFor="reply" />}
            />
            <Route exact path='/settings/edit-profile' element={<CreateAccount formFor="edit" />} />
            <Route exact path='/stories/:userName/:storyId' element={<StoryLayout />} />
            <Route exact path='/messages' element={<MessagesMain />} />
            <Route exact path='/messages/:dmUrl' element={<MessagesMain />} />
            <Route exact path='/notifications' element={<Notifications />} />
            <Route exact path='/posts/:postId' element={<PostView viewFor="post" />} />
            <Route exact path='/search' element={<Search />} />
            <Route exact path='/:userName' element={<Profile profileFor="search" />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route exact path='/settings' element={<Settings />} />

            
            {user && user.id &&
              <Route exact path='/new-story' element={<NewStoryLayout />} />
            }

          </Routes>

          {!homeLoading &&
            <>
              <VerifiedMessage />
              <>
              {user && user.id &&
                <>
                  <ShareMenu />
                  <PostForm />
                </>
              }
              </>
            </>
          }
        </FunctionsContext>
      </appContext.Provider>
    </div>
  )
}

export default App