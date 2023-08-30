import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { auth, db, directMessagesRef, postsRef, storage, usersRef } from './firebase/config'
import {v4 as uuidv4} from 'uuid';

import Home from './Pages/Home'
import PostView from './Pages/PostView'
import Profile from './Pages/Profile'
import Notifications from './Pages/Notifications'
import SearchProfile from './Pages/SearchProfile'
import Search from './Pages/Search'
import Auth from './Pages/Auth'
import Settings from './Pages/Settings'
import Messaging from './Pages/Messaging'
import EditProfile from './Pages/EditProfile'
import Messages from './Pages/Messages'
import ForwardedStory from './Pages/ForwardedStory'
import CommentReplyView from './Pages/CommentReplyView'
import CommentView from './Pages/CommentView'
import BookmarkedPages from './Pages/BookmarkedPages'
import BookmarkedPosts from './Pages/BookmarkedPosts'
import StoryLayout from './Pages/StoryLayout'

import ShareMenu from './Components/ShareMenu'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import StoryForm from './Components/StoryForm'
import Processing from './Components/Processing'
import RequireAuth from './Components/RequireAuth'
import VerifiedMessage from './Components/VerifiedMessage'
import ShareStoryMenu from './Components/ShareStoryMenu'
import ReplyForm from './Components/ReplyForm'
import ReplyReplyForm from './Components/ReplyReplyForm'
import SignUp from './Components/SignUp'


