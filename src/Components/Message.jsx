import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import ReplyMessage from './ReplyMessageAttachment'
import ReplyIcon from '@mui/icons-material/Reply';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { copyText } from '../GENERAL-FUNCTIONS/functions';
import { motion } from 'framer-motion';
import { messageRoomsRef } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import ChopText from './GENERAL-COMPONENTS/ChopText';
import Video from './GENERAL-COMPONENTS/Video';
import { messagingContext } from './MESSAGING-COMPONENTS/Messaging';
import ReplyMessageAttachment from './ReplyMessageAttachment';



const messageContext = React.createContext()


const Message = ({ message, isLastMessage }) => {
  const { user, showChatModal } = useContext(appContext)
  const { isLinkElement } = useContext(functionsContext)
  const { otherUser, thisRoom, dmUrl, replyMessage, setIsReply } = useContext(messagingContext)

  const { id, creator, media, replyMessage: messageRepliedTo, post, type, story } = message

  const [dragDistance, setDragDistance] = useState(0);
  const [isUserCreator, setIsUserCreator] = useState(creator === user.id)

  const resizeMedia = useRef([])
  const resizeMediaRef = el => el && resizeMedia.current.push(el)
  

  function isElementTouchingRegion(element, region) {
    const regionRect = region.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    
    const touchingTop = rect.top <= regionRect.top;
    const touchingBottom = rect.bottom >= regionRect.bottom;
    const touchingLeft = rect.left <= regionRect.left;
    const touchingRight = rect.right >= regionRect.right;
  
    return {
      touchingTop,
      touchingBottom,
      touchingLeft,
      touchingRight
    };
  }


  function isElementInsideRegion(element, region) {
    const regionRect = region.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    
    const topBelowBottom = rect.top >= regionRect.bottom;
    const bottomAboveTop = rect.bottom <= regionRect.top;
  
    return {
      topBelowBottom,
      bottomAboveTop
    };
  }


  function showOptionsSpan(messageId) {
    const optionsSpan = document.querySelector(`${messageId} .options-span`);

    if (optionsSpan) {
      optionsSpan.classList.add("active");
    }
  }


  function hideOptionsSpan(messageId) {
    const optionsSpan = document.querySelector(`${messageId} .options-span`);
    
    setTimeout(() => {
      if (optionsSpan) {
        optionsSpan.classList.remove("active");
      }
    }, 2000);
  }



  useEffect(() => {
    function windowResize() {
      resizeMedia.current.forEach(media => {
        if (media) {
          const elementId = `[id='${id.toString()}']`
          const div = document.querySelector(elementId)
          const pre = document.querySelector(`${elementId} pre`)
          const creatorDiv = document.querySelector(`${elementId} div.post-message-creator`)
          
          if (media.getBoundingClientRect().width > 100) {
            if (div) {
              div.style.width = `${media.getBoundingClientRect().width}px`
            }
        
            if (creatorDiv) {
              creatorDiv.style.width = `${media.getBoundingClientRect().width}px`
            }
        
            if (pre && pre.classList.contains('resize')) {
              pre.style.width = `${media.getBoundingClientRect().width}px`
            }
          }
        }
      })
    }

    window.addEventListener('resize', windowResize)

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [])




  useEffect(() => {
    const messagingSection = document.querySelector('.messaging-section')
    const messages = document.querySelectorAll('.message');
    
    function windowScroll() {
      const videos = document.querySelectorAll('video')
      const messagesArea = document.querySelector('.messaging-area')

      videos.forEach(video => {
        if (video && messagesArea) {
          const result = isElementInsideRegion(video, messagesArea)

          const { topBelowBottom, bottomAboveTop } = result

          if (topBelowBottom || bottomAboveTop) {
            video.pause()
          }
        }
      })
    }



    

    

    messages.forEach(message => {
      if (message) {
        const id = message.id;
        const messageId = `[id='${id.toString()}']`;    

        // Pass a function to the event listener
        message.addEventListener('mouseenter', () => showOptionsSpan(messageId));
        message.addEventListener('mouseleave', () => hideOptionsSpan(messageId));
      }
    });





    messagingSection?.addEventListener('scroll', windowScroll)

    return () => {
      messagingSection?.removeEventListener('scroll', windowScroll)
    }
  }, [])



  useEffect(() => {
    const videos = document.querySelectorAll('.message video')
    videos.forEach(video => video.pause())
  }, [showChatModal])

  

  function checkResize(e) {
    const image = e.currentTarget
    
    // if (image.naturalWidth / image.naturalHeight > image.clientWidth / image.clientHeight) {
    //   image.style.height = 'auto';
    //   image.style.width = '100%';
    // } else {
    //   image.style.width = 'auto';
    //   image.style.height = '100%';
    // }
  }




  function resizePre(e) {
    const media = e.currentTarget
    const elementId = `[id='${id.toString()}']`
    const div = document.querySelector(elementId)
    const pre = document.querySelector(`${elementId} pre`)
    const creatorDiv = document.querySelector(`${elementId} div.post-message-creator`)

    if (media.getBoundingClientRect().width > 100) {
      if (div) {
        div.style.width = `${media.getBoundingClientRect().width}px`
      }
  
      if (creatorDiv) {
        creatorDiv.style.width = `${media.getBoundingClientRect().width}px`
      }
  
      if (pre && pre.classList.contains('resize')) {
        pre.style.width = `${media.getBoundingClientRect().width}px`
      }
    }
  }


  useEffect(() => {
    if (dragDistance > 70) {
      replyMessage.current = message
      setIsReply(true)
    }
  }, [dragDistance])




  return (
    <messageContext.Provider
      value={{
        message, otherUser, isLastMessage, thisRoom, dmUrl, post, isUserCreator, checkResize, resizeMediaRef, resizePre, isElementTouchingRegion, hideOptionsSpan
      }}
    >
      <motion.div id={id}
        className={`message ${isUserCreator ? "align-right" : "align-left"}`}
        // drag="x"
        // dragConstraints={{ left: 100, right: 100 }}
        // whileDrag={{ scale: 1.2 }}
        // dragSnapToOrigin={true}
        // onDrag={(event, info) => {
        //   const newX = Math.max(0, Math.min(100, info.offset.x)); 
        //   setDragDistance(newX); 
        // }}
        // dragMomentum={false}
      >
        {type === 'text-message' &&
          <TypedMessage />
        }


        {type === 'photo-message' &&
          <TypedMessage>
            <PhotoMessage media={media}/>
          </TypedMessage>
        }

        
        {type === 'video-message' &&
          <TypedMessage>
            <VideoMessage media={media}/>
          </TypedMessage>
        }


        {type === 'group-media-message' &&
          <TypedMessage>
            <GroupMediaMessage media={media}/>
          </TypedMessage>
        }


        {type === 'Text' && post &&
          <PostMessage num={300} bgc={true} />
        }


        {type === 'Picture-Media' && post &&
          <PostMessage>
            <img ref={resizeMediaRef} src={post.media} alt=""
              onLoad={e => resizePre(e)}
            />
          </PostMessage>
        }


        {type === 'Video-Media' && post &&
          <PostMessage>
            <Video haveControls={true} source={post.media}
              onLoadedData={resizePre} videoRef={resizeMediaRef} 
            />
          </PostMessage>
        }


        {type === 'Group-Media' && post && 
          <PostMessage>
            {post.media[0].type === 'img' ?
              <img ref={resizeMediaRef} src={post.media[0].url} alt=""
                onLoad={e => resizePre(e)}
              />
            :
              <Video haveControls={true} source={post.media[0].url}
                onLoadedData={resizePre} videoRef={resizeMediaRef} 
              />
            }
          </PostMessage>
        }


        {type === 'story-text-message' && // reply a story with a text
          <RepliedStory story={story}>
            <TypedMessage />
          </RepliedStory>
        }

        {type === 'story-photo-message' && // reply a story with a photo
          <RepliedStory story={story}>
            <TypedMessage>
              <PhotoMessage media={media}/>
            </TypedMessage>
          </RepliedStory>
        }

        {type === 'story-video-message' && // reply a story with a video
          <RepliedStory story={story}>
            <TypedMessage>
              <VideoMessage media={media}/>
            </TypedMessage>
          </RepliedStory>
        }

        {type === 'story-group-media-message' && // reply a story with group media
          <RepliedStory story={story}>
            <TypedMessage>
              <GroupMediaMessage media={media}/>
            </TypedMessage>
          </RepliedStory>
        }

        {type === 'reply-text-message' && // reply a message with a text
          <ReplyTypedMessage />
        }

        {type === 'reply-photo-message' && // reply a message with a photo
          <div className='text-post-msg'
          >
              
            <div>
              <div className='replied-message' onClick={() => {
                const element = document.querySelector(`[id='${replyMessage.id}']`)
                element.scrollIntoView()
              }}>
                <ReplyMessage message={message}/>
              </div>
              
              <div className="media-reply">
                <MessageOptions message={message} dmUrl={dmUrl} 
                  otherUser={otherUser}
                  />

                <img src={media} alt="" className='img story-reply-img' onLoad={() => {
                  const pre = document.querySelector(`[id='${id.toString()}'] .media-reply pre`)
                  pre.style.width = `${document.querySelector(`[id='${id.toString()}'] .media-reply img`).getBoundingClientRect().width}px`

                  const div = document.querySelector(`[id='${id.toString()}'] .pic-post-body`)
                  div.style.width = `${document.querySelector(`[id='${id.toString()}'] .media-reply img`).getBoundingClientRect().width + 10}px`
                }}data-type='reply-photo-message' data-val={media}/>
                
                <MessageCaption message={message} />
              </div>
            </div>
              
            <MessageTime 
              message={message} thisRoom={thisRoom} isLastMessage={isLastMessage}
              otherUser={otherUser}
            />
          </div>
        }

        {type === 'reply-video-message' && // reply a message with a video
          <div className='text-post-msg'
          >
              
            <div>
              <div className='replied-message' onClick={() => {
                const element = document.querySelector(`[id='${replyMessage.id}']`)
                element.scrollIntoView()
              }}>
                <ReplyMessage message={message}/>
              </div>
              
              <div className="media-reply">
                <MessageOptions message={message} dmUrl={dmUrl} 
                  otherUser={otherUser}
                  />

                <video controls src={media} className='video' onLoadedData={() => {
                  const pre = document.querySelector(`[id='${id.toString()}'] .media-reply pre`)
                  pre.style.width = `${document.querySelector(`[id='${id.toString()}'] .media-reply video`).getBoundingClientRect().width}px`

                  const div = document.querySelector(`[id='${id.toString()}'] .pic-post-body`)
                  div.style.width = `${document.querySelector(`[id='${id.toString()}'] .media-reply video`).getBoundingClientRect().width + 10}px`
                }}data-type='reply-video-message' data-val={media}></video>
                
                <MessageCaption message={message} />
              </div>
            </div>
              
            <MessageTime 
              message={message} thisRoom={thisRoom} isLastMessage={isLastMessage}
              otherUser={otherUser}
            />
          </div>
        }

        {type === 'reply-group-media-message' && // reply a message with group media
          <div className='text-post-msg'
          >
              
            <div>
              <div className='replied-message group-replied-message' onClick={() => {
                const element = document.querySelector(`[id='${replyMessage.id}']`)
                element.scrollIntoView()
              }}>
                <ReplyMessage message={message}/>
              </div>
              
              <div>
                <MessageOptions message={message} dmUrl={dmUrl} 
                  otherUser={otherUser}
                  />

                <div className={media.length > 4 ? "group-media-message-container four" : 'group-media-message-container'}>
                  {media.length > 4 ?
                    <>
                      <div className='group-media-container-overlay'>
                        +{media.length - 3}
                      </div>
                      {media.slice(0, 4).map((msg, index) => {
                        return (
                          <div key={index}>
                            {msg.type === 'video' &&
                              <video controls src={msg.url} data-type='group-media-message' data-val={JSON.stringify(message.body)}></video>}
                            {msg.type === 'img' &&
                              <img src={msg.url} alt="" data-type='group-media-message' data-val={JSON.stringify(message.body)} />}
                          </div>
                        )
                      })}
                    </>
                    :
                    <>
                      {media.map((msg, index) => {
                        return (
                          <div key={index}>
                            {msg.type === 'video' &&
                              <video controls src={msg.url} data-type='group-media-message' data-val={JSON.stringify(message.body)}></video>}
                            {msg.type === 'img' &&
                              <img src={msg.url} alt="" data-type='group-media-message' data-val={JSON.stringify(message.body)} />}
                          </div>
                        )
                      })}
                    </>
                  }
                </div>
                
                <MessageCaption message={message} />
              </div>
            </div>
              
            <MessageTime 
              message={message} thisRoom={thisRoom} isLastMessage={isLastMessage}
              otherUser={otherUser}
            />
          </div>
        }


        {type.includes("Story") &&
          <RepliedStory story={post} sent={true} />
        }
      </motion.div>
    </messageContext.Provider>
  )
}

export default Message









const MessageCaption = ({ classname, children }) => {
  const { hrefChecker, isLinkElement } = useContext(functionsContext)
  
  const { message } = useContext(messageContext)

  const { id, caption } = message

  const [captionToShow, setCaptionToShow] = useState('')
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (caption.length >= 300) {
      if (showMore) {
        setCaptionToShow(caption)

      } else {
        setCaptionToShow(`${caption.slice(0, 300)}...`)
      }

    } else {
      setCaptionToShow(caption)
    }
  }, [caption, showMore])


  return (
    <>
      {caption !== '' &&
        <pre className={`slideForReply message-body ${classname}`}>
          {children}
          <>
            {isLinkElement(caption) ?
                  
              <a className='out-link' href={hrefChecker(caption)} target='_blank'>
                {captionToShow}
              </a>
              :
              <>
                {captionToShow}
              </>
            }
            {caption.length >= 300 &&
              <b onClick={() => setShowMore(!showMore)}>
                {showMore ? 'less' : 'more'}
              </b>
            }
          </>
        </pre>
      }
    </>
  )
}





