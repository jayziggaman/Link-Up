import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaPaperPlane, FaImage, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import loadVideoDark from '../Images/load-video-dark.mp4'
import loadVideoLight from '../Images/load-video-light.mp4'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, messageRoomsRef, postsRef, storage } from '../firebase/config'
import {v4 as uuidv4} from 'uuid';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

const NewChatForm = ({selected, setSelected}) => {
  const { showNewMessageForm, setShowNewMessageForm, userAuth, gError, user, day, month, year, hours, mins, period, userDirectMessages, darkMode } = useContext(appContext)
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const picPost = useRef()
  const vidPost = useRef()
  const [index, setIndex] = useState(0)
  const [mediaCaption, setMediaCaption] = useState('')
  const [newText, setNewText] = useState('')
  const [isOnePic, setIsOnePic] = useState(false)
  const [isOneVid, setIsOneVid] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [mediaProcessing, setMediaProcessing] = useState(false)
  const newFormRef = useRef()
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }



  useEffect(() => {
    const div = document.querySelector('.multiple-dm-media-div')
    // console.log(files)
    const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
    if (fileLength === 1) {
      if (photoTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setMediaProcessing(true)
        setIsOnePic(true)
        setIsOneVid(false)
  
        const avatarRef = ref(storage, `pending-img-msg${time.getTime()}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            picPost.current = url
          }).then(() => {
            document.querySelector('.img-message').src = picPost.current
            setMediaProcessing(false)
          })
        })
      } else if (vidTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setMediaProcessing(true)
        setIsOnePic(false)
        setIsOneVid(true)
  
        const avatarRef = ref(storage, `pending-vid-msg${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            vidPost.current = url
          }).then(() => {
            document.querySelector('.video-message').src = vidPost.current
            setMediaProcessing(false)
          })
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
    } else if (fileLength > 1) {
      const postsArr = []
      
      const run = () => {
        if (postsArr.length === fileLength) {
          postsArr.map((item, i) => {
            if (item.type === 'img') {
              const img = document.createElement('img')
              img.setAttribute('class', `img-message`)
              img.setAttribute('src', item.url)
              div.appendChild(img)
            } else {
              const vid = document.createElement('video')
              vid.setAttribute('class', `video-message`)
              vid.setAttribute('src', item.url)
              vid.setAttribute('autoplay', 'autoplay')
              div.appendChild(vid)
            }
          })
        }
      }

      for (let i = 0; i < fileLength; i++) {
        let mediaUrl
        const selected = files[i]
        const avatarRef = ref(storage, `pending-msgs${files[i].name}/${files[i].name}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            mediaUrl = url
          }).then(() => {
            if (vidTypes.includes(files[i].type)) {
              postsArr.push({
                type: 'video',
                url: mediaUrl
              })
            } else if (photoTypes.includes(files[i].type)) {
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
  
  const finish = (inboxId, paraCondition, type, select) => {
    if (paraCondition === 1) {
      const meRef = doc(db, 'users', userAuth, 'messageRooms', `${inboxId}a`)
      updateDoc(meRef, {
        mostRecentMessage: newText,
        mostRecentMessageTime: `${hours}:${mins} ${period}`,
        mostRecentMessageCreator: userAuth,
        createdAt: time.getTime(),
        mostRecentMessageType: type ,
      }).then(() => {
        const otherRef = doc(db, 'users', select.id, 'messageRooms', `${inboxId}b`)

        updateDoc(otherRef, {
          mostRecentMessage: newText,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
        })
      }).then(() => {
        setNewText('')
        setMediaCaption('')
        setFiles([])
        setFileLength(prev => prev - prev)
      })
    } else {
      const meRef = doc(db, 'users', userAuth, 'messageRooms', `${inboxId}b`)
      updateDoc(meRef, {
        mostRecentMessage: newText,
        mostRecentMessageTime: `${hours}:${mins} ${period}`,
        mostRecentMessageCreator: userAuth,
        createdAt: time.getTime(),
        mostRecentMessageType: type,
      }).then(() => {
        const otherRef = doc(db, 'users', select.id, 'messageRooms', `${inboxId}a`)

        updateDoc(otherRef, {
          mostRecentMessage: newText,
          mostRecentMessageTime: `${hours}:${mins} ${period}`,
          mostRecentMessageCreator: userAuth,
          createdAt: time.getTime(),
          mostRecentMessageType: type,
        })
      }).then(() => {
        setNewText('')
        setMediaCaption('')
        setFiles([])
        setFileLength(prev => prev - prev)
      })
    }
  }
  
  const handleNewMessage = async (para, selectedUser) => {
    const id = uuidv4()
    const paraCondition = selectedUser.dmId.localeCompare(user.dmId)

    try {
      const docRefA = doc(db, 'messageRooms', `${para}a`)
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


      const docRefB = doc(db, 'messageRooms', `${para}b`)
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
        if (newText !== '') {
          const ref = collection(db, 'messageRooms', `${para}a`, 'messages')
          setDoc(doc(ref, id), {
            id: id,
            body: newText,
            createdAt: time.getTime(),
            date: `${day}/${month}/${year}`,
            time: `${hours}:${mins} ${period}`, 
            creator: userAuth,
            type: 'text-message',
            isSent: false
    
          }).then(() => {
            const ref = collection(db, 'messageRooms', `${para}b`, 'messages')
            setDoc(doc(ref, id), {
              id: id,
              body: newText,
              createdAt: time.getTime(),
              date: `${day}/${month}/${year}`,
              time: `${hours}:${mins} ${period}`, 
              creator: userAuth,
              type: 'text-message',
              isSent: false
      
            })
          }).then(() => {
            finish(para, paraCondition, 'text-message', selectedUser)
          })
        }
      } else if (fileLength === 1) {
        if (isOnePic) {
          let mediaUrl
          const selected = files[0]
    
          const avatarRef = ref(storage, `photo-message${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              const ref = collection(db, 'messageRooms', `${para}a`, 'messages')
              setDoc(doc(ref, id), {
                id: id,
                caption: mediaCaption,
                body: mediaUrl,
                createdAt: time.getTime(),
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`, 
                creator: userAuth,
                type: 'photo-message',
                isSent: false
        
              }).then(() => {
                const ref = collection(db, 'messageRooms', `${para}b`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaCaption,
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
              finish(para, paraCondition, 'photo-message', selectedUser)
            })
          })
            
        } else if (isOneVid) {
          let mediaUrl
          const selected = files[0]
    
          const avatarRef = ref(storage, `video-message${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              const ref = collection(db, 'messageRooms', `${para}a`, 'messages')
              setDoc(doc(ref, id), {
                id: id,
                caption: mediaCaption,
                body: mediaUrl,
                createdAt: time.getTime(),
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`, 
                creator: userAuth,
                type: 'video-message',
                isSent: false
        
              }).then(() => {
                const ref = collection(db, 'messageRooms', `${para}b`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaCaption,
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
              finish(para, paraCondition, 'video-message', selectedUser)
            })
          })
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
                const ref = collection(db, 'messageRooms', `${para}a`, 'messages')
                setDoc(doc(ref, id), {
                  id: id,
                  caption: mediaCaption,
                  body: postsArr,
                  createdAt: time.getTime(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  type: 'group-media-message',
                  isSent: false
          
                }).then(() => {
                  const ref = collection(db, 'messageRooms', `${para}b`, 'messages')
                  setDoc(doc(ref, id), {
                    id: id,
                    caption: mediaCaption,
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
              finish(para, paraCondition, 'group-media-message', selectedUser)
            })
          })
        }
      }
    }

    
  }

  const sendMessage = async () => {
    selected.map(select => {
      let conditionII = userDirectMessages.find(dm => dm.user === select?.id)
      let para 
      const paraCondition = select.dmId.localeCompare(user.dmId)
      if (paraCondition === 1) {
        para = user.dmId + select.dmId
      } else {
        para = select.dmId + user.dmId
      }
      

      const start = async () => {
        if (paraCondition === 1) {
          setDoc(doc(messageRoomsRef, `${para}a`), {
            mainUser: user?.id,
            otherUser: select.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
  
          }).then(() => {
            setDoc(doc(messageRoomsRef, `${para}b`), {
              mainUser: select.id,
              otherUser: user?.id,
              chatDateMarker: [],
              isActive: false,
              activeLast: 0
            })
          }).then(() => {
            const ref = collection(db, 'users', user?.id, 'messageRooms')
            setDoc(doc(ref, `${para}a`), {
              id: `${para}a`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: select.id,
              lastSeen: 0
            }).then(() => {
              const ref = collection(db, 'users', select.id, 'messageRooms')
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
            }).then(() => handleNewMessage(para, select))
          })
  
        } else {
          setDoc(doc(messageRoomsRef, `${para}a`), {
            mainUser: select.id,
            otherUser: user?.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
  
          }).then(() => {
            setDoc(doc(messageRoomsRef, `${para}b`), {
              mainUser: user?.id,
              otherUser: select.id,
              chatDateMarker: [],
              isActive: false,
              activeLast: 0
            })
          }).then(() => {
            const ref = collection(db, 'users', user?.id, 'messageRooms')
            setDoc(doc(ref, `${para}b`), {
              id: `${para}b`,
              mostRecentMessage: '',
              mostRecentMessageTime: '',
              mostRecentMessageCreator: '',
              createdAt: '',
              mostRecentMessageType: '',
              user: select.id,
              lastSeen: 0
            }).then(() => {
              const ref = collection(db, 'users', select.id, 'messageRooms')
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
            }).then(() => handleNewMessage(para, select))
          })
        }
      }

      if (!conditionII) {
        start()
      } else {
        handleNewMessage(para, select)
      }
    })
    setShowNewMessageForm(false)
    setSelected([])
  }

  return (
    <form ref={newFormRef} action="submit" className={showNewMessageForm ? 'show new-chat-form' : 'new-chat-form'} onSubmit={e => e.preventDefault()}>
      
      <div className='new-post-btn-div'>
        <label htmlFor='new-post-img' >
          <span><FaImage /></span>
          <input autoComplete='off' type="file" id='new-post-img' name='new-post-img'
            onClick={e => e.target.value = null}
            onChange={e => {
              setFiles(e.target.files)
              setFileLength( prev => (prev - prev) + e.target.files.length)
              // files.current = e.target.files
              // console.log(e.target.files.length)
            }} multiple='multiple'
          />
        </label>
        <button type='submit' onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>

      <div className="textarea-div">
        {/* {fileLength > 0 &&
          <div className="post-number">
            {index + 1}/{fileLength}
          </div>
        }

        {fileLength > 1 &&
          <div className="scroll-posts">
            <button onClick={e => {
              e.preventDefault()
              index !== 0 && setIndex(prev => prev - 1)
            }}>
              <FaAngleLeft />
            </button>

            <button onClick={e => {
              e.preventDefault()
              index !== fileLength - 1 && setIndex(prev => prev + 1)
            }}>
              <FaAngleRight />
            </button>
          </div>
        } */}

        
        <textarea autoComplete='off' className='media-post-cap' type="text" maxLength='100' placeholder='Type a caption...' style={{ display: `${files[0] ? 'block' : 'none'}` }} value={mediaCaption} onChange={e => setMediaCaption(e.target.value)}></textarea>

        <div style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} className="post-media-processing-overlay">
          {files[0] && mediaProcessing &&
            <>
              {darkMode ?
                <video style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoDark}>
                </video>
                :
                <video style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoLight}>
                </video>
              }
            </>
          }
        </div>

        {fileLength > 1 && <div className="multiple-dm-media-div"></div>}
        
        <img style={{ display: `${isOnePic ? 'block' : 'none'}` }} className='img-messsge'/>
        
        <video autoPlay className='video-message' style={{ display: `${isOneVid ? 'block' : 'none'}` }}></video>

        <textarea autoComplete='off' autoFocus value={newText} style={{display: `${files[0] ? 'none' : 'block'}` }} placeholder="Send a new message..." id='new-post-text'
          onChange={e => setNewText(e.target.value)} name="" cols="30" rows="10"></textarea> 
      </div>

      <div onClick={() => setShowNewMessageForm(false)} className='form-cancel-btn-div'>
        <span className='form-cancel-btn'>
          Cancel
        </span>
      </div>
    </form>
  )
}

export default NewChatForm