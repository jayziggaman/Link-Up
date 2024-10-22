import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { appContext } from '../../App'
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { db, messageRoomsRef } from '../../firebase/config'
import {v4 as uuidv4} from 'uuid';
import Message from '../Message'
import DMMedia from "../GENERAL-COMPONENTS/DMMedia"
import { textAreaResize } from '../../GENERAL-FUNCTIONS/functions'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { ReactMediaRecorder } from 'react-media-recorder'
import ChatViewModal from '../ChatViewModal'
import ChatDateMarker from '../ChatDateMarker'
import VerifiedBadge from '../GENERAL-COMPONENTS/VerifiedBadge'
import BackButton from '../GENERAL-COMPONENTS/BackButton';
import LoadingMedia from '../GENERAL-COMPONENTS/LoadingMedia';
import { functionsContext } from '../../CONTEXTS/FunctionsContext';
import UserPfp from '../GENERAL-COMPONENTS/UserPfp';


export const messagingContext = React.createContext()


const Messaging = ({ dmUrl }) => {
  const { day, month, year, users, user, hours, mins, period, windowWidth } = useContext(appContext)
  const { fetchDM, generateLink, callError, routeToLogin, loadMedia } = useContext(functionsContext)

  const [thisRoom, setThisRoom] = useState(null)
  const [roomMessages, setRoomMessages] = useState(null)
  const [locationState, setLocationState] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [userActiveObject, setUserActiveObject] = useState(null)
  const [otherUserActiveObject, setOtherUserActiveObject] = useState(null)
  const [myLastMessage, setMyLastMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState([])
  const [files, setFiles] = useState([])

  const [voiceMessage, setVoiceMessage] = useState()
  const [recordingState, setRecordingState] = useState('inactive')
  const [isReply, setIsReply] = useState(false)
  
  const replyMessage = useRef(null)
  const messagesArea = useRef(null)
  const messagesSection = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const time = new Date()


  useEffect(() => {
    if (routeToLogin()) {
      navigate('/auth?type=login');
    }
  }, [])


  useEffect(() => {
    if (users) {
      if (location.state) {
        localStorage.setItem('dm-location-state', JSON.stringify(location.state))
        setLocationState(location.state)

      } else {
        setLocationState(JSON.parse(localStorage.getItem('dm-location-state')))
      }
    }
  }, [users, location.pathname])


  useEffect(() => {
    if (locationState) {
      const { user: stateUser } = locationState
      
      setOtherUser(users.find(user => user.id === stateUser.id))
    }
  }, [locationState])


  useEffect(() => {
    if (
      roomMessages && otherUser && thisRoom && userActiveObject && otherUserActiveObject && user && user.id
    ) {
      setLoading(false)
    }
  }, [roomMessages, otherUser, user, thisRoom, userActiveObject, otherUserActiveObject])


  const hasScrolled = useRef(false);
  useEffect(() => {
    if (!loading && roomMessages) {
      if (roomMessages.length !== 0 && !hasScrolled.current) {
        messagesSection.current.scrollTop = messagesSection.current.scrollHeight;
        hasScrolled.current = true;
      }
    }
  }, [loading, roomMessages]);



  useEffect(() => {
    if (files.length !== 0) {
      loadMedia(files, setMedia)

    } else {
      setMedia([])
    }
  }, [files])


  useEffect(() => {
    if (user && otherUser) {
      fetchDM(dmUrl, setRoomMessages, otherUser, setThisRoom)
    }
  }, [user, otherUser]);  



  useEffect(() => {
    if (user && user.id) {
      let thisRoom
      const messageRoomRef = doc(messageRoomsRef, dmUrl);

      const fetchDocument = async () => {
        const docSnap = await getDoc(messageRoomRef); // Fetch the document snapshot
    
        if (docSnap.exists()) {
          thisRoom = docSnap.data()

          // If the document exists, you can access its data
          updateDoc(messageRoomRef, {
            users: {
              ...thisRoom.users,
              [user.username]: { lastActive: serverTimestamp(), isActive: true },
            }
          });
        } 
      };

      fetchDocument()
      

      return () => {
        if (thisRoom) {
          updateDoc(messageRoomRef, {
            users: {
              ...thisRoom.users,
              [user.username]: { lastActive: serverTimestamp(), isActive: false },
            }
          });
        }
      };
    }
  }, [user]);  



  useEffect(() => {
    if (thisRoom && user && user.id && otherUser) {
      setUserActiveObject(thisRoom.users[user.username])
      setOtherUserActiveObject(thisRoom.users[otherUser.username])
    }
  }, [thisRoom, user, otherUser])



  useEffect(() => {
    if (roomMessages && user && user.id) {
      function getLastMessage(array, creatorId) {
        // Loop backward to find the last occurrence
        for (let i = array.length - 1; i >= 0; i--) {
          if (array[i].creator === creatorId) {
            return roomMessages[i]; 
          }
        }
        return {}; 
      }

      setMyLastMessage(getLastMessage(roomMessages, user.id))
    }
  }, [roomMessages, user])

  



  useEffect(() => {
    const area = messagesArea.current
    const section = messagesSection.current

    function windowResize() {

      if (area && section) {
        const sectionWidth = section.getBoundingClientRect().width

        area.style.width = `${sectionWidth - 8}px`
      }
    }

    windowResize()

    window.addEventListener('resize', windowResize)

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [loading])


  useEffect(() => {
    if (replyMessage.current) {
      const { id } = replyMessage.current

      const message = document.getElementById(id)

      if (message) {
        if (!isReply) {
          message.style.zIndex = 'unset'
          // message.style.color = 'unset'

        } else {
          message.style.zIndex = 10
          // message.style.color = 'gainsboro'
        }
      }
    }


    if (isReply) {
      const messagesSect = messagesSection.current
      messagesSect.addEventListener('scroll', e => e.preventDefault())
    }
  }, [isReply])



  const uploadMessage = async () => {
    const dmRef = collection(db, "messageRooms", dmUrl, "messages")

    const id = uuidv4()
    const date = `${day}/${month}/${year}`
    let type = ''
    const thisCaption = caption
    const theseFiles = files

    if (!media[0]) {
      if (thisCaption === '') {
        return
      }
      type = 'text-message'

    } else if (media.length === 1) {
      if (media[0].type === 'img') {
        type = 'photo-message'

      } else {
        type = 'video-message'
      }

    } else {
      type = 'group-media-message'
    }

    setFiles([])
    setCaption("")

    const newMedia = theseFiles[0] ? await generateLink(theseFiles) : []

    setDoc(doc(dmRef, id), {
      id, date,
      caption: thisCaption,
      type: isReply ? `reply-${type}` : type,
      media: newMedia,
      time: `${hours}:${mins} ${period}`, 
      creator: user.id,
      replyMessage: replyMessage.current,
      createdAt: serverTimestamp(),
      likes: { value: [] },
      ["deletedBy_" + user.username]: false,
      ["deletedBy_" + otherUser.username]: false,

    }).catch(() => {
      callError("Couldn't send message. Please try again")

    }).finally(() => {
      setFiles([])
      setCaption("")
      replyMessage.current = null
      setIsReply(false)
    })
  }


  
  const handleNewMessage = async (e) => {
    const id = uuidv4()
    const date = `${day}/${month}/${year}`

    const dmRef = collection(db, "messageRooms", dmUrl, "messages")
    if (
      roomMessages.length === 0 ||
      roomMessages[roomMessages.length - 1].date !== date
    ) {
      setDoc(doc(dmRef, id), {
        id,
        year: time.getFullYear(),
        month: time.getMonth(),
        day: time.getDate(),
        type: "date-marker",
        createdAt: serverTimestamp(),

      }).then(() => {
        uploadMessage()

      }).catch(() => {
        callError("Couldn't send message. Please try again")

      }).finally(() => {
        // console.log(e.currentTarget)
        // e.currentTarget.disabled = false
      })

    } else {
      uploadMessage()
    }






  
    // try {
    //   const docRefA = doc(db, 'directMessages', `${inboxId}a`)
    //   onSnapshot(docRefA, doc => {
    //     const { chatDateMarker } = doc.data()
    //     let condition
    //     chatDateMarker === [] ? condition = false :
    //     condition = chatDateMarker.find(date => {
    //       return date?.year === today.year && date?.month === today.month && date?.day === today.day
    //     })
  
    //     if (!condition) {
    //       updateDoc(docRefA, {
    //         chatDateMarker: [...chatDateMarker, today]
    //       })
    //     }
    //   })
  
  
    //   const docRefB = doc(db, 'directMessages', `${inboxId}b`)
    //   onSnapshot(docRefB, doc => {
    //     const { chatDateMarker } = doc.data()
    //     let condition
    //     chatDateMarker === [] ? condition = false :
    //     condition = chatDateMarker.find(date => {
    //       return date?.year === today.year && date?.month === today.month && date?.day === today.day
    //     })
  
    //     if (!condition) {
    //       updateDoc(docRefB, {
    //         chatDateMarker: [...chatDateMarker, today]
    //       })
    //     }
    //   })
  
    // } finally {
    //   if (files[0] === undefined) {
    //     if (newMessage !== '') {
    //       try {
    //         const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
    //         setDoc(doc(ref, id), {
    //           id: id,
    //           body: newMessage,
    //           createdAt: time.getTime(),
    //           date: `${day}/${month}/${year}`,
    //           time: `${hours}:${mins} ${period}`, 
    //           creator: user.id,
    //           type: 'text-message',
    //           isSent: false
      
    //         }).then(() => {
    //           const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
    //           setDoc(doc(ref, id), {
    //             id: id,
    //             body: newMessage,
    //             createdAt: time.getTime(),
    //             date: `${day}/${month}/${year}`,
    //             time: `${hours}:${mins} ${period}`, 
    //             creator: user.id,
    //             type: 'text-message',
    //             isSent: false
        
    //           })
    //         }).then(() => {
    //           finish('text-message')
    //         })
    //       } catch (err) {
    //         console.log(err.message)
    //       } 
    //     }
    //   } else if (fileLength === 1) {
    //     if (isOnePic) {
    //       try {
    //         let mediaUrl
    //         const selected = files[0]
      
    //         const avatarRef = ref(storage, `photo-message${user.id}/${time.getTime().toString()}`)
    //         uploadBytes(avatarRef, selected).then(() => {
    //           getDownloadURL(avatarRef).then(url => {
    //             mediaUrl = url
    //           }).then(() => {
    //             const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
    //             setDoc(doc(ref, id), {
    //               id: id,
    //               caption: mediaText,
    //               body: mediaUrl,
    //               createdAt: time.getTime(),
    //               date: `${day}/${month}/${year}`,
    //               time: `${hours}:${mins} ${period}`, 
    //               creator: user.id,
    //               type: 'photo-message',
    //               isSent: false
  
    //             }).then(() => {
    //               const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
    //               setDoc(doc(ref, id), {
    //                 id: id,
    //                 caption: mediaText,
    //                 body: mediaUrl,
    //                 createdAt: time.getTime(),
    //                 date: `${day}/${month}/${year}`,
    //                 time: `${hours}:${mins} ${period}`, 
    //                 creator: user.id,
    //                 type: 'photo-message',
    //                 isSent: false
            
    //               })
    //             })
    //           }).then(() => {
    //             finish('photo-message')
    //           })
    //         })
            
    //       } catch (err) {
    //         console.log(err.message)
    //       } 
    //     } else if (isOneVid) {
    //       try {
    //         let mediaUrl
    //         const selected = files[0]
      
    //         const avatarRef = ref(storage, `video-message${user.id}/${time.getTime().toString()}`)
    //         uploadBytes(avatarRef, selected).then(() => {
    //           getDownloadURL(avatarRef).then(url => {
    //             mediaUrl = url
    //           }).then(() => {
    //             const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
    //             setDoc(doc(ref, id), {
    //               id: id,
    //               caption: mediaText,
    //               body: mediaUrl,
    //               createdAt: time.getTime(),
    //               date: `${day}/${month}/${year}`,
    //               time: `${hours}:${mins} ${period}`, 
    //               creator: user.id,
    //               type: 'video-message',
    //               isSent: false
          
    //             }).then(() => {
    //               const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
    //               setDoc(doc(ref, id), {
    //                 id: id,
    //                 caption: mediaText,
    //                 body: mediaUrl,
    //                 createdAt: time.getTime(),
    //                 date: `${day}/${month}/${year}`,
    //                 time: `${hours}:${mins} ${period}`, 
    //                 creator: user.id,
    //                 type: 'video-message',
    //                 isSent: false
  
    //               })
    //             })
    //           }).then(() => {
    //             finish('video-message')
    //           })
    //         })
  
    //       } catch (err) {
    //         console.log(err.message)
    //       } 
    //     }
    //   } else {
    //     const postsArr = []
    //     const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
  
    //     for (let i = 0; i < fileLength; i++) {
    //       let mediaUrl
    //       const selected = files[i]
    //       const avatarRef = ref(storage, `img/vid-posts${files[i].name}/${files[i].name}`)
    //       uploadBytes(avatarRef, selected).then(() => {
    //         getDownloadURL(avatarRef).then(url => {
    //           mediaUrl = url
    //         }).then(() => {
    //           if (types.includes(files[i].type)) {
    //             postsArr.push({
    //               type: 'video',
    //               url: mediaUrl
    //             })
    //           } else {
    //             postsArr.push({
    //               type: 'img',
    //               url: mediaUrl
    //             })
    //           }
    //         }).then(() => {
    //           if (postsArr.length === fileLength) {
    //             const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
    //             setDoc(doc(ref, id), {
    //               id: id,
    //               caption: mediaText,
    //               body: postsArr,
    //               createdAt: time.getTime(),
    //               date: `${day}/${month}/${year}`,
    //               time: `${hours}:${mins} ${period}`, 
    //               creator: user.id,
    //               type: 'group-media-message',
    //               isSent: false
          
    //             }).then(() => {
    //               const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
    //               setDoc(doc(ref, id), {
    //                 id: id,
    //                 caption: mediaText,
    //                 body: postsArr,
    //                 createdAt: time.getTime(),
    //                 date: `${day}/${month}/${year}`,
    //                 time: `${hours}:${mins} ${period}`, 
    //                 creator: user.id,
    //                 type: 'group-media-message',
    //                 isSent: false
            
    //               })
    //             })
    //           }
    //         }).then(() => {
    //           finish('group-media-message')
    //         })
    //       })
    //     }
    //   }
    // } 
  }
  


  if (loading) {
    return (
      <Loading  />
    )

  } else {
    const { followers, following, username, displayName, userType } = otherUser

    return (
      <messagingContext.Provider
        value={{
          setIsReply, otherUser, thisRoom, dmUrl, replyMessage
        }}
      >
        <section className="messaging-section">
          <div className="messaging-section-div">
            <div ref={messagesArea} className="messaging-area"></div>
            <header className="messaging-header">
              <BackButton navigateLink={'/messages'} />

              <Link to={`/${username}`} >
                <UserPfp user={otherUser} />
                
                <span>
                  {displayName} {userType === 'creator' && <VerifiedBadge />}
                </span>
              </Link>
            </header>
      
            <section ref={messagesSection} className="messages-sect">
              {/* <div
                className={`reply-overlay 
                ${isReply && windowWidth < 500 ? 'active' : ''}`}
                onClick={() => setIsReply(false)}
              ></div> */}

              <Link to={`/${username}`} className='messages-intro-div'>
                <UserPfp user={otherUser} />
      
                <p className='msg-intro-displayName' >
                  {displayName} {userType === 'creator' && <VerifiedBadge />}
                </p>
                <p className='msg-intro-username' > @{username} </p>
                <p className='msg-intro-followers' >
                  {followers.value.length} followers . {following.value.length} following
                </p>
              </Link>
      
              {/* <audio ref={audioRef} controls ></audio> */}
              
              {roomMessages.length === 0 ?
                <p 
                  style={{
                    textAlign: "center",
                    marginTop: "2rem"
                  }}
                >
                  Send a message to {otherUser.displayName} 😉
                </p>
                :
                <>
                  {roomMessages.map(message => {
                    const { id, type } = message

                    return (
                      <div key={id}>
                        {type === 'date-marker' ?
                          <ChatDateMarker message={message} />
                          :
                          <Message
                            message={message} 
                            isLastMessage={myLastMessage.id === id ? true : false}
                          />
                        }
                      </div>
                    )})
                  }
                </>
              }
            </section>
      
            <div className="messages-input">
              <DMMedia media={media} setFiles={setFiles} setMedia={setMedia} />
                  
              <div className="select-file">
                <label htmlFor="select-media-message">
                  <input autoComplete='off' type="file" id='select-media-message'
                    name='select-media-message' multiple='multiple' maxLength='5'
                    onClick={e => {
                      e.target.value = null
                    }}
                    onChange={e => {
                      setFiles(e.target.files)
                    }}  
                  />
                  <span>
                    <AttachFileIcon />
                  </span>
                </label>
              </div>

              <textarea autoComplete='off' className="message-input"
                type="text" value={caption} placeholder='Type a Message...'
                onChange={e => setCaption(e.target.value)}
                onInput={e => textAreaResize(e, caption)}
                onPaste={e => textAreaResize(e, caption)}
              ></textarea>
      
              <button className="send-btn"
                onClick={e => {
                  handleNewMessage(e)
                  // e.currentTarget.disabled = true
                  // isReply ?
                  //   sendReply(messageId.current, replyMessageBody?.type) :
                  //   handleNewMessage(e)
                }}
              >
                  <SendIcon />
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
      
              <ChatViewModal />
            </div>
          </div>
        </section>
      </messagingContext.Provider>
    )
  }
}

export default Messaging



const Loading = () => {
  return (
    <>
      <div className="messaging-loading">
        <header className="messaging-header">
          <BackButton navigateLink={-1} />

          <Link to="" >
            <UserPfp user={null} />
            
            <span>
              LinkUp
            </span>
          </Link>
        </header>

        <div className="messaging-loading-upper">
          <div className='messaging-loading-pfp'></div>
          <div className='messaging-loading-username'></div>
          <div className='messaging-loading-username'></div>
        </div>

        <div className="messaging-loading-lower">
          {[1,1,1,1,1,1,1,1,1].map((_, index) => {
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
  )
}