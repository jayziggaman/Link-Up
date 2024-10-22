import React, { useContext, useEffect, useRef, useState } from 'react'
import { faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appContext } from '../App';
import CloseIcon from '@mui/icons-material/Close';
import FriendsList from './FriendsList';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { db, messageRoomsRef } from '../firebase/config';
import {v4 as uuidv4} from 'uuid';
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import UserPfp from './GENERAL-COMPONENTS/UserPfp';
import ChopText from './GENERAL-COMPONENTS/ChopText';
import { compareStrings } from '../GENERAL-FUNCTIONS/functions';
import { functionsContext } from '../CONTEXTS/FunctionsContext';

const ShareMenu = () => {
  const {
    user, showShareMenu, userAuth, day, month, year, hours, mins, period, selectedMessage, setSelectedMessage, setShowShareMenu, windowWidth, allPosts, userDirectMessages, users
  } = useContext(appContext)
  const { checkIfDMExists, createDM, callError } = useContext(functionsContext)

  const [selected, setSelected] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [userFriends, setUserFriends] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime() - 50
  }

  useEffect(() => {
    if (!showShareMenu) {
      setSelected([])
      setSelectedMessage({
        postId: "", commentId: "", replyId: "", storyId: "", post: {}, creator: {}
      })
      setSearchTerm('')
    }
  }, [showShareMenu])


  const handleSelected = (user) => {
    const { id } = user
    
    const condition = selected.find(select => select.id === id)
    if (condition) {
      removeSelected(id)

    } else {
      setSelected([...selected, user])
    }
  }



  const removeSelected = (id) => {
    setSelected(selected.filter(item => item.id !== id))
  }


  async function sendPostToSelectedUser(selectedUser) {
    const { id: selectId } = selectedUser

    const dmUrl = compareStrings(user.id, selectId)

    try {
      const messageRoomRef = doc(messageRoomsRef, dmUrl);
      const dmExists = await checkIfDMExists(messageRoomRef);
  
      if (dmExists) {
        sharePost(dmUrl);

      } else {
        await createDM(user, selectedUser, dmUrl);
        sharePost(dmUrl);
      }

    } catch (error) {
      callError(`Couldn't send reply to ${selectedUser.displayName}, please try again`)
    }
  }

  

  const initializeSharePost = async () => {
    selected.map(selectedUser => {
      sendPostToSelectedUser(selectedUser)
   })
  }


  const sharePost = async (dmUrl) => {
    const ref = collection(messageRoomsRef, dmUrl, 'messages');
    const id = uuidv4()

    const { postId, commentId, replyId, storyId, post, creator } = selectedMessage

    setDoc(doc(ref, id), {
      id,
      type: post.type,
      media: [],
      date: `${day}/${month}/${year}`,
      time: `${hours}:${mins} ${period}`, 
      creator: user.id,
      createdAt: serverTimestamp(),
      
      postId: postId ? postId : '',
      commentId: commentId ? commentId : '',
      replyId: replyId ? replyId : '',
      storyId: storyId ? storyId : '',
      post,
      postCreator: creator

    }).then(() => {
      callError("Message sent!")

    }).catch(() => {
      callError("Couldn't send reply. Please try again.")
    })
  }



  useEffect(() => {
    if (user && user.id) {
      const friends = user.friends.value
      const arr = []
      for (let friend of friends) {
        const person = users.find(user => user.id === friend)

        if(person) arr.push(person)
      }
      setUserFriends(arr)
    }
  }, [user])
  

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResult([...userFriends])

    } else {
      setSearchResult(userFriends.filter(user =>
        user.username.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
      ))
    }
  }, [searchTerm, userFriends])



  return (
    <div className={showShareMenu ? 'active share-menu-overlay' : 'share-menu-overlay'}>
      <div className='share-menu'>
        <button className='close-menu' onClick={() => setShowShareMenu(false)}>
          <CloseIcon />
        </button>

        <div className="share-menu-search">
          <FontAwesomeIcon icon={faSearch} />
          <input autoComplete='off' type="text" value={searchTerm}
            placeholder='Search Friends' onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {selected.length > 0 &&
          <div className="selected-friends">
            {selected.map(select => {
              const { id, avatarUrl, username } = select
              
              return (
                <div key={id} className="selected-friend">  
                  <UserPfp user={select} />

                  <button onClick={() => removeSelected(id) }>
                    <CancelOutlinedIcon />
                  </button>

                  <p>
                    <ChopText text={username} num={9} />
                  </p>
                </div>
              )
            })}
          </div>
        }

        <div className="search-results">
          {searchResult.map(result => {
            return (
              <FriendsList
                key={result.id} result={result} handleSelected={handleSelected}
              />
            )
          })}
        </div>

        <button className='share-send-btn' onClick={() => {
          initializeSharePost()
          setShowShareMenu(false)
        }}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  )
}

export default ShareMenu