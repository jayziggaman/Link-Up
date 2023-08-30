import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaRegHeart, FaRegComment, FaShareSquare, FaAngleUp, FaAngleDown, FaReply, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'
import OtherReplyOptions from './OtherReplyOptions'
import ReplyOptions from './ReplyOptions'
import ShareMenu from './ShareMenu'

const ReplyBookmark = ({post}) => {
  const { allPosts, users, userAuth, handleLike, setShowShareMenu, setSelectedMessage, likeCommentReply, showRepOptionsDIv, setShowRepOptionsDiv, showOtherRepOptionsDIv, setShowOtherRepOptionsDiv } = useContext(appContext)
  
  const [replyPost, setReplyPost] = useState()
  const [replyComment, setReplyComment] = useState()
  const [reply, setReply] = useState()
  const [replyCreator, setReplyCreator] = useState()
  const replyId = useRef('')
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setReplyPost(allPosts.find(item => item.id === post.value.post.id))
  }, [post])

  useEffect(() => {
    setReplyComment(replyPost?.comments.value.find(comment => comment.id === post.value.comment.id))
  }, [replyPost])

  useEffect(() => {
    setReply(replyComment?.replies.value.find(reply => reply.id === post.value.reply.id))
  }, [replyComment])

  useEffect(() => {
    setReplyCreator(users.find(user => user.id === reply?.creator))
  }, [reply])

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

  const linkTo = (e, postLink, commentLink, link) => {
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'BUTTON') {
      navigate(`/post/${postLink}/comments/${commentLink}/replies/${link}`)
    }
  }

  return (
    <div id={post.value.reply.id} className='comment-bookmark-post' onClick={e => {
      replyId.current = e.currentTarget.id
    }}>

      {replyCreator?.id === userAuth ?
        <ReplyOptions postId={replyPost?.id} CommentId={replyComment?.id}
        func={[
          { id: replyId.current, text: 'Remove bookmark', prop: 'remove-bookmark' },
          { id: replyId.current, text: 'Delete reply', prop: 'delete-reply red' }
        ]}
        />
        :
        <OtherReplyOptions postId={replyPost?.id} CommentId={replyComment?.id}
        func={[
          { id: replyId.current, text: 'Remove bookmark', prop: 'remove-bookmark' }
        ]}
        />
      }

      <div className="upper-sect">
        <Link to={replyCreator?.id}>
          <div className="upper-sect-img-div">
            <img src={replyCreator?.avatarUrl} alt="" />
          </div>

          <div className="post-username-div">
            <p className="post-display-name">
              {replyCreator?.displayName}  {replyCreator?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
            </p>
            <p className="post-username"> @{replyCreator?.username} </p>
          </div>
        </Link>

        <div className='upper-sect-options' onClick={() => {
          if (reply?.creator === userAuth) {
            setShowRepOptionsDiv(!showRepOptionsDIv)
          } else {
            setShowOtherRepOptionsDiv(!showOtherRepOptionsDIv)
          }
        }}>
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </div>
      </div>

      <div className="middle-sect">
        {reply?.type === 'Text-Reply' &&
          <pre className='preRef'>
            {isLinkElement(reply?.body) ?
            
              <a className='out-link' href={reply?.body.includes('http://') || reply?.body.includes('https://') ? `${reply?.body}` : `http://${reply?.body}`} target='_blank'>
                {reply?.body?.length >= 300 && `${reply?.body.slice(0, 300)}...`} { reply?.body?.length >= 300 && <b> more </b>}
                {reply?.body?.length < 300 && reply?.body}
              </a>
              :
              <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}/replies/${reply?.id}`} className='in-link'>
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
                <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}/replies/${reply?.id}`} className='in-link'>
                  {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                  {reply?.caption?.length < 300 && reply?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, replyPost?.id, replyComment?.id, reply?.id)} className='in-link'>
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
                <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}/replies/${reply?.id}`} className='in-link'>
                  {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                  {reply?.caption?.length < 300 && reply?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, replyPost?.id, replyComment?.id, reply?.id)} className='in-link'>
              <video controls className='img-post-body' src={reply?.body}></video>
            </div>
          </div>
        }
      
        {reply?.type === 'Group-Reply' &&
          <div className="img-post-body-div">
             {/* ref={groupRef} */}

            <pre className='preRef'>
              {isLinkElement(reply?.caption) ?
              
                <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                  {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                  {reply?.caption?.length < 300 && reply?.caption}
                </a>
                :
                <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}/replies/${reply?.id}`} className='in-link'>
                  {reply?.caption?.length >= 300 && `${reply?.caption.slice(0, 300)}...`} { reply?.caption?.length >= 300 && <b> more </b>}
                  {reply?.caption?.length < 300 && reply?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, replyPost?.id, replyComment?.id, reply?.id)} className='in-link'>
              <div className='group-media-div'>
                <div className="post-number">
                  {index + 1}/{reply?.body.length}
                </div>
                <div className="scroll-posts postt">
                {/* ref={btnRef}  */}
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

      <div className="lower-sect">
        <span className="post-time">
          <span>{reply?.time}</span>
          <span>{reply?.date} </span>
        </span>
        <span style={ reply?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => likeCommentReply(replyPost?.id, replyComment?.id, reply?.id)}>
        <FaRegHeart style={ reply?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {reply?.likes?.value?.length}
        </span>
        <span>
          <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}/replies/${reply?.id}`} >
            <FaRegComment />
            {/* {comments?.value?.length} */}
          </Link>
        </span>
      <span onClick={() => {
        setShowShareMenu(true)
        setSelectedMessage({
          post: replyPost, comment: replyComment, reply: reply, typeOf: 'reply', type: reply?.type
        })
        }} > <FaShareSquare /> {reply?.shares?.value?.length} </span>
      </div>
    </div>
  )

  // return (
  //   <div className="comment-bookmark-post">
  //     <div className="post-bookmark-upper">
  //       <div className="post-bookmark-img-div">
  //         <img src={users.find(person => person.id === replyPost?.creator)?.avatarUrl} alt="" className="post-bookmark-img"/>
  //       </div>

  //       <Link to={`/${post.value.post?.creator}`} className="post-bookmark-username-displayname">
  //         <div>
  //           <p>
  //             @{users.find(person => person.id === replyPost?.creator)?.username}
  //           </p>
  //           <p>
  //             {users.find(person => person.id === replyPost?.creator)?.displayName}
  //           </p>
  //         </div>
  //         <p className="post-date"> {post.value.post.date} </p>
  //       </Link>
        
  //       <div className="post-bookmark-options">
  //         <div></div>
  //         <div></div>
  //         <div></div>
  //       </div>
  //     </div>

  //     <div className="post-bookmark-lower">
  //       <pre>
  //         <Link to={`/post/${replyPost?.id}`}>
  //           {replyPost?.body}
  //         </Link>
  //       </pre>

  //       <div className="comment-bookmark-comment">
  //         <div className="comment-bookmark-upper">
  //           <div className="comment-bookmark-img-div">
  //             <img src={users.find(person => person.id === replyComment?.creator)?.avatarUrl} alt="" className="comment-bookmark-img"/>
  //           </div>

  //           <div className="post-bookmark-username-displayname">
  //             <p>
  //               @{users.find(person => person.id === replyComment?.creator)?.username}
  //             </p>
  //             <p>
  //               {users.find(person => person.id === replyComment?.creator)?.displayName}
  //             </p>
  //           </div>
            
  //           <div className="post-bookmark-options">
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //           </div>
  //         </div>

  //         <div className="comment-bookmark-lower">
  //           <pre>
  //             <Link to={`/post/${replyPost?.id}/comments/${replyComment?.id}`}>
  //               {replyComment?.body}
  //             </Link>
  //           </pre>

  //           <div className="reply-bookmark">
  //             <div className="reply-bookmark-upper">
  //               <div className="reply-bookmark-img-div">
  //                 <img src={users.find(person => person.id === replyComment?.creator)?.avatarUrl} alt="" className="reply-bookmark-img"/>
  //               </div>

  //               <div className="post-bookmark-username-displayname">
  //                 <p>
  //                   @{users.find(person => person.id === replyComment?.creator)?.username}
  //                 </p>
  //                 <p>
  //                   {users.find(person => person.id === replyComment?.creator)?.displayName}
  //                 </p>
  //               </div>
                
  //               <div className="post-bookmark-options">
  //                 <div></div>
  //                 <div></div>
  //                 <div></div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //     </div>

  //     <div className="lower-sect">
  //       <span  className="post-time"> {post.value.post.time} </span>
  //       <span style={ post.value.post.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => handleLike(post.value.post.id)}>
  //       <FaRegHeart /> {post.value.post.likes?.value?.length}
  //       </span>
  //       <span>
  //         <Link to={`/post/${post.value.post.id}`} >
  //           <FaRegComment /> {post.value.post.comments?.value?.length}
  //         </Link>
  //       </span>
  //       <span onClick={() => { setShowShareMenu(true)
  //       setSelectedMessage({
  //         postId: post.value.post.id, type: 'post'
  //       })
  //       }}
  //       >  <FaShareSquare /> {post.value.post.shares?.value?.length}
  //       </span>
  //     </div>
  //   </div>
  // )
}

export default ReplyBookmark