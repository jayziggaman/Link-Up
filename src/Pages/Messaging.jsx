import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaPlus, FaPaperPlane, FaMicrophone, FaStop, FaTrashAlt, FaReply } from 'react-icons/fa'
import { appContext } from '../App'
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { db, directMessagesRef, storage } from '../firebase/config'
import {v4 as uuidv4} from 'uuid';
import Message from '../Components/Message'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { ReactMediaRecorder } from 'react-media-recorder'
import verifiedBadge from '../Images/verified-badge.jpg'
import MessagesMain from '../Components/MessagesMain'
import Chat from '../Components/Chat'
import MessagesNav from '../Components/MessagesNav'
import MessagesHeader from '../Components/MessagesHeader'
import ChatViewModal from '../Components/ChatViewModal'
import ChatDateMarker from '../Components/ChatDateMarker'

const Messaging = ({selectedMediaId, selectedMediaType}) => {
  const navigate = useNavigate()
  const {inboxId} = useParams()
  const {
    userAuth, day, month, year, hours, mins, period, users, setCurrentUserPage, user, currentUserPage, leavingTime, gError, userDirectMessages
  } = useContext(appContext)
  const [newMessage, setNewMessage] = useState('')
  const location = useLocation()
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }

  const statRef = useRef()
  const [chatDateMarker, setChatDateMarker] = useState([])
  const [roomMessages, setRoomMessages] = useState()
  const [isOnePic, setIsOnePic] = useState(false)
  const [isOneVid, setIsOneVid] = useState(false)
  const photoUrl = useRef('')
  const videoUrl = useRef('')
  const audioRef = useRef()
  const [isActive, setIsActive] = useState()
  const [activeLast, setActiveLast] = useState()
  const [rmLength, setRmLength] = useState(0)
  const [mediaText, setMediaText] = useState('')
  const [voiceMessage, setVoiceMessage] = useState()
  const [recordingState, setRecordingState] = useState('inactive')
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const [timeTrigger, setTimeTrigger] = useState(false)
  // const [lastTime, setLastTime] = useState((time.getTime() / 1000).toFixed(0))
  const [index, setIndex] = useState(0)
  const [paraCondition, setParaCondition] = useState()
  const deleteMessage = useRef()
  const deleteMessageII = useRef()
  const messageId = useRef()
  const replyMessageType = useRef()
  const replyMessageDiv = useRef()
  const [isReply, setIsReply] = useState(false)
  const [replyMessageBody, setReplyMessageBody] = useState('')
  const messagesSect = useRef()
  const mediaDiv = useRef()
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [loading, setLoading] = useState(true)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  useEffect(() => {
    if (roomMessages !== undefined && paraCondition !== undefined) {
      setLoading(false)
    }
  }, [roomMessages, paraCondition])

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main?.querySelectorAll('video')
      allVideos?.forEach(video => video.pause())
    }
  }, [])

  useEffect(() => {
    function scroll() {
      setScrollTop(window.scrollY)
      deleteMessage.current?.classList.remove('show-del-div')
      deleteMessageII.current?.classList.remove('show-del-div')
    }
    window.addEventListener('scroll', scroll)

    return () => window.removeEventListener('scroll', scroll)
  }, [])

  useEffect(() => {
    setCurrentUserPage(users.find(user => user.id === location.state?.id))
  }, [users, location.pathname])

  useEffect(() => {
    if (currentUserPage) {
      setParaCondition(currentUserPage?.dmId.localeCompare(user?.dmId))
    }
  }, [currentUserPage, location.pathname])

  
  useEffect(() => {
    // userDirectMessages?.map(dm => console.log(dm.id.slice(0, dm.id.length - 1) === inboxId))
    const condition = userDirectMessages?.find(dm => dm.id.slice(0, dm.id.length - 1) === inboxId)
    if (!loading && !condition) {
      const setUp = async () => {
        try {
          if (paraCondition === 1) {
            setDoc(doc(directMessagesRef, `${inboxId}a`), {
              mainUser: user.id,
              otherUser: currentUserPage.id,
              chatDateMarker: [],
              isActive: true,
              activeLast: Math.floor(time.getTime() / 1000)

            }).then(() => {
              setDoc(doc(directMessagesRef, `${inboxId}b`), {
                mainUser: currentUserPage.id,
                otherUser: user.id,
                chatDateMarker: [],
                isActive: false,
                activeLast: 0
              })
            })

          } else {
            setDoc(doc(directMessagesRef, `${inboxId}a`), {
              mainUser: currentUserPage.id,
              otherUser: user.id,
              chatDateMarker: [],
              isActive: false,
              activeLast: 0

            }).then(() => {
              setDoc(doc(directMessagesRef, `${inboxId}b`), {
                mainUser: user.id,
                otherUser: currentUserPage.id,
                chatDateMarker: [],
                isActive: true,
                activeLast: Timestamp.now().seconds
              })
            })
          }

        } finally {
          if (paraCondition === 1) {
            const ref = collection(db, 'users', user.id, 'directMessages')
            setDoc(doc(ref, `${inboxId}a`), {
              id: `${inboxId}a`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: currentUserPage.id,
              lastSeen: Math.floor(time.getTime() / 1000)
            }).then(() => {
              const ref = collection(db, 'users', currentUserPage.id, 'directMessages')
              setDoc(doc(ref, `${inboxId}b`), {
                id: `${inboxId}b`,
                mostRecentMessage: '',
                mostRecentMessageTime: '',
                mostRecentMessageCreator: '',
                createdAt: '',
                mostRecentMessageType: '',
                user: user.id,
                lastSeen: 0
              })
            })

          } else {
            const ref = collection(db, 'users', user.id, 'directMessages')
            setDoc(doc(ref, `${inboxId}b`), {
              id: `${inboxId}b`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: currentUserPage.id,
              lastSeen: Math.floor(time.getTime() / 1000)
            }).then(() => {
              const ref = collection(db, 'users', currentUserPage.id, 'directMessages')
              setDoc(doc(ref, `${inboxId}a`), {
                id: `${inboxId}a`,
                mostRecentMessage: '',
                mostRecentMessageTime: '',
                mostRecentMessageCreator: '',
                createdAt: '',
                mostRecentMessageType: '',
                user: user.id,
                lastSeen: 0
              })
            })
          }
        }
      }
      setUp()
    }
  }, [loading])


  const deleteMsg = async (messageId) => {
    if (paraCondition === 1) {
      const docRef = doc(db, 'directMessages', `${inboxId}a`, 'messages', messageId)
      deleteDoc(docRef)

    } else {
      const docRef = doc(db, 'directMessages', `${inboxId}b`, 'messages', messageId)
      deleteDoc(docRef)
    }
  }

  const replyMessage = () => {
    setIsReply(true)
    setReplyMessageBody(rMessages.find(message => message.id === messageId.current))
    const overlay = document.querySelector('.reply-overlay')
    overlay.style.visibility = 'visible'
    const messagesSect = document.querySelector('.messages-sect')
    messagesSect.style.paddingBottom = '170px'

    if (document.querySelector(`[id='${messageId.current}'] .align-right`)) {
      const message = document.querySelector(`[id='${messageId.current}'] .align-right`)
      message.style.zIndex = 10
    } else {
      const message = document.querySelector(`[id='${messageId.current}'] .align-left`)
      message.style.zIndex = 10
    }
  }

  useEffect(() => {
    if (paraCondition) {
      if (paraCondition === 1) {
        const docRefB = doc(db, 'directMessages', `${inboxId}a`)
        onSnapshot(docRefB, doc => {
          const { chatDateMarker } = doc.data()
          doc.data() ? setChatDateMarker([...chatDateMarker]) : setChatDateMarker([])
        })
  
      } else {
        const docRefA = doc(db, 'directMessages', `${inboxId}b`)
        onSnapshot(docRefA, doc => {
          const { chatDateMarker } = doc.data()
          doc.data() ? setChatDateMarker([...chatDateMarker]) : setChatDateMarker([])
        })
      }
    }
  }, [paraCondition])


  useEffect(() => {
    if (paraCondition) {
      if (paraCondition === 1) {
        const docRefB = doc(db, 'directMessages', `${inboxId}b`)
        updateDoc(docRefB, {
          isActive: true,
          activeLast: Math.floor(time.getTime() / 1000)
        }).then(() => {
          const docRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}a`)
          updateDoc(docRef, {
            lastSeen: Math.floor(time.getTime() / 1000)
          })
        })
  
        } else {
          const docRefA = doc(db, 'directMessages', `${inboxId}a`)
          updateDoc(docRefA, {
            isActive: true,
            activeLast: Math.floor(time.getTime() / 1000)
          }).then(() => {
            const docRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}b`)
            updateDoc(docRef, {
              lastSeen: Math.floor(time.getTime() / 1000)
            })
          })
        }
    }

    return () => {
      if (paraCondition) {
        if (paraCondition === 1) {
          const docRefB = doc(db, 'directMessages', `${inboxId}b`)
          updateDoc(docRefB, {
            isActive: false,
            activeLast: Timestamp.now().seconds
          }).then(() => {
            const docRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}a`)
            updateDoc(docRef, {
              lastSeen: Timestamp.now().seconds
            })
          })
    
        } else {
          const docRefA = doc(db, 'directMessages', `${inboxId}a`)
          updateDoc(docRefA, {
            isActive: false,
            activeLast: Timestamp.now().seconds
          }).then(() => {
            const docRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}b`)
            updateDoc(docRef, {
              lastSeen: Timestamp.now().seconds
            })
          })
        }
      }
    }
  }, [paraCondition])
  

  useEffect(() => {
    if (paraCondition) {
      if (paraCondition === 1) {
        const docRef = doc(db, 'directMessages', `${inboxId}a`)
        onSnapshot(docRef, doc => {
          const data = doc.data()
          const {isActive, activeLast} = data
          setIsActive(isActive)
          setActiveLast(activeLast)
        })
        
      } else {
        const docRef = doc(db, 'directMessages', `${inboxId}b`)
        onSnapshot(docRef, doc => {
          const data = doc.data()
          const {isActive, activeLast} = data
          setIsActive(isActive)
          setActiveLast(activeLast)
        })
      }
    }
  }, [paraCondition])


  useEffect(() => {
    if (paraCondition) {
      if (paraCondition === 1) {
        const dmRef = collection(db, 'directMessages', `${inboxId}a`, 'messages' )
        onSnapshot(dmRef, snap => {
          const arr = []
          snap.docs.forEach(doc => {
            arr.push({...doc.data(), id:doc.id})
          })
          const sort = arr.sort((a, b) => a.createdAt - b.createdAt)
          setRoomMessages([...sort])
        })
        
      } else {
        const dmRef = collection(db, 'directMessages', `${inboxId}b`, 'messages' )
        onSnapshot(dmRef, snap => {
          const arr = []
          snap.docs.forEach(doc => {
            arr.push({...doc.data(), id:doc.id})
          })
          const sort = arr.sort((a, b) => a.createdAt - b.createdAt)
          setRoomMessages([...sort])
        })
      }
    }
  }, [paraCondition, location.pathname])

  const rMessages = useMemo(() => {
    // Perform some expensive calculations based on the fetched data
    // For example:
    return roomMessages
  }, [roomMessages]);


  const [myMessages, setMyMessages] = useState([])
  useEffect(() => {
    setMyMessages(rMessages?.filter(message => message.creator === userAuth))
    roomMessages && setRmLength(prev => (prev - prev) + roomMessages?.length)
  }, [roomMessages])

  const [myLastMessage, setMyLastMessage] = useState([])
  useEffect(() => {
    myMessages && setMyLastMessage(myMessages[myMessages?.length - 1])
  }, [myMessages])


  const divRef = useRef()
  const fileRef = useRef(true)
  useEffect(() => {
    if (fileRef.current) {
      fileRef.current = false
    } else {
      const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
      if (fileLength === 1) {
        if (photoTypes.includes(files[0]?.type)) {
          setIsOnePic(true)
          setIsOneVid(false)
          const selected = files[0]

          const avatarRef = ref(storage, `pending-img-messages${userAuth}/${userAuth}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              photoUrl.current = url
            }).then(() => {
              document.querySelector('.img-message').src = photoUrl.current
            })
          })
        } else if (vidTypes.includes(files[0]?.type)) {
          setIsOnePic(false)
          setIsOneVid(true)
          const selected = files[0]

          const avatarRef = ref(storage, `pending-vid-messages${userAuth}/${userAuth}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              videoUrl.current = url
            }).then(() => {
              document.querySelector('.video-message').src = videoUrl.current
            })
          })
        }
      } else if (fileLength > 1) {
        const postsArr = []
        
        const run = () => {
          if (postsArr.length === fileLength) {
            postsArr.map((item, i) => {
              if (item.type === 'img') {
                const img = document.createElement('img')
                img.setAttribute('class', `img-message`)
                img.setAttribute('src', item.url)
                divRef.current.appendChild(img)
              } else {
                const vid = document.createElement('video')
                vid.setAttribute('class', `video-message`)
                vid.setAttribute('src', item.url)
                vid.setAttribute('autoplay', 'autoplay')
                divRef.current.appendChild(vid)
              }
            })
          }
        }

        for (let i = 0; i < fileLength; i++) {
          let mediaUrl
          const selected = files[i]
          const avatarRef = ref(storage, `pending-posts${files[i]?.name}/${files[i]?.name}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              if (vidTypes.includes(files[i]?.type)) {
                postsArr.push({
                  type: 'video',
                  url: mediaUrl
                })
              } else if (photoTypes.includes(files[i]?.type)) {
                postsArr.push({
                  type: 'img',
                  url: mediaUrl
                })
              } else {
                setFiles([])
                setFileLength(prev => prev - prev)
                gError?.classList.add('show-error')
                // setGlobalError(`Your post wasn't sent. Try Again.`)
                setTimeout(() => {
                  gError?.classList.remove('show-error')
                }, 3000 )
              }
            }).then(() => run())
          })
        }
      }
    }
  }, [files])

  const finish = (type) => {
    if (paraCondition === 1) {
      const meRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}a`)
      updateDoc(meRef, {
        mostRecentMessage: newMessage,
        mostRecentMessageTime: `${hours}:${mins} ${period}`,
        mostRecentMessageCreator: userAuth,
        createdAt: time.getTime(),
        mostRecentMessageType: type ,
      }).then(() => {
        const otherRef = doc(db, 'users', currentUserPage.id, 'directMessages', `${inboxId}b`)

        updateDoc(otherRef, {
          mostRecentMessage: newMessage,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
        })
      }).then(() => {
        setNewMessage('')
        setMediaText('')
        setFiles([])
        setFileLength(prev => prev - prev)
      })
    } else {
      const meRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}b`)
      updateDoc(meRef, {
        mostRecentMessage: newMessage,
        mostRecentMessageTime: `${hours}:${mins} ${period}`,
        mostRecentMessageCreator: userAuth,
        createdAt: time.getTime(),
        mostRecentMessageType: type,
      }).then(() => {
        const otherRef = doc(db, 'users', currentUserPage.id, 'directMessages', `${inboxId}a`)

        updateDoc(otherRef, {
          mostRecentMessage: newMessage,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
        })
      }).then(() => {
        setNewMessage('')
        setMediaText('')
        setFiles([])
        setFileLength(prev => prev - prev)
      })
    }
    const button = document.querySelector('.messaging-main .send-btn')
    button.disabled = false
  }

  const sendReply = async (replyId, type) => {
    const id = uuidv4()

    const overlay = document.querySelector('.reply-overlay')
    overlay.style.visibility = 'hidden'

    const messagesSect = document.querySelector('.messages-sect')
    messagesSect.style.paddingBottom = '30px'

    if (document.querySelector(`[id='${messageId.current}'] .align-right`)) {
      const message = document.querySelector(`[id='${messageId.current}'] .align-right`)
      message.style.zIndex = 0
    } else {
      const message = document.querySelector(`[id='${messageId.current}'] .align-left`)
      message.style.zIndex = 0
    }
    

    try {
      const docRefA = doc(db, 'directMessages', `${inboxId}a`)
      onSnapshot(docRefA, doc => {
        const { chatDateMarker } = doc.data()
        let condition
        chatDateMarker === [] ? condition = false :
        condition = chatDateMarker.find(date => {
          return date?.year === today.year && date?.month === today.month && date?.day === today.day
        })

        if (!condition) {
          updateDoc(docRefA, {
            chatDateMarker: [...chatDateMarker, today]
          })
        }
      })


      const docRefB = doc(db, 'directMessages', `${inboxId}b`)
      onSnapshot(docRefB, doc => {
        const { chatDateMarker } = doc.data()
        let condition
        chatDateMarker === [] ? condition = false :
        condition = chatDateMarker.find(date => {
          return date?.year === today.year && date?.month === today.month && date?.day === today.day
        })

        if (!condition) {
          updateDoc(docRefB, {
            chatDateMarker: [...chatDateMarker, today]
          })
        }
      })
    } finally {
      try {
        if (files[0] === undefined) {
          if (newMessage !== '') {
            try {
              const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
              setDoc(doc(ref, id), {
                id: id,
                body: newMessage,
                createdAt: time.getTime(),
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`,
                creator: userAuth,
                type: 'reply-text-message',
                replyMessage: replyMessageBody,
                replyMessageType: type,
                replyMessageId: replyId,
                isSent: false
        
              }).then(() => {
                const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  body: newMessage,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`,
                  creator: userAuth,
                  type: 'reply-text-message',
                  replyMessage: replyMessageBody,
                  replyMessageType: type,
                  replyMessageId: replyId,
                  isSent: false
          
                })
              }).then(() => {
                finish('text-message')
              })
            } catch (err) {
              console.log(err.message)
            }
          }
        } else if (fileLength === 1) {
          if (isOnePic) {
            try {
              let mediaUrl
              const selected = files[0]
        
              const avatarRef = ref(storage, `photo-message${userAuth}/${time.getTime().toString()}`)
              uploadBytes(avatarRef, selected).then(() => {
                getDownloadURL(avatarRef).then(url => {
                  mediaUrl = url
                }).then(() => {
                  const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaText,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'reply-photo-message',
                    replyMessage: replyMessageBody,
                    replyMessageType: type,
                    replyMessageId: replyId,
                    isSent: false
            
                  }).then(() => {
                    const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                    setDoc(doc(ref, id), {
                      id: id,
                      caption: mediaText,
                      body: mediaUrl,
                      createdAt: time.getTime(),
                      date: `${day}/${month}/${year}`,
                      time: `${hours}:${mins} ${period}`, 
                      creator: userAuth,
                      type: 'reply-photo-message',
                      replyMessage: replyMessageBody,
                      replyMessageType: type,
                      replyMessageId: replyId,
                      isSent: false
              
                    })
                  })
                }).then(() => {
                  finish('photo-message')
                })
              })
              
            } catch (err) {
              console.log(err.message)
            } 
          } else if (isOneVid) {
            try {
              let mediaUrl
              const selected = files[0]
        
              const avatarRef = ref(storage, `video-message${userAuth}/${time.getTime().toString()}`)
              uploadBytes(avatarRef, selected).then(() => {
                getDownloadURL(avatarRef).then(url => {
                  mediaUrl = url
                }).then(() => {
                  const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaText,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'reply-video-message',
                    replyMessage: replyMessageBody,
                    replyMessageType: type,
                    replyMessageId: replyId,
                    isSent: false
            
                  }).then(() => {
                    const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                    setDoc(doc(ref, id), {
                      id: id,
                      caption: mediaText,
                      body: mediaUrl,
                      createdAt: time.getTime(),
                      date: `${day}/${month}/${year}`,
                      time: `${hours}:${mins} ${period}`, 
                      creator: userAuth,
                      type: 'reply-video-message',
                      replyMessage: replyMessageBody,
                      replyMessageType: type,
                      replyMessageId: replyId,
                      isSent: false
              
                    })
                  })
                })
              }).then(() => {
                finish('video-message')
              })
  
            } catch (err) {
              console.log(err.message)
            } 
          }
        } else {
          try {
            const postsArr = []
  
            for (let i = 0; i < fileLength; i++) {
              let mediaUrl
              const selected = files[i]
              const avatarRef = ref(storage, `img/vid-posts${files[i].name}/${files[i].name}`)
              uploadBytes(avatarRef, selected).then(() => {
                getDownloadURL(avatarRef).then(url => {
                  mediaUrl = url
                }).then(() => {
                  if (files[i].type === 'video/mp4') {
                    postsArr.push({
                      type: 'video',
                      url: mediaUrl
                    })
                  } else {
                    postsArr.push({
                      type: 'img',
                      url: mediaUrl
                    })
                  }
                }).then(() => {
                  if (postsArr.length === fileLength) {
                    const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                    setDoc(doc(ref, id), {
                      id: id,
                      caption: mediaText,
                      body: postsArr,
                      createdAt: time.getTime(),
                      date: `${day}/${month}/${year}`,
                      time: `${hours}:${mins} ${period}`, 
                      creator: userAuth,
                      type: 'reply-group-media-message',
                      replyMessage: replyMessageBody,
                      replyMessageType: type,
                      replyMessageId: replyId,
                      isSent: false
              
                    }).then(() => {
                      const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                      setDoc(doc(ref, id), {
                        id: id,
                        caption: mediaText,
                        body: postsArr,
                        createdAt: time.getTime(),
                        date: `${day}/${month}/${year}`,
                        time: `${hours}:${mins} ${period}`, 
                        creator: userAuth,
                        type: 'reply-group-media-message',
                        replyMessage: replyMessageBody,
                        replyMessageType: type,
                        replyMessageId: replyId,
                        isSent: false
                      })
                    })
                  }
                }).then(() => {
                  finish('group-media-message')
                })
              })
            }
          } catch (err) {
            console.log(err)
          }
        }
      } finally {
        setIsReply(false)
        replyMessageType.current = ''
        messageId.current = ''
        messagesSect.current.style.paddingBottom = '30px'
      }
    }
  }

  const handleNewMessage = async () => {
    const id = uuidv4()

    try {
      const docRefA = doc(db, 'directMessages', `${inboxId}a`)
      onSnapshot(docRefA, doc => {
        const { chatDateMarker } = doc.data()
        let condition
        chatDateMarker === [] ? condition = false :
        condition = chatDateMarker.find(date => {
          return date?.year === today.year && date?.month === today.month && date?.day === today.day
        })

        if (!condition) {
          updateDoc(docRefA, {
            chatDateMarker: [...chatDateMarker, today]
          })
        }
      })


      const docRefB = doc(db, 'directMessages', `${inboxId}b`)
      onSnapshot(docRefB, doc => {
        const { chatDateMarker } = doc.data()
        let condition
        chatDateMarker === [] ? condition = false :
        condition = chatDateMarker.find(date => {
          return date?.year === today.year && date?.month === today.month && date?.day === today.day
        })

        if (!condition) {
          updateDoc(docRefB, {
            chatDateMarker: [...chatDateMarker, today]
          })
        }
      })

    } finally {
      if (files[0] === undefined) {
        if (newMessage !== '') {
          try {
            const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
            setDoc(doc(ref, id), {
              id: id,
              body: newMessage,
              createdAt: time.getTime(),
              date: `${day}/${month}/${year}`,
              time: `${hours}:${mins} ${period}`, 
              creator: userAuth,
              type: 'text-message',
              isSent: false
      
            }).then(() => {
              const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
              setDoc(doc(ref, id), {
                id: id,
                body: newMessage,
                createdAt: time.getTime(),
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`, 
                creator: userAuth,
                type: 'text-message',
                isSent: false
        
              })
            }).then(() => {
              finish('text-message')
            })
          } catch (err) {
            console.log(err.message)
          } 
        }
      } else if (fileLength === 1) {
        if (isOnePic) {
          try {
            let mediaUrl
            const selected = files[0]
      
            const avatarRef = ref(storage, `photo-message${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaText,
                  body: mediaUrl,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'photo-message',
                  isSent: false
  
                }).then(() => {
                  const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaText,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'photo-message',
                    isSent: false
            
                  })
                })
              }).then(() => {
                finish('photo-message')
              })
            })
            
          } catch (err) {
            console.log(err.message)
          } 
        } else if (isOneVid) {
          try {
            let mediaUrl
            const selected = files[0]
      
            const avatarRef = ref(storage, `video-message${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaText,
                  body: mediaUrl,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'video-message',
                  isSent: false
          
                }).then(() => {
                  const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaText,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'video-message',
                    isSent: false
  
                  })
                })
              }).then(() => {
                finish('video-message')
              })
            })
  
          } catch (err) {
            console.log(err.message)
          } 
        }
      } else {
        const postsArr = []
        const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']

        for (let i = 0; i < fileLength; i++) {
          let mediaUrl
          const selected = files[i]
          const avatarRef = ref(storage, `img/vid-posts${files[i].name}/${files[i].name}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              if (types.includes(files[i].type)) {
                postsArr.push({
                  type: 'video',
                  url: mediaUrl
                })
              } else {
                postsArr.push({
                  type: 'img',
                  url: mediaUrl
                })
              }
            }).then(() => {
              if (postsArr.length === fileLength) {
                const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaText,
                  body: postsArr,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'group-media-message',
                  isSent: false
          
                }).then(() => {
                  const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaText,
                    body: postsArr,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'group-media-message',
                    isSent: false
            
                  })
                })
              }
            }).then(() => {
              finish('group-media-message')
            })
          })
        }
      }
    } 
  }

  let screenDisplay

  if (roomMessages) {
    screenDisplay = [...rMessages, ...chatDateMarker]
  }

  const sort = screenDisplay?.sort((a, b) => {
    return a.createdAt - b.createdAt
  })

  useEffect(() => {
    !loading && window.scrollTo(0, document.body.scrollHeight);
  }, [loading])
  

  return (
    <main className="messaging-main" onClick={e => {
      if (deleteMessage.current.classList.contains('show-del-div')) {
        // deleteMessage.current.classList.remove('show-del-div')
        // deleteMessage.current.style.visibility = 'hidden'
        // deleteMessage.current.style.zIndex = -100

        if(!e.target.classList.contains('reply-msg')) {
          // replyMessageType.current = ''
          // messageId.current = ''
        }
      }
      // console.log(deleteMessage.current.classList.contains('show-del-div'))
    }}>
      <header className="messaging-header">
        <button onClick={() => {
          navigate('/messages')
        } } >
          <FaArrowLeft />
        </button>
        <div>
          {/* <h1> shareME </h1> */}
          <h1>WoWi</h1>
        </div>
      </header>

      {!loading ?
        <>
          <section ref={messagesSect} className="messages-sect">
            <div className="reply-overlay" onClick={e => {
              e.currentTarget.style.visibility = 'hidden'
              const messagesSect = document.querySelector('.messages-sect')
              messagesSect.style.paddingBottom = '30px'

              if (document.querySelector(`[id='${messageId.current}'] .align-right`)) {
                const message = document.querySelector(`[id='${messageId.current}'] .align-right`)
                message.style.zIndex = 0
              } else {
                const message = document.querySelector(`[id='${messageId.current}'] .align-left`)
                message.style.zIndex = 0
              }
            }}
            ></div>
            <div className='messages-intro-div'>
              <Link to={`/${location.state?.id}`}>
                <img src={location.state?.avatarUrl} alt="" />
              </Link>
    
              <p className='msg-intro-username' >
                @{location.state?.username}
                {location.state?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
              </p>
              <p className='msg-intro-displayName' > {location.state?.displayName} </p>
              <p className='msg-intro-followers' > {location.state?.followers?.value.length} followers . { location.state?.following?.value.length} following </p>
            </div>
    
            {/* <audio ref={audioRef} controls ></audio> */}
            
            {sort.map((message, index) => {
                return (
                  <div key={index}>
                    {message.year !== undefined ?
                      <ChatDateMarker message={message} />
                      :
                      <Message message={message} type={message.type} messageId={messageId}
                      currentUserPage={currentUserPage} deleteMessage={deleteMessage}
                      replyMessageType={replyMessageType} selectedMediaId={selectedMediaId}
                      selectedMediaType={selectedMediaType} scrollTop={scrollTop} deleteMessageII={deleteMessageII}
                      />
                    }
                  </div>
                )
              })
            }
    
            {roomMessages[rmLength - 1]?.creator === userAuth &&
              <span ref={statRef} className="message-stat right-stat">
                {isActive || activeLast - (Math.floor(myLastMessage?.createdAt / 1000)) > 0 ? 'seen' : 'sent'}
              </span>
            }
    
            <div ref={deleteMessage} className="delete-msg-reply-msg"
              onClick={() => {
                deleteMessage.current.classList.remove('show-del-div')
              }}
              // style={{top: y, right: x}}
            >
              <button className='reply-msg' onClick={() => {replyMessage()}}>
                reply
              </button>
    
              <button className="delete-msg" onClick={() => deleteMsg(messageId.current)}>
                delete
              </button>
            </div> 
    
            
            <div ref={deleteMessageII} className="delete-msg-reply-msg-II"
              onClick={() => {
                // deleteMessage.current.classList.remove('show-del-div')
              }}
              // style={{top: y, right: x}}
            >
              <button className='reply-msg' onClick={() => {replyMessage()}}>
                reply
              </button>
    
              <button className="delete-msg" onClick={() => deleteMsg(messageId.current)}>
                delete
              </button>
            </div>  
  
          </section>
    
    
          <div className="messages-input">
            
            <div className="select-file">
              <label htmlFor="select-media-message">
                <input autoComplete='off' type="file" id='select-media-message' name='select-media-message'
                  onClick={e => {
                    e.target.value = null
                    setIsOnePic(false)
                    setIsOneVid(false)
                    // setIsReply(false)
                  }}
                  onChange={e => {
                    setFiles(e.target.files)
                    setFileLength(prev => (prev - prev) + e.target.files.length)
                  }}  multiple='multiple' maxLength='5'
                />
                <span>
                  <FaPlus />
                </span>
              </label>
            </div>
    
            <div className="message-input-div">
              <div className="media-input-div" style={files[0] ? { display: 'block' } : { display: 'none' }}>
    
                {fileLength > 1 && <div ref={divRef} className="multiple-dm-media-div"></div>}
    
                <img style={isOnePic ? { display: 'block' } : { display: 'none' }} src={photoUrl.current} className='img-message' />
    
                <video src={videoUrl.current} style={isOneVid ? { display: 'block' } : { display: 'none' }} className='video-message' controls loop autoPlay muted></video>
    
                <textarea autoComplete='off' style={files[0] ? { display: 'block' } : { display: 'none' }} name="" id="message-media-text" cols="30" rows="10" value={mediaText} onChange={e => setMediaText(e.target.value)}></textarea>
    
                <div className='cancel-dm-media' role={'button'} onClick={() => setFiles([])}>
                  <div></div>
                  <div></div>
                </div>
    
              </div>
              
              
    
              <textarea autoComplete='off' style={ files[0] ? {display:'none'} : {display:'block'} } className="message-input" type="text" value={newMessage} onChange={ e => setNewMessage(e.target.value) } placeholder='Type a Message...' ></textarea>
            </div>
    
            {/* {newMessage || mediaMessage &&
            
            } */}
            <button className="send-btn" onClick={e => {
              isReply ? sendReply(messageId.current, replyMessageBody?.type) : handleNewMessage()
              e.currentTarget.disabled = true
              }} >
                <FaPaperPlane />
              </button> 
    
            {/* {!newMessage && files[0] === undefined && recordingState === 'inactive' &&
              <button className='microphone-btn'>
                <FaMicrophone />
              </button> 
            }
    
            {!newMessage && files[0] === undefined && recordingState === 'recording' &&
              <button className='stop-audio-recording'>
                <FaStop />
              </button>
            } */}
  
            <ChatViewModal selectedMediaId={selectedMediaId} selectedMediaType={selectedMediaType}/>
          </div>
          </>
        :
        <>
          <div className="messaging-loading">
            <div className="messaging-loading-upper">
              <div className='messaging-loading-pfp'></div>
              <div className='messaging-loading-username'></div>
              <div className='messaging-loading-username'></div>
            </div>

            <div className="messaging-loading-lower">
              {loadArr.map((item, index) => {
                return (
                  <div className='message-loading' key={index}>
                    {index % 2 === 0 ?
                      <div className="align-right"></div>
                      :
                      <div className="align-left"></div>
                    }
                  </div>
                )
              })
              }
            </div>
          </div>
        </>
      }
    </main>
  )
}

export default Messaging