export const appContext = React.createContext()
const App = () => {
  const cookies = new Cookies()
  const [showSignUpForm, setShowSignUpForm] = useState(false)
  const [homeLoading, setHomeLoading] = useState(true)
  const [enableSIgnIn, setEnableSignIn] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState()
  const [userStories, setUserStories] = useState([])
  const [followingStories, setFollowingStories] = useState([])
  const followStory = useRef()
  const [searchedUser, setSearchedUser] = useState()
  const [currentUserPage, setCurrentUserPage] = useState()
  const [directMessages, setDirectMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationCount, setNotificationCount] = useState(notifications.length)
  const [commentId, setCommentId] = useState('')
  const [replyId, setReplyId] = useState('')
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState({})

  const [userPosts, setUserPosts] = useState([])

  const storyType = useRef('')
  const [showForm, setShowForm] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplyReplyForm, setShowReplyReplyForm] = useState(false)
  const [newTextPost, setNewTextPost] = useState('')
  const [newMediaPost, setNewMediaPost] = useState([])
  const picPost = useRef(null)
  const [mediaCaption, setMediaCaption] = useState('')
  const [globalError, setGlobalError] = useState('')
  const gError = useRef()
  const location = useLocation()
  const [newComment, setNewComment] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()
  const footerRef = useRef()
  const newIconRef = useRef()
  let userAuth 
  const [showOptionsDIv, setShowOptionsDiv] = useState(false)
  const [showOtherOptionsDIv, setShowOtherOptionsDiv] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [sssMenu, setSssMenu] = useState(false)
  const [showNewMessageForm, setShowNewMessageForm] = useState()
  const [showMoreDiv, setShowMoreDiv] = useState(false)
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [storyText, setStoryText] = useState('')
  const [storyMedia, setStoryMedia] = useState(null)
  const [storyIsPic, setStoryIsPic] = useState(false)
  const [storyIsVid, setStoryIsVid] = useState(false)
  const [storyCaption, setStoryCaption] = useState('')
  const storyPic = useRef(null)
  const storyVid = useRef(null)
  const [mediaProcessing, setMediaProcessing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const processingType = useRef()
  const appRef = useRef()
  const leavingTime = useRef()
  const VerifiedMessageRef = useRef()
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false)
  const [taggedPosts, setTaggedPosts] = useState([])
  const [userDirectMessages, setUserDirectMessages] = useState()
  const [showChatModal, setShowChatModal] = useState(false)
  const [notiRed, setNotiRed] = useState(false) 
  const [messagesRed, setMessagesRed] = useState(false)
  const currentStory = useRef()
  const [showComOptionsDIv, setShowComOptionsDiv] = useState(false)
  const [showRepOptionsDIv, setShowRepOptionsDiv] = useState(false)
  const [showOtherComOptionsDIv, setShowOtherComOptionsDiv] = useState(false)
  const [showOtherRepOptionsDIv, setShowOtherRepOptionsDiv] = useState(false)

  const replyFormPostId = useRef('')
  const replyFormCommentId = useRef('')
  const replyReplyFormPostId = useRef('')
  const replyReplyFormCommentId = useRef('')
  const optionsPostId = useRef('')
  const otherOptionsPostId = useRef('')
  const commentOptionsPostId = useRef('')
  const commentOptionsCommentId = useRef('')
  const replyOptionsPostId = useRef('')
  const replyOptionsCommentId = useRef('')
  const replyOptionsReplyId = useRef('')
  const shareMenuPostId = useRef('')
  const shareMenuCommentId = useRef('')
  const shareMenuReplyId = useRef('')
  const chatId = useRef('')


  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', resize)

    return () => window.removeEventListener('resize', resize)
  }, [])

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

  const routes = useRef([])

  if (JSON.parse(localStorage.getItem('wowi-auth-token'))) {
    userAuth = JSON.parse(localStorage.getItem('wowi-auth-token'))
  } else if(auth.currentUser?.uid) {
    userAuth = auth.currentUser?.uid
  } else if (cookies.get('wowi-auth-token')) {
    userAuth = cookies.get('wowi-auth-token')
  }

  useEffect(() => {
    const ls = JSON.parse(localStorage.getItem('wowi-auth-token'))
    const au = auth.currentUser?.uid
    const c = cookies.get('wowi-auth-token')
    if (ls === undefined && au === undefined && c === undefined) {
      setShowSignUpForm(true)
    }
  }, [])

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
    if (user) {
      const arr = user.notifications.value?.sort((a, b) => b.sentAt - a.sentAt)
      setNotifications([...arr])

      const userRef = collection(db, 'users', user.id, 'directMessages')
      onSnapshot(userRef, snap => {
        const dm = []
        snap.docs.forEach(doc => {
          dm.push({...doc.data(), id: doc.id})
        })
        setUserDirectMessages([...dm])
      })

    }
  }, [user])

  useEffect(() => {
    if (allPosts.length > 0) {
      setHomeLoading(false)
    }
  }, [allPosts])

  useEffect(() => {
    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(postsQuery, snap => {
      let tempPosts = []
      snap.docs.forEach(doc => {
        tempPosts.push({ ...doc.data(), id: doc.id })
      })
      setAllPosts(tempPosts)
    })

    const subscribe = onSnapshot( usersRef, snap => {
      let tempUsers = []
      snap.docs.forEach(doc => {
        tempUsers.push({ ...doc.data(), id: doc.id })
      })
      setUsers(tempUsers)
    })


    const unsubscribeII = onSnapshot(directMessagesRef, snap => {
      // console.log(body)
      let tempDMs = []
      snap.docs.forEach(doc => {
        tempDMs.push({ ...doc.data(), id: doc.id })
      })
      setDirectMessages(tempDMs)
    })
    // console.log(JSON.parse(localStorage.getItem('wowi-app-mode')))
    

    if (location.pathname.includes('stories')) {
      navigate('/')
    }

    return () => {
      unsubscribe()
      subscribe()
      unsubscribeII()
    }
  }, [])
  
  useEffect(() => {
    if (userAuth) {
      const userRef = doc(db, 'users', userAuth)
      updateDoc(userRef, {
        posts: {
          value: [...userPosts]
        }
      })
    }

    if (user) {
      const storyRef = collection(db, 'users', user.id, 'stories')
      const storyQuery = query(storyRef, orderBy('createdAt', 'asc'))
      onSnapshot(storyQuery, snap => {
        const arr = []
        snap.docs.forEach(doc => {
          arr.push({...doc.data(), id: doc.id})
        })
        setUserStories([...arr])
      })
    }

    // if (user) {
    //   setUserStories(user.stories.value)
    // }
  }, [user, userPosts])

  useEffect(() => {
    userAuth && setUser(users.find(person => person.userId === userAuth))
    setUserPosts(allPosts.filter(post => post.creator === userAuth))
  }, [userAuth, allPosts, users])

  const updateUserPosts = (postId) => {  
    const docRef = doc(db, 'users', userAuth)
    updateDoc(docRef, {
      posts: {
        value: [...userPosts]
      }
    })

    const condition = user.likes.value.find(like => like === postId)
    if (condition) { 
      updateDoc(docRef, {
        likes: {
          value: [...user.likes.value.filter(like => like !== postId)]
        }
      })
    }
    else {
      updateDoc(docRef, {
        likes: {
          value: [...user.likes.value, postId]
        }
      }).catch((err) => {
        gError?.classList.add('show-error')
        setGlobalError(err.message)
        setTimeout(() => {
          gError?.classList.remove('show-error')
        }, 3000 )
      })
    }
  }

  const handleLike = (id) => {
    const docRef = doc(db, 'posts', id)

    const post = allPosts.find(post => post.id === id)
    const condition = post.likes.value.find(like => like === userAuth)

    if (condition) {
      updateDoc(docRef, {
        likes: {
          value: post.likes.value.filter(like => like !== userAuth)
        }
      }).then(() => {
        updateUserPosts(id)
      }).catch((err) => {
        gError?.classList.add('show-error')
        setGlobalError(err.message)
        setTimeout(() => {
          gError?.classList.remove('show-error')
        }, 3000 )
      })
    } else {
      updateDoc(docRef, {
        likes: {
          value: [...post.likes.value, userAuth]
        }
      }).then(() => {
        updateUserPosts(id)
        const notiId = uuidv4()
        const creator = users.find(user => user.id === post.creator)
        const userRef = doc(db, 'users', creator.id)
        updateDoc(userRef, {
          notifications: {
            value: [...creator.notifications.value, {
              id: notiId,
              type: 'post-like', 
              value: id, 
              likedBy: userAuth,
              sentAt: time.getTime()
            }]
          }
        })
      }).catch((err) => {
        gError?.classList.add('show-error')
        setGlobalError(err.message)
        setTimeout(() => {
          gError?.classList.remove('show-error')
        }, 3000 )
      })
    }
  }

  const likeComment = (postId, commentId) => {
    const docRef = doc(db, 'posts', postId, 'comments', commentId)

    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    
    const condition = comment.likes.value.find(like => like === userAuth)

    if (condition) {
      updateDoc(docRef, {
        likes: {
          value: comment.likes.value.filter(like => like !== userAuth)
        }
      }).then(() => {
        call()
      })
    } else {
      updateDoc(docRef, {
        likes: {
          value: [...comment.likes.value, userAuth]
        }
      }).then(() => {
        call()
        const notiId = uuidv4()
        const creator = users.find(user => user.id === comment.creator)
        const userRef = doc(db, 'users', creator.id)
        updateDoc(userRef, {
          notifications: {
            value: [...creator.notifications.value, {
              id: notiId,
              type: 'comment-like', 
              value: commentId,
              postId: postId,
              likedBy: userAuth,
              sentAt: time.getTime()
            }]
          }
        })
      })
    }

    const call = () => {
      const docRefII = doc(postsRef, postId)
      const commentRef = collection(postsRef, postId, 'comments')
      let arr = []
      onSnapshot(commentRef, snap => {
        snap.docs.forEach(doc => {
          arr.push({ ...doc.data(), id: doc.id })
        })
        updateDoc(docRefII, {
          comments: {
            value: [...arr]
          }
        } )
      })
    }
  }

  const likeCommentReply = (postId, commentId, replyId) => {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    const reply = comment.replies.value.find(reply => reply.id === replyId)

    const docRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId)
    const condition = reply.likes.value.find(like => like === userAuth)
    if (condition) {
      updateDoc(docRef, {
        likes: {
          value: reply.likes.value.filter(like => like !== userAuth)
        }
      }).then(() => {
        call()
      })
    } else {
      updateDoc(docRef, {
        likes: {
          value: [...reply.likes.value, userAuth]
        }
      }).then(() => {
        call()
        const notiId = uuidv4()
        const creator = users.find(user => user.id === reply.creator)
        const userRef = doc(db, 'users', creator.id)
        updateDoc(userRef, {
          notifications: {
            value: [...creator.notifications.value, {
              id: notiId,
              type: 'reply-like', 
              value: replyId,
              commentId: commentId,
              postId: postId,
              likedBy: userAuth,
              sentAt: time.getTime()
            }]
          }
        })
      })
    }

    const call = () => {
      const repliesRef = collection(postsRef, postId, 'comments', commentId, 'replies')
      onSnapshot(repliesRef, snap => {
        let arr = []
        snap.docs.forEach(doc => {
          arr.push({ ...doc.data(), id: doc.id })
        })
        const docRefIII = doc(db, 'posts', postId, 'comments', commentId)
        updateDoc(docRefIII, {
          replies: {
            value: [...arr]
          }
        }).then(() => {

          const commentRef = collection(postsRef, postId, 'comments')
          onSnapshot(commentRef, snap => {
            const commentsArr = []
            snap.docs.forEach(doc => {
              commentsArr.push({...doc.data(), id: doc.id})
            })
            const docRefIV = doc(db, 'posts', postId)
            updateDoc(docRefIV, {
              comments: {
                value: [...commentsArr]
              }
            })
          })
        })
      })
    }
  }


  const storyRef = useRef(true)
  useEffect(() => {
    if (storyRef.current) {
      storyRef.current = false;
    } else {
      const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
      if (storyMedia && photoTypes.includes(storyMedia.type)) {
        const selected = storyMedia
        setStoryIsPic(true)
        setStoryIsVid(false)

        const avatarRef = ref(storage, `pending-story-img${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            storyPic.current = url
          }).then(() => {
            document.querySelector('.img-story').src = storyPic.current
          })
        })
      }
      else if (storyMedia && vidTypes.includes(storyMedia.type)) {
        const selected = storyMedia
        setStoryIsVid(true)
        setStoryIsPic(false)

        const avatarRef = ref(storage, `pending-story-vid${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            storyVid.current = url
          }).then(() => {
            document.querySelector('.vid-story').src = storyVid.current
          })
        })
      }
    }
  }, [storyMedia, storyPic.current, storyVid.current]);

  // const storyPosting = async (e, prop) => {
  //   processingType.current = 'Story sent'
  //   e.preventDefault()
  //   if (!storyMedia) {
  //     if (storyText !== '') {
  //       setProcessing(true)
  //       const userRef = doc(db, "users", userAuth)
  //       const storyId = uuidv4()
  //       updateDoc(userRef, {
  //         stories: {
  //           value: [...user.stories.value, {
  //             id: storyId,
  //             body: storyText,
  //             createdAt: time.getTime(),
  //             type: 'Text-Story',
  //             props: prop,
  //             beenChecked: false,
  //             viewers: {
  //               value: []
  //             }
  //           }]
  //         }
  //       }).then(docRef => {
  //         const id = uuidv4()
  //         const words = storyText.split(/['.', '/',' ', ':', ';', ',']/)
  //         users.map(user => {
  //           const condition = words.find(word => word === `@${user?.username}` )
  //           if (condition) {
  //             const userRef = doc(db, 'users', user.id)
  //             updateDoc(userRef, {
  //               notifications: {
  //                 value: [...user.notifications.value, {
  //                   id: storyId,
  //                   type: 'story-tag',
  //                   value: storyId,
  //                   taggedBy: userAuth,
  //                   sentAt: time.getTime()
  //                 }]
  //               }
  //             }).then(() => {
  //               const userRef = collection(db, 'users', userAuth, 'stories')
  //               onSnapshot(userRef, snap => {
  //                 const arr = []
  //                 snap.docs.forEach(doc => {
  //                   arr.push({...doc.data(), id:doc.id})
  //                 })
  //                 setTimeout(() => {
  //                   const condition = arr.find(story => story.id === storyId)
  //                   if (!condition) {
  //                     const userRef = doc(db, 'users', user.id)
  //                     const notis = user.notifications.value.filter(noti => noti.id !== storyId)
  //                     updateDoc(userRef, {
  //                       notifications: {
  //                         value: [...notis]
  //                       }
  //                     })
  //                   }
  //                 }, 60000);
  //               })
  //             })
  //           }
  //         })
  //         setStoryText('')
  //         setShowStoryForm(false)
  //         setTimeout(() => {
  //           setShowReplyReplyForm(false)
  //           setProcessing(false)
  //         }, 1000)
  //       })
  //         // .catch((err) => console.log(err.message))
  //     }
  //   } else {
  //     const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
  //     const vidTypes = ['video/mp4']

  //     try {
  //       if (storyIsPic && photoTypes.includes(storyMedia.type)) {
  //         setProcessing(true)
  //         const selected = storyMedia
  //         let mediaUrl
  
  //         const avatarRef = ref(storage, `media-story${userAuth}/${time.getTime().toString()}`)
  //         uploadBytes(avatarRef, selected).then(() => {
  //           getDownloadURL(avatarRef).then(url => {
  //             mediaUrl = url
  //           }).then(() => {
  //             const userRef = collection(db, "users", userAuth)
  //             const storyId = uuidv4()
  //             updateDoc(userRef, {
  //               stories: {
  //                 value: [...user.stories.value, {
  //                   id: storyId,
  //                   caption: storyCaption,
  //                   body: mediaUrl,
  //                   createdAt: time.getTime(),
  //                   type: 'Img-Story',
  //                   props: prop,
  //                   beenChecked: false,
  //                   viewers: {
  //                     value: []
  //                   }
  //                 }]
  //               }
  //             }).then(docRef => {
  //               const id = uuidv4()
  //               const words = storyCaption.split(/['.', '/',' ', ':', ';', ',']/)
  //               users.map(user => {
  //                 const condition = words.find(word => word === `@${user?.username}` )
  //                 if (condition) {
  //                   const userRef = doc(db, 'users', user.id)
  //                   updateDoc(userRef, {
  //                     notifications: {
  //                       value: [...user.notifications.value, {
  //                         id: id,
  //                         type: 'story-tag',
  //                         value: storyId,
  //                         taggedBy: userAuth,
  //                         sentAt: time.getTime()
  //                       }]
  //                     }
  //                   }).then(() => {
  //                     const userRef = collection(db, 'users', userAuth, 'stories')
  //                     onSnapshot(userRef, snap => {
  //                       const arr = []
  //                       snap.docs.forEach(doc => {
  //                         arr.push({...doc.data(), id:doc.id})
  //                       })
  //                       setTimeout(() => {
  //                         const condition = arr.find(story => story.id === storyId)
  //                         if (!condition) {
  //                           const userRef = doc(db, 'users', user.id)
  //                           updateDoc(userRef, {
  //                             notifications: {
  //                               value: [...user.notifications.value.filter(noti => noti.id !== id)]
  //                             }
  //                           })
  //                         }
  //                       }, 30000);
  //                     })
  //                   })
  //                 }
  //               })
  //             })
  //           })
  //         })
  //       } else if (storyIsVid && vidTypes.includes(storyMedia.type)) {
  //         setProcessing(true)
  //         const selected = storyMedia
  //         let mediaUrl
  
  //         const avatarRef = ref(storage, `media-story${userAuth}/${time.getTime().toString()}`)
  //         uploadBytes(avatarRef, selected).then(() => {
  //           getDownloadURL(avatarRef).then(url => {
  //             mediaUrl = url
  //           }).then(() => {
  //             const userRef = collection(db, "users", userAuth)
  //             const storyId = uuidv4()
  //             updateDoc(userRef, {
  //               stories: {
  //                 value: [...user.stories.value, {
  //                   id: storyId,
  //                   caption: storyCaption,
  //                   body: mediaUrl,
  //                   createdAt: time.getTime(),
  //                   type: 'Vid-Story',
  //                   props: prop,
  //                   beenChecked: false,
  //                   viewers: {
  //                     value: []
  //                   }
  //                 }]
  //               }
  //             }).then(docRef => {
  //               const id = uuidv4()
  //               const words = storyCaption.split(/['.', '/',' ', ':', ';', ',']/)
  //               users.map(user => {
  //                 const condition = words.find(word => word === `@${user?.username}` )
  //                 if (condition) {
  //                   const userRef = doc(db, 'users', user.id)
  //                   updateDoc(userRef, {
  //                     notifications: {
  //                       value: [...user.notifications.value, {
  //                         id: id,
  //                         type: 'story-tag',
  //                         value: storyId,
  //                         taggedBy: userAuth,
  //                         sentAt: time.getTime()
  //                       }]
  //                     }
  //                   }).then(() => {
  //                     setTimeout(() => {
  //                       const condition = userStories.find(story => story.id === storyId)
  //                       if (!condition) {
  //                         const userRef = doc(db, 'users', user.id)
  //                         updateDoc(userRef, {
  //                           notifications: {
  //                             value: [...user.notifications.value.filter(noti => noti.id !== id)]
  //                           }
  //                         })
  //                       }
  //                     }, 30000);
  //                   })
  //                 }
  //               })
  //             })
  //           })
  //         })
  //       }
  //     } finally {
  //       setStoryMedia(null)
  //       setStoryCaption('')
  //       setShowStoryForm(false)
  //       setTimeout(() => {
  //         setShowReplyReplyForm(false)
  //         setProcessing(false)
  //       }, 1000)
  //     }

      
  //   }
  // }

  // console.log(userStories)

  // console.log(notifications)

  
  
  

  const checkNewStory = ( storyId, user) => {
    const arr = []
    const userRef = collection(db, 'users', userAuth, 'stories')
    const fetch = () => {
      return new Promise((resolve, reject) => {
        onSnapshot(userRef, snap => {
          const array = []
          snap.docs.forEach(doc => {
            array.push({ ...doc.data(), id: doc.id })
            arr.push(...array)
          })
          if (arr.length > 0) {
            resolve(arr)
          }
        })
      })
    }
    
    fetch().then(arr => {
      const timer = 0
      const stories = [...arr]

      const interval = setInterval(() => {
        console.log('running')
        const condition = stories.find(story => story.id === storyId)
        if (!condition) {
          const userRef = doc(db, 'users', user.id)
          const notis = user.notifications.value.filter(noti => noti.id !== storyId)
          updateDoc(userRef, {
            notifications: {
              value: [...notis]
            }
          })
        }
        timer++
      }, 1000);
      if (timer > 59) {
        clearInterval(interval)
      }
    })
  }
  
  const storyPosting = async (e, prop) => {
    processingType.current = 'Story sent'
    e.preventDefault()
    if (!storyMedia) {
      if (storyText !== '') {
        setProcessing(true)
        const userRef = collection(db, "users", userAuth, 'stories')
        const storyId = uuidv4()
        setDoc(doc(userRef, storyId), {
          id: storyId,
          body: storyText,
          creator: userAuth,
          createdAt: time.getTime(), 
          type: 'Text-Story',
          props: prop, 
          beenChecked: false,
          viewers: {
            value: []
          }
        }).then(() => {
          const words = storyText.split(/['/', ' ', ':', ';', ',']/)
          const arr = []
          users.map(user => {
            console.log(`@${user.username}`)
            const condition = words.find(word => {
              console.log(word)
              console.log(`@${user.username.toString()}` === word.toString())
              return  word === `@${user.username}`
            })
            console.log(condition)
            if (condition) {
              arr.push(user)
            }
          })
          console.log(arr)
          console.log(storyText)
          for (let i = 0; i < arr.length; i++) {
            const userRef = doc(db, 'users', arr[i].id)
            updateDoc(userRef, {
              notifications: {
                value: [...arr[i].notifications.value, {
                  id: storyId,
                  type: 'story-tag', 
                  value: storyId, 
                  taggedBy: userAuth,
                  sentAt: time.getTime()
                }]
              }
            }).then(() => {
              checkNewStory(arr, storyId, arr[i])
            })
          }
          setStoryText('')
          setShowStoryForm(false)
          setTimeout(() => {
            setShowReplyReplyForm(false)
            setProcessing(false)
          }, 1000)
        })
          // .catch((err) => console.log(err.message))
      }
    } else {
      const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']

      try {
        if (storyIsPic && photoTypes.includes(storyMedia.type)) {
          setProcessing(true)
          const selected = storyMedia
          let mediaUrl
  
          const avatarRef = ref(storage, `media-story${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              const userRef = collection(db, "users", userAuth, 'stories')
              const storyId = uuidv4()
              setDoc(doc(userRef, storyId), {
                id: storyId,
                caption: storyCaption,
                body: mediaUrl,
                creator: userAuth,
                createdAt: time.getTime(), 
                type: 'Img-Story',
                props: prop, 
                beenChecked: false,
                viewers: {
                  value: []
                }
              }).then(docRef => {
                const id = uuidv4()
                const words = storyCaption.split(/['.', '/',' ', ':', ';', ',']/)
                users.map(user => {
                  const condition = words.find(word => word === `@${user?.username}` )
                  if (condition) {
                    const userRef = doc(db, 'users', user.id)
                    updateDoc(userRef, {
                      notifications: {
                        value: [...user.notifications.value, {
                          id: id,
                          type: 'story-tag', 
                          value: storyId, 
                          taggedBy: userAuth,
                          sentAt: time.getTime()
                        }]
                      }
                    }).then(() => {
                      // const userRef = collection(db, 'users', userAuth, 'stories')
                      // onSnapshot(userRef, snap => {
                      //   const arr = []
                      //   snap.docs.forEach(doc => {
                      //     arr.push({...doc.data(), id:doc.id})
                      //   })
                      //   setTimeout(() => {
                      //     const condition = arr.find(story => story.id === storyId)
                      //     if (!condition) {
                      //       const userRef = doc(db, 'users', user.id)
                      //       updateDoc(userRef, {
                      //         notifications: {
                      //           value: [...user.notifications.value.filter(noti => noti.id !== id)]
                      //         }
                      //       })
                      //     }
                      //   }, 30000);
                      // })
                    })
                  }
                })
              })
            })
          })
        } else if (storyIsVid && vidTypes.includes(storyMedia.type)) {
          setProcessing(true)
          const selected = storyMedia
          let mediaUrl
  
          const avatarRef = ref(storage, `media-story${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              const userRef = collection(db, "users", userAuth, 'stories')
              const storyId = uuidv4()
              setDoc(doc(userRef, storyId), {
                id: storyId,
                caption: storyCaption,
                body: mediaUrl,
                creator: userAuth,
                createdAt: time.getTime(), 
                type: 'Vid-Story',
                props: prop, 
                beenChecked: false,
                viewers: {
                  value: []
                }
              }).then(docRef => {
                const id = uuidv4()
                const words = storyCaption.split(/['.', '/',' ', ':', ';', ',']/)
                users.map(user => {
                  const condition = words.find(word => word === `@${user?.username}` )
                  if (condition) {
                    const userRef = doc(db, 'users', user.id)
                    updateDoc(userRef, {
                      notifications: {
                        value: [...user.notifications.value, {
                          id: id,
                          type: 'story-tag', 
                          value: storyId, 
                          taggedBy: userAuth,
                          sentAt: time.getTime()
                        }]
                      }
                    }).then(() => {
                      // const userRef = collection(db, 'users', userAuth, 'stories')
                      // onSnapshot(userRef, snap => {
                      //   const arr = []
                      //   snap.docs.forEach(doc => {
                      //     arr.push({...doc.data(), id:doc.id})
                      //   })
                      //   setTimeout(() => {
                      //     const condition = arr.find(story => story.id === storyId)
                      //     if (!condition) {
                      //       const userRef = doc(db, 'users', user.id)
                      //       updateDoc(userRef, {
                      //         notifications: {
                      //           value: [...user.notifications.value.filter(noti => noti.id !== id)]
                      //         }
                      //       })
                      //     }
                      //   }, 30000);
                      // })
                    })
                  }
                })
              })
            })
          })
        }
      } finally {
        setStoryMedia(null)
        setStoryCaption('')
        setShowStoryForm(false)
        setTimeout(() => {
          setShowReplyReplyForm(false)
          setProcessing(false)
        }, 1000)
      }

      
    }
  }

  
  // console.log(userStories)
  // const str = 'i.am/coming-to see:you;today'
  // const newStr = str.split(/['.', '/',' ', ':', ';']/)
  // console.log(newStr)

  const deleteStory = async (storyId) => {
    // console.log(storyId)
    const storyRef = doc(db, 'users', userAuth, 'stories', storyId)
    try {
      deleteDoc(storyRef)
    } catch (err) {
      console.error(err)
    } finally {
      console.log('message deleted')
    }
  }

  // const deleteStory = (storyId) => {
  //   // console.log(storyId)
  //   const storyRef = doc(db, 'users', userAuth, 'stories', storyId)
  //   deleteDoc(storyRef)
  //   const newList = userStories.filter(story => story.id !== storyId)
  //   const userRef = doc(db, 'users', userAuth)
  //   updateDoc(userRef, {
  //     stories: {
  //       value: [...newList]
  //     }
  //   })
  // }

  useEffect(() => {
    const body = document.querySelector('body')
    const html = document.querySelector('html')
    if (appRef.current.classList.contains('dark-mode')) {
      body.classList.add('dark-mode')
      html.classList.add('dark-mode')
      setDarkMode(true)
    } else {
      body.classList.remove('dark-mode')
      html.classList.remove('dark-mode')
      setDarkMode(false)
    }
  })

  

  

  const userIdArr = []
  for( let i = 1; i <= 100; i++ ) {
    userIdArr.push('/:userId'.repeat(i))
  } 

  const flick = (e) => {
    if (e.target.parentElement.parentElement.className === 'show-more' || e.target.parentElement.className === 'show-more') {
      setShowMoreDiv(!showMoreDiv)
    } else {
      setShowMoreDiv(false)
    }

    if (showSignUpForm) {
      setShowSignUpForm(false)
    }
  }

  return (
    <div onClick={e => flick(e)} ref={appRef} className="App">
      <appContext.Provider value={{
        allPosts, users, user, setShowForm, handleLike, setGlobalError, gError, cookies, userPosts, setUserPosts, location, searchedUser, setSearchedUser, currentUserPage, setCurrentUserPage, newComment, setNewComment, directMessages, setDirectMessages, footerRef, newIconRef, notificationCount, setNotificationCount, likeComment, notifications, userAuth, showForm, setNewMediaPost, setNewTextPost, newMediaPost, newTextPost, showReplyForm, setShowReplyForm, commentId, setCommentId, likeCommentReply, showReplyReplyForm, setShowReplyReplyForm, replyId, setReplyId, showOptionsDIv, setShowOptionsDiv, day, month, year, hours, mins, period, showShareMenu, setShowShareMenu, selectedMessage, setSelectedMessage, picPost, mediaCaption, setMediaCaption, windowWidth, showMoreDiv, storyPosting, showStoryForm, setShowStoryForm, storyText, setStoryText, enableSIgnIn, setEnableSignIn, storyType, userStories, deleteStory, storyMedia, setStoryMedia, storyIsPic, setStoryIsPic, storyIsVid, setStoryIsVid, storyPic, storyVid, storyCaption, setStoryCaption, homeLoading, setHomeLoading, processing, setProcessing, processingType, followStory, followingStories, setFollowingStories, mediaProcessing, leavingTime, showOtherOptionsDIv, setShowOtherOptionsDiv, VerifiedMessageRef, showVerifiedMessage, setShowVerifiedMessage, taggedPosts, setTaggedPosts, userDirectMessages, setUserDirectMessages, sssMenu, setSssMenu, showNewMessageForm, setShowNewMessageForm, showChatModal, setShowChatModal, replyFormPostId, replyFormCommentId, replyReplyFormPostId, replyReplyFormCommentId, optionsPostId, otherOptionsPostId, commentOptionsPostId, commentOptionsCommentId, replyOptionsPostId, replyOptionsCommentId, replyOptionsReplyId, shareMenuPostId, shareMenuCommentId, shareMenuReplyId, notiRed, setNotiRed, messagesRed, setMessagesRed, chatId, appRef, darkMode, setShowSignUpForm, showSignUpForm, currentStory, showComOptionsDIv, setShowComOptionsDiv, showRepOptionsDIv, setShowRepOptionsDiv, showOtherComOptionsDIv, setShowOtherComOptionsDiv, showOtherRepOptionsDIv, setShowOtherRepOptionsDiv
      }} >
        <h3 ref={gError} className='global-error'> {globalError} </h3>
        <Processing />
        <SignUp />
        
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='messages' element={<Messages />} />
          <Route exact path='messages/:inboxId' element={<Messages />} />
          {userIdArr.map((item, index) =>
            <Route key={index} exact path={item} element={<SearchProfile />} />
          )}
          <Route exact path='/login' element={<Auth />} />
          <Route exact path='/search' element={<Search />} />
          {userIdArr.map((item, index) =>
            <Route key={index} exact path={`/search${item}`} element={<SearchProfile />} />
          )}
          <Route exact path='/notifications' element={<Notifications />} />
          <Route exact path='/profile' element={<Profile />} />
          {userIdArr.map((item, index) =>
            <Route key={index} exact path={`/profile${item}`} element={<SearchProfile />} />
          ) }
          <Route exact path='/profile/settings' element={<Settings />} />
          <Route exact path='/profile/settings/bookmarked-posts' element={<BookmarkedPosts />} />
          <Route exact path='/profile/settings/bookmarked-pages' element={<BookmarkedPages />} />
          <Route exact path='/profile/settings/edit-profile' element={<EditProfile />} />
          <Route exact path='/profile/messaging' element={<Messaging />} />
          <Route exact path='/post/:postId' element={<PostView />} />

          <Route exact path='/comments/:commentId' element={<CommentView />} />
          <Route exact path='/replies/:replyId' element={<CommentReplyView />} />

          <Route exact path='/post/:postId/comments/:commentId' element={<CommentView />} />
          <Route exact path='/post/:postId/replies/:replyId' element={<CommentReplyView />} />
          <Route exact path='/post/:postId/comments/:commentId/replies/:replyId' element={<CommentReplyView />} />
          <Route exact path='/profile/:postId' element={<PostView />} />
          <Route exact path='/stories/:userId/:storyId' element={<StoryLayout />} />
          <Route exact path='/f/stories/:userId/:storyId' element={<ForwardedStory />} />
        </Routes>
        <VerifiedMessage />
        <StoryForm />
        <ShareMenu />
        <ShareStoryMenu currStory={currentStory.current}/>
        <ReplyForm />
        <ReplyReplyForm />
      </appContext.Provider>
    </div>
  )
}

export default App