import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import Options from './Options'

const Chat = ({message}) => {
  const { showOptionsDIv, setShowOptionsDiv, users, userAuth, directMessages, leavingTime, windowWidth, chatId } = useContext(appContext)
  const { id, user, mostRecentMessage, mostRecentMessageTime, mostRecentMessageCreator,mostRecentMessageType, lastSeen, createdAt } = message

  const [messageCreator, setMessageCreator] = useState('')
  const [chatUser, setChatUser] = useState()
  const [hasRead, setHasRead] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMessageCreator(users.find(user => user.id === mostRecentMessageCreator))
    setChatUser(users.find(person => person.id === user))

    const dm = directMessages.find(dm => dm.id === message.id)
  }, [users, message])

  const checkLength = (username, message) => {
    const newWord = `${username} ${message}` 
    let returnSentence = ''
    
    switch (windowWidth > 0) {
      case windowWidth < 501 && windowWidth > 400 :
        returnSentence = newWord.length > 37 ? `${newWord.slice(0, 37)}...` : newWord
        break;
      
      case windowWidth < 401 && windowWidth > 350 :
        returnSentence = newWord.length > 30 ? `${newWord.slice(0, 30)}...` : newWord
        break;
      case windowWidth < 351 :
        returnSentence = newWord.length > 25 ? `${newWord.slice(0, 25)}...` : newWord
        break;
      case windowWidth > 850 && windowWidth < 950 :
        returnSentence = newWord.length > 20 ? `${newWord.slice(0, 20)}...` : newWord
        break;
      
      case windowWidth > 949 && windowWidth < 1050 :
        returnSentence = newWord.length > 25 ? `${newWord.slice(0, 25)}...` : newWord
        break;
    
      case windowWidth > 1049 && windowWidth < 1150 :
        returnSentence = newWord.length > 30 ? `${newWord.slice(0, 30)}...` : newWord
        break;
    
      case windowWidth > 1149 && windowWidth < 1250 :
        returnSentence = newWord.length > 35 ? `${newWord.slice(0, 35)}...` : newWord
        break;
    
      case windowWidth > 1249 && windowWidth < 1350 :
        returnSentence = newWord.length > 40 ? `${newWord.slice(0, 40)}...` : newWord
        break;
    
      case windowWidth > 1349 :
        returnSentence = newWord.length > 45 ? `${newWord.slice(0, 45)}...` : newWord
        break;
    }

    return returnSentence
  }

  const structure = (word) => {
    const [first, ...rest] = word?.split(':')
    return[first, rest]
  }

  useEffect(() => {
    const at = Math.floor(createdAt / 1000)
    if (mostRecentMessageCreator === userAuth) {
      setHasRead(true)
    } else {
      if ((at - lastSeen) > 0) {
        setHasRead(false)
      } else {
        setHasRead(true)
      }
    }
  }, [message])

  let isHolding = false
  let clicks = 0
  
  function mousedown() {
    setTimeout(() => {
      isHolding = true
    }, 500);
  }

  function mouseup(route) {
    if (isHolding) {
      setShowOptionsDiv(true)
    } else {
      const {id, username, displayName, followers, following, avatarUrl, userType} = chatUser
      navigate(route, { state:{id, username, displayName, followers, following, avatarUrl, userType}})
    }
    isHolding = false
  }


  return (
    <>
      <div id={message?.id} className='chat' onClick={e => {
        chatId.current = e.currentTarget.id
      }}>

        <Link state={chatUser} className="chat-pfp" onMouseDown={()=> mousedown()}
          onMouseUp={() => mouseup(`/messages/${id.slice(0, id?.length - 1)}`)}
          // to={!isHolding && `/messages/${id.slice(0, id?.length - 1)}`}
        >
          <img src={chatUser?.avatarUrl} alt="" />
          {!hasRead &&
            <span className="has-read-indicator"></span>
          }
        </Link>

        {windowWidth < 501 &&
          <>
            <Link state={chatUser} className="chat-username-recent-msg"
              onMouseDown={()=> mousedown()}
              onMouseUp={() => mouseup(`/messages/${id.slice(0, id?.length - 1)}`)}
              // to={!isHolding && `/messages/${id.slice(0, id?.length - 1)}`}
            >
              <p className='chat-username'> {chatUser?.displayName} </p>
              
              {mostRecentMessageType === 'text-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    <>
                      {<>
                        {structure(checkLength('You:', mostRecentMessage)?.slice(':'))[0]}: 
                        {structure(checkLength('You:', mostRecentMessage)?.slice(':'))[1]}
                      </>
                      }
                    </>
                    :
                    <>
                      {<>
                        {structure(checkLength(`${messageCreator?.displayName}:`, mostRecentMessage)?.slice(':'))[0]}:
                        {structure(checkLength(`${messageCreator?.displayName}:`, mostRecentMessage)?.slice(':'))[1]}
                      </>
                      }
                    </>
                  }
                </p>
              }
              

              {mostRecentMessageType === 'photo-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a photo'
                    :
                    checkLength(messageCreator?.displayName, 'shared a photo')
                  }
                </p>
              }
              

              {mostRecentMessageType === 'video-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a photo'
                    :
                    checkLength(messageCreator?.displayName, 'shared a video')
                  }
                </p>
              }

              {mostRecentMessageType === 'group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared some files'
                    :
                    checkLength(messageCreator?.displayName, 'shared some files')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Picture-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'story-text-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }
              
              {mostRecentMessageType === 'story-photo-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }
              
              {mostRecentMessageType === 'story-video-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }

              {mostRecentMessageType === 'story-group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-text-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-photo-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-video-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'sent-story' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a story'
                    :
                    checkLength(messageCreator?.displayName, 'sent a story')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Photo-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Photo-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }
            </Link>

            <div className="chat-options-time">
              <button onClick={e => setShowOptionsDiv(!showOptionsDIv)} >
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </button>
              <p> {mostRecentMessageTime} </p>
            </div>
          </>
        }

        {windowWidth > 849 &&
          <>
            <Link state={chatUser} className="chat-username-recent-msg"
              onMouseDown={()=> mousedown()}
              onMouseUp={() => mouseup(`/messages/${id.slice(0, id?.length - 1)}`)}
              // to={!isHolding && `/messages/${id.slice(0, id?.length - 1)}`}
            >
              <p className='chat-username'> {chatUser?.displayName} </p>
              
              {mostRecentMessageType === 'text-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    <>
                      {<>
                        {structure(checkLength('You:', mostRecentMessage)?.slice(':'))[0]}: 
                        {structure(checkLength('You:', mostRecentMessage)?.slice(':'))[1]}
                      </>
                      }
                    </>
                    :
                    <>
                      {<>
                        {structure(checkLength(`${messageCreator?.displayName}:`, mostRecentMessage)?.slice(':'))[0]}:
                        {structure(checkLength(`${messageCreator?.displayName}:`, mostRecentMessage)?.slice(':'))[1]}
                      </>
                      }
                    </>
                  }
                </p>
              }
              

              {mostRecentMessageType === 'photo-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a photo'
                    :
                    checkLength(messageCreator?.displayName, 'shared a photo')
                  }
                </p>
              }
              

              {mostRecentMessageType === 'video-message' &&
                <p className='chat-mrm'>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a photo'
                    :
                    checkLength(messageCreator?.displayName, 'shared a video')
                  }
                </p>
              }

              {mostRecentMessageType === 'group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared some files'
                    :
                    checkLength(messageCreator?.displayName, 'shared some files')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Picture-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Media-post' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You shared a post'
                    :
                    checkLength(messageCreator?.displayName, 'shared a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'story-text-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }
              
              {mostRecentMessageType === 'story-photo-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }
              
              {mostRecentMessageType === 'story-video-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }

              {mostRecentMessageType === 'story-group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s story`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your story')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-text-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-photo-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-video-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'reply-group-media-message' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    checkLength('You replied', `${chatUser?.displayName}'s message`)
                    :
                    checkLength(messageCreator?.displayName, 'replied your message')
                  }
                </p>
              }

              {mostRecentMessageType === 'sent-story' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a story'
                    :
                    checkLength(messageCreator?.displayName, 'sent a story')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Photo-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Comment-comment' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Text-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Photo-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Video-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }

              {mostRecentMessageType === 'Group-Reply-reply' &&
                <p className='chat-mrm' style={{ marginTop: '7px' }}>
                  {mostRecentMessageCreator === userAuth ?
                    'You sent a post'
                    :
                    checkLength(messageCreator?.displayName, 'sent a post')
                  }
                </p>
              }
            </Link>

            <div className="chat-options-time">
              <button onClick={e => setShowOptionsDiv(!showOptionsDIv)} >
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </button>
              <p> {mostRecentMessageTime} </p>
            </div>
          </>
        }
        
      </div>
      
      {/* <Options func={[
        { text: 'Clear chat', id: chatId.current,  prop: 'clear-chat red' }
      ]}
      /> */}
    </>
  )
}

export default Chat