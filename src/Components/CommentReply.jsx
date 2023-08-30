import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaRegHeart, FaReply, FaShareSquare, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import ReplyOptions from './ReplyOptions'
import verifiedBadge from '../Images/verified-badge.jpg'
import OtherReplyOptions from './OtherReplyOptions'

const CommentReply = ({ reply, postId, CommentId, RepId, func }) => {
  const {
    allPosts, users, likeCommentReply, userAuth, setShowReplyForm, setShowReplyReplyForm, setReplyId, setCommentId, setShowShareMenu, setSelectedMessage, replyReplyFormPostId, replyReplyFormCommentId, showRepOptionsDIv, setShowRepOptionsDiv, showOtherRepOptionsDIv, setShowOtherRepOptionsDiv,
  } = useContext(appContext)

  const [post, setPost] = useState(allPosts.find(post => post.id === postId))
  const [comment, setComment] = useState()
  const [creator, setCreator] = useState()
  const [showMore, setShowMore] = useState(false)
  const [index, setIndex] = useState(0)
  const [trigger, setTrigger] = useState(false)
  const groupRef = useRef()
  const btnRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (post) {
      setComment(post.comments.value.find(comment => comment.id  === CommentId))
    }
  }, [post])

  // console.log(RepId)


  useEffect(() => {
    const callOn = () => {
      if (btnRef.current) {
        btnRef.current.style.visibility = 'visible'
      }
    }

    const callOff = () => {
      if (btnRef.current) {
        btnRef.current.style.visibility = 'hidden'
      }
    }

    groupRef.current?.addEventListener('mouseover', function () {
      callOn()
      setTrigger(!trigger)
    })

    groupRef.current?.addEventListener('mouseleave', function () {
      setTimeout(() => {
        callOff()
        setTrigger(!trigger)
      }, 2000);
    })
    // return () => groupRef.current
  }, [trigger])

  useEffect(() => {
    setCreator(users.find(user => user.id === reply.creator))
  }, [reply, users])

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

  const linkTo = (e, link) => {
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'BUTTON') {
      e.preventDefault()
      navigate(`/post/${postId}/comments/${CommentId}/replies/${link}`)
    }
  }

  if (creator) {
    return (
      <div className='comment-reply' id={reply.id} onClick={e => {
        if (RepId !== undefined) {
          RepId.current = e.currentTarget.id
        } 
      }}>
        {creator?.id === userAuth ?
          <>
            <ReplyOptions postId={postId} CommentId={CommentId} func={func} />
            
            <div className="comment-reply-upper-sect">
              <Link to={reply?.creator} className="comment-reply-img-div">
                <img src={creator?.avatarUrl} alt="" />
              </Link>
      
              <div className="reply-username-div">
                <div className="reply-username">
                  <div>
                    <p>
                      {creator?.displayName}
                      {creator.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
                    </p>
                    <p> @{creator?.username} </p>
                  </div>
      
                  <div className='upper-sect-options' onClick={() => {
                    setShowRepOptionsDiv(!showRepOptionsDIv)
                  }}>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                  </div>
                </div>

                <div className="reply-body">
                  {reply?.type === 'Text-Reply' &&
                    <pre className='preRef'>
                      {isLinkElement(reply?.body) ?
                      
                        <a className='out-link' href={reply?.body.includes('http://') || reply?.body.includes('https://') ? `${reply?.body}` : `http://${reply?.body}`} target='_blank'>
                          {reply?.body?.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body?.length >= 300 && <b> more </b>}
                          {reply?.body?.length < 300 && reply?.body}
                        </a>
                        :
                        <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                          {reply?.body?.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body?.length >= 300 && <b> more </b>}
                          {reply?.body?.length < 300 && reply?.body}
                        </Link>
                      }
                    </pre>
                  }

                  {reply?.type === 'Photo-Reply' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <img className='img-post-body' src={reply?.body} alt="" />
                      </div>
                    </div>
                  }

                  {reply?.type === 'Video-Reply' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <video controls className='img-post-body' src={reply?.body}></video>
                      </div>
                    </div>
                  }
                
                  {reply?.type === 'Group-Reply' &&
                    <div ref={groupRef} className="img-post-body-div">

                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}   className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <div className='group-media-div'>
                          <div className="post-number">
                            {index + 1}/{reply?.body.length}
                          </div>
                          <div ref={btnRef} className="scroll-posts postt">
                            <button className='index-btn' style={{opacity: index === 0 && '0'}}
                              onClick={() => {
                                index !== 0 && setIndex(prev => prev - 1)
                              }}
                            >
                              <FaAngleLeft />
                            </button>
      
                            <button className='index-btn'  style={{opacity: index === reply?.body.length - 1 && '0'}}
                              onClick={() => {
                                index !== reply?.body.length - 1 && setIndex(prev => prev + 1)
                              }}
                            >
                              <FaAngleRight />
                            </button>
                          </div>
                          {reply?.body.map((item, i) => {
                            return (
                              <div key={i}>
                                {item.type === 'img' ?
                                  <>
                                    {index === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media curr-media'
                                      />
                                    }

                                    {(index + 1) === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media next-media'
                                      />
                                    }

                                    {(index - 1) === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media prev-media'
                                      />
                                    }

                                    {index !== i && (index + 1) !== i && (index - 1) !== i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media'
                                      />
                                    }
                                  </>
                                  :
                                  item.type === 'video' &&
                                  <>
                                    {index === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media curr-media'
                                      ></video>
                                    }

                                    {(index + 1) === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media next-media'
                                      ></video>
                                    }

                                    {(index - 1) === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media prev-media'
                                      ></video>
                                    }

                                    {index !== i && (index + 1) !== i && (index - 1) !== i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media'
                                      ></video>
                                    }
                                  </>
                                }
                              </div>
                            )
                          })}
      
                        {reply?.body.map((item, i) => {
                          return  item.type === 'img' ?
                            <img key={i} src={item.url} alt=""
                              className="img-post-body sample"
                            /> 
                          :
                          item.type === 'video' &&
                            <video key={i} src={item.url} controls
                              className="vid-post-body sample"
                              ></video>
                          })}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
      
      
            <div className="lower-sect">
              <span style={ reply.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={ () => likeCommentReply(postId, CommentId, reply.id) } >
                <FaRegHeart  style={ reply.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {reply?.likes.value.length}
              </span>
              <span className='reply' onClick={() => {
                if (userAuth) {
                  setShowReplyReplyForm(true)
                  setShowReplyForm(false)
                  setReplyId(reply.id)
                  setCommentId(CommentId)
                  replyReplyFormPostId.current = post?.id 
                  replyReplyFormCommentId.current = comment?.id
                }
              } } >
                <FaReply/>
              </span>
              <span onClick={e => {
                if (userAuth) {
                  setSelectedMessage({
                    post: post, comment: comment && comment, reply: reply, typeOf: 'reply', type: reply.type
                  })
                  setShowShareMenu(true)
                }
              }}> <FaShareSquare /> {reply?.shares.value.length} </span>
            </div>
          </>
          :
          <>
            <OtherReplyOptions postId={postId} CommentId={CommentId} func={func} />
            
            <div className="comment-reply-upper-sect">
              <Link to={reply?.creator} className="comment-reply-img-div">
                <img src={creator?.avatarUrl} alt="" />
              </Link>
      
              <div className="reply-username-div">
                <div className="reply-username">
                  <div>
                    <p>
                      {creator?.displayName}
                      {creator.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
                    </p>
                    <p> @{creator?.username} </p>
                  </div>
      
                  <div className='upper-sect-options' onClick={() => {
                    setShowOtherRepOptionsDiv(!showOtherRepOptionsDIv)
                  }}>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                  </div>
                </div>

                <div className="reply-body">
                  {reply?.type === 'Text-Reply' &&
                    <pre className='preRef'>
                      {isLinkElement(reply?.body) ?
                      
                        <a className='out-link' href={reply?.body.includes('http://') || reply?.body.includes('https://') ? `${reply?.body}` : `http://${reply?.body}`} target='_blank'>
                          {reply?.body?.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body?.length >= 300 && <b> more </b>}
                          {reply?.body?.length < 300 && reply?.body}
                        </a>
                        :
                        <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                          {reply?.body?.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body?.length >= 300 && <b> more </b>}
                          {reply?.body?.length < 300 && reply?.body}
                        </Link>
                      }
                    </pre>
                  }

                  {reply?.type === 'Photo-Reply' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <img className='img-post-body' src={reply?.body} alt="" />
                      </div>
                    </div>
                  }

                  {reply?.type === 'Video-Reply' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}  className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <video controls className='img-post-body' src={reply?.body}></video>
                      </div>
                    </div>
                  }
                
                  {reply?.type === 'Group-Reply' &&
                    <div ref={groupRef} className="img-post-body-div">

                      <pre className='preRef'>
                        {isLinkElement(reply?.caption) ?
                        
                          <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </a>
                          :
                          <Link to={`/post/${postId}/comments/${CommentId}/replies/${reply.id}`}   className='in-link'>
                            {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                            {reply?.caption?.length < 300 && reply?.caption}
                          </Link>
                        }
                      </pre>
                      <div onClick={e => linkTo(e, reply?.id)} className='in-link'>
                        <div className='group-media-div'>
                          <div className="post-number">
                            {index + 1}/{reply?.body.length}
                          </div>
                          <div ref={btnRef} className="scroll-posts postt">
                            <button className='index-btn' style={{opacity: index === 0 && '0'}}
                              onClick={() => {
                                index !== 0 && setIndex(prev => prev - 1)
                              }}
                            >
                              <FaAngleLeft />
                            </button>
      
                            <button className='index-btn'  style={{opacity: index === reply?.body.length - 1 && '0'}}
                              onClick={() => {
                                index !== reply?.body.length - 1 && setIndex(prev => prev + 1)
                              }}
                            >
                              <FaAngleRight />
                            </button>
                          </div>
                          {reply?.body.map((item, i) => {
                            return (
                              <div key={i}>
                                {item.type === 'img' ?
                                  <>
                                    {index === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media curr-media'
                                      />
                                    }

                                    {(index + 1) === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media next-media'
                                      />
                                    }

                                    {(index - 1) === i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media prev-media'
                                      />
                                    }

                                    {index !== i && (index + 1) !== i && (index - 1) !== i &&
                                      <img key={i} src={item.url} alt=""
                                        className='img-post-body group-media'
                                      />
                                    }
                                  </>
                                  :
                                  item.type === 'video' &&
                                  <>
                                    {index === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media curr-media'
                                      ></video>
                                    }

                                    {(index + 1) === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media next-media'
                                      ></video>
                                    }

                                    {(index - 1) === i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media prev-media'
                                      ></video>
                                    }

                                    {index !== i && (index + 1) !== i && (index - 1) !== i &&
                                      <video key={i} src={item.url} alt="" controls
                                        className='vid-post-body group-media'
                                      ></video>
                                    }
                                  </>
                                }
                              </div>
                            )
                          })}
      
                        {reply?.body.map((item, i) => {
                          return  item.type === 'img' ?
                            <img key={i} src={item.url} alt=""
                              className="img-post-body sample"
                            /> 
                          :
                          item.type === 'video' &&
                            <video key={i} src={item.url} controls
                              className="vid-post-body sample"
                              ></video>
                          })}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
      
      
            <div className="lower-sect">
              <span style={ reply.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={ () => likeCommentReply(postId, CommentId, reply.id) } >
                <FaRegHeart  style={ reply.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {reply?.likes.value.length}
              </span>
              <span className='reply' onClick={() => {
                if (userAuth) {
                  setShowReplyReplyForm(true)
                  setShowReplyForm(false)
                  setReplyId(reply.id)
                  setCommentId(CommentId)
                  replyReplyFormPostId.current = post?.id 
                  replyReplyFormCommentId.current = comment?.id
                }
              } } >
                <FaReply/>
              </span>
              <span onClick={e => {
                if (userAuth) {
                  setSelectedMessage({
                    post: post, comment: comment && comment, reply: reply, typeOf: 'reply', type: reply.type
                  })
                  setShowShareMenu(true)
                }
              }}> <FaShareSquare /> {reply?.shares.value.length} </span>
            </div>
          </>
        }
      </div>
    )
  } else {
    return (
      <div className="deleted-reply">
        This reply was made by a deleted account
      </div>
    )
  }

 
}

export default CommentReply