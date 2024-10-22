import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import UserPfp from './GENERAL-COMPONENTS/UserPfp';
import Options from './GENERAL-COMPONENTS/Options';



const dmRoomContext = React.createContext()




const DMRoom = ({ dmRoom }) => {
  const { users, user, windowWidth } = useContext(appContext)
  const { fetchDM, deleteMessage } = useContext(functionsContext)

  const { id, users: dmUsers } = dmRoom

  const [loading, setLoading] = useState(true)
  const [roomMessages, setRoomMessages] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [hasRead, setHasRead] = useState(false)
  const [showOptionsDiv, setShowOptionsDiv] = useState(false)

  const optionId = useRef(null)
  const location = useLocation()



  useEffect(() => {
    if (dmRoom && user) {
      const dmUsers = Object.keys(dmRoom.users)
      const otherUsername = dmUsers.find(person => person.trim() !== user.username.trim())

      setOtherUser(users.find(user => user.username.trim() === otherUsername.trim()))
    }
  }, [dmRoom, user])



  useEffect(() => {
    if (user && otherUser && dmRoom) {
      fetchDM(dmRoom.id, setRoomMessages, otherUser)
    }
  }, [user, otherUser, dmRoom]);



  useEffect(() => {
    if (lastMessage) {
      setLoading(false)


      if (lastMessage.creator === user?.id || !lastMessage.creator) {
        setHasRead(true)

      } else {
        const lmCreatedAt = lastMessage.createdAt
        const lastMessageTime = `${lmCreatedAt?.seconds}.${lmCreatedAt?.nanoseconds}`

        const userLastActive = dmRoom.users[user?.username].lastActive
        const myLastSeen = `${userLastActive?.seconds}.${userLastActive?.nanoseconds}`

        if (parseFloat(myLastSeen) >= parseFloat(lastMessageTime)) {
          setHasRead(true)

        } else {
          setHasRead(false)
        }

      }
    }
  }, [lastMessage, dmRoom])



  useEffect(() => {
    function checkForLastMessage() {
      if (roomMessages.length === 0) {
        setLastMessage({})

      } else {
        for (let i = (roomMessages.length - 1); i >= 0; i--) {
          if (roomMessages[i].type !== 'date-marker') {
            setLastMessage(roomMessages[i])
            return

          } else {
            setLastMessage({})
          }
        }
      }
    }


    if (roomMessages) {
      checkForLastMessage()
    }
  }, [roomMessages])

  // deleteMessage(dmUrl, id, isUserCreator, user, otherUser)

  const clearMessages = () => roomMessages.map(message => {
    const { id } = message

    // dmUrl, messageId, condition, user, otherUser
    
    deleteMessage(dmRoom.id, id, false, user, otherUser);
  })
  // const callRemoveBookmarkedPost = () => removeBookmarkedPost(id);
  // const callBookmarkPost = () => bookmarkPost(id, id);


  const functionsForOption = [
    { text: 'Clear Chat', func: clearMessages }
  ];




  if (loading) {
    return (
      <div className="chat-loading">
        <div className='chat-pfp-loading'></div>

        {windowWidth < 500 || windowWidth > 850 ?
          <>
            <div className='chat-name-text-loading'>
              <div className="chat-name-loading"></div>
              <div className="chat-text-loading"></div>
            </div>
            
            <div className='chat-time-loading'></div>
          </>
          : <></>
        }
      </div>
    )

  } else {
    return (
      <dmRoomContext.Provider
        value={{
          lastMessage, optionId, otherUser, dmRoom, showOptionsDiv, setShowOptionsDiv
        }}
      >
        <div id={lastMessage?.id} className='chat'>
          <Link className="chat-pfp"
            state={{ from: location.pathname, user: otherUser }} 
            to={`/messages/${dmRoom.id}`}
          >
            <UserPfp user={otherUser} />
            
            {!hasRead &&
              <span className="has-read-indicator"></span>
            }
          </Link>
  
          {windowWidth < 500 || windowWidth > 850 ?
            <DMRoomDiv />
            :
            <button onClick={() => {
              optionId.current = id
              setShowOptionsDiv(!showOptionsDiv)
            }}>
              <MoreVertOutlinedIcon />
            </button>
          }

          {user?.id &&
            <Options
              functions={functionsForOption} optionId={optionId}
              setShowOptionsDiv={setShowOptionsDiv} showOptionsDiv={showOptionsDiv}
            />
          }
        </div>
      </dmRoomContext.Provider>
    )
  }
}

export default DMRoom







const DMRoomDiv = () => {
  const { user } = useContext(appContext)

  const { lastMessage, otherUser, dmRoom, optionId, showOptionsDiv, setShowOptionsDiv } = useContext(dmRoomContext)

  const { caption, creator, type, time } = lastMessage

  const [lastMessageCreator, setLastMessageCreator] = useState(
    creator === otherUser.id ? otherUser : creator === user.id && user
  )
  const [isUserCreator, setIsUserCreator] = useState(creator === user.id)

  const location = useLocation()
  

  
  return(
    <>
      <Link className="chat-username-recent-msg"
        state={{ from: location.pathname, user: otherUser }} 
        to={`/messages/${dmRoom.id}`}
      >
        <p className='chat-username'> {otherUser.displayName} </p>
        
        {lastMessage.type ?
          <p className='chat-mrm'>
            {type === 'text-message' || type === 'reply-text-message' ?
              <>
                {isUserCreator ?
                  `You: ${caption}`
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''}: ${caption}`
                }
              </>
              : <></>
            }
            

            {type === 'photo-message' || type === 'reply-photo-message' ?
              <>
                {isUserCreator ?
                  'You sent a photo'
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''} sent a photo`
                }
              </>
              : <></>
            }
        

            {type === 'video-message' || type === 'reply-video-message' ?
              <>
                {isUserCreator ?
                  'You sent a video'
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''} sent a video`
                }
              </>
              : <></>
            }

            {type === 'group-media-message' || type === 'reply-group-media-message' ?
              <>
                {isUserCreator ?
                  'You sent some files'
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''} sent some files`
                }
              </>
              : <></>
            }


            {type === 'Text' || type === 'Picture-Media' || type === 'Video-Media' || type === 'Group-Media' ?
              <>
                {isUserCreator ?
                  'You sent a post'
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''} sent a post`
                }
              </>
              : <></>
            }


            {type === 'story-text-message' || type === 'story-photo-message' || type === 'story-video-message' || type === 'story-group-media-message' ?
              <>
                {isUserCreator ?
                  `You replied ${otherUser.displayName}'s story`
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''}, replied your story`
                }
              </>
              : <></>
            }


            {type.includes("Story") &&
              <>
                {isUserCreator ?
                  'You sent a story'
                  :
                  `${lastMessageCreator?.displayName ? 
                    lastMessageCreator?.displayName : ''} sent a story`
                }
              </>
            }
          </p>
          : <></>
        }
      </Link>

      <div className="chat-options-time">
        <button
          onClick={() => {
            optionId.current = dmRoom.id
            setShowOptionsDiv(!showOptionsDiv)
          }}
        >
          <MoreHorizIcon />
        </button>
        <p> {time} </p>
      </div>
    </>
  )
}