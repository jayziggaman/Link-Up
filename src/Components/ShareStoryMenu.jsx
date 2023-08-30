import React, { useContext, useEffect, useState } from 'react'
import { faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from '../App';
import FriendsList from './FriendsList';
import { db, directMessagesRef } from '../firebase/config';
import {v4 as uuidv4} from 'uuid';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

const ShareStoryMenu = ({currStory}) => {
  const {
    user, userAuth, day, month, year, hours, mins, period, windowWidth, allPosts, userDirectMessages, sssMenu, setSssMenu
  } = useContext(appContext)
  const [selected, setSelected] = useState([])
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }

  const url = useLocation()

  // console.log(currStory)

  // const [width, setWidth] = useState(70 * selected.length)

  // useEffect(() => {
  //   const ShareMenu = document.querySelector('.story-share-menu')
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
    const ShareMenu = document.querySelector('.story-share-menu')
    if (sssMenu) {
      ShareMenu.style.zIndex = '1000'
      ShareMenu.style.visibility = 'visible'
      ShareMenu.style.transform = ' translateY(0)'
    } else {
      ShareMenu.style.zIndex = '-1000'
      ShareMenu.style.visibility = 'hidden'
      ShareMenu.style.transform = ' translateY(500px)'
      setSelected([])
    }
  }, [sssMenu])

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
          storyCreator: currStory.creator,
          storyUrl: url.pathname,
          storyText: currStory.body,
          storyMedia: currStory.body,
          storyMediaCaption: currStory?.caption || '',
          storyType: currStory.type,
          storyProps: currStory.props,
          date: `${day}/${month}/${year}`,
          createdAt: time.getTime(),
          time: `${hours}:${mins} ${period}`, 
          creator: userAuth,
          type: 'sent-story',
          isSent: false
        })
    
        setDoc(doc(messagesRefB, id), {
          id: id,
          storyCreator: currStory.creator,
          storyUrl: url.pathname,
          storyText: currStory.body,
          storyMedia: currStory.body,
          storyMediaCaption: currStory?.caption || '',
          storyType: currStory.type,
          storyProps: currStory.props,
          date: `${day}/${month}/${year}`,
          createdAt: time.getTime(),
          time: `${hours}:${mins} ${period}`, 
          creator: userAuth,
          type: 'sent-story',
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
            mostRecentMessageType: 'sent-story',
  
          }).then(() => {
            const userRef = doc(db, 'users', selectedUser.id, 'directMessages', location + 'b')
            updateDoc(userRef, {
              mostRecentMessage: '',
              mostRecentMessageTime: `${hours}:${mins} ${period}`,
              mostRecentMessageCreator: userAuth,
              createdAt: time.getTime(),
              mostRecentMessageType: 'sent-story',
            })
          })
  
          
        } else {
          const userRef = doc(db, 'users', userAuth, 'directMessages', location + 'b')
          updateDoc(userRef, {
            mostRecentMessage: '',
            mostRecentMessageTime: `${hours}:${mins} ${period}`,
            mostRecentMessageCreator: userAuth,
            createdAt: time.getTime(),
            mostRecentMessageType: 'sent-story',
  
          }).then(() => {
            const userRef = doc(db, 'users', selectedUser.id, 'directMessages', location + 'a')
            updateDoc(userRef, {
              mostRecentMessage: '',
              mostRecentMessageTime: `${hours}:${mins} ${period}`,
              mostRecentMessageCreator: userAuth,
              createdAt: time.getTime(),
              mostRecentMessageType: 'sent-story',
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
    <div className='story-share-menu'>
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
        setSssMenu(false)
      }}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  )
}

export default ShareStoryMenu