const MessageTime = () => {
  const { message, isLastMessage, thisRoom, otherUser, isUserCreator } = useContext(messageContext)

  const { time, createdAt } = message

  const [otherUserActiveObject, setOtherUserActiveObject] = useState()
  const [messageHasBeenSeen, setMessageHasBeenSeen] = useState(false)


  useEffect(() => {
    if (thisRoom && otherUser) {
      // setUserActiveObject(thisRoom.users[user.username])
      setOtherUserActiveObject(thisRoom.users[otherUser.username])
    }
  }, [thisRoom, otherUser])



  useEffect(() => {
    if (otherUserActiveObject && message) {
      const { isActive, lastActive } = otherUserActiveObject

      if (isActive) {
        setMessageHasBeenSeen(true)

      } else {
        if (isLastMessage) {
          if (createdAt && lastActive) {
            const messageTime = parseFloat(`${createdAt.seconds}.${createdAt.nanoseconds}`)
            const userTime = parseFloat(`${lastActive.seconds}.${lastActive.nanoseconds}`)
      
            if (messageTime > userTime) {
              setMessageHasBeenSeen(false)
      
            } else {
              setMessageHasBeenSeen(true)
            }
          }
        }
      }
      
    }
  }, [message, otherUserActiveObject])
  
  return (
    <span className='message-time'>
      {/* {isUserCreator && isLastMessage &&
        <span>
          {messageHasBeenSeen ? "Seen" : "Sent"}
        </span>
      } */}

      <span>
        {time}
      </span>
    </span>
  )
}




