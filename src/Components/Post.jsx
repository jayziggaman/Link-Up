import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaRegHeart, FaRegComment, FaShareSquare, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appContext } from '../App'
import Options from './Options'
import OtherOption from './OtherOption'
import verifiedBadge from '../Images/verified-badge.jpg'

const Post = ({ post, func, postId }) => {
  const {
    handleLike, allPosts, users, userAuth, showOptionsDIv, setShowOptionsDiv, setShowShareMenu, setSelectedMessage, showOtherOptionsDIv, setShowOtherOptionsDiv
  } = useContext(appContext)
  const { userId } = useParams()
  const { id, body, time, date, likes, comments, creator, caption, type, shares } = post

  const [user, setUser] = useState(users.find(p => p.id === creator))
  const [index, setIndex] = useState(0)
  const [cond, setCond] = useState(false)
  const [trigger, setTrigger] = useState(false)
  const groupRef = useRef()
  const btnRef = useRef()
  const navigate = useNavigate()

  var topDomains = /(\.com | \.de | \.org | \.net | \.us | \.co | \.edu | \.gov | \.biz | \.za | \.info | \.cc | \.ca | \.cn | \.fr | \.ch | \.au | \.in | \.jp | \.be | \.it | \.nl | \.uk | \.mx | \.no | \.ru | \.br | \.se | \.es | \.at | \.dk | \.eu | \.il)$/gim;
  

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


  // useEffect(() => {
  //   const callOn = () => {
  //     if (btnRef.current) {
  //       btnRef.current.style.visibility = 'visible'
  //     }
  //   }

  //   const callOff = () => {
  //     if (btnRef.current) {
  //       btnRef.current.style.visibility = 'hidden'
  //     }
  //   }

  //   groupRef.current?.addEventListener('mouseover', function () {
  //     callOn()
  //     setTrigger(!trigger)
  //   })

  //   groupRef.current?.addEventListener('mouseleave', function () {
  //     setTimeout(() => {
  //       callOff()
  //       setTrigger(!trigger)
  //     }, 2000);
  //   })
  //   // return () => groupRef.current
  // }, [trigger])


  const linkTo = (e, link) => {
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'BUTTON') {
      e.preventDefault()
      navigate(`/post/${link}`)
    }
  }

  // console.log(creator)

  if (!user) {
    return (
      <div className="deleted-comment">
        This post was made by a deleted account
      </div>
    )
  } else {
    return (
      <div id={id} className="post" onClick={e => {
        if (postId !== undefined) {
          postId.current = e.currentTarget.id
        }
      }}>
        {allPosts && 
          <>
            {creator === userAuth ?
              <>
                <Options func={func} creator={creator} /> 
                <div className="upper-sect">
                  <Link to={userId !== creator ? creator : ''}>
                    <div className="upper-sect-img-div">
                      <img src={user?.avatarUrl} alt="" />
                    </div>
    
                    <div className="post-username-div">
                      <p className="post-display-name">
                        {user?.displayName}  {user?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                      </p>
                      <p className="post-username"> @{user?.username} </p>
                    </div>
                  </Link>
        
                  <div className='upper-sect-options' onClick={() => {
                    setShowOptionsDiv(!showOptionsDIv)
                  }}>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                  </div>
                </div>
    
                <div className="middle-sect">
                  {type === 'Text' &&
                    <pre className='preRef'>
                      {isLinkElement(body) ?
                      
                        <a className='out-link' href={body.includes('http://') || body.includes('https://') ? `${body}` : `http://${body}`} target='_blank'>
                          {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                          {body?.length < 300 && body}
                        </a>
                        :
                        <Link to={`/post/${id}`} className='in-link'>
                          {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                          {body?.length < 300 && body}
                        </Link>
                      }
                    </pre>
                  }

                  {type === 'Picture-Media' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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

                  {type === 'Video-Media' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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
                
                  {type === 'Group-Media' &&
                    <div ref={groupRef} className="img-post-body-div">

                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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
                  <span className="post-time">
                    <span>{time}</span>
                    <span>{date} </span>
                  </span>
                  <span style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => handleLike(id)}>
                  <FaRegHeart style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {likes?.value?.length}
                  </span>
                  <span>
                    <Link to={`/post/${id}`} >
                      <FaRegComment /> {comments?.value?.length}
                    </Link>
                  </span>
                <span onClick={() => {
                  setShowShareMenu(true)
                  setSelectedMessage({
                    post: post, typeOf: 'post', type: post.type
                  })
                  }} > <FaShareSquare /> {shares?.value?.length} </span>
                </div>
              </>
    
              :
    
              <>
                <OtherOption func={func} creator={creator}/> 
                <div className="upper-sect">
                  <Link to={userId !== creator ? creator : ''}>
                    <div className="upper-sect-img-div">
                      <img src={user?.avatarUrl} alt="" />
                    </div>
    
                    <div className="post-username-div">
                      <p className="post-display-name">
                        {user?.displayName}  {user?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                      </p>
                      <p className="post-username"> @{user?.username} </p>
                    </div>
                  </Link>
        
                  <div className='upper-sect-options' onClick={() => {
                    setShowOtherOptionsDiv(!showOtherOptionsDIv)
                  }}>
                    <p>.</p>
                    <p>.</p>
                    <p>.</p>
                  </div>
                </div>
    
                <div className="middle-sect">
                  {type === 'Text' &&
                    <pre className='preRef'>
                      {isLinkElement(body) ?
                      
                        <a className='out-link' href={body.includes('http://') || body.includes('https://') ? `${body}` : `http://${body}`} target='_blank'>
                          {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                          {body?.length < 300 && body}
                        </a>
                        :
                        <Link to={`/post/${id}`} className='in-link'>
                          {body?.length >= 300 && `${body.slice(0, 300)}...`} { body?.length >= 300 && <b> more </b>}
                          {body?.length < 300 && body}
                        </Link>
                      }
                    </pre>
                  }

                  {type === 'Picture-Media' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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

                  {type === 'Video-Media' &&
                    <div className="img-post-body-div">
                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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
                
                  {type === 'Group-Media' &&
                    <div ref={groupRef} className="img-post-body-div">

                      <pre className='preRef'>
                        {isLinkElement(caption) ?
                        
                          <a className='out-link' href={caption.includes('http://') || caption.includes('https://') ? `${caption}` : `http://${caption}`} target='_blank'>
                            {caption?.length >= 300 && `${caption.slice(0, 300)}...`} { caption?.length >= 300 && <b> more </b>}
                            {caption?.length < 300 && caption}
                          </a>
                          :
                          <Link to={`/post/${id}`} className='in-link'>
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
                  <span className="post-time">
                    <span>{time}</span>
                    <span>{date} </span>
                  </span>
                  <span style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null } onClick={() => handleLike(id)}>
                  <FaRegHeart style={ likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {likes?.value?.length}
                  </span>
                  <span>
                    <Link to={`/post/${id}`} >
                      <FaRegComment /> {comments?.value?.length}
                    </Link>
                  </span>
                <span onClick={() => {
                  setShowShareMenu(true)
                  setSelectedMessage({
                    post: post, typeOf: 'post', type: post.type
                  })
                  }} > <FaShareSquare /> {shares?.value?.length} </span>
                </div>
              </>
            }
          </>
          }
      </div>
    )
  }
}

export default Post