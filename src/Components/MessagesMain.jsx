import React, { useContext, useEffect, useRef } from 'react'
import { FaPlus, FaPen } from 'react-icons/fa'
import Footer from './Footer'
import { appContext } from '../App'
import Chat from './Chat'
import MessagesHeader from './MessagesHeader'
import MessagesNav from './MessagesNav'
import Form from './Form'
import NewChatForm from './NewChatForm'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const MessagesMain = ({inboxId, showUserList, setShowUserList}) => {
  const { users, user, showOptionsDIv, setShowOptionsDiv, setShowForm, windowWidth, userAuth, userDirectMessages, setUserDirectMessages, showNewMessageForm, messagesRed, setMessagesRed } = useContext(appContext)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  useEffect(() => {
    if (userDirectMessages !== undefined) {
      setLoading(false)
    }
  }, [userDirectMessages])

  useEffect(() => {
    const condition = userDirectMessages?.find(dm => {
      const { createdAt, lastSeen } = dm
      const at = Math.floor(createdAt / 1000)
      return (at - lastSeen) > 0


      // if (mostRecentMessageCreator === userAuth) {
      //   setMessagesRed(false)
      // } else {
      //   if ((at - lastSeen) > 0) {
      //     setMessagesRed(false)
      //   } else {
      //     setMessagesRed(true)
      //   }
      // }
    })

    if (condition) {
      setMessagesRed(true)
    } else {
      setMessagesRed(false)
    }
  }, [userDirectMessages])


  const sort = userDirectMessages?.sort((a, b) => {
    return b.createdAt - a.createdAt
  })

  return (
    <main style={{ marginTop: windowWidth <= 700 ? '3rem' : '0' }} className={inboxId ? "messages-main none" : "messages-main"}>
      {windowWidth < 800 ?
        <>{!inboxId && <MessagesHeader />}</>
        : <MessagesHeader />
      }
      <MessagesNav />
      
      {windowWidth > 849 && 
        <>
          <div className="chat-list" style={{top: inboxId ? '5.2rem' : '5.2rem'}}>
            {sort?.map(message => <Chat key={message.id} message={message}/>)}
          </div>
        </>
      }

      {windowWidth < 800 && windowWidth > 500 &&
        <>
          <div className="chat-list" style={{top: inboxId ? '0.5rem' : '3rem'}}>
            {sort?.map(message => <Chat key={message.id} message={message}/>)}
          </div>
        </>
      }

      {windowWidth > 800 && windowWidth < 850 &&
        <>
          <div className="chat-list">
            {sort?.map(message => <Chat key={message.id} message={message}/>)}
          </div>
        </>
      }

      {windowWidth < 501 && 
        <>
          {!loading ?
          <>
            <div className="chat-list" style={{top: inboxId ? '0.5rem' : '3rem'}}>
              {sort?.map(message => <Chat key={message.id} message={message}/>)}
            </div>
          </>
          :
          <>
            {inboxId ?
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
              :
              <>
                <div className="messages-loading">
                  <div className="messages-loading-div">
                    {loadArr.map((item, index) => {
                      return (
                        <div key={index} className="chat-loading">
                          <div className='chat-pfp-loading'></div>

                          {windowWidth > 849 &&
                            <>
                              <div className='chat-name-text-loading'>
                                <div className="chat-name-loading"></div>
                                <div className="chat-text-loading"></div>
                              </div>
                              
                              <div className='chat-time-loading'></div>
                            </>
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            }
          </>
          }
        </>
      }
      
      

      {!inboxId &&
        
        <>
          {!showUserList && !showNewMessageForm &&
          <button className='new-post-icon' onClick={() => {
            if (userAuth) {
              setShowUserList(true)
            } else {
              navigate('/login')
            }
            }}>
              <FaPen />
            </button>
          }
          
          {/* consider changing to send a dm instead */}
          {/* <NewChatForm /> */}
        
          <Footer />
        </>
      }
        
    </main>
  )
}

export default MessagesMain