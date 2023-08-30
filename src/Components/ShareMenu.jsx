import React, { useContext, useEffect, useState } from 'react'
import { faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from '../App';
import FriendsList from './FriendsList';
import { db, directMessagesRef } from '../firebase/config';
import {v4 as uuidv4} from 'uuid';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const ShareMenu = () => {
  const {
    user, showShareMenu, directMessages, userAuth, day, month, year, hours, mins, period, selectedMessage, setSelectedMessage, setShowShareMenu, windowWidth, allPosts, userDirectMessages
  } = useContext(appContext)
  const [selected, setSelected] = useState([])
  const [chatDateMarker, setChatDateMarker] = useState([])
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }

  // const [width, setWidth] = useState(70 * selected.length)

  // useEffect(() => {
  //   setWidth(70 * selected?.length)
  // }, [selected])

  // useEffect(() => {
  //   const ShareMenu = document.querySelector('.share-menu')
  //   const selectedFriends = document.querySelector('.selected-friends')
  //   width > windowWidth ?
  //     ShareMenu.style.width = `${width - 50}px`
  //   :
  //     ShareMenu.style.width = `${windowWidth - 50}px`
    
  //   if (selectedFriends) {
  //     width > windowWidth ?
  //     selectedFriends.style.width = `${width - 50}px` :
  //     selectedFriends.style.width = `${windowWidth - 50}px`
  //   }
  // }, [width, windowWidth])

  useEffect(() => {
    const ShareMenu = document.querySelector('.share-menu')
    if (showShareMenu) {
      ShareMenu.style.zIndex = '1000'
      ShareMenu.style.visibility = 'visible'
      ShareMenu.style.transform = ' translateY(0)'
    } else {
      ShareMenu.style.zIndex = '-1000'
      ShareMenu.style.visibility = 'hidden'
      ShareMenu.style.transform = ' translateY(500px)'
      setSelected([])
      setSelectedMessage({})
    }
  }, [showShareMenu])


  const handleSelected = (user) => {
    const condition = selected.find(select => select.id === user.id)
    if (condition) {
      return
    } else {
      setSelected([...selected, user])
    }
  }

  const removeSelected = (id) => {
    setSelected(selected.filter(item => item.id !== id))
  }

  const handleNewMessage = async (location, selectedUser) => {
    const id = uuidv4()
    const paraCondition = selectedUser.dmId.localeCompare(user.dmId)

    if (selectedMessage.typeOf === 'post') {
      const {post} = selectedMessage
      const postRef = doc(db, 'posts', post.id)
      updateDoc(postRef, {
        shares: {
          value: [...post.shares.value, userAuth]
        }
      })

    } else if (selectedMessage.typeOf === 'comment') {
      const { post, comment } = selectedMessage

      const commentRef = doc(db, 'posts', post.id, 'comments', comment.id)
      updateDoc(commentRef, {
        shares: {
          value: [...comment.shares.value, userAuth]
        }
      }).then(() => {
        const postRef = doc(db, 'posts', post.id)
        const commentRef = collection(db, 'posts', post.id, 'comments')
        let arr = []
        onSnapshot(commentRef, snap => {
          snap.docs.forEach(doc => {
            arr.push({ ...doc.data(), id: doc.id })
          })
          updateDoc(postRef, {
            comments: {
              value: [...arr]
            }
          } )
        })
      })

    } else if (selectedMessage.typeOf === 'reply') {
      const {post, comment, reply} = selectedMessage

      const replyRef = doc(db, 'posts', post.id, 'comments', comment.id, 'replies', reply.id)
      updateDoc(replyRef, {
        shares: {
          value: [...reply.shares.value, userAuth]
        }
      }).then(() => {
        const repliesRef = collection(db, 'posts', post.id, 'comments', comment.id, 'replies')
        onSnapshot(repliesRef, snap => {
          let arr = []
          snap.docs.forEach(doc => {
            arr.push({ ...doc.data(), id: doc.id })
          })
          const docRefIII = doc(db, 'posts', post.id, 'comments', comment.id)
          updateDoc(docRefIII, {
            replies: {
              value: [...arr]
            }
          }).then(() => {
  
            const commentRef = collection(db, 'posts', post.id, 'comments')
            onSnapshot(commentRef, snap => {
              const commentsArr = []
              snap.docs.forEach(doc => {
                commentsArr.push({...doc.data(), id: doc.id})
              })
              const docRefIV = doc(db, 'posts', post.id)
              updateDoc(docRefIV, {
                comments: {
                  value: [...commentsArr]
                }
              })
            })
          })
        })
      })
    }

    const messagesRefA = collection(directMessagesRef, location + 'a', 'messages')
    const messagesRefB = collection(directMessagesRef, location + 'b', 'messages')

    try {
      const docRefA = doc(db, 'directMessages', `${location}a`)
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


      const docRefB = doc(db, 'directMessages', `${location}b`)
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
        setDoc(doc(messagesRefA, id), {
          id: id,
          postId: selectedMessage.post.id,
          post: selectedMessage.post,
          comment: selectedMessage.comment || '',
          reply: selectedMessage.reply || '',
          commentId: selectedMessage.comment?.id || '',
          replyId: selectedMessage.reply?.id || '',
          date: `${day}/${month}/${year}`,
          createdAt: time.getTime(),
          time: `${hours}:${mins} ${period}`, 
          creator: userAuth,
          type: `${selectedMessage.type}-${selectedMessage.typeOf}`,
          isSent: false
        })
    
        setDoc(doc(messagesRefB, id), {
          id: id,
          postId: selectedMessage.post.id,
          post: selectedMessage.post,
          comment: selectedMessage.comment || '',
          reply: selectedMessage.reply || '',
          commentId: selectedMessage.comment?.id || '',
          replyId: selectedMessage.reply?.id || '',
          date: `${day}/${month}/${year}`,
          createdAt: time.getTime(),
          time: `${hours}:${mins} ${period}`, 
          creator: userAuth,
          type: `${selectedMessage.type}-${selectedMessage.typeOf}`,
          isSent: false
        })
      } finally {
        if (paraCondition === 1) {
          const userRef = doc(db, 'users', userAuth, 'directMessages', location + 'a')
          updateDoc(userRef, {
            mostRecentMessage: '',
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: `${selectedMessage.type}-${selectedMessage.typeOf}`,
  
          }).then(() => {
            const userRef = doc(db, 'users', selectedUser.id, 'directMessages', location + 'b')
            updateDoc(userRef, {
              mostRecentMessage: '',
              mostRecentMessageTime: `${hours}:${mins} ${period}`,
              mostRecentMessageCreator: userAuth,
              createdAt: time.getTime(),
              mostRecentMessageType: `${selectedMessage.type}-${selectedMessage.typeOf}`,
            })
          })
  
          
        } else {
          const userRef = doc(db, 'users', userAuth, 'directMessages', location + 'b')
          updateDoc(userRef, {
            mostRecentMessage: '',
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: `${selectedMessage.type}-${selectedMessage.typeOf}`,
  
          }).then(() => {
            const userRef = doc(db, 'users', selectedUser.id, 'directMessages', location + 'a')
            updateDoc(userRef, {
              mostRecentMessage: '',
              mostRecentMessageTime: `${hours}:${mins} ${period}`,
              mostRecentMessageCreator: userAuth,
              createdAt: time.getTime(),
              mostRecentMessageType: `${selectedMessage.type}-${selectedMessage.typeOf}`,
            })
          })
        }
      }
   }
  }

  const initiateSend = async () => {
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
          setDoc(doc(directMessagesRef, `${para}a`), {
            mainUser: user?.id,
            otherUser: select.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
  
          }).then(() => {
            setDoc(doc(directMessagesRef, `${para}b`), {
              mainUser: select.id,
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
              user: select.id,
              lastSeen: 0
            }).then(() => {
              const ref = collection(db, 'users', select.id, 'directMessages')
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
          setDoc(doc(directMessagesRef, `${para}a`), {
            mainUser: select.id,
            otherUser: user?.id,
            chatDateMarker: [],
            isActive: false,
            activeLast: 0
  
          }).then(() => {
            setDoc(doc(directMessagesRef, `${para}b`), {
              mainUser: user?.id,
              otherUser: select.id,
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
              user: select.id,
              lastSeen: 0
            }).then(() => {
              const ref = collection(db, 'users', select.id, 'directMessages')
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
  }

  
  return (
    <div className='share-menu'>
      <div className="share-menu-search">
        <FontAwesomeIcon icon={faSearch} />
        <input autoComplete='off' type="text" placeholder='Search Friends' />
      </div>

      {
        selected.length > 0 &&
        <div className="selected-friends">
            {selected.map(select => <div key={select.id}> 
              <img src={select.avatarUrl} alt="" />

              <div onClick={() => removeSelected(select.id) }>
                <div className="remove-select"></div>
                <div className="remove-select"></div>
              </div>
            </div>
          )}
        </div>
      }

      <div className="search-results">
        {user?.friends.value.map(result => <FriendsList key={result} result={result} handleSelected={handleSelected} /> )}
      </div>

      <button className='share-send-btn' onClick={() => {
        initiateSend()
        setShowShareMenu(false)
      }}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  )
}

export default ShareMenu