import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaRegHeart, FaRegComment, FaShareSquare, FaAngleUp, FaAngleDown, FaReply, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'
import verifiedBadge from '../Images/verified-badge.jpg'
import CommentOptions from './CommentOptions'
import OtherCommentOptions from './OtherCommentOptions'

const CommentBookmark = ({post, postId, commntId}) => {
  const { users, allPosts, userAuth, setSelectedMessage, setShowShareMenu, likeComment, showComOptionsDIv, setShowComOptionsDiv, showOtherComOptionsDIv, setShowOtherComOptionsDiv } = useContext(appContext)
  const [comment, setComment] = useState()
  const [commentPost, setCommentPost] = useState()
  const [commentCreator, setCommentCreator] = useState()
  const[showMore, setShowMore] = useState(false)
  const commentId = useRef('')
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setCommentPost(allPosts.find(item => item.id === post?.value?.post?.id))
  }, [post])

  useEffect(() => {
    setComment(commentPost?.comments.value.find(comment => comment.id === post?.value?.comment?.id))
  }, [commentPost])

  useEffect(() => {
    setCommentCreator(users.find(user => user.id === comment?.creator))
  }, [comment])


  useEffect(() => {
    const height =
    document.querySelector(`[id='${commentPost?.id.toString()}'] .cv-post-content-div`)?.getBoundingClientRect().height +
    document.querySelector(`[id='${commentPost?.id.toString()}'] .lower-sect`)?.getBoundingClientRect().height + 30 +
    document.querySelector(`[id='${comment?.id.toString()}']`)?.getBoundingClientRect().height
  
    const div = document.querySelector(`[id='${commentPost?.id.toString()}'] .post-bookmark-lower`)
    if (div) div.style.height = `${height}px`
  }, [showMore, commentPost])

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

  const linkTo = (e, postLink, link) => {
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'BUTTON') {
      navigate(`/post/${postLink}/comments/${link}`)
    }
  }

  return (
    <div id={post?.value?.comment?.id} className='comment-bookmark-post' onClick={e => {
      commentId.current = e.currentTarget.id
    }}>

      {commentCreator?.id === userAuth ?
        <CommentOptions postId={commentPost?.id} style='comment'
        func={[
          { id: commentId.current, text: 'Remove bookmark', prop: 'remove-bookmark' },
          { id: commentId.current, text: 'Delete comment', prop: 'delete-comment red' }
        ]}
        />
        :
        <OtherCommentOptions postId={commentPost?.id} style='comment'
        func={[
          { id: commentId.current, text: 'Remove bookmark', prop: 'remove-bookmark' }
        ]}
        />
      }

      <div className="upper-sect">
        <Link to={commentCreator?.id}>
          <div className="upper-sect-img-div">
            <img src={commentCreator?.avatarUrl} alt="" />
          </div>

          <div className="post-username-div">
            <p className="post-display-name">
              {commentCreator?.displayName}  {commentCreator?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
            </p>
            <p className="post-username"> @{commentCreator?.username} </p>
          </div>
        </Link>

        <div className='upper-sect-options' onClick={() => {
          if (comment?.creator === userAuth) {
            setShowComOptionsDiv(!showComOptionsDIv)
          } else {
            setShowOtherComOptionsDiv(!showOtherComOptionsDIv)
          }
        }}>
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </div>
      </div>

      <div className="middle-sect">
        {comment?.type === 'Text-Comment' &&
          <pre className='preRef'>
            {isLinkElement(comment?.body) ?
            
              <a className='out-link' href={comment?.body.includes('http://') || comment?.body.includes('https://') ? `${comment?.body}` : `http://${comment?.body}`} target='_blank'>
                {comment?.body?.length >= 300 && `${comment?.body.slice(0, 300)}...`} { comment?.body?.length >= 300 && <b> more </b>}
                {comment?.body?.length < 300 && comment?.body}
              </a>
              :
              <Link to={`/post/${commentPost?.id}/comments/${comment?.id}`} className='in-link'>
                {comment?.body?.length >= 300 && `${comment?.body.slice(0, 300)}...`} { comment?.body?.length >= 300 && <b> more </b>}
                {comment?.body?.length < 300 && comment?.body}
              </Link>
            }
          </pre>
        }

        {comment?.type === 'Photo-Comment' &&
          <div className="img-post-body-div">
            <pre className='preRef'>
              {isLinkElement(comment?.caption) ?
              
                <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </a>
                :
                <Link to={`/post/${commentPost?.id}/comments/${comment?.id}`} className='in-link'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, commentPost?.id, comment?.id)} className='in-link'>
              <img className='img-post-body' src={comment?.body} alt="" />
            </div>
          </div>
        }

        {comment?.type === 'Video-Comment' &&
          <div className="img-post-body-div">
            <pre className='preRef'>
              {isLinkElement(comment?.caption) ?
              
                <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </a>
                :
                <Link to={`/post/${commentPost?.id}/comments/${comment?.id}`} className='in-link'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, commentPost?.id, comment?.id)} className='in-link'>
              <video controls className='img-post-body' src={comment?.body}></video>
            </div>
          </div>
        }
      
      {/* ref={groupRef} */}
        {comment?.type === 'Group-Comment' &&
          <div className="img-post-body-div">

            <pre className='preRef'>
              {isLinkElement(comment?.caption) ?
              
                <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </a>
                :
                <Link to={`/post/${commentPost?.id}/comments/${comment?.setCommentId}`} className='in-link'>
                  {comment?.caption?.length >= 300 && `${comment?.caption.slice(0, 300)}...`} { comment?.caption?.length >= 300 && <b> more </b>}
                  {comment?.caption?.length < 300 && comment?.caption}
                </Link>
              }
            </pre>
            <div onClick={e => linkTo(e, commentPost?.id, comment?.id)} className='in-link'>
              <div className='group-media-div'>
                <div className="post-number">
                  {index + 1}/{comment?.body.length}
                </div>
                {/* ref={btnRef} */}
                <div className="scroll-posts postt">
                  <button className='index-btn' style={{opacity: index === 0 && '0'}}
                    onClick={() => {
                      index !== 0 && setIndex(prev => prev - 1)
                    }}
                  >
                    <FaAngleLeft />
                  </button>

                  <button className='index-btn'  style={{opacity: index === comment?.body.length - 1 && '0'}}
                    onClick={() => {
                      index !== comment?.body.length - 1 && setIndex(prev => prev + 1)
                    }}
                  >
                    <FaAngleRight />
                  </button>
                </div>
                {comment?.body.map((item, i) => {
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

              {comment?.body.map((item, i) => {
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
          <span>{comment?.time}</span>
          <span>{comment?.date} </span>
        </span>
        <span style={ comment?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => likeComment(commentPost?.id, comment?.id)}>
        <FaRegHeart style={ comment?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {comment?.likes?.value?.length}
        </span>
        <span>
          <Link to={`/post/${commentPost?.id}/comments/${comment?.id}`}>
            <FaRegComment /> {comment?.replies?.value?.length}
          </Link>
        </span>
      <span onClick={() => {
        setShowShareMenu(true)
        setSelectedMessage({
          post: commentPost, comment: comment, typeOf: 'comment', type: comment?.type
        })
        }} > <FaShareSquare /> {comment?.shares?.value?.length} </span>
      </div>
    </div>
  )

  // return (
  //   <div id={commentPost?.id} className="comment-bookmark-post">
  //     <div className="post-bookmark-upper">
  //       <Link to={`/${post.value.post.creator}`} className="post-bookmark-img-div">
  //         <img src={users.find(person => person.id === commentPost?.creator)?.avatarUrl} alt="" className="post-bookmark-img"/>
  //       </Link>

  //       <Link to={`/${post.value.post.creator}`} className="post-bookmark-username-displayname">
  //         <div>
  //           <p>
  //             @{users.find(person => person.id === commentPost?.creator)?.username}
  //           </p>
  //           <p>
  //             {users.find(person => person.id === commentPost?.creator)?.displayName}
  //           </p>
  //         </div>
  //         <p className="post-date"> {post.value.post.date} </p>
  //       </Link>
        
  //       <div className="post-bookmark-options" >
  //         {/* <div></div>
  //         <div></div>
  //         <div></div> */}
  //       </div>
  //     </div>

  //     <div className="post-bookmark-lower">
  //       <div className="cv-post-content-div">
  //         {commentPost?.type === 'Text' &&
  //           <Link to={`/post/${commentPost?.id}`}>
  //             <pre>
  //               {commentPost?.body?.length >= 300 && `${commentPost?.body.slice(0, 300)}...`} { commentPost?.body?. length >= 300 && <b> more </b>}
  //               {commentPost?.body?.length < 300 && commentPost?.body}
  //             </pre>
  //           </Link>
  //         }
    
  //         {commentPost?.type === 'Picture-Media' &&
  //           <Link to={`/post/${commentPost?.id}`} className="img-post-body-div">
  //             <pre>
  //               {commentPost?.caption}
  //             </pre>
  //             <img className='img-post-body' src={commentPost?.body} alt="" />
  //           </Link>
  //         }

  //         {commentPost?.type === 'Video-Media' &&
  //           <Link to={`/post/${commentPost?.id}`} className="img-post-body-div">
  //             <pre>
  //               {commentPost?.caption}
  //             </pre>
  //             <video controls className='img-post-body' src={commentPost?.body}></video>
  //           </Link>
  //         }
  //       </div>


  //       <div className="lower-sect">
  //         <span  className="post-time"> {post.value.post.time} </span>
  //         <span style={ post.value.post.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => handleLike(post.value.post.id)}>
  //           <FaRegHeart
  //             style={post.value.post.likes.value.find(like => like === userAuth) ? { color: 'red' } : null}
  //           /> {post.value.post.likes?.value?.length}
  //         </span>
  //         <span>
  //           <Link to={`/post/${post.value.post.id}`} >
  //             <FaRegComment /> {post.value.post.comments?.value?.length}
  //           </Link>
  //         </span>
  //         <span onClick={() => {
  //           setShowShareMenu(true)
  //           setSelectedMessage({
  //             postId: post.value.post.id, type: 'post'
  //           })
  //         }}
  //         >  <FaShareSquare /> {post.value.post.shares?.value?.length}
  //         </span>
  //       </div>      
        

  //       <div className="comment-bookmark-comment">

  //         {comment &&
  //           <div id={comment?.id}
  //             onLoad={() => {
  //             const height =
  //               document.querySelector(`[id='${commentPost?.id.toString()}'] .cv-post-content-div`).getBoundingClientRect().height +
  //               document.querySelector(`[id='${commentPost?.id.toString()}'] .lower-sect`).getBoundingClientRect().height + 30 +
  //               document.querySelector(`[id='${comment?.id.toString()}']`).getBoundingClientRect().height
              
  //             const div = document.querySelector(`[id='${commentPost?.id.toString()}'] .post-bookmark-lower`)
  //             div.style.height = `${height}px`
  //             }}
  //             onMouseEnter={() => {
  //             const height =
  //               document.querySelector(`[id='${commentPost?.id.toString()}'] .cv-post-content-div`).getBoundingClientRect().height +
  //               document.querySelector(`[id='${commentPost?.id.toString()}'] .lower-sect`).getBoundingClientRect().height + 30 +
  //               document.querySelector(`[id='${comment?.id.toString()}']`).getBoundingClientRect().height
              
  //             const div = document.querySelector(`[id='${commentPost?.id.toString()}'] .post-bookmark-lower`)
  //             div.style.height = `${height}px`
  //           }}
              
  //           >
  //             {commentCreator?.id === userAuth ?
  //               <Comment comment={comment} postId={commentPost?.id} comtId={commentId} showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={RepId} 
  //               setShowMore={setShowMore} showMore={showMore}
  //               func={[
  //                 { id: commentId.current, text: 'Remove bookmark', prop: 'remove-bookmark' },
  //                 { id: commentId.current, text: 'Delete comment', prop: 'delete-comment red' }
  //               ]}
  //               />
  //             :
  //               <Comment comment={comment} postId={commentPost?.id} comtId={commentId} showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={RepId} 
  //               setShowMore={setShowMore} showMore={showMore}
  //                 func={[
  //                   { id: commentId.current, text: 'Bookmark comment', prop: 'bookmark-comment' }
  //                 ]}
  //               />
  //             }
  //           </div>
  //         }


  //         {/* <div className="comment-bookmark-upper">
  //           <Link to={`/${post.value.comment.creator}`} className="comment-bookmark-img-div">
  //             <img src={users.find(person => person.id === comment?.creator)?.avatarUrl} alt="" className="comment-bookmark-img"/>
  //           </Link>

  //           <Link to={`/${post.value.comment.creator}`} className="post-bookmark-username-displayname">
  //             <p>
  //               @{users.find(person => person.id === comment?.creator)?.username}
  //             </p>
  //             <p>
  //               {users.find(person => person.id === comment?.creator)?.displayName}
  //             </p>
  //           </Link>
            
  //           <div className="post-bookmark-options">
  //             <div></div>
  //             <div></div>
  //             <div></div>
  //           </div>
  //         </div>

  //         <div className="comment-bookmark-lower">
  //           {comment?.type === 'Text-Comment' &&
  //             <pre>
  //               <Link to={`/post/${commentPost?.id}/comments/${comment?.id}`}>
  //                 {comment?.body}
  //               </Link>
  //             </pre>
  //           }
  //         </div> */}

  //         {/* <div className="lower-sect">
  //           <span className='show-comment-replies' onClick={ () => setShowReplies(!showReplies) } >
  //             { showReplies ? <FaAngleUp /> : <FaAngleDown /> }
  //           </span>
  
  //           <span style={ post.value.comment.likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => likeComment(commentPost.id, comment.id)}>
  //             <FaRegHeart /> {post.value.comment.likes?.value.length}
  //           </span>
  
  //           <span className='reply' onClick={e => {
  //             setShowReplyForm(true)
  //             setShowReplyReplyForm(false)
  //             setCommentId(e.currentTarget.parentElement.parentElement.id)
  //           } }>
  //             <FaReply id='reply-btn' className='reply'/> {post.value.comment.replies?.value.length}
  //           </span>
            
  //           <span onClick={e => {
  //           setShowShareMenu(true)
  //           const comment = document.querySelector('.comment')
  //             setSelectedMessage({
  //               postId: commentPost.id, commentId: comment.id, type: 'comment'
  //             })
  //           }}>
  //           <FaShareSquare /> {comment?.shares?.value.length}
  //           </span>
  //         </div> */}
  //       </div>

  //     </div>

  //   </div>
  // )
}

export default CommentBookmark