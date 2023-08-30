import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaRegHeart, FaReply, FaShareSquare, FaAngleDown, FaAngleUp, FaAngleLeft, FaAngleRight, FaRegComment } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import CommentOptions from './CommentOptions'
import CommentReply from './CommentReply'
import verifiedBadge from '../Images/verified-badge.jpg'
import OtherCommentOptions from './OtherCommentOptions'

const Comment = (
  { comment, postId, comtId, RepId, func, setShowMore, showMore, comments }
) => {
  const {
    allPosts, userAuth, likeComment, setShowReplyForm, setCommentId, setShowReplyReplyForm, users, setShowShareMenu, setSelectedMessage, replyFormPostId, replyFormCommentId, showComOptionsDIv, setShowComOptionsDiv, showRepOptionsDIv, setShowRepOptionsDiv, showOtherComOptionsDIv, setShowOtherComOptionsDiv, showOtherRepOptionsDIv, setShowOtherRepOptionsDiv,
  } = useContext(appContext)
  
  const {body, likes, replies, id, creator, type, caption, shares} = comment
  const [showReplies, setShowReplies] = useState(false)
  const [post, setPost] = useState(allPosts.find(post => post.id === postId))
  const [user, setUser] = useState()
  // const [showMore, setShowMore] = useState(false)
  const [index, setIndex] = useState(0)
  const [trigger, setTrigger] = useState(false)
  const groupRef = useRef()
  const btnRef = useRef()
  const navigate = useNavigate()

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
    setUser(users.find(user => user.id === creator))
  }, [creator])

  useEffect(() => {
    if (user) {
      const replyBtn = document.getElementById('reply-btn')
      const child = replyBtn.childNodes
      child.forEach(x => x.setAttribute("class", "reply"))
    } 
  }, [])

  useEffect(() => {
    if (showMore !== undefined) {
      if (showReplies) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      // console.log(showMore)
    }
  }, [showReplies])

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
      navigate(`/post/${post?.id}/comments/${link}`)
    }
  }
  
  
  const commentClick = e => {
    if (comtId !== undefined) {
      comtId.current = e.currentTarget.id
    }
  }

  if (!user) {
    return (
      <div className="deleted-comment">
        This comment was made by a deleted account
      </div>
    )
  } else {
    return (
      <div className='comment' id={id} onClick={e => commentClick(e)} >
        {creator === userAuth ?
          <>
            <CommentOptions style='comment' postId={postId}
            func={func}
            />

            <div className="upper-sect">
              <Link to={creator}>
                <div className="upper-sect-img-div">
                  <img src={user.avatarUrl} alt="" />
                </div>
      
                <div className="post-username-div">
                  <p className="post-display-name">
                    {user?.displayName}  {user?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                  </p>
                  <p className="post-username"> @{user?.username} </p>
                </div>
              </Link>
      
              <div className='upper-sect-options' onClick={() => {
                setShowComOptionsDiv(!showComOptionsDIv)
              }}>
                <p>.</p>
                <p>.</p>
                <p>.</p>
              </div>
            </div>
  
            <div className="middle-sect">
              {type === 'Text-Comment' &&
                <pre className='preRef'>
                  {isLinkElement(body) ?
                  
                    <a className='out-link' href={body.includes('http://') || body.includes('https://') ? `${body}` : `http://${body}`} target='_blank'>
                      {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                      {body?.length < 300 && body}
                    </a>
                    :
                    <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                      {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                      {body?.length < 300 && body}
                    </Link>
                  }
                </pre>
              }

              {type === 'Photo-Comment' &&
                <div className="img-post-body-div">
                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <img className='img-post-body' src={body} alt="" />
                  </div>
                </div>
              }

              {type === 'Video-Comment' &&
                <div className="img-post-body-div">
                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <video controls className='img-post-body' src={body}></video>
                  </div>
                </div>
              }
            
              {type === 'Group-Comment' &&
                <div ref={groupRef} className="img-post-body-div">

                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <div className='group-media-div'>
                      <div className="post-number">
                        {index + 1}/{body.length}
                      </div>
                      <div ref={btnRef} className="scroll-posts postt">
                        <button className='index-btn' style={{opacity: index === 0 && '0'}}
                          onClick={() => {
                            index !== 0 && setIndex(prev => prev - 1)
                          }}
                        >
                          <FaAngleLeft />
                        </button>

                        <button className='index-btn'  style={{opacity: index === body.length - 1 && '0'}}
                          onClick={() => {
                            index !== body.length - 1 && setIndex(prev => prev + 1)
                          }}
                        >
                          <FaAngleRight />
                        </button>
                      </div>
                      {body.map((item, i) => {
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

                    {body.map((item, i) => {
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

            <div className="lower-sect">
              <span className='show-comment-replies' onClick={() => {
                setShowReplies(!showReplies)
                // setShowMore(!showMore)
                }}
              >
                { showReplies ? <FaAngleUp /> : <FaAngleDown /> }
              </span>

              <span style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => likeComment(postId, id)}>
                <FaRegHeart style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {likes?.value.length}
              </span>

              <span className='reply' onClick={e => {
                if (userAuth) {
                  setShowReplyForm(true)
                  setShowReplyReplyForm(false)
                  setCommentId(e.currentTarget.parentElement.parentElement.id)
                  replyFormPostId.current = post?.id
                  replyFormCommentId.current = comment.id
                }
              } }>
                <FaRegComment id='reply-btn' className='reply'/> {replies?.value.length}
              </span>
              
              <span onClick={e => {
                if (userAuth) {
                  setShowShareMenu(true)
                  setSelectedMessage({
                    post: post, comment: comment, typeOf: 'comment', type: comment.type
                  })
                }
              }}>
              <FaShareSquare /> {shares?.value.length}
              </span>
            </div>
      
            <div className='comment-reply-div'>
              {showReplies && replies?.value.map((reply, ind) => {
                  const { creator } = reply
                  if (creator === userAuth) {
                    return (
                      <div key={ind} className='post-div'>
                        {ind !== 0 && <hr />}
                        <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={id} RepId={RepId}
                            func={[
                              { id: RepId.current, text: 'Bookmark reply', prop: 'bookmark-reply' },
                              { id: RepId.current, text: 'Delete reply', prop: 'delete-reply red' }
                            ]}
                        />
                      </div>
                    ) 
                  } else {
                    return (
                      <div key={ind} className='post-div'>
                        {ind !== 0 && <hr />}
                        <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={id} RepId={RepId}
                          func={[
                            { id: RepId.current, text: 'Bookmark reply', prop: 'bookmark-reply' }
                          ]}
                        />
                      </div>
                    ) 
                  }
                })}
            </div>
          </>
          :
          <>
            <OtherCommentOptions style='comment' postId={postId}
            func={func}
            />

            <div className="upper-sect">
              <Link to={creator}>
                <div className="upper-sect-img-div">
                  <img src={user.avatarUrl} alt="" />
                </div>
      
                <div className="post-username-div">
                  <p className="post-display-name">
                    {user?.displayName}  {user?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                  </p>
                  <p className="post-username"> @{user?.username} </p>
                </div>
              </Link>
      
              <div className='upper-sect-options' onClick={() => {
                setShowOtherComOptionsDiv(!showOtherComOptionsDIv)
              }}>
                <p>.</p>
                <p>.</p>
                <p>.</p>
              </div>
            </div>
  
            <div className="middle-sect">
              {type === 'Text-Comment' &&
                <pre className='preRef'>
                  {isLinkElement(body) ?
                  
                    <a className='out-link' href={body.includes('http://') || body.includes('https://') ? `${body}` : `http://${body}`} target='_blank'>
                      {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                      {body?.length < 300 && body}
                    </a>
                    :
                    <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                      {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                      {body?.length < 300 && body}
                    </Link>
                  }
                </pre>
              }

              {type === 'Photo-Comment' &&
                <div className="img-post-body-div">
                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <img className='img-post-body' src={body} alt="" />
                  </div>
                </div>
              }

              {type === 'Video-Comment' &&
                <div className="img-post-body-div">
                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <video controls className='img-post-body' src={body}></video>
                  </div>
                </div>
              }
            
              {type === 'Group-Comment' &&
                <div ref={groupRef} className="img-post-body-div">

                  <pre className='preRef'>
                    {isLinkElement(caption) ?
                    
                      <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </a>
                      :
                      <Link to={`/post/${post?.id}/comments/${id}`} className='in-link'>
                        {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                        {caption?.length < 300 && caption}
                      </Link>
                    }
                  </pre>
                  <div onClick={e => linkTo(e, id)} className='in-link'>
                    <div className='group-media-div'>
                      <div className="post-number">
                        {index + 1}/{body.length}
                      </div>
                      <div ref={btnRef} className="scroll-posts postt">
                        <button className='index-btn' style={{opacity: index === 0 && '0'}}
                          onClick={() => {
                            index !== 0 && setIndex(prev => prev - 1)
                          }}
                        >
                          <FaAngleLeft />
                        </button>

                        <button className='index-btn'  style={{opacity: index === body.length - 1 && '0'}}
                          onClick={() => {
                            index !== body.length - 1 && setIndex(prev => prev + 1)
                          }}
                        >
                          <FaAngleRight />
                        </button>
                      </div>
                      {body.map((item, i) => {
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

                    {body.map((item, i) => {
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

            <div className="lower-sect">
              <span className='show-comment-replies' onClick={() => {
                setShowReplies(!showReplies)
                // setShowMore(!showMore)
                }}
              >
                { showReplies ? <FaAngleUp /> : <FaAngleDown /> }
              </span>

              <span style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => likeComment(postId, id)}>
                <FaRegHeart style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {likes?.value.length}
              </span>

              <span className='reply' onClick={e => {
                if (userAuth) {
                  setShowReplyForm(true)
                  setShowReplyReplyForm(false)
                  setCommentId(e.currentTarget.parentElement.parentElement.id)
                  replyFormPostId.current = post?.id
                  replyFormCommentId.current = comment.id
                }
              } }>
                <FaRegComment id='reply-btn' className='reply'/> {replies?.value.length}
              </span>
              
              <span onClick={e => {
                if (userAuth) {
                  setShowShareMenu(true)
                  setSelectedMessage({
                    post: post, comment: comment, typeOf: 'comment', type: comment.type
                  })
                }
              }}>
              <FaShareSquare /> {shares?.value.length}
              </span>
            </div>
      
            <div className='comment-reply-div'>
              {showReplies && replies?.value.map((reply, ind) => {
                  const { creator } = reply
                  if (creator === userAuth) {
                    return (
                      <div key={ind} className='post-div'>
                        {ind !== 0 && <hr />}
                        <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={id} RepId={RepId}
                            func={[
                              { id: RepId.current, text: 'Bookmark reply', prop: 'bookmark-reply' },
                              { id: RepId.current, text: 'Delete reply', prop: 'delete-reply red' }
                            ]}
                        />
                      </div>
                    ) 
                  } else {
                    return (
                      <div key={ind} className='post-div'>
                        {ind !== 0 && <hr />}
                        <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={id} RepId={RepId}
                          func={[
                            { id: RepId.current, text: 'Bookmark reply', prop: 'bookmark-reply' }
                          ]}
                        />
                      </div>
                    ) 
                  }
                })}
            </div>
          </>
        }
      </div>
    )
  }

  
}

export default Comment