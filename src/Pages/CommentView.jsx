import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { appContext } from '../App'
import { FaRegHeart, FaRegComment, FaShareSquare, FaPaperPlane, FaImage, FaAngleLeft, FaAngleRight, FaReply } from 'react-icons/fa'
import verifiedBadge from '../Images/verified-badge.jpg'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import CommentOptions from '../Components/CommentOptions'
import Post from '../Components/Post'
import CommentReply from '../Components/CommentReply'
import Footer from '../Components/Footer'
import LoadPosts from '../Components/LoadPosts'

const CommentView = () => {
  const {allPosts, users, user, userAuth, likeComment, setSelectedMessage, setShowShareMenu, setShowReplyForm, setShowReplyReplyForm, setCommentId, replyFormPostId, replyFormCommentId, windowWidt, showShareMenu} = useContext(appContext)

  const {postId, commentId} = useParams()
  const [post, setPost] = useState()
  const [comment, setComment] = useState()
  const [commentCreator, setCommentCreator] = useState()
  const [replies, setReplies] = useState()
  const [showComOptionsDIv, setShowComOptionsDiv] = useState(false)
  const [showRepOptionsDIv, setShowRepOptionsDiv] = useState(false)
  const [loading, setLoading] = useState(true)
  const loadArr = [1, 2, 3, 4, 5]
  const postRef = useRef()
  const commentRef = useRef()
  const [index, setIndex] = useState(0)
  const location = useLocation()
  const groupRef = useRef()
  const btnRef = useRef()
  const comtId = useRef()
  const RepId = useRef()

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main.querySelectorAll('video')
      allVideos.forEach(video => video.pause())
    }
  }, [])

  useEffect(() => {
    if(window.innerWidth < 950) {
      // commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // const top = commentRef.current.offsetTop - 200
      // commentRef.current.scrollTo(0, 300 + 'px')
      // console.log(top)
      // window.scrollTo(0, `${top}px`) 
      // console.log(postRef.current?.getBoundingClientRect().height)
    } else {
      commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [])

  useEffect(() => {
    setPost(allPosts.find(post => post.id === postId))
  }, [location.pathname, allPosts])

  useEffect(() => {
    setComment(post?.comments.value.find(comment => comment.id === commentId))
  }, [post])

  useEffect(() => {
    setCommentCreator(users.find(user => user.id === comment?.creator))
    setReplies(comment?.replies.value)
  }, [comment, users])

  useEffect(() => {
    if (replies) {
      setLoading(false)
    }
  }, [replies])

  useEffect(() => { 
    const post = document.querySelector('.post')
    const height = post?.getBoundingClientRect().height + 40
    window.scrollTo(0, height)
  }, [post])

  
  useEffect(() => {
    
    // let totalHeight
      
    // windowWidth > 800 ?
    // totalHeight = postSect?.getBoundingClientRect().height + commentSect?.getBoundingClientRect().height + height + 100 + (10 * repliesDiv?.length)
    // : 
    // totalHeight = postSect?.getBoundingClientRect().height + commentSect?.getBoundingClientRect().height + height + 100 + (10 * repliesDiv?.length)
      
     

    if (!loading) {
      if (comment) {
        const main = document.querySelector('.comment-view-main')
        const postSect = document.querySelector('.cv-post-section')
        const commentSect = document.querySelector('.cv-comment-section')
        const repliesSect = document.querySelector('.cv-replies-section')
        const repliesDiv = repliesSect?.querySelectorAll('.comment-reply')
        let height = 0
        
        let totalHeight = postSect?.getBoundingClientRect().height + commentSect?.getBoundingClientRect().height + height + 100 + (10 * repliesDiv?.length)


        main.style.height = `${totalHeight}px`
        repliesDiv?.forEach(reply => {
          height += reply.getBoundingClientRect().height
        })
      }  
      
    }
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
      <main className="comment-view-main" onClick={() => {
        if (showShareMenu) { 
          setShowShareMenu(false)
        }
      }}>
        <Header />
        <Nav />
        {commentCreator?.id === userAuth ?
          <CommentOptions showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv}
            postId={postId} style='comment' func={[
            { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' },
            { id: commentId, text: 'Delete comment', prop: 'delete-comment red cv' }
          ]} /> :
  
          <CommentOptions showComOptionsDIv={showComOptionsDIv} setShowComOptionsDiv={setShowComOptionsDiv}
            postId={postId} style='comment' func={[
            { id: commentId, text: 'Bookmark comment', prop: 'bookmark-comment' }
        ]}/>
        }
  
        <section ref={postRef} className="cv-post-section">
          {post &&
            <>
              {post?.creator === userAuth ?
                <Post post={post}
                  func={[
                    { id: postId, text: 'Bookmark post', prop: 'bookmark-post' },
                    { id: postId, text: 'Delete post', prop: 'delete-post red pv' }
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
  
        <section ref={commentRef} className="cv-comment-section">
          <div className="upper-sect">
            <Link to={comment?.creator}>
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
              setShowComOptionsDiv(!showComOptionsDIv)
            }}>
              <p>.</p>
              <p>.</p>
              <p>.</p>
            </div>
          </div>
  
  
          <div className="middle-sect">
            {comment?.type === 'Text-Comment' &&
              <pre>
                {isLinkElement(comment?.body) ?
                  
                  <a className='out-link' href={comment?.body.includes('http://') || comment?.body.includes('https://') ? `${comment?.body}` : `http://${comment?.body}`} target='_blank'>
                    {comment?.body}
                  </a>
                  :
                  <>
                    {comment?.body}
                  </>
                }
              </pre>
            }
  
            {comment?.type === 'Photo-Comment' &&
              <div className="img-post-body-div">
                <pre className='preRef'>
                  {isLinkElement(comment?.caption) ?
                  
                    <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                      {comment?.caption}
                    </a>
                    :
                    <>
                      {comment?.caption}
                    </>
                  }
                </pre>
                <>
                  <img className='img-post-body' src={comment?.body} alt="" />
                </>
              </div>
            }
  
            {comment?.type === 'Video-Comment' &&
              <div className="img-post-body-div">
                <pre className='preRef'>
                  {isLinkElement(comment?.caption) ?
                  
                    <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                      {comment?.caption}
                    </a>
                    :
                    <>
                      {comment?.caption}
                    </>
                  }
                </pre>
                <>
                  <video controls className='img-post-body' src={comment?.body}></video>
                </>
                
                {/* <div role={'button'} onClick={() => setPlayVideo(!playVideo)}>
                  <div>
                    {playVideo ? <FaPause /> : <FaPlay />}
                  </div>  
                </div> */}
              </div>
            }
  
            {comment?.type === 'Group-Comment' &&
              <div ref={groupRef} className="img-post-body-div">
                <pre>
                  {isLinkElement(comment?.caption) ?
                    
                    <a className='out-link' href={comment?.caption.includes('http://') || comment?.caption.includes('https://') ? `${comment?.caption}` : `http://${comment?.caption}`} target='_blank'>
                      {comment?.caption}
                    </a>
                    :
                    <>
                      {comment?.caption}
                    </>
                  }
                </pre>
  
                <div className='group-media-div'>
                  <div className="post-number">
                    {index + 1}/{comment?.body.length}
                  </div>
                  <div ref={btnRef} className="scroll-posts postt">
                    <button className='index-btn' style={{opacity: index === 0 && '0'}}
                      onClick={() => {
                        index !== 0 && setIndex(prev => prev - 1)
                      }}
                    >
                      <FaAngleLeft />
                    </button>
  
                    <button className='index-btn' style={{opacity: index === comment?.body.length - 1 && '0'}}
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
                                className='pv-vid-post-body group-media curr-media'
                              ></video>
                            }
  
                            {(index + 1) === i &&
                              <video key={i} src={item.url} alt="" controls
                                className='pv-vid-post-body group-media next-media'
                              ></video>
                            }
  
                            {(index - 1) === i &&
                              <video key={i} src={item.url} alt="" controls
                                className='pv-vid-post-body group-media prev-media'
                              ></video>
                            }
  
                            {index !== i && (index + 1) !== i && (index - 1) !== i &&
                              <video key={i} src={item.url} alt="" controls
                                className='pv-vid-post-body group-media'
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
                      className="pv-vid-post-body sample"
                      ></video>
                  })}
                </div>
              </div>
            }
          </div>
  
  
          <div className="lower-sect">
            <span className="post-time">
              <span>{comment?.time}</span>
              <span> {comment?.date} </span>
            </span>
            <span onClick={() => likeComment(postId, commentId)}
              style={ comment?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }
            >
              <FaRegHeart style={ comment?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {comment?.likes.value.length}
            </span>
            <span onClick={e => {
              setShowReplyForm(true)
              setShowReplyReplyForm(false)
              setCommentId(e.currentTarget.parentElement.parentElement.id)
              replyFormPostId.current = post?.id 
              replyFormCommentId.current = comment?.id
            }}>
              <FaReply /> {comment?.replies?.value.length}
            </span>
            <span onClick={() => {
              setShowShareMenu(true)
              setSelectedMessage({
                post: post, comment: comment, typeOf: 'comment', type: comment?.type
              })
  
            }}> <FaShareSquare /> {comment?.shares.value.length} </span>
          </div>
        </section>
        <hr />
  
        <section className="cv-replies-section">
          {replies?.map((reply, ind) => {
            const { creator } = reply
            if (creator === userAuth) {
              return (
                <div key={ind} className='post-div'>
                  {ind !== 0 && <hr />}
                  <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={commentId}
                    showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv} RepId={RepId}
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
                  <CommentReply key={reply.id} reply={reply} postId={postId} CommentId={commentId}
                    showRepOptionsDIv={showRepOptionsDIv} setShowRepOptionsDiv={setShowRepOptionsDiv}
                    RepId={RepId} func={[
                      { id: RepId.current, text: 'Bookmark reply', prop: 'bookmark-reply' }
                    ]}
                  />
                </div>
              ) 
            }
          })}
        </section>
  
  
        <Footer />
      </main>
    )
  }

 
}

export default CommentView