const MessageOptions = () => {
  const { user } = useContext(appContext)
  const { deleteMessage } = useContext(functionsContext)
  const { setIsReply, replyMessage } = useContext(messagingContext)
  const { message, isUserCreator, otherUser, dmUrl, isElementTouchingRegion, hideOptionsSpan } = useContext(messageContext)

  const { id, date, time, caption, creator } = message


  function hideOptions() {
    const messageId = `[id='${id.toString()}']`; 
    const messageOptions = document.querySelector(`${messageId} .message-options`)
    const optionsSpan = document.querySelector(`${messageId} .options-span`)

    messageOptions?.classList.remove('active')
    optionsSpan?.classList.remove('active')
  }


  useEffect(() => {
    const messagingSection = document.querySelector('.messaging-section')
    const messages = document.querySelectorAll('.message')
    const region = document.querySelector('.messaging-area')
    const spans = document.querySelectorAll('.options-span')
    const buttons = document.querySelectorAll('.message-options button')

    const showOptions = (e) => {
      const thisSpan = e.currentTarget

      hideOptions()

      setTimeout(() => {
        const optionDiv = thisSpan.nextElementSibling
        if (optionDiv) {
          const isTouching = isElementTouchingRegion(optionDiv, region)

          optionDiv.classList.add('active')
    
          
          if (isTouching.touchingTop) {
            optionDiv.style.transform = `translateY(10%)`
    
          } else if (isTouching.touchingBottom) {
            optionDiv.style.top = `unset`
            optionDiv.style.bottom = `0.5rem`
          }
          
    
          if (isTouching.touchingLeft) {
            optionDiv.style.transform = `translateX(50%)`
    
          } else if (isTouching.touchingRight) {
            optionDiv.style.transform = `translateX(-50%)`
          }
        }
      }, 50)
    }

    
    spans.forEach(span => {
      if (span) {
        span.addEventListener('click', showOptions)
      }
    })



    buttons.forEach(button => {
      button.addEventListener('click', hideOptions)
    })
    

    function scroll() {
      messages.forEach(message => {
        if (message) {
          const optionsDiv = message.querySelector('.message-options')

          if (optionsDiv) {
            optionsDiv.classList.remove('active')
          }
        }
      })
    }

    function windowClick(e) {
      spans.forEach(span => {
        if (span) {
          let isActive = false

          span.classList.contains('active-option') ?
            isActive = true : isActive = false

          if (isActive) {
            span.classList.remove('active-option')
          } 
          return
        }
      })
    }

    messagingSection.addEventListener('scroll', scroll)
    // window.addEventListener('click', windowClick)


    return () => {
      spans.forEach(span => {
        if (span) {
          span.removeEventListener('click', showOptions)
        }
      })

      // buttons.forEach(button => {
      //   if (message) {
        
      // })


      // window.removeEventListener('click', windowClick)
      messagingSection.removeEventListener('scroll', scroll)
    }
  }, [message])


  

  
  return (
    <>
      <span className='options-span'>
        <MoreHorizOutlinedIcon />
      </span>
      
      <div className="message-options">
        <div className="message-options-header">
          <span>
            {date}
          </span>

          <span>
            {time}
          </span>
        </div>

        {/* <button
          onClick={() => {
            replyMessage.current = message
            setIsReply(true)
          }}
        >
          <span>
            reply
          </span>

          <ReplyIcon />
        </button> */}

        <button
          onClick={() => copyText(caption)}
        >
          <span>
            copy
          </span>

          <ContentCopyOutlinedIcon />
        </button>

        <button className='delete'
          onClick={e => {
            deleteMessage(dmUrl, id, isUserCreator, user, otherUser)
          }}
        >
          <span>
            delete {creator !== user.id && "for me"}
          </span>

          <DeleteOutlineOutlinedIcon />
        </button>

        <div className="message-options-footer" role={'button'}
          onClick={() => hideOptions()}
        >
          <span>
            cancel
          </span>
        </div>
      </div>
    </>
  )
}




const TypedMessage = ({ children }) => {
  return (
    <>
      <MessageOptions />

      <div className='img-message-body'>
        {children}
      
        <MessageCaption />
      </div>
        
      <MessageTime />
    </>
  )
}



const ReplyTypedMessage = () => {
  const { message } = useContext(messageContext)

  return (
    <div className="reply-message">
      <ReplyMessageAttachment message={message} />

      <TypedMessage />
    </div>
  )
}




const PhotoMessage = ({ media }) => {
  const { checkResize, resizeMediaRef, resizePre, message } = useContext(messageContext)
  const { id } = message
  
  
  return (
    <img ref={resizeMediaRef} className='img slideForReply' src={media}
      onLoad={e => {
        checkResize(e)
        resizePre(e)
      }}
    />
  )
}




const VideoMessage = ({ media }) => {
  const { checkResize, resizeMediaRef, resizePre, message } = useContext(messageContext)
  const { id } = message

  return (
    <Video haveControls={true} source={media} classname='video slideForReply'
      onLoadedData={resizePre} videoRef={resizeMediaRef} 
    />
  )
}



const GroupMediaMessage = ({ media }) => {
  const { message } = useContext(messageContext)

  const { id } = message
  
  
  return (
    <div 
      className={
        `group-media-message-container slideForReply ${media.length >= 3 ? 'complete' : ''}`
      }
    >
      {media.length > 4 &&
        <div className='group-media-container-overlay'>
          + {media.length - 3}
        </div>
      }

      {media.slice(0, 4).map((msg, ind) => {
        const { url, type } = msg
        
        return (
          <div key={ind} className="group-media-ind-div">
            {type === 'video' &&
               <Video haveControls={true} source={url} 
             />
            }

            {type === 'img' &&
              <img src={url} alt="" />
            }
          </div>
        )
      })}
    </div>
  )
}




