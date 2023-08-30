import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import { FaReply, FaEllipsisH } from 'react-icons/fa'
import ReplyMessage from './ReplyMessage'

const Message = ({ message, type, currentUserPage, messageId, x, y, deleteMessage, replyMessageType, selectedMediaId, selectedMediaType, scrollTop, deleteMessageII }) => {
  const { userAuth, users, allPosts, followStory, storyType, showChatModal, setShowChatModal } = useContext(appContext)
  const [showMore, setShowMore] = useState(false)

  const [post, setPost] = useState()
  const [comment, setComment] = useState()
  const [reply, setReply] = useState()
  const location = useLocation()
  const [imgWidth, setImgWidth] = useState(0)
  const [vidWidth, setVidWidth] = useState(0)

  useEffect(() => {
    if (type === 'Text-post' ||
      type === 'Picture-Media-post' ||
      type === 'Video-Media-post' ||
      type === 'Group-Media-post' 
    ) {
      setPost(allPosts.find(post => post.id === message.postId))
    }
  }, [message])

  useEffect(() => {
    if (type === 'Text-Comment-comment' ||
      type === 'Photo-Comment-comment' ||
      type === 'Video-Comment-comment' ||
      type === 'Group-Comment-comment' 
    ) {
      const post = allPosts.find(post => post.id === message.postId)
      setComment(post?.comments.value.find(comment => comment.id === message.commentId))
    }
  }, [message])

  useEffect(() => {
    if (type === 'Text-Reply-reply' ||
      type === 'Photo-Reply-reply' ||
      type === 'Video-Reply-reply' ||
      type === 'Group-Reply-reply' 
    ) {
      const post = allPosts.find(post => post.id === message.postId)
      const comment = post?.comments.value.find(comment => comment.id === message.commentId)
      setReply(comment?.replies.value.find(reply => reply.id  === message.replyId))
    }
  }, [message])

  useEffect(() => {
    const tpDivs = document.querySelectorAll('.tp-div')

    tpDivs.forEach(div => {
      const textPostInfo = div.querySelector('.text-post-info')
      const overlay = div.querySelector('.text-post-overlay')
      div.addEventListener('mouseover', () => {
        textPostInfo ? textPostInfo.style.zIndex = '11' : console.log()
        overlay ? overlay.style.zIndex = '10' : console.log()
      })
    })

    tpDivs.forEach(div => {
      const textPostInfo = div.querySelector('.text-post-info')
      const overlay = div.querySelector('.text-post-overlay')
      div.addEventListener('mouseout', () => {
        textPostInfo ? textPostInfo.style.zIndex = '-11' : console.log()
        overlay ? overlay.style.zIndex = '-10' : console.log()
      })
    })
  }, [])

  useEffect(() => {
    const messagesRight = document.querySelectorAll('.message .align-right')
    const messagesLeft = document.querySelectorAll('.message .align-left')
    const videos = document.querySelectorAll('video')

    // console.log(messagesRight)
    // console.log(messagesLeft)

    function click(e) {
      // videos.forEach(video => video.pause())
      // console.log(e.target)
      let clicks = 0
      if (e.currentTarget.nodeName === 'IMG' ||
        e.currentTarget.nodeName === 'VIDEO' ||
        e.target.nodeName === 'IMG' ||
        e.target.nodeName === 'VIDEO')
      {
      clicks += 1
      if (e.currentTarget !== null) {
        selectedMediaType.current = e.currentTarget.dataset.type
        selectedMediaId.current = e.currentTarget.dataset.val
      } else if (e.target !== null) {
        selectedMediaType.current = e.target.dataset.type
        selectedMediaId.current = e.target.dataset.val
      }
        
        setTimeout(() => {
          if (clicks < 2) {
            setShowChatModal(true)
            clicks = 0
          }
        }, 500);
      }

      if (e.currentTarget.nodeName === 'VIDEO') {
        e.currentTarget.pause()
      } else if (e.target.nodeName === 'VIDEO') {
        e.target.pause()
      }
    }

    messagesRight.forEach(message => {
      message.addEventListener('click', click)
    })

    messagesLeft.forEach(message => {
      message.addEventListener('click', click)
    })
    
    return () => {
      messagesRight.forEach(message => {
        message.removeEventListener('click', click)
      })

      messagesLeft.forEach(message => {
        message.removeEventListener('click', click)
      })
    }
  }, [])

  useEffect(() => {
    const videos = document.querySelectorAll('.message video')
    videos.forEach(video => video.pause())
  }, [showChatModal])

  function mouseenter(e) {
    const message = e.currentTarget
    // selectedMediaType.current = e.currentTarget.dataset.type
    // selectedMediaId.current = e.currentTarget.dataset.val
    messageId.current = e.currentTarget.id
    replyMessageType.current = e.currentTarget.dataset.type

    const messagesSect = document.querySelector('.messages-sect')
    let parentDiv

    if (e.currentTarget.querySelector('.align-right')) {
      parentDiv = e.currentTarget.querySelector('.align-right')
    } else {
      parentDiv = e.currentTarget.querySelector('.align-left')
    }
    
    const coordinates = parentDiv.getBoundingClientRect()

    //use align right and align left
    const coord = e.target.parentElement
    const span = parentDiv?.querySelector('.message-options')

    span.style.visibility = 'visible'
    span.style.opacity = 1
    span.addEventListener('click', function (e) {
      deleteMessage.current.classList.add('show-del-div')
      // deleteMessageII.current.classList.add('show-del-div')
      span.style.visibility = 'hidden'
      span.style.opacity = 0
      if (message.querySelector('.align-right')) {
        deleteMessage.current.style.right = `${coordinates.width + 20}px` 
        deleteMessage.current.style.top = `${e.target.getBoundingClientRect().bottom}px`
      } else {
        const width = messagesSect.getBoundingClientRect().width
        // deleteMessage.current.style.right = `${coordinates.width + 10 + 80}px`
        deleteMessage.current.style.right = `${width - coordinates.width - 120}px`
        deleteMessage.current.style.top = `${e.target.getBoundingClientRect().bottom}px`
      }
      // console.log(coordinates)
    })
  }

  function mouseleave(e) {
    // const messageDiv = document.querySelector(`[class^="${e.currentTarget.id}"]`)
    let parentDiv

    if (e.currentTarget.querySelector('.align-right')) {
      parentDiv = e.currentTarget.querySelector('.align-right')
    } else {
      parentDiv = e.currentTarget.querySelector('.align-left')
    }
    const span = parentDiv?.querySelector('.message-options')
    // console.log(e.target)

    let keep = false

    span.addEventListener('mouseenter', function (e) {
      keep = true
    })

    span.addEventListener('mouseleave', function (e) {
      setTimeout(() => {
        span.style.visibility = 'hidden'
        span.style.opacity = 0
      }, 2000);
    })

    setTimeout(() => {
      if (!keep) {
        span.style.visibility = 'hidden'
        span.style.opacity = 0
      }
    }, 2000);
  }

  function resize(e) {
    // console.log('resize')
    const overlay = document.querySelector(`[id='${message.id}'] .group-media-container-overlay`)
    const img = e.currentTarget
    overlay.style.width = `${img.getBoundingClientRect().width}px`
    overlay.style.height = `${img.getBoundingClientRect().height}px`
  }

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

  return (
    <>
      
      
      {type === 'text-message' &&
        <div id={message.id} data-type='text-message' className='messages-sect-message message' 
          onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'align-right' : 'align-left' }>
            <div className='message-options'>
              <FaEllipsisH />
            </div>
            <pre className={message.creator === userAuth ? 'message-body right' : 'message-body'}>
              {message?.body.length < 301 &&
                <>
                  {isLinkElement(message?.body) ?
                        
                    <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                      {message?.body}
                    </a>
                    :
                    <>
                      {message?.body}
                    </>
                  }
                </>
              }

              {message.body.length > 300 &&
                <>
                  {showMore &&
                    <>
                      {isLinkElement(message?.body) ?
                            
                        <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                          {message?.body}
                        </a>
                        :
                        <>
                          {message?.body}
                          <b onClick={() => setShowMore(!showMore)}>
                            {showMore ? 'less' : 'more'}
                          </b>
                        </>
                      }
                    </>
                  }

                  {!showMore && 
                    <>
                    
                    
                      {isLinkElement(message?.body) ?
                            
                        <a className='out-link' href={message?.body.includes('http://') || message?.body.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                          {message?.body?.length >= 300 && `${message?.body.slice(0, 300)}...`} { message?.body?.length >= 300 && <b> more </b>}
                          {message?.body?.length < 300 && message?.body}
                        </a>
                        :
                        <>
                          {message?.body.length >= 300 && `${message?.body.slice(0, 300)}...`} {message?.body.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                        </>
                      }
                    </>
                  }
                </>
              }
            </pre>
            <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
              { message.time }
            </span>
          </div> 
        </div>
      }

      {type === 'photo-message' &&
        <div id={message.id} data-type='photo-message' data-val={message.body} className='messages-sect-message message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'align-right' : 'align-left'} data-type='photo-message' data-val={message.body}>
            <div className='message-options'>
              <FaEllipsisH />
            </div>

            <div className={message.creator === userAuth ? 'img-message-body right' : 'img-message-body'}>
              <img className='img' src={message.body} data-type='photo-message' data-val={message.body}
                onLoad={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                }} 
              />
              <pre>
              {message?.caption.length < 301 &&
                <>
                  {isLinkElement(message?.caption) ?
                        
                    <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                      {message?.caption}
                    </a>
                    :
                    <>
                      {message?.caption}
                    </>
                  }
                </>
              }

              {message.caption.length > 300 &&
                <>
                  {showMore &&
                    <>
                      {isLinkElement(message?.caption) ?
                            
                        <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                          {message?.caption}
                        </a>
                        :
                        <>
                          {message?.caption}
                          <b onClick={() => setShowMore(!showMore)}>
                            {showMore ? 'less' : 'more'}
                          </b>
                        </>
                      }
                    </>
                  }

                  {!showMore && 
                    <>
                    
                    
                      {isLinkElement(message?.caption) ?
                            
                        <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                          {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                          {message?.caption?.length < 300 && message?.caption}
                        </a>
                        :
                        <>
                          {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                        </>
                      }
                    </>
                  }
                </>
              }
              </pre>
            </div>
              
            <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
              { message.time }
            </span>
          </div> 
        </div>
      }
      
      {type === 'video-message' &&
        <div id={message.id} data-type='video-message' data-val={message.body} className='messages-sect-message message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'align-right' : 'align-left'} data-type='video-message' data-val={message.body}>

            <div className={message.creator === userAuth ? 'img-message-body right' : 'img-message-body'}>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <video controls className='video' src={message.body} data-type='video-message' data-val={message.body} onLoadedData={() => {
                const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
              }}
              ></video>
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
              
            <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
              { message.time }
            </span>
          </div> 
        </div>
      }

      {type === 'group-media-message' &&
        <div id={message.id} data-type='group-media-message' data-val={JSON.stringify(message.body)} className='messages-sect-message message multi-media'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'align-right' : 'align-left'} data-type='group-media-message' data-val={JSON.stringify(message.body)}>

            <div className={message.creator === userAuth ? 'img-message-body right' : 'img-message-body'}>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <div className={message.body.length > 4 ? "group-media-message-container four" : 'group-media-message-container'}>
                {message.body.length > 4 ?
                  <>
                    <div className='group-media-container-overlay'>
                      +{message.body.length - 3}
                    </div>
                    {message.body.slice(0, 4).map((msg, index) => {
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
                    {message.body.map((msg, index) => {
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
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
              
            <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
              { message.time }
            </span>
          </div> 
        </div>
      }

      {type === 'Text-post' && 
        <div id={message?.id} data-type='Text-post' className='text-post-msg is-text-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message?.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="text-post-overlay"></div>
            <div className='text-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${post?.id}`} >
                <pre>
                  {post?.body.length >= 300 && `${post?.body.slice(0, 300)}...`} { post?.body.length >= 150 && <b> more </b>}
                  {post?.body.length < 300 && post.body}
                </pre>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === post?.creator)?.username}
                </span>
              
                <span>
                  {post?.date}
                </span>

                <span>
                  {post?.time}
                </span>
              </p>
            </div>

            <div className="text-post-info">
              <div>{post?.likes?.value?.length} <span> likes </span></div>
              <div>{post?.comments?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Picture-Media-post' && 
        <div id={message.id} data-type='Picture-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
              
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${post?.id}`}>
                <img src={post?.body} alt="" onLoad={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                }}/>
                <div className="img-pre">
                  <pre>
                    {post?.caption?.length >= 100 && `${post?.caption.slice(0, 100)}...`} 
                    {post?.caption?.length < 100 && post?.caption}
                  </pre>
                </div>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === post?.creator)?.username}
                </span>
              
                <span>
                  {post?.date}
                </span>

                <span>
                  {post?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{post?.likes?.value?.length} <span> likes </span></div>
              <div>{post?.comments?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'Video-Media-post' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${post?.id}`}>
                <video controls src={post?.body} onLoadedData={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                }}
                ></video>
                <div className="vid-pre">
                  <pre>
                    {post?.caption?.length >= 100 && `${post?.caption.slice(0, 100)}...`} 
                    {post?.caption?.length < 100 && post?.caption}
                  </pre>
                </div>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === post?.creator)?.username}
                </span>
              
                <span>
                  {post?.date}
                </span>

                <span>
                  {post?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{post?.likes?.value?.length} <span> likes </span></div>
              <div>{post?.comments?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Group-Media-post' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}
          >
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${post?.id}`}>
                <span className="media-length">
                  1/{post?.body.length}
                </span>
                {post?.body[0].type === 'img' ?
                  <>
                    <img src={post?.body[0].url} alt="" className='group-img' onLoad={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                    }}/>
                    <div className="img-pre">
                      <pre>
                        {post?.caption?.length >= 100 && `${post?.caption.slice(0, 100)}...`} 
                        {post?.caption?.length < 100 && post?.caption}
                      </pre>
                    </div>
                  </>
                  :
                  <>
                    <video controls src={post?.body[0].url} className='group-video' onLoadedData={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                    }}
                    ></video>
                    <div className="vid-pre">
                      <pre>
                        {post?.caption?.length >= 100 && `${post?.caption.slice(0, 100)}...`} 
                        {post?.caption?.length < 100 && post?.caption}
                      </pre>
                    </div>
                  </>
                }
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === post?.creator)?.username}
                </span>
              
                <span>
                  {post?.date}
                </span>

                <span>
                  {post?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{post?.likes?.value?.length} <span> likes </span></div>
              <div>{post?.comments?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'story-text-message' && // reply a story with a text
        <div id={message.id} data-type='story-text-message' className='text-post-msg story-reply message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          {console.log(message.storyUrl.slice(1, 2) === 'f')}
          {console.log(message.storyUrl)}
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <Link
              to={message.storyUrl.slice(1, 2) === 'f' ? `${message.storyUrl}` : `/f${message.storyUrl}`} state={{ url: location.pathname, user: currentUserPage }} onClick={() => {
                followStory.current = message.storyCreator
                storyType.current = message.storyCreator === userAuth ? 'user' : 'following'
              }}
            >
              <div className='reply-div'>
                {message.storyType === 'Text-Story' &&
                  <>
                    <div className='text-post-body'>
                      <p className='story-reply-text'> 
                        {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                      </p>
                      <pre className='text-story' style={{
                        backgroundColor: message?.storyProps?.backgroundColor,
                        fontWeight: message?.storyProps?.fontWeight,
                        color: message?.storyProps?.color,
                        fontStyle: message?.storyProps?.fontStyle,
                        fontFamily: message?.storyProps?.fontFamily
                      }} >
                        {message?.storyText.length >= 300 && `${message?.storyText.slice(0, 300)}...`} { message?.storyText.length >= 300 && <b> more </b>}
                        {message?.storyText.length < 300 && message.storyText}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Img-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>
                    <img src={message?.storyMedia} alt="" className='text-image-story' onLoad={() => {
                      const pres = document.querySelectorAll(`[id='${message.id.toString()}'] pre`)
                      pres.forEach(pre => {
                        pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                        })
                      }}
                    />
                    <div className="img-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Vid-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>

                    <video className='text-video-story' src={message.storyMedia} onLoadedData={() => {
                      const pres = document.querySelectorAll(`[id='${message.id.toString()}'] pre`)
                      pres.forEach(pre => {
                        pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                        })
                      }}
                    ></video>
                    <div className="vid-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }
              </div>
            </Link>
              
            <pre className='text-story text-story-text'>
              <FaReply className='reply-arrow'/>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <>
                {message?.body.length < 301 &&
                  <>
                    {isLinkElement(message?.body) ?
                          
                      <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                        {message?.body}
                      </a>
                      :
                      <>
                        {message?.body}
                      </>
                    }
                  </>
                }

                {message.body.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.body) ?
                              
                          <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                            {message?.body}
                          </a>
                          :
                          <>
                            {message?.body}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.body) ?
                              
                          <a className='out-link' href={message?.body.includes('http://') || message?.body.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                            {message?.body?.length >= 300 && `${message?.body.slice(0, 300)}...`} { message?.body?.length >= 300 && <b> more </b>}
                            {message?.body?.length < 300 && message?.body}
                          </a>
                          :
                          <>
                            {message?.body.length >= 300 && `${message?.body.slice(0, 300)}...`} {message?.body.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </>
            </pre>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'story-photo-message' && // reply a story with a photo
        <div id={message.id} data-type='story-photo-message' data-val={message.body} className='text-post-msg story-reply message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='story-photo-message' data-val={message.body}
          >
            <Link
              to={message.storyUrl.slice(1, 2) === 'f' ? `${message.storyUrl}` : `/f${message.storyUrl}`} state={{ url: location.pathname, user: currentUserPage }} onClick={() => {
                followStory.current = message.storyCreator
                storyType.current = message.storyCreator === userAuth ? 'user' : 'following'
              }}
            >
              <div className='reply-div'>
                {message.storyType === 'Text-Story' &&
                  <>
                    <div className='text-post-body'>
                      <p className='story-reply-text'> 
                        {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                      </p>
                      <pre className='text-story' style={{
                        backgroundColor: message?.storyProps?.backgroundColor,
                        fontWeight: message?.storyProps?.fontWeight,
                        color: message?.storyProps?.color,
                        fontStyle: message?.storyProps?.fontStyle,
                        fontFamily: message?.storyProps?.fontFamily
                      }} >
                        {message?.storyText.length >= 300 && `${message?.storyText.slice(0, 300)}...`} { message?.storyText.length >= 300 && <b> more </b>}
                        {message?.storyText.length < 300 && message.storyText}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Img-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>
                    <img src={message?.storyMedia} alt="" className='text-image-story'/>
                    <div className="img-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Vid-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>

                    <video className='text-video-story' src={message.storyMedia}></video>
                    <div className="vid-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }
              </div>
            </Link>

            <div className="media-reply">
              <FaReply className='reply-arrow' />
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <img src={message.body} alt="" className='img story-reply-img' onLoad={() => {
                const pre = document.querySelector(`[id='${message.id.toString()}'] .media-reply pre`)
                const myWidth = document.querySelector(`[id='${message.id.toString()}'] .media-reply img`).getBoundingClientRect().width
                let otherWidth
                if (message.storyType === 'Text-Story') {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-post-body`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-post-body`)
                    body.style.width = `${myWidth}px`
                    pre.style.width = `${myWidth}px`
                  } else {
                    const img = document.querySelector(`[id='${message.id.toString()}'] .media-reply img`)
                    img.style.width = `${otherWidth - 10}px`
                    pre.style.width = `${otherWidth - 10}px`
                  }
                  
                } else if (message.storyType === 'Img-Story') {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-image-story`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-image-story`)
                    body.style.width = `${myWidth}px`
                    pre.style.width = `${myWidth}px`
                  } else {
                    const img = document.querySelector(`[id='${message.id.toString()}'] .media-reply img`)
                    img.style.width = `${otherWidth - 10}px`
                    pre.style.width = `${otherWidth - 10}px`
                  }

                  const storyPre = document.querySelector(`[id='${message.id.toString()}'] .img-pre pre`)
                  storyPre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-image-story`).getBoundingClientRect().width}px`
                } else if (message.storyType === 'Vid-Story')  {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-video-story`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-video-story`)
                    body.style.width = `${myWidth}px`
                    pre.style.width = `${myWidth}px`
                  } else {
                    const img = document.querySelector(`[id='${message.id.toString()}'] .media-reply img`)
                    img.style.width = `${otherWidth - 10}px`
                    pre.style.width = `${otherWidth - 10}px`
                  }

                  const storyPre = document.querySelector(`[id='${message.id.toString()}'] .vid-pre pre`)
                  storyPre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-video-story`).getBoundingClientRect().width}px`
                }


              }} data-type='story-photo-message' data-val={message.body}/>
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'story-video-message' && // reply a story with a video
        <div id={message.id} data-type='story-video-message' data-val={message.body} className='text-post-msg story-reply message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='story-video-message' data-val={message.body}
          >
            <Link
              to={message.storyUrl.slice(1, 2) === 'f' ? `${message.storyUrl}` : `/f${message.storyUrl}`} state={{ url: location.pathname, user: currentUserPage }} onClick={() => {
                followStory.current = message.storyCreator
                storyType.current = message.storyCreator === userAuth ? 'user' : 'following'
              }}
            >
              <div className='reply-div'>
                {message.storyType === 'Text-Story' &&
                  <>
                    <div className='text-post-body'>
                      <p className='story-reply-text'> 
                        {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                      </p>
                      <pre className='text-story' style={{
                        backgroundColor: message?.storyProps?.backgroundColor,
                        fontWeight: message?.storyProps?.fontWeight,
                        color: message?.storyProps?.color,
                        fontStyle: message?.storyProps?.fontStyle,
                        fontFamily: message?.storyProps?.fontFamily
                      }} >
                        {message?.storyText.length >= 300 && `${message?.storyText.slice(0, 300)}...`} { message?.storyText.length >= 300 && <b> more </b>}
                        {message?.storyText.length < 300 && message.storyText}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Img-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>
                    <img src={message?.storyMedia} alt="" className='text-image-story'/>
                    <div className="img-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Vid-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>

                    <video className='text-video-story' src={message.storyMedia} ></video>
                    <div className="vid-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }
              </div>
            </Link>

            <div className="media-reply">
              <FaReply className='reply-arrow' />
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <video controls src={message.body} className='video story-reply-img' onLoadedData={() => {
                const pre = document.querySelector(`[id='${message.id.toString()}'] .media-reply pre`)
                const myWidth = document.querySelector(`[id='${message.id.toString()}'] .media-reply video`).getBoundingClientRect().width
                let otherWidth
                if (message.storyType === 'Text-Story') {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-post-body`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-post-body`)
                    body.style.width = `${myWidth}px`
                    // body.style.maxWidth = `${320}px`
                    pre.style.width = `${myWidth}px`
                    // pre.style.maxWidth = `${320}px`
                  } else {
                    const video = document.querySelector(`[id='${message.id.toString()}'] .media-reply video`)
                    video.style.width = `${otherWidth - 10}px`
                    // video.style.maxWidth = `${320}px`
                    pre.style.width = `${otherWidth - 10}px`
                    // pre.style.maxWidth = `${320}px`
                  }
                  
                } else if (message.storyType === 'Img-Story') {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-image-story`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-image-story`)
                    body.style.width = `${myWidth}px`
                    pre.style.width = `${myWidth}px`
                  } else {
                    const video = document.querySelector(`[id='${message.id.toString()}'] .media-reply video`)
                    video.style.width = `${otherWidth - 10}px`
                    pre.style.width = `${otherWidth - 10}px`
                  }

                  const storyPre = document.querySelector(`[id='${message.id.toString()}'] .img-pre pre`)
                  storyPre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-image-story`).getBoundingClientRect().width}px`
                } else if (message.storyType === 'Vid-Story')  {
                  otherWidth = document.querySelector(`[id='${message.id.toString()}'] .text-video-story`).getBoundingClientRect().width

                  if (myWidth > otherWidth) {
                    const body = document.querySelector(`[id='${message.id.toString()}'] .text-video-story`)
                    body.style.width = `${myWidth}px`
                    pre.style.width = `${myWidth}px`
                  } else {
                    const video = document.querySelector(`[id='${message.id.toString()}'] .media-reply video`)
                    video.style.width = `${otherWidth - 10}px`
                    pre.style.width = `${otherWidth - 10}px`
                  }

                  const storyPre = document.querySelector(`[id='${message.id.toString()}'] .vid-pre pre`)
                  storyPre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-video-story`).getBoundingClientRect().width}px`
                }
              }}
                data-type='story-video-message' data-val={message.body} ></video>
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
              
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'story-group-media-message' && // reply a story with group media
        <div id={message.id} data-type='story-group-media-message' data-val={JSON.stringify(message.body)} className='text-post-msg story-reply message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='story-group-media-message' data-val={JSON.stringify(message.body)}
            >
            <Link
              to={message.storyUrl.slice(1, 2) === 'f' ? `${message.storyUrl}` : `/f${message.storyUrl}`} state={{ url: location.pathname, user: currentUserPage }} onClick={() => {
                followStory.current = message.storyCreator
                storyType.current = message.storyCreator === userAuth ? 'user' : 'following'
              }}
            >
              <div className='reply-div'>
                {message.storyType === 'Text-Story' &&
                  <>
                    <div className='text-post-body'>
                      <p className='story-reply-text'> 
                        {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                      </p>
                      <pre className='text-story' style={{
                        backgroundColor: message?.storyProps?.backgroundColor,
                        fontWeight: message?.storyProps?.fontWeight,
                        color: message?.storyProps?.color,
                        fontStyle: message?.storyProps?.fontStyle,
                        fontFamily: message?.storyProps?.fontFamily
                      }} >
                        {message?.storyText.length >= 300 && `${message?.storyText.slice(0, 300)}...`} { message?.storyText.length >= 300 && <b> more </b>}
                        {message?.storyText.length < 300 && message.storyText}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Img-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>
                    <img src={message?.storyMedia} alt="" className='text-image-story' onLoad={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] .img-pre pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-image-story`).getBoundingClientRect().width}px`
                      }}
                    />
                    <div className="img-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }

                {message.storyType === 'Vid-Story' &&
                  <>
                    <p className='story-reply-text'> 
                      {message.creator === userAuth ? 'You replied a Story' : `${currentUserPage?.username} replied a Story`  }
                    </p>

                    <video className='text-video-story' src={message.storyMedia} onLoadedData={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] .vid-pre pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .text-video-story`).getBoundingClientRect().width}px`
                    }}></video>
                    <div className="vid-pre">
                      <pre>
                        {message?.storyMediaCaption?.length >= 100 && `${message?.storyMediaCaption.slice(0, 100)}...`} 
                        {message?.storyMediaCaption?.length < 100 && message?.storyMediaCaption}
                      </pre>
                    </div>
                  </>
                }
              </div>
            </Link>
            
            <div className="story-reply-img-div">
              <FaReply className='reply-arrow' />

              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <div className={message.body.length > 4 ? "group-media-message-container four" : 'group-media-message-container'}>
                {message.body.length > 4 ?
                  <>
                    <div className='group-media-container-overlay'>
                      +{message.body.length - 3}
                    </div>
                    {message.body.slice(0, 4).map((msg, index) => {
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
                    {message.body.map((msg, index) => {
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
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
            
              
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {/* use text story for stories */}
      {type === 'reply-text-message' && // reply a message with a text
        <div id={message.id} data-type='reply-text-message' className='text-post-msg message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            
            <div className='replied-message' onClick={() => {
              const element = document.querySelector(`[id='${message.replyMessage.id}']`)
              element.scrollIntoView()
            }}>
              <ReplyMessage message={message}/>
            </div>
              
            <div className='message-options'>
              <FaEllipsisH />
            </div>
            
            {/* className='text-story-reply' */}
            <pre className='text-message'>
              {message?.body.length < 301 &&
                <>
                  {isLinkElement(message?.body) ?
                        
                    <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                      {message?.body}
                    </a>
                    :
                    <>
                      {message?.body}
                    </>
                  }
                </>
              }

              {message.body.length > 300 &&
                <>
                  {showMore &&
                    <>
                      {isLinkElement(message?.body) ?
                            
                        <a className='out-link' href={message?.body.includes('http://') || message.body?.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                          {message?.body}
                        </a>
                        :
                        <>
                          {message?.body}
                          <b onClick={() => setShowMore(!showMore)}>
                            {showMore ? 'less' : 'more'}
                          </b>
                        </>
                      }
                    </>
                  }

                  {!showMore && 
                    <>
                    
                    
                      {isLinkElement(message?.body) ?
                            
                        <a className='out-link' href={message?.body.includes('http://') || message?.body.includes('https://') ? `${message?.body}` : `http://${message?.body}`} target='_blank'>
                          {message?.body?.length >= 300 && `${message?.body.slice(0, 300)}...`} { message?.body?.length >= 300 && <b> more </b>}
                          {message?.body?.length < 300 && message?.body}
                        </a>
                        :
                        <>
                          {message?.body.length >= 300 && `${message?.body.slice(0, 300)}...`} {message?.body.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                        </>
                      }
                    </>
                  }
                </>
              }
            </pre>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'reply-photo-message' && // reply a message with a photo
        <div id={message.id} data-type='reply-photo-message' data-val={message.body} className='text-post-msg message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='reply-photo-message' data-val={message.body}
          >
            <div className='replied-message' onClick={() => {
              const element = document.querySelector(`[id='${message.replyMessage.id}']`)
              element.scrollIntoView()
            }}>
              <ReplyMessage message={message}/>
            </div>
            
            <div className="media-reply">
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <img src={message.body} alt="" className='img story-reply-img' onLoad={() => {
                const pre = document.querySelector(`[id='${message.id.toString()}'] .media-reply pre`)
                pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .media-reply img`).getBoundingClientRect().width}px`

                const div = document.querySelector(`[id='${message.id.toString()}'] .pic-post-body`)
                div.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .media-reply img`).getBoundingClientRect().width + 10}px`
              }}data-type='reply-photo-message' data-val={message.body}/>
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'reply-video-message' && // reply a message with a video
        <div id={message.id} data-type='reply-video-message' data-val={message.body} className='text-post-msg message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='reply-video-message' data-val={message.body}
          >
            <div className='replied-message' onClick={() => {
              const element = document.querySelector(`[id='${message.replyMessage.id}']`)
              element.scrollIntoView()
            }}>
              <ReplyMessage message={message}/>
            </div>
            
            <div className="media-reply">
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <video controls src={message.body} className='video' onLoadedData={() => {
                const pre = document.querySelector(`[id='${message.id.toString()}'] .media-reply pre`)
                pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .media-reply video`).getBoundingClientRect().width}px`

                const div = document.querySelector(`[id='${message.id.toString()}'] .pic-post-body`)
                div.style.width = `${document.querySelector(`[id='${message.id.toString()}'] .media-reply video`).getBoundingClientRect().width + 10}px`
              }}data-type='reply-video-message' data-val={message.body}></video>
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'reply-group-media-message' && // reply a message with group media
        <div id={message.id} data-type='reply-group-media-message' data-val={JSON.stringify(message.body)} className='text-post-msg message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}
        >
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'} data-type='reply-group-media-message' data-val={JSON.stringify(message.body)}
          >
            <div className='replied-message group-replied-message' onClick={() => {
              const element = document.querySelector(`[id='${message.replyMessage.id}']`)
              element.scrollIntoView()
            }}>
              <ReplyMessage message={message}/>
            </div>
            
            <div className={message.creator === userAuth ? 'img-message-body right' : 'img-message-body'}>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <div className={message.body.length > 4 ? "group-media-message-container four" : 'group-media-message-container'}>
                {message.body.length > 4 ?
                  <>
                    <div className='group-media-container-overlay'>
                      +{message.body.length - 3}
                    </div>
                    {message.body.slice(0, 4).map((msg, index) => {
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
                    {message.body.map((msg, index) => {
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
              <pre>
                {message?.caption.length < 301 &&
                  <>
                    {isLinkElement(message?.caption) ?
                          
                      <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                        {message?.caption}
                      </a>
                      :
                      <>
                        {message?.caption}
                      </>
                    }
                  </>
                }

                {message.caption.length > 300 &&
                  <>
                    {showMore &&
                      <>
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message.caption?.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption}
                            <b onClick={() => setShowMore(!showMore)}>
                              {showMore ? 'less' : 'more'}
                            </b>
                          </>
                        }
                      </>
                    }

                    {!showMore && 
                      <>
                      
                      
                        {isLinkElement(message?.caption) ?
                              
                          <a className='out-link' href={message?.caption.includes('http://') || message?.caption.includes('https://') ? `${message?.caption}` : `http://${message?.caption}`} target='_blank'>
                            {message?.caption?.length >= 300 && `${message?.caption.slice(0, 300)}...`} { message?.caption?.length >= 300 && <b> more </b>}
                            {message?.caption?.length < 300 && message?.caption}
                          </a>
                          :
                          <>
                            {message?.caption.length >= 300 && `${message?.caption.slice(0, 300)}...`} {message?.caption.length >= 300 && <b onClick={() => setShowMore(!showMore)}> {showMore ? 'less' : 'more'} </b>}
                          </>
                        }
                      </>
                    }
                  </>
                }
              </pre>
            </div>
          </div>
            
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'sent-story' && //sent-stories
        <div id={message.id} data-type={`${message.storyType}`} className='text-post-msg is-story story-reply message' onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
            
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
          <div>
            <div onClick={() => {
              followStory.current = message.storyCreator
              storyType.current = message.storyCreator === userAuth ? 'user' : 'following'
            }}>
              <div className='pic-post-body'>
                <div className='message-options'>
                  <FaEllipsisH />
                </div>
                  <Link to={`/f${message.storyUrl}`} state={{url: location.pathname, user: currentUserPage}}>
                    {message.storyType === 'Text-Story' &&
                      <>
                        <div className='text-post-body'>
                          <p className='story-reply-text'> 
                            {message.creator === userAuth ? 'You sent a story' : `${currentUserPage?.username} sent a story`  }
                          </p>
                          <pre className='text-story' style={{
                            backgroundColor: message?.storyProps?.backgroundColor,
                            fontWeight: message?.storyProps?.fontWeight,
                            color: message?.storyProps?.color,
                            fontStyle: message?.storyProps?.fontStyle,
                            fontFamily: message?.storyProps?.fontFamily
                          }} >
                            {message?.storyText.length >= 300 && `${message?.storyText.slice(0, 300)}...`} 
                            {message?.storyText.length < 300 && message.storyText}
                          </pre>
                        </div>
                      </>
                    }

                    {message.storyType === 'Img-Story' &&
                      <>
                        <p className='story-reply-text'> 
                          {message.creator === userAuth ? 'You sent a story' : `${currentUserPage?.username} sent a story`  }
                        </p>
                        <div className='media-post-body'>
                          <img src={message?.storyMedia} alt="" onLoad={() => {
                            const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                            pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                          }}/>
                          <div className="media-story-caption">
                            <pre> 
                              {message?.storyMediaCaption?.length >= 50 && `${message?.storyMediaCaption.slice(0, 50)}...`} 
                              {message?.storyMediaCaption?.length < 50 && message?.storyMediaCaption}
                            </pre>
                            <p>
                              {/* {message?.time} */}
                            </p>
                          </div>
                        </div>
                      </>
                    }

                    {message.storyType === 'Vid-Story' &&
                      <>
                        <p className='story-reply-text'> 
                          {message.creator === userAuth ? 'You sent a story' : `${currentUserPage?.username} sent a story`  }
                        </p>
                        <div className="media-post-body">
                          <video controls src={message.storyMedia} onLoadedData={() => {
                            const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                            pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                          }}
                          ></video>
                          <div className="media-story-caption">
                            <pre> 
                              {message?.storyMediaCaption?.length >= 50 && `${message?.storyMediaCaption.slice(0, 50)}...`} 
                              {message?.storyMediaCaption?.length < 50 && message?.storyMediaCaption}
                            </pre>
                            <p>
                              {/* {message?.time} */}
                            </p>
                          </div>
                        </div>
                      </>
                    }
                  </Link>
              </div>
            </div>
          </div>
        </div>
          
        <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
          { message.time }
        </span>
      </div>
      }

      {type === 'Text-Comment-comment' && 
        <div id={message?.id} data-type='Text-post' className='text-post-msg is-text-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message?.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="text-post-overlay"></div>
            <div className='text-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${comment?.id}`}>
                <pre>
                  {comment?.body.length >= 300 && `${comment?.body.slice(0, 300)}...`} { comment?.body.length >= 150 && <b> more </b>}
                  {comment?.body.length < 300 && comment.body}
                </pre>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === comment?.creator)?.username}
                </span>
              
                <span>
                  {comment?.date}
                </span>

                <span>
                  {comment?.time}
                </span>
              </p>
            </div>

            <div className="text-post-info">
              <div>{comment?.likes?.value?.length} <span> likes </span></div>
              <div>{comment?.replies?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Photo-Comment-comment' && 
        <div id={message.id} data-type='Picture-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
              
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${comment?.id}`}>
                <img src={comment?.body} alt="" onLoad={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                }}/>
                <div className="img-pre">
                  <pre>
                    {comment?.caption?.length >= 100 && `${comment?.caption.slice(0, 100)}...`} 
                    {comment?.caption?.length < 100 && comment?.caption}
                  </pre>
                </div>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === comment?.creator)?.username}
                </span>
              
                <span>
                  {comment?.date}
                </span>

                <span>
                  {comment?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{comment?.likes?.value?.length} <span> likes </span></div>
              <div>{comment?.replies?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'Video-Comment-comment' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${comment?.id}`}>
                <video controls src={comment?.body} onLoadedData={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                }}>
                </video>
                <div className="vid-pre">
                  <pre>
                    {comment?.caption?.length >= 100 && `${comment?.caption.slice(0, 100)}...`} 
                    {comment?.caption?.length < 100 && comment?.caption}
                  </pre>
                </div>
              </Link>
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === comment?.creator)?.username}
                </span>
              
                <span>
                  {comment?.date}
                </span>

                <span>
                  {comment?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{comment?.likes?.value?.length} <span> likes </span></div>
              <div>{comment?.replies?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Group-Comment-comment' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${comment?.id}`}>
                <span className="media-length">
                  1/{comment?.body.length}
                </span>
                {comment?.body[0].type === 'img' ?
                  <>
                    <img src={comment?.body[0].url} alt="" className='group-img' onLoad={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                    }}/>
                    <div className="img-pre">
                      <pre>
                        {comment?.caption?.length >= 100 && `${comment?.caption.slice(0, 100)}...`} 
                        {comment?.caption?.length < 100 && comment?.caption}
                      </pre>
                    </div>
                  </>
                  :
                  <>
                    <video controls src={comment?.body[0].url} className='group-video' onLoadedData={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                    }}>
                    </video>
                    <div className="vid-pre">
                      <pre>
                        {comment?.caption?.length >= 100 && `${comment?.caption.slice(0, 100)}...`} 
                        {comment?.caption?.length < 100 && comment?.caption}
                      </pre>
                    </div>
                  </>
                }
              </Link>
              
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === comment?.creator)?.username}
                </span>
              
                <span>
                  {comment?.date}
                </span>

                <span>
                  {comment?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{comment?.likes?.value?.length} <span> likes </span></div>
              <div>{comment?.replies?.value?.length} <span> comments </span> </div>
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Text-Reply-reply' && 
        <div id={message?.id} data-type='Text-post' className='text-post-msg is-text-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
           
          <div className={message?.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="text-post-overlay"></div>
            <div className='text-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${message.commentId}/replies/${reply?.id}`}>
                <pre>
                  {reply?.body.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body.length >= 150 && <b> more </b>}
                  {reply?.body.length < 300 && reply.body}
                </pre>
              </Link>
              
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === reply?.creator)?.username}
                </span>
              
                <span>
                  {reply?.date}
                </span>

                <span>
                  {reply?.time}
                </span>
              </p>
            </div>

            <div className="text-post-info">
              <div>{reply?.likes?.value?.length} <span> likes </span></div>
              {/* <div>{reply?.comments?.value?.length} <span> comments </span> </div> */}
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Photo-Reply-reply' && 
        <div id={message.id} data-type='Picture-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
              
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${message.commentId}/replies/${reply?.id}`}>
                <img src={reply?.body} alt="" onLoad={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width}px`
                }}/>
                <div className="img-pre">
                  <pre>
                    {reply?.caption?.length >= 100 && `${reply?.caption.slice(0, 100)}...`} 
                    {reply?.caption?.length < 100 && reply?.caption}
                  </pre>
                </div>
              </Link>
              
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === reply?.creator)?.username}
                </span>
              
                <span>
                  {reply?.date}
                </span>

                <span>
                  {reply?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{reply?.likes?.value?.length} <span> likes </span></div>
              {/* <div>{reply?.comments?.value?.length} <span> comments </span> </div> */}
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time'} >
            { message.time }
          </span>
        </div>
      }

      {type === 'Video-Reply-reply' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
          
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${message.commentId}/replies/${reply?.id}`}>
                <video controls src={reply?.body} onLoadedData={() => {
                  const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                  pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                }}></video>
                <div className="vid-pre">
                  <pre>
                    {reply?.caption?.length >= 100 && `${reply?.caption.slice(0, 100)}...`} 
                    {reply?.caption?.length < 100 && reply?.caption}
                  </pre>
                </div>
              </Link>

            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === reply?.creator)?.username}
                </span>
              
                <span>
                  {reply?.date}
                </span>

                <span>
                  {reply?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{reply?.likes?.value?.length} <span> likes </span></div>
              {/* <div>{reply?.comments?.value?.length} <span> comments </span> </div> */}
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {type === 'Group-Reply-reply' && 
        <div id={message.id} data-type='Video-Media-post' className='text-post-msg is-post message'
        onMouseEnter={e => mouseenter(e)} onMouseLeave={e => mouseleave(e)}>
           
          <div className={message.creator === userAuth ? 'tp-div align-right' : 'align-left tp-div'}>
            <div className="media-post-overlay"></div>
            <div className='media-post-body'>
              <div className='message-options'>
                <FaEllipsisH />
              </div>
              <Link to={`/post/${message.postId}/comments/${message.commentId}/replies/${reply?.id}`}>
                <span className="media-length">
                  1/{reply?.body.length}
                </span>
                {reply?.body[0].type === 'img' ?
                  <>
                    <img src={reply?.body[0].url} alt="" className='group-img' onLoad={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] img`).getBoundingClientRect().width - 0.5}px`
                    }}/>
                    <div className="img-pre">
                      <pre>
                        {reply?.caption?.length >= 100 && `${reply?.caption.slice(0, 100)}...`} 
                        {reply?.caption?.length < 100 && reply?.caption}
                      </pre>
                    </div>
                  </>
                  :
                  <>
                    <video controls src={reply?.body[0].url} className='group-video' onLoadedData={() => {
                      const pre = document.querySelector(`[id='${message.id.toString()}'] pre`)
                      pre.style.width = `${document.querySelector(`[id='${message.id.toString()}'] video`).getBoundingClientRect().width}px`
                    }}
                    ></video>
                    <div className="vid-pre">
                      <pre>
                        {reply?.caption?.length >= 100 && `${reply?.caption.slice(0, 100)}...`} 
                        {reply?.caption?.length < 100 && reply?.caption}
                      </pre>
                    </div>
                  </>
                }
              </Link>
              
            </div>

            <div className="text-post-creator">
              <p>
                <span>
                  Post by {users.find(user => user.id === reply?.creator)?.username}
                </span>
              
                <span>
                  {reply?.date}
                </span>

                <span>
                  {reply?.time}
                </span>
              </p>
            </div>

            <div className="media-post-info">
              <div>{reply?.likes?.value?.length} <span> likes </span></div>
              {/* <div>{reply?.comments?.value?.length} <span> comments </span> </div> */}
            </div>
          </div>
          <span className={message.creator === userAuth ? 'align-span message-time' : 'message-time' } >
            { message.time }
          </span>
        </div>
      }

      {/* sending group media ==> posts & other media ==> comments/replies       */}
      {/* replying messages with group media */}
    </>
  )
}

export default Message




