import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaPlus, FaAngleLeft, FaAngleRight, FaEye, FaTrashAlt, FaAngleUp, FaAngleDown, FaImages, FaPaperPlane } from 'react-icons/fa'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, directMessagesRef, storage, usersRef } from '../firebase/config'
import FriendsList from '../Components/FriendsList'
import StoryList from '../Components/StoryList'
import verifiedBadge from '../Images/verified-badge.jpg'
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import ShareStoryMenu from '../Components/ShareStoryMenu'

const StoryLayout = () => {
  const { 
    users, user, setShowStoryForm, storyType, userStories, deleteStory, followStory, followingStories, setFollowingStories, userAuth, gError, year, mins, period, day, month, hours, userDirectMessages, sssMenu, setSssMenu, currentStory
  } = useContext(appContext)
  const [storyCreator, setStoryCreator] = useState()
  const [storyIndex, setStoryIndex] = useState(0)
  const [index, setIndex] = useState(0)
  const {userId} = useParams()
  const {storyId} = useParams() 
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }

  const navigate = useNavigate() 
  const location = useLocation()
  const [showViews, setShowViews] = useState(false)

  const [myStories, setMyStories] = useState()
  const [currStory, setCurrStory] = useState()
  const [personStories, setPersonStories] = useState()

  const [storyReply, setStoryReply] = useState('')
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const [storyReplyCaption, setStoryReplyCaption] = useState('')
  const [isOnePic, setIsOnePic] = useState(false)
  const [isOneVid, setIsOneVid] = useState(false)
  const picReply = useRef()
  const vidReply = useRef()
  const divRef = useRef()

  //user's stories - userStories
  //other person's story - personStories + their id
  //personStories.creatorStories - another person's story list
  //collection of other user's stories - followingStories
  //currStory - current story in view
  //a user's storylist to cause a rerender - stories

  useEffect(() => {
    if (user) {
      if (user.visitedRoutes.value[user.visitedRoutes.value.length - 1] === location.pathname) {
        return
      } else {
        const condititon = user.visitedRoutes.value.find(route => route === location.pathname)
        if (!condititon) {
          const userRef = doc(db, 'users', user?.id)
          updateDoc(userRef, {
            visitedRoutes: {
              value: [...user?.visitedRoutes.value, location.pathname]
            }
          })
        }
      }
    }
  }, [location.pathname])

  useEffect(() => {
    currentStory.current = currStory
  }, [currStory])

  useEffect(() => {
    if (storyType.current === 'user') {
      setMyStories([...userStories])
    } else if (storyType.current === 'following') {
     setPersonStories(followingStories.find(storyObj => storyObj.creatorId === followStory.current))
    }
  }, [userStories, followingStories])

  useEffect(() => {
    setStoryCreator(users.find(user => user.username === userId))
    if (storyType.current === 'following') {
      setCurrStory(personStories?.creatorStories?.find(story => story.id === storyId))
      const user = users.find(user => user.username === userId)
      const i = followingStories.findIndex(storyObj => storyObj.creatorId === user.id)
      setStoryIndex(prev => (prev - prev) + i)

    } else if (storyType.current === 'user') {
      setCurrStory(myStories?.find(story => story.id === storyId))
    }
  }, [location.pathname, myStories, personStories])

  const indexRef = useRef(true)
  useEffect(() => {
    if (indexRef.current) {
      indexRef.current = false
    } else {
      if (storyType.current === 'following') {
        const ind = personStories?.creatorStories?.findIndex(story => story.id === storyId)
        personStories && setIndex(prev => (prev - prev) + ind)
  
      } else if (storyType.current === 'user') {
        const i = myStories?.findIndex(story => story.id === storyId)
        myStories && setIndex(prev => (prev - prev) + i)
      }
    }
  }, [location.pathname, myStories, personStories])
  
  const storyIndexRef = useRef(true)
  useEffect(() => {
    if (storyIndexRef.current) {
      storyIndexRef.current = false
    } else {
      followStory.current = followingStories[storyIndex]?.creatorId
      const user = users.find(user => user.id === followStory.current)
      setPersonStories(followingStories.find(storyObj => storyObj.creatorId === followStory.current))
      if (location.pathname !== `/stories/${user?.username}/${followingStories[storyIndex]?.creatorStories[index]?.id}`) {
        navigate(`/stories/${user?.username}/${followingStories[storyIndex]?.creatorStories[index]?.id}`)
      } else return
    }
  }, [storyIndex])
  
  const navRef = useRef(true)
  useEffect(() => {
    const user = users.find(user => user.id === followStory.current)
    if (navRef.current) {
      navRef.current = false
    } else {
      if (storyType.current === 'following') {
        if (location.pathname !== `/stories/${user?.username}/${followingStories[storyIndex]?.creatorStories[index]?.id}`) {
          navigate(`/stories/${user?.username}/${followingStories[storyIndex]?.creatorStories[index]?.id}`)
        } else return
       
      } else if (storyType.current === 'user') {
        if (location.pathname !== `/stories/${user?.username}/${userStories[index]?.id}`) {
          navigate(`/stories/${user?.username}/${userStories[index]?.id}`)
        } else return
      }
    }
  }, [index])

  const divs = document.querySelectorAll('.story-amt div')
  useEffect(() => {
    divs.forEach((div, i) => {
      i === index ? div.setAttribute('id', 'curr') : div.removeAttribute('id', 'curr')
    })
  }, [index, divs])

  const increaseIndex = () => {
    setIndex(prev => prev + 1)
  }

  const decreaseIndex = () => {
    setIndex(prev => prev - 1)
  }

  const increaseStoryIndex = () => {
    followStory.current = ''
    setStoryIndex(prev => prev + 1)
    setIndex(prev => prev - prev)
    // followStory.current = followingStories[storyIndex]?.creatorId
    // setStoryCreator(users.find(user => user.id === followingStories[storyIndex]?.creatorId))
    // setPersonStories(followingStories.find(storyObj => storyObj.creatorId === followStory.current))
  }

  const decreaseStoryIndex = () => {
    followStory.current = ''
    setStoryIndex(prev => prev - 1)
    setIndex(prev => prev - prev)
    // followStory.current = followingStories[storyIndex]?.creatorId
    // setStoryCreator(users.find(user => user.id === followingStories[storyIndex]?.creatorId))
    // setPersonStories(followingStories.find(storyObj => storyObj.creatorId === followStory.current))
  }

  useEffect(() => {
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
            picReply.current = url
          }).then(() => {
            document.querySelector('.img-message').src = picReply.current
          })
        })
      } else if (vidTypes.includes(files[0]?.type)) {
        setIsOnePic(false)
        setIsOneVid(true)
        const selected = files[0]

        const avatarRef = ref(storage, `pending-vid-messages${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            vidReply.current = url
          }).then(() => {
            document.querySelector('.video-message').src = vidReply.current
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
  }, [files])

  const finish = (para, paraCondition, type) => {
    if (paraCondition === 1) {
      const condition = userDirectMessages.find(dm => dm.id === `${para}a`)
      if (condition) {
        const meRef = doc(db, 'users', userAuth, 'directMessages', `${para}a`)
        updateDoc(meRef, {
          mostRecentMessage: storyReply,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
        }).then(() => {
          const otherRef = doc(db, 'users', followStory.current, 'directMessages', `${para}b`)

          updateDoc(otherRef, {
            mostRecentMessage: storyReply,
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: type,
          })
        })
      } else {
        const meRef = collection(usersRef, userAuth, 'directMessages')
        setDoc(doc(meRef, `${para}a`), {
          id: `${para}a`,
          mostRecentMessage: storyReply,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
          user: followStory.current
        }).then(() => {
          const otherRef = collection(usersRef, followStory.current, 'directMessages')
          setDoc(doc(otherRef, `${para}b`), {
            id: `${para}b`,
            mostRecentMessage: storyReply,
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: type,
            user: userAuth
          })
        })
      }
    } else {
      const condition = userDirectMessages.find(dm => dm.id === `${para}b`)
      if (condition) {
        const meRef = doc(db, 'users', userAuth, 'directMessages', `${para}b`)
        updateDoc(meRef, {
          mostRecentMessage: storyReply,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: 'story-text-message',
        }).then(() => {
          const otherRef = doc(db, 'users', followStory.current, 'directMessages', `${para}a`)

          updateDoc(otherRef, {
            mostRecentMessage: storyReply,
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: 'story-text-message',
          })
        })
      } else {
        const meRef = collection(usersRef, userAuth, 'directMessages')
        setDoc(doc(meRef, `${para}b`), {
          id: `${para}b`,
          mostRecentMessage: storyReply,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: 'story-text-message',
          user: followStory.current
        }).then(() => {
          const otherRef = collection(usersRef, followStory.current, 'directMessages')
          setDoc(doc(otherRef, `${para}a`), {
            id: `${para}a`,
            mostRecentMessage: storyReply,
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: 'story-text-message',
            user: userAuth
          })
        })
      }
    }
  }

  const replyStory = async () => {
    const id = uuidv4()

    let para 
    const otherUser = users.find(user => user.id === followStory.current )
    const paraCondition = otherUser.dmId.localeCompare(user.dmId)
    if (paraCondition === 1) {
      para = user.dmId + otherUser.dmId
    } else {
      para = otherUser.dmId + user.dmId
    }

    try {
      const docRefA = doc(db, 'directMessages', `${para}a`)
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


      const docRefB = doc(db, 'directMessages', `${para}b`)
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
        if (storyReply !== '') {
          try {
            const ref = collection(directMessagesRef, `${para}a`, 'messages')
            setDoc(doc(ref, id), {
              id: id,
              body: storyReply,
              createdAt: time.getTime(),
              date: `${day}/${month}/${year}`,
              time: `${hours}:${mins} ${period}`, 
              creator: userAuth,
              type: 'story-text-message',
              storyCreator: currStory.creator,
              storyUrl: location.pathname,
              storyText: currStory.body,
              storyMedia: currStory.body,
              storyMediaCaption: currStory.caption || '',
              storyType: currStory.type,
              storyProps: currStory.props,
              isSent: false
      
            }).then(() => {
              const ref = collection(directMessagesRef, `${para}b`, 'messages')
              setDoc(doc(ref, id), {
                id: id,
                body: storyReply,
                createdAt: time.getTime(),
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`, 
                creator: userAuth,
                type: 'story-text-message',
                storyUrl: location.pathname,
                storyCreator: currStory.creator,
                storyText: currStory.body,
                storyMedia: currStory.body,
                storyMediaCaption: currStory.caption || '',
                storyType: currStory.type,
                storyProps: currStory.props,
                isSent: false
        
              })
            })
          } catch (err) {
            console.log(err.message)
          } finally {
            setStoryReply('')
            finish(para, paraCondition, 'story-text-message')
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
                const ref = collection(directMessagesRef, `${para}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: storyReplyCaption,
                  body: mediaUrl,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'story-photo-message',
                  storyUrl: location.pathname,
                  storyCreator: currStory.creator,
                  storyText: currStory.body,
                  storyMedia: currStory.body,
                  storyMediaCaption: currStory.caption || '',
                  storyType: currStory.type,
                  storyProps: currStory.props,
                  isSent: false
          
                }).then(() => {
                  const ref = collection(directMessagesRef, `${para}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: storyReplyCaption,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'story-photo-message',
                    storyCreator: currStory.creator,
                    storyUrl: location.pathname,
                    storyText: currStory.body,
                    storyMedia: currStory.body,
                    storyMediaCaption: currStory.caption || '',
                    storyType: currStory.type,
                    storyProps: currStory.props,
                    isSent: false
            
                  })
                })
              })
            })
            
          } catch (err) {
            console.log(err.message)
          } finally {
            setStoryReplyCaption('')
            setIsOnePic(false)
            setIsOneVid(false)
            setFiles([])
            setFileLength(prev => prev - prev)
            finish(para, paraCondition, 'story-photo-message')
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
                const ref = collection(directMessagesRef, `${para}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: storyReplyCaption,
                  body: mediaUrl,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'story-video-message',
                  storyCreator: currStory.creator,
                  storyUrl: location.pathname,
                  storyText: currStory.body,
                  storyMedia: currStory.body,
                  storyMediaCaption: currStory.caption || '',
                  storyType: currStory.type,
                  storyProps: currStory.props,
                  isSent: false
          
                }).then(() => {
                  const ref = collection(directMessagesRef, `${para}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: storyReplyCaption,
                    body: mediaUrl,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'story-video-message',
                    storyUrl: location.pathname,
                    storyCreator: currStory.creator,
                    storyText: currStory.body,
                    storyMedia: currStory.body,
                    storyMediaCaption: currStory.caption || '',
                    storyType: currStory.type,
                    storyProps: currStory.props,
                    isSent: false
            
                  })
                })
              })
            })
  
          } catch (err) {
            console.log(err.message)
          } finally {
            setStoryReplyCaption('')
            setFiles([])
            setFileLength(prev => prev - prev)
            setIsOnePic(false)
            setIsOneVid(false)
            finish(para, paraCondition, 'story-video-message')
          }
        }
      } else {
        try {
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
                  const ref = collection(directMessagesRef, `${para}a`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: storyReplyCaption,
                    body: postsArr,
                    createdAt: time.getTime(),
                    date: `${day}/${month}/${year}`,
                    time: `${hours}:${mins} ${period}`, 
                    creator: userAuth,
                    type: 'story-group-media-message',
                    storyUrl: location.pathname,
                    storyCreator: currStory.creator,
                    storyText: currStory.body,
                    storyMedia: currStory.body,
                    storyMediaCaption: currStory.caption || '',
                    storyType: currStory.type,
                    storyProps: currStory.props,
                    isSent: false
            
                  }).then(() => {
                    const ref = collection(directMessagesRef, `${para}b`, 'messages')
                    setDoc(doc(ref, id), {
                      id: id,
                      caption: storyReplyCaption,
                      body: postsArr,
                      createdAt: time.getTime(),
                      date: `${day}/${month}/${year}`,
                      time: `${hours}:${mins} ${period}`, 
                      creator: userAuth,
                      type: 'story-group-media-message',
                      storyUrl: location.pathname,
                      storyCreator: currStory.creator,
                      storyText: currStory.body,
                      storyMedia: currStory.body,
                      storyMediaCaption: currStory.caption || '',
                      storyType: currStory.type,
                      storyProps: currStory.props,
                      isSent: false
              
                    })
                  })
                }
              })
            })
          }
        } finally {
          setStoryReplyCaption('')
          setFiles([])
          setFileLength(prev => prev - prev)
          finish(para, paraCondition, 'story-group-media-message')
        }
      }
    }

    
  }

  const setUp = async () => {
    const condition = userDirectMessages.find(dm => dm.user === storyCreator?.id)
    const conditionII = storyCreator?.id === userAuth

    let para 
    const otherUser = users.find(user => user.id === followStory.current )
    const paraCondition = otherUser.dmId.localeCompare(user.dmId)
    if (paraCondition === 1) {
      para = user.dmId + otherUser.dmId
    } else {
      para = otherUser.dmId + user.dmId
    }

    if (!condition && !conditionII) {
      if (paraCondition === 1) {
        setDoc(doc(directMessagesRef, `${para}a`), {
          mainUser: user?.id,
          otherUser: otherUser.id,
          chatDateMarker: [],
          isActive: false,
          activeLast: 0

        }).then(() => {
          setDoc(doc(directMessagesRef, `${para}b`), {
            mainUser: otherUser.id,
            otherUser: user?.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
          })
        }).then(() => {
          const ref = collection(db, 'users', user?.id, 'directMessages')
          setDoc(doc(ref, `${para}a`), {
            id: `${para}a`,
            mostRecentMessage: '',
            mostRecentMessageTime: '',
            mostRecentMessageCreator: '',
            createdAt: '',
            mostRecentMessageType: '',
            user: otherUser.id,
            lastSeen: 0
          }).then(() => {
            const ref = collection(db, 'users', otherUser.id, 'directMessages')
            setDoc(doc(ref, `${para}b`), {
              id: `${para}b`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: user?.id,
              lastSeen: 0
            })
          }).then(() => replyStory())
        })

      } else {
        setDoc(doc(directMessagesRef, `${para}a`), {
          mainUser: otherUser.id,
          otherUser: user?.id,
          chatDateMarker: [],
          isActive: false,
          activeLast: 0

        }).then(() => {
          setDoc(doc(directMessagesRef, `${para}b`), {
            mainUser: user?.id,
            otherUser: otherUser.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
          })
        }).then(() => {
          const ref = collection(db, 'users', user?.id, 'directMessages')
          setDoc(doc(ref, `${para}b`), {
            id: `${para}b`,
            mostRecentMessage: '',
            mostRecentMessageTime: '',
            mostRecentMessageCreator: '',
            createdAt: '',
            mostRecentMessageType: '',
            user: otherUser.id,
            lastSeen: 0
          }).then(() => {
            const ref = collection(db, 'users', otherUser.id, 'directMessages')
            setDoc(doc(ref, `${para}a`), {
              id: `${para}a`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: user?.id,
              lastSeen: 0
            })
          }).then(() => replyStory())
        })
      }
    } else if (condition && !conditionII) {
      replyStory()
    }
  }

  const shareStory = async () => {
    setSssMenu(true)
  }

  // useEffect(() => {
  //   if (storyType.current === 'user') {
  //     if (myStories?.length < 1) {
  //       navigate('/')
  //     }
  //   } else {
  //     if (storyType.current === 'following') {
  //       if (personStories?.creatorStories.length < 1) {
  //         navigate('/')
  //       }
  //     }
  //   }
  // })
  // console.log(currStory)

  useEffect(() => {
    if (storyType.current === 'user') {
      if (myStories) {
        const story = myStories.find(story => story.id === storyId)
        if (story) {
          const condition = story.viewers.value.find(view => view === userAuth)
          if (condition) {
            return
          } else {
            const storyRef = doc(db, 'users', followStory.current, 'stories', storyId)
            updateDoc(storyRef, {
              viewers: {
                value: [...story.viewers.value, userAuth]
              }
            })
          }
        }
      }
    } else if (storyType.current === 'following') {
      if (personStories) {
        const story = personStories.creatorStories?.find(story => story.id === storyId)
        if (story) {
          const condition = story.viewers.value.find(view => view === userAuth)
          if (condition) {
            return
          } else {
            const storyRef = doc(db, 'users', followStory.current, 'stories', storyId)
            updateDoc(storyRef, {
              viewers: {
                value: [...story.viewers.value, userAuth]
              }
            })
          }
        }
      }
    }
  }, [myStories, personStories, storyIndex, index, storyId])

  function isLinkElement(textContent) {
    // Check if the element has a link-like appearance (e.g., starts with 'http', 'https', 'www', or 'ftp')
    const text = textContent;
    
    const linkLikeRegexB = /^(https?|www\.|ftp)/gi;
    const linkLikeRegexE = /(\.com|\.de|\.org|\.net|\.us|\.co|\.edu|\.gov|\.biz|\.za|\.info|\.cc|\.ca|\.cn|\.fr|\.ch|\.au|\.in|\.jp|\.be|\.it|\.nl|\.uk|\.mx|\.no|\.ru|\.br|\.se|\.es|\.at|\.dk|\.eu|\.il)$/gi;

    if (linkLikeRegexB.test(text) || linkLikeRegexE.test(text)) {
      return true
    } else {
      return false 
    }
  }

  const calc = () => {
    const diff = time.getTime() - currStory?.createdAt 
    if (diff <= 60000) {
      return `${Math.floor(diff / 1000)}s`
    } else if (diff <= 3600000) {
      return `${Math.floor(diff / 60000)}m`
    } else {
      return `${Math.floor(diff / 3600000)}h`
    }
  }

  useEffect(() => {
    return () => {
      const main = document.querySelector('.story-layout')
      const allVideos = main?.querySelectorAll('video')
      allVideos?.forEach(video => video.pause())
    }
  }, [])
  

  if (storyType.current === 'user') {
    
    return (
      <div className='story-layout' onClick={(e) => {
        sssMenu && setSssMenu(false)
      }}>
        
        <div className='story-options'>
          <div role={'button'} onClick={() => {
            setSssMenu(false)
            navigate('/')
          }} className='story-cancel'>
            <div></div>
            <div></div>
          </div>
  
          <div className='add-story' role={'button'} onClick={() => {
            navigate('/')
            setSssMenu(false)
            setShowStoryForm(true)
          }}>
            <FaPlus />
          </div>
        </div>

        <div className="story-viewers" style={{overflowY:!showViews && 'hidden'}}>
          <div className='views-icon' role={'button'} onClick={() => setShowViews(!showViews)}>
            <span>
              {showViews? <FaAngleDown /> : <FaAngleUp />}
            </span>
            seen by {currStory?.viewers.value.length} <FaEye />
          </div>
          <div className='story-viewers-list'>
            {showViews && currStory?.viewers.value.map((viewer, index) =>
            <StoryList key={index} viewer={viewer} />)}
          </div>
          
        </div>
  
        <section className="story-content" id="story-content">
          {/* {
            storyIndex === 0 &&
            <button disabled={storyIndex === 0 && true} onClick={decreaseIndex}>
              <FaAngleLeft />
            </button>
          } */}
          
  
          <div className="story-details">
            {index !== 0 &&
              <div role={'button'} className='story-minus-one' onClick={decreaseIndex}>
                <button>
                  <FaAngleLeft />
                </button>
              </div>
            }

            {index !== userStories.length - 1 &&
              <div className='story-plus-one' role={'button'} onClick={increaseIndex}>
                <button>
                  <FaAngleRight />
                </button>
              </div>
            }

            <div className="story-abs" id="story-abs">
  
              <div className='story-amt'>
                {myStories?.map((story, index) => <div key={index}></div>)}
              </div>
  
              <div className="story-pfp-username">
                <img src={user?.avatarUrl} alt="" />
  
                <div className="name-time-opt">
                  <span>
                    Your Story  {storyCreator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" /> }
                    <span className='calc-span'>
                      {calc()}
                      </span>
                  </span>

                  {/* style={{backgroundColor: currStory?.props?.backgroundColor}}  div */}
                  {/* style={{
                      backgroundColor:currStory?.props?.backgroundColor
                    }}  btn */}
                  <div className='delete-btn-div'>
                    <button className='delete-btn' id='delete-btn' onClick={() => {
                      deleteStory(currStory?.id)
                      setSssMenu(false)
                      if (userStories.length - 1 > 0) {
                        index === 0 ? setIndex(prev => prev - prev) : decreaseIndex()
                      } else {
                        navigate('/')
                      }
                    }}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                
              </div>
            </div>

            {currStory?.type === 'Text-Story' &&
              <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily: currStory?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
                backgroundColor: currStory?.props?.backgroundColor
              }} className="story-content-div">
                
                
                {isLinkElement(currStory?.body) ?
                  <a className='out-link' href={currStory?.body.includes('http://') || currStory?.body.includes('https://') ? `${currStory?.body}` : `http://${currStory?.body}`} target='_blank'>
                    {currStory?.body}
                  </a>
                  :
                  <>
                    {currStory?.body}
                  </>
                }
            </pre>
            }

            {currStory?.type === 'Img-Story' &&
              <div className='story-content-div'>
                <img className='story-content-img' src={currStory?.body} alt="" />
                <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily: currStory?.props?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
              }}
                  className='story-content-pre'>
                  {isLinkElement(currStory?.caption) ?
                    <a className='out-link' href={currStory?.caption.includes('http://') || currStory?.caption.includes('https://') ? `${currStory?.caption}` : `http://${currStory?.caption}`} target='_blank'>
                      {currStory?.caption}
                    </a>
                    :
                    <>
                      {currStory?.caption}
                    </>
                  }
                </pre>
              </div>
            }

            {currStory?.type === 'Vid-Story' &&
              <div className='story-content-div'>
                <video autoPlay className='story-content-vid' src={currStory?.body}></video>
                <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily: currStory?.props?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
              }}
                  className='story-content-pre'>
                  {isLinkElement(currStory?.caption) ?
                    <a className='out-link' href={currStory?.caption.includes('http://') || currStory?.caption.includes('https://') ? `${currStory?.caption}` : `http://${currStory?.caption}`} target='_blank'>
                      {currStory?.caption}
                    </a>
                    :
                    <>
                      {currStory?.caption}
                    </>
                  }
                </pre>
              </div>
            }
            
            <button className='share-story-btn' onClick={shareStory}>
              <FaPaperPlane />
            </button>
          </div>

          {/* {
            storyIndex !== userStories?.length &&
            <button disabled={storyIndex === userStories?.length - 1 && true} onClick={goToNext}>
            <FaAngleRight />
          </button>
          } */}
        </section>


        {/* <ShareStoryMenu currStory={currStory}/> */}
      </div>
    )
  }
  else if (storyType.current === 'following') {
    return (
      <div className='story-layout' onClick={() => {
        sssMenu && setSssMenu(false)
      }}>
        <div className='story-options'>
          <div role={'button'} onClick={() => {
            navigate('/')
          }} className='story-cancel'>
            <div></div>
            <div></div>
          </div>
        </div>

        
  
        <section className="story-content" id="story-content">
          {storyIndex !== 0 &&
            <button onClick={decreaseStoryIndex}>
              <FaAngleLeft />
            </button>
          }
          
  
          <div className="story-details">
            {index !== 0 &&
              <div className='story-minus-one' role={'button'} onClick={decreaseIndex}>
                <button>
                  <FaAngleLeft />
                </button>
              </div>
            }
           

            {index !== personStories?.creatorStories.length - 1 &&
              <div className='story-plus-one' role={'button'} onClick={increaseIndex}>
                <button>
                  <FaAngleRight />
                </button>
              </div>
            }


            <div className="story-abs" id="story-abs">
  
              <div className='story-amt'>
                {personStories?.creatorStories.map((story, index) => <div key={index}></div>)}
              </div>
  
              <div className="story-pfp-username">
                <img src={storyCreator?.avatarUrl} alt="" />
  
                <div className="name-time-opt">
                  <span>
                    {storyCreator?.username} {storyCreator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" /> }
                    <span className='calc-span'>
                      {calc()}
                    </span>
                  </span>
                </div>
                
              </div>
            </div>

            {currStory?.type === 'Text-Story' &&
              <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily:currStory?.props?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
                backgroundColor: currStory?.props?.backgroundColor
              }} className="story-content-div text">
                {isLinkElement(currStory?.body) ?
                  <a className='out-link' href={currStory?.body.includes('http://') || currStory?.body.includes('https://') ? `${currStory?.body}` : `http://${currStory?.body}`} target='_blank'>
                    {currStory?.body}
                  </a>
                  :
                  <>
                    {currStory?.body}
                  </>
                }
            </pre>
            }

            {currStory?.type === 'Img-Story' &&
              <div className='story-content-div'>
                <img className='story-content-img' src={currStory?.body} alt="" />
                <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily: currStory?.props?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
              }}
                  className='story-content-pre'>
                  {isLinkElement(currStory?.caption) ?
                    <a className='out-link' href={currStory?.caption.includes('http://') || currStory?.caption.includes('https://') ? `${currStory?.caption}` : `http://${currStory?.caption}`} target='_blank'>
                      {currStory?.caption}
                    </a>
                    :
                    <>
                      {currStory?.caption}
                    </>
                  }
                </pre>
              </div>
            }

            {currStory?.type === 'Vid-Story' &&
              <div className='story-content-div'>
                <video autoPlay className='story-content-vid' src={currStory?.body}></video>
                <pre style={{
                fontWeight: currStory?.props?.fontWeight,
                fontStyle: currStory?.props?.fontStyle,
                fontFamily: currStory?.props?.fontFamily,
                color: currStory?.props?.color,
                fontSize: currStory?.props?.fontSize,
              }}
                  className='story-content-pre'>
                  {isLinkElement(currStory?.caption) ?
                    <a className='out-link' href={currStory?.caption.includes('http://') || currStory?.caption.includes('https://') ? `${currStory?.caption}` : `http://${currStory?.caption}`} target='_blank'>
                      {currStory?.caption}
                    </a>
                    :
                    <>
                      {currStory?.caption}
                    </>
                  }
                </pre>
              </div>
            }

            <form action="submit" className="story-reply-form" onSubmit={e => {
              setUp()
              e.preventDefault()
            }}>
              <label htmlFor="story-reply-media-input">
                <span>
                  <FaImages />
                </span>
                <input type="file" name='story-reply-media-input' id='story-reply-media-input'
                  onClick={e => {
                    e.target.files = null
                    setIsOnePic(false)
                    setIsOneVid(false)
                    setFileLength(prev => prev - prev)
                  }}
                  onChange={e => {
                    setFiles(e.target.files)
                    setFileLength(prev => (prev - prev) + e.target.files.length)
                  }} multiple='multiple'
                />
              </label>

              <div className="media-input-div" style={files[0] ? { display: 'block' } : { display: 'none' }}>

                {fileLength > 1 && <div ref={divRef} className="multiple-dm-media-div"></div>}

                <img style={isOnePic ? { display: 'block' } : { display: 'none' }} src={picReply.current} className='img-message' />

                <video src={vidReply.current} style={isOneVid ? { display: 'block' } : { display: 'none' }} className='video-message' controls loop autoPlay muted></video>

                <textarea autoComplete='off' style={files[0] ? { display: 'block' } : { display: 'none' }} name="" id="message-media-text" cols="30" rows="10" value={storyReplyCaption} onChange={e => setStoryReplyCaption(e.target.value)}></textarea>

                <div className='cancel-story-media' role={'button'} onClick={() => setFiles([])}>
                  <div></div>
                  <div></div>
                </div>

              </div>

              <input type="text" value={storyReply} onChange={e => setStoryReply(e.target.value)}/>

              <button onClick={() => {
                if (storyReply === '' && files[0] === undefined) {
                  setSssMenu(true)
                }
              }}>
                <FaPaperPlane />
              </button>
            </form>
            
          </div>

          {storyIndex !== followingStories.length - 1 &&
            <button onClick={increaseStoryIndex}>
              <FaAngleRight />
            </button>
          }
        </section>


        {/* <ShareStoryMenu currStory={currStory}/> */}
      </div>
    )
  }
  
  
}

export default StoryLayout