const PostMessage = ({ children, num, bgc }) => {
  const { post, message } = useContext(messageContext)

  const { id, type } = message

  const { id: postId } = post
  

  return (
    <>
      <div className="post-message slideForReply">
        <MessageOptions />

        <Link to={`/posts/${postId}`}
          className='post-message-body'
          style={{ backgroundColor: !bgc ? 'transparent' : null }}
        >
          {children}

          <pre>
            <ChopText text={post.caption} num={num ? num : 100} />
          </pre>
        </Link>

        <PostMessageInfo />
      </div>
      
      <MessageTime />
    </>
  )
}




const PostMessageInfo = () => {
  const { post, message } = useContext(messageContext)

  const { postCreator } = message

  return (
    <div className="post-message-creator">
      <strong>
        Post by {postCreator.username}
      </strong>

      <div className="post-message-overlay">
        <span>
          {post.likes.value.length}
        </span>
        <span>
        {post.likes.value.length === 1 ? "Like" : "Likes"}
        </span>
      </div>
    
      <span>
        {post.date}
      </span>

      <span>
        {post.time}
      </span>
    </div>
  )
}




const RepliedStory = ({ children, story, sent }) => {
  const { users, user } = useContext(appContext)

  const { id: storyId, caption, type, creator, media, props } = story

  const storyUser = users.find(person => person.id === creator)

  const location = useLocation()

  if (storyUser) {
    const { username } = storyUser
    
    const storyCreator = creator === user?.id ? "user" : 'following'
  
    const storyLink = `/stories/${username}/${storyId}?storyBy=${storyCreator}`




    return (
      <div className='story-message'>
        <Link
          className={`replied-story-body ${sent ? 'sent slideForReply' : ''}`}
          to={storyLink} 
          state={{ from: location.pathname }}
          style={{
            backgroundColor: props.backgroundColor ? props.backgroundColor : 'gray',
          }}
        >
            
          {type === 'Text-Story' &&
            <RepliedStoryDetails storyCaption={caption} story={story} />
          }


          {type === 'Img-Story' &&
            <RepliedStoryDetails storyCaption={caption} story={story}>
              <img src={media} alt="" className='text-image-story'/>
            </RepliedStoryDetails>
          }


          {type === 'Vid-Story' &&
            <RepliedStoryDetails storyCaption={caption} story={story}>
              <Video source={media} classname='text-video-story' />
            </RepliedStoryDetails>
          }
        </Link>
          
        {children}
            
        <MessageTime />

        {sent && <MessageOptions />}
      </div>
    )
  }
}




const RepliedStoryDetails = ({ children, storyCaption, story }) => {
  const { message, isUserCreator, otherUser } = useContext(messageContext)

  const { story: storyInMessage } = message
  

  const { props } = story

  return (
    <>
      <p className='story-detail'> 
        {storyInMessage ?
          <>
            {isUserCreator ?
              `You replied ${otherUser.displayName}'s story` :
              `${otherUser.displayName} replied your story`
            }
          </>
          :
          <>
            {isUserCreator ?
              `You sent ${otherUser.displayName} a story` :
              `${otherUser.displayName} sent you a story`
            }
          </>
        }
      </p>

      {children}

      <pre
        style={{
          fontWeight: props.fontWeight,
          color: props.color,
          fontStyle: props.fontStyle,
          fontFamily: props.fontFamily
        }}
      >
        {storyCaption}
      </pre>
    </>
  )
}