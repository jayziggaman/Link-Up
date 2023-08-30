import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { appContext } from '../App'
import { FaRegHeart, FaRegComment, FaShareSquare, FaPaperPlane, FaImage, FaAngleLeft, FaAngleRight, FaReply } from 'react-icons/fa'
import verifiedBadge from '../Images/verified-badge.jpg'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import Post from '../Components/Post'
import Comment from '../Components/Comment'
import ReplyOptions from '../Components/ReplyOptions'
import LoadPosts from '../Components/LoadPosts'

const CommentReplyView = () => {
  const { allPosts, users, user, userAuth,  likeComment, setSelectedMessage, setShowReplyForm, setShowReplyReplyForm, setReplyId, setCommentId, likeCommentReply, setShowShareMenu, showShareMenu} = useContext(appContext)
  
  const {postId, commentId, replyId} = useParams()
  const [post, setPost] = useState()
  const [comment, setComment] = useState()
  const [reply, setReply] = useState()
  const [replyCreator, setReplyCreator] = useState()
  const [showMore, setShowMore] = useState(false)
  const [showComOptionsDIv, setShowComOptionsDiv] = useState(false)
  const [showRepOptionsDIv, setShowRepOptionsDiv] = useState(false)
  const [loading, setLoading] = useState(true)
  const loadArr = [1, 2, 3, 4, 5]
  const RepId = useRef('')
  const [index, setIndex] = useState(0)
  const location = useLocation()
  const groupRef = useRef()
  const btnRef = useRef()

  useEffect(() => {
    setPost(allPosts.find(post => post.id === postId))
  }, [location.pathname, allPosts])

  useEffect(() => {
    setComment(post?.comments.value.find(comment => comment.id === commentId))
  }, [location.pathname, post])

  useEffect(() => {
    setReply(comment?.replies.value.find(comment => comment.id === replyId))
  }, [location.pathname, comment])

  useEffect(() => {
    setReplyCreator(users.find(user => user.id === reply?.creator))
    if (reply) {
      setLoading(false)
    }
  }, [reply, users])

  useEffect(() => { 
    if (post && comment) {
      const post = document.querySelector('.post')
      const comment = document.querySelector('.comment')
      const height = post?.getBoundingClientRect().height + 50 + comment?.getBoundingClientRect().height
      window.scrollTo(0, height)
    }
  }, [post, comment])

  const commentNode = document.querySelector(`[id='${commentId}']`)
  const replyDiv = commentNode?.querySelector('.comment-reply-div')
  useEffect(() => {
    if (showMore) {
      const replies = replyDiv?.querySelectorAll('.comment-reply')
      let totalHeight = 0
      replies?.forEach(reply => {
        totalHeight += reply.getBoundingClientRect().height + 10
        console.log(reply.id, reply.getBoundingClientRect().height)
      })
      const height = totalHeight 

      if (commentNode) {
        // comment.style.height = `${comment?.getBoundingClientRect().height + height}px`
        // console.log(height, 'height')
        commentNode.style.marginBottom = `${height + 20}px`
      }
    } else {
      if (commentNode) {
        commentNode.style.marginBottom = `${20}px`
      }
    }
    // console.log(showMore)
  })

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

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main.querySelectorAll('video')
      allVideos.forEach(video => video.pause())
    }
  }, [])





  if (loading) {
    return (
      <main className="post-view-main post-view-main-loading">
      <Header />
      <Nav />
        <div className="pv-post-loading">
          <div className="pvp-upper-sect">
            <div className="pvp-img-loading"></div>
            <div className="pvp-username-name-loading"></div>
          </div>
          <div className="pvp-middle-sect">
            <div></div>
            <div></div>
          </div>
          <div className="pvp-lower-sect">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {
          loadArr.map((item, index) => <LoadPosts key={index} />)
        }
      </main>
    )
  } else {
    return (
      <main className="comment-reply-view-main comment-view-main" onClick={() => {
        if (showShareMenu) { 
          setShowShareMenu(false)
        }
      }}>
        <Header />
        <Nav />
  
        {replyCreator?.id === userAuth ?
          <ReplyOptions showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} postId={postId} CommentId={comment?.id}
          func={[
            { id: replyId, text: 'Bookmark reply', prop: 'bookmark-reply' },
            { id: replyId, text: 'Delete reply', prop: 'delete-reply red rv' }
          ]}
          />
          :
          <ReplyOptions showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} postId={postId} CommentId={comment?.id}
          func={[
            { id: replyId, text: 'Bookmark reply', prop: 'bookmark-reply' }
          ]}
          />
        }
  
  
        <section className="crv-post-section">
          {post &&
            <>
              {post?.creator === userAuth ?
                <Post post={post}
                  func={[
                    { id: postId, text: 'Bookmark post', prop: 'bookmark-post' },
                    { id: postId, text: 'Delete post', prop: 'delete-post red' }
                  ]}
                /> :
                <Post post={post}
                  func={[
                    { id: postId, text: 'Bookmark post', prop: 'bookmark-post' }
                  ]}
                />
              }
            </>
          }
        </section>
        <hr />
  
        <section className="crv-comment-section">
          {comment && 
            <>
              {comment?.creator === userAuth ?
                <Comment comment={comment} postId={postId}
                showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={RepId} setShowMore={setShowMore} showMore={showMore}
                  func={[
                    { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' },
                    { id: commentId, text: 'Delete comment', prop: 'delete-comment red' }
                  ]}
                /> :
                <Comment comment={comment} postId={postId}
                  showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={RepId} setShowMore={setShowMore} showMore={showMore}
                    func={[
                      { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' }
                    ]}
                  />
              }
            </>
          }
        </section>
        <hr />
  
        <section className="crv-comment-reply">
          <div className="upper-sect">
            <Link to={reply?.creator}>
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
          setShowRepOptionsDiv(!showRepOptionsDIv)
        }}>
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </div>
          </div>
  
          <div className="middle-sect">
            {reply?.type === 'Text-Reply' &&
              <pre>
                {isLinkElement(reply?.body) ?
                    
                  <a className='out-link' href={reply?.body.includes('http://') || reply?.body.includes('https://') ? `${reply?.body}` : `http://${reply?.body}`} target='_blank'>
                    {reply?.body}
                  </a>
                  :
                  <>
                    {reply?.body}
                  </>
                }
              </pre>
            }
  
            {reply?.type === 'Photo-Reply' &&
              <div className="img-post-body-div">
                <pre>
                  {isLinkElement(reply?.caption) ?
                    
                    <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                      {reply?.caption}
                    </a>
                    :
                    <>
                      {reply?.caption}
                    </>
                  }
                </pre>
                <img className='img-post-body' src={reply?.body} alt="" />
              </div>
            }
  
            {reply?.type === 'Video-Reply' &&
              <div className="vid-post-body-div">
                <pre>
                  {isLinkElement(reply?.caption) ?
                    
                    <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                      {reply?.caption}
                    </a>
                    :
                    <>
                      {reply?.caption}
                    </>
                  }
                </pre>
                <video controls className='img-post-body' src={reply?.body}></video>
                {/* <div role={'button'} onClick={() => setPlayVideo(!playVideo)}>
                  <div>
                    {playVideo ? <FaPause /> : <FaPlay />}
                  </div>  
                </div> */}
              </div>
            }
  
            {reply?.type === 'Group-Reply' &&
              <div ref={groupRef} className="img-post-body-div">
  
                <pre className='preRef'>
                  {isLinkElement(reply?.caption) ?
                  
                    <a className='out-link' href={reply?.caption.includes('http://') || reply?.caption.includes('https://') ? `${reply?.caption}` : `http://${reply?.caption}`} target='_blank'>
                      {reply?.caption}
                    </a>
                    :
                    <>
                      {reply?.caption}
                    </>
                  }
                </pre>
  
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
            }
          </div>
  
          <div className="lower-sect">
            <span className="post-time">
              <span>{reply?.time}</span>
              <span>{reply?.date} </span>
            </span>
            <span onClick={() => likeCommentReply(postId, commentId, replyId)}
              style={ reply?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }
            >
              <FaRegHeart style={ reply?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {reply?.likes.value.length}
            </span>
  
            <span onClick={() => {
              setShowReplyReplyForm(true)
              setShowReplyForm(false)
              setReplyId(reply.id)
              setCommentId(commentId)
            }}>
              <FaReply />
            </span>
  
            <span onClick={() => {
              setShowShareMenu(true)
              setSelectedMessage({
                post: post, comment: comment, reply: reply, typeOf: 'reply', type: reply.type
              })
            }}> <FaShareSquare /> {reply?.shares.value.length} </span>
          </div>
        </section>
      </main>
    )
  }

  
}

export default CommentReplyView


{/* <main className="comment-view-main">
<Header />
<Nav />
{commentCreator?.id === userAuth ?
  <CommentOptions showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} postId={postId} style='comment' func={[
    { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' },
    { id: commentId, text: 'Delete comment', prop: 'delete-comment red' }
  ]} /> :

  <CommentOptions showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv} postId={postId} style='comment' func={[
    { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' }
]}/>
} */}


{/* <section ref={postRef} className="cv-post-section">
  {post &&
    <>
      {post?.creator === userAuth ?
        <Post post={post} postId={postId}
          func={[
            { id: postId, text: 'Bookmark post', prop: 'bookmark-post' },
            { id: postId, text: 'Delete post', prop: 'delete-post red' }
          ]}
        /> :
        <Post post={post} postId={postId}
          func={[
            { id: postId, text: 'Bookmark post', prop: 'bookmark-post' }
          ]}
        />
  }
    </>
  }
</section>

<section ref={commentRef} className="cv-comment-section">
  


 


//   
// </section>

// <section className="cv-replies-section">
//   {comment?.replies.value.map(reply => {
//         const { creator } = reply
//         if (creator === userAuth) {
//           return (
//             <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={commentId}
//              showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={reply.id}
//               func={[
//                 { id: reply.id, text: 'Bookmark reply', prop: 'bookmark-reply' },
//                 { id: reply.id, text: 'Delete reply', prop: 'delete-reply red' }
//               ]}
//             />
//           ) 
//         } else {
//           return (
//             <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={commentId}
//             showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={reply.id}
//               func={[
//                 { id: reply.id, text: 'Bookmark reply', prop: 'bookmark-reply' }
//               ]}
//             />
//           ) 
//         }
//       })}
// </section>


// </main>
// ) */}