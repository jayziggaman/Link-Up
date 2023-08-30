import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { appContext } from '../App'
import {v4 as uuidv4} from 'uuid';
import { FaRegHeart, FaRegComment, FaShareSquare, FaPaperPlane, FaImage, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import Comment from '../Components/Comment'
import ReplyForm from '../Components/ReplyForm'
import ReplyReplyForm from '../Components/ReplyReplyForm'
import Options from '../Components/Options'
import Header from '../Components/Header'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import LoadPosts from '../Components/LoadPosts'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import loadVideoLight from '../Images/load-video-light.mp4'
import verifiedBadge from '../Images/verified-badge.jpg'
import OtherCommentOptions from '../Components/OtherCommentOptions';
import CommentOptions from '../Components/CommentOptions';

const PostView = () => {
  const {
  allPosts, handleLike, newComment, setNewComment, users, userAuth, showReplyForm, commentId, user, showOptionsDIv, setShowOptionsDiv, setShowShareMenu, showShareMenu, day, month, year, hours, mins, period, processingType, processing, setProcessing, windowWidth, gError, setGlobalError, setSelectedMessage, 
  } = useContext(appContext)
  const { postId } = useParams()
  const [post, setPost] = useState() 
  const [postCreator, setPostCreator] = useState()
  const comtId = useRef('')
  const RepId = useRef('')
  const time = new Date()
  const [loading, setLoading] = useState(true)
  const loadArr = [1, 2, 3, 4, 5]
  const [mediaProcessing, SetMediaProcessing] = useState(false)
  const [commentIndex, setCommentIndex] = useState(0)
  const [newTextComment, setNewTextComment] = useState('')
  const [commentMediaCaption, setCommentMediaCaption] = useState('')
  const [commentMediaProcessing, setCommentMediaProcessing] = useState(false)
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const [index, setIndex] = useState(0)
  const [commentIsOnePic, setCommentIsOnePic] = useState(false)
  const [commentIsOneVid, setCommentIsOneVid] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const picComment = useRef(null)
  const vidComment = useRef(null)
  const [trigger, setTrigger] = useState(false)
  const groupRef = useRef()
  const btnRef = useRef()

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
    setPost(allPosts?.find(post => post.id == postId))
  }, [allPosts])

  useEffect(() => {
    setPostCreator(users.find(person => person.id === post?.creator))
    if (post) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [post])

  useEffect(() => {
    if (!showShareMenu) {
      setSelectedMessage({})
    }
  }, [showShareMenu])

  useEffect(() => {
    const div = document.querySelector('.multiple-media-div')
    const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
    if (fileLength === 1) {
      if (photoTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setCommentMediaProcessing(true)
        setCommentIsOnePic(true)
        setCommentIsOneVid(false)
  
        const avatarRef = ref(storage, `pending-img-comments${time.getTime()}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            picComment.current = url
          }).then(() => {
            document.querySelector('.new-img-comment').src = picComment.current
            setCommentMediaProcessing(false)
          })
        })
      } else if (vidTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setCommentMediaProcessing(true)
        setCommentIsOnePic(false)
        setCommentIsOneVid(true)
  
        const avatarRef = ref(storage, `pending-vid-comments${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            vidComment.current = url
          }).then(() => {
            document.querySelector('.new-vid-comment').src = vidComment.current
            setCommentMediaProcessing(false)
          })
        })
      } else {
        setFiles([])
        setFileLength(prev => prev - prev)
        gError?.classList.add('show-error')
        // setGlobalError(`Your post wasn't sent. Try Again.`)
        setTimeout(() => {
          gError?.classList.remove('show-error')
        }, 3000 )
      }
    } else if (fileLength > 1) {
      const postsArr = []
      
      const run = () => {
        if (postsArr.length === fileLength) {
          postsArr.map((item, i) => {
            let currState = index === i ? 'visible' : 'hidden'
            if (item.type === 'img') {
              const img = document.createElement('img')
              img.setAttribute('class', `new-img-post ${currState} media`)
              img.setAttribute('src', item.url)
              div.appendChild(img)
            } else {
              const vid = document.createElement('video')
              vid.setAttribute('class', `new-vid-post ${currState} media`)
              vid.setAttribute('src', item.url)
              vid.setAttribute('autoplay', true)
              div.appendChild(vid)
            }
          })
        }
      }

      for (let i = 0; i < fileLength; i++) {
        let mediaUrl
        const selected = files[i]
        const avatarRef = ref(storage, `pending-posts${files[i].name}/${files[i].name}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            mediaUrl = url
          }).then(() => {
            if (vidTypes.includes(files[i].type)) {
              postsArr.push({
                type: 'video',
                url: mediaUrl
              })
            } else if (photoTypes.includes(files[i].type)) {
              postsArr.push({
                type: 'img',
                url: mediaUrl
              })
            } else {
              setFiles([])
              setFileLength(prev => prev - prev)
              gError.current?.classList.add('show-error')
              setGlobalError(`Your comment wasn't sent. Try Again.`)
              setTimeout(() => {
                gError.current?.classList.remove('show-error')
              }, 3000 )
            }
          }).then(() => run())
        })
      }
    }
  }, [files])

  useEffect(() => {
    const div = document.querySelector('.multiple-media-div')
    const media = div?.querySelectorAll('.media')
    media?.forEach((item, i) => {
      if (index === i) {
        item.classList.add('visible')
        item.classList.remove('hidden')
        item.setAttribute('muted', false)
      } else {
        item.classList.remove('visible')
        item.classList.add('hidden')
        item.setAttribute('muted', true)
      }
    })
  }, [index])

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main.querySelectorAll('video')
      allVideos.forEach(video => video.pause())
    }
  }, [])
  

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      // const post = allPosts?.find(post => post.id === postId)
      if (post === undefined) {
        setNotFound(true)
        setLoading(false)
      } else {
        setNotFound(false)
      }
    }, 2000);

    clearTimeout(timeout)
  }, [post])


  // useEffect(() => {
  //   if (!loading) {
  //     const main = document.querySelector('main')
  //     const div = document.querySelector('.group-media-div')
  //     const videos = div.querySelectorAll('video')

  //     videos.forEach(video => {
  //       const cond = video.classList.contains('curr-media')
  //       if (!cond) {
  //         video.pause()
  //       }
  //     })

  //     main.addEventListener('click', e => {
  //       console.log(e.currentTarget)
  //       console.log(e.target)
  //     })

  //     const allVideos = main.querySelectorAll('video')
  //     allVideos.forEach(video => video.pause())
      
  //     allVideos.forEach(video => {
  //       video.addEventListener('click', (e) => {
  //         console.log(allVideos)
  //         allVideos.forEach(video => video.pause())
  //         e.currentTarget.play()
  //       })
  //     })
  //   }
  // }, [commentIndex, loading])

  // useEffect(() => {
  //   const div = document.querySelector('.multiple-media-div')
  //   const media = div?.querySelectorAll('.media')
  //   media?.forEach((item, i) => {
  //     if (index === i) {
  //       item.classList.add('curr-media')
  //       item.classList.remove('prev-media')
  //       item.classList.remove('next-media')
  //       item.setAttribute('muted', 'false')

  //     } else if ((index + 1) === i) {
  //       item.classList.remove('curr-media')
  //       item.classList.remove('prev-media')
  //       item.classList.add('next-media')
  //       item.setAttribute('muted', 'true')

  //     } else if ((index - 1) === i) {
  //       item.classList.remove('curr-media')
  //       item.classList.add('prev-media')
  //       item.classList.remove('next-media')
  //       item.setAttribute('muted', 'true')

  //     } else {
  //       item.classList.remove('curr-media')
  //       item.classList.remove('prev-media')
  //       item.classList.remove('next-media')
  //       item.setAttribute('muted', 'true')
  //     }
  //   })
  // }, [index])

  const addComment = async (id, comment) => {
    processingType.current = 'Comment sent'
    const docRef = doc(db, 'posts', id)
    const commentRef = collection(db, 'posts', id, 'comments')
    // const commentQuery = query(commentRef, orderBy('createdAt', 'desc'))

    try {
      if (files[0] === undefined) {
        if (newTextComment !== '') {
          const id = uuidv4()
          setDoc(doc(commentRef, id), {
            id: id,
            type: 'Text-Comment' ,
            body: comment,
            date: `${day}/${month}/${year}`,
            time: `${hours}:${mins} ${period}`, 
            creator: userAuth,
            createdAt: serverTimestamp(),
            likes: {value: []},
            replies: {value: []},
            shares: {value: []},
            beenChecked: false
          }).then(docRef => {
            const notiId = uuidv4()
            const words = comment.split(/['.', '/',' ', ':', ';', ',']/)
            users.map(user => {
              const condition = words.find(word => word === `@${user?.username}` )
              if (condition) {
                const userRef = doc(db, 'users', user.id)
                updateDoc(userRef, {
                  notifications: {
                    value: [...user.notifications.value, {
                      id: notiId,
                      type: 'comment-tag', 
                      taggedBy: userAuth,
                      value: id, 
                      postId: postId,
                      sentAt: time.getTime()
                    }]
                  }
                })
              }
            })
            setProcessing(true)
            setNewTextComment('')
          }).then(() => {
            const notiId = uuidv4()
            const userRef = doc(db, 'users', post.creator)
            const creator = users.find(user => user.id === post.creator)
            updateDoc(userRef, {
              notifications: {
                value: [...creator.notifications.value, {
                  id: notiId,
                  type: 'post-reply',
                  value: post.id,
                  repliedBy: userAuth,
                  sentAt: time.getTime()
                }]
              }
            })
          }).catch((err) => {
            console.log(err.message)
            gError.current?.classList.add('show-error')
            setGlobalError(`Your comment wasn't sent. Try Again.`)
            setTimeout(() => {
              gError.current?.classList.remove('show-error')
            }, 3000 )
          }) 
        } else {
          gError.current?.classList.add('show-error')
          setGlobalError(' Can not send an empty comment ')
          setTimeout(() => {
            gError.current?.classList.remove('show-error')
          }, 3000 )
        }

      } else if (fileLength === 1) {
        if (commentIsOnePic) {
          const selected = files[0]
          let photoUrl
          const avatarRef = ref(storage, `photo-comments${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              photoUrl = url
            }).then(() => {
              const id = uuidv4()
              setDoc(doc(commentRef, id), {
                id: id,
                type: 'Photo-Comment',
                caption: commentMediaCaption,
                body: photoUrl,
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`,
                creator: userAuth,
                createdAt: serverTimestamp(),
                likes: { value: [] },
                replies: { value: [] },
                shares: {value: []},
                beenChecked: false
              }).then(docRef => {
                const notiId = uuidv4()
                const words = commentMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                users.map(user => {
                  const condition = words.find(word => word === `@${user?.username}` )
                  if (condition) {
                    const userRef = doc(db, 'users', user.id)
                    updateDoc(userRef, {
                      notifications: {
                        value: [...user.notifications.value, {
                          id: notiId,
                          type: 'comment-tag', 
                          taggedBy: userAuth,
                          value: id, 
                          postId: postId,
                          sentAt: time.getTime()
                        }]
                      }
                    })
                  }
                })
                setProcessing(true)
                setNewTextComment('')
                setFiles([])
                setFileLength(prev => prev - prev)
                setCommentMediaCaption('')
              }).then(() => {
                const notiId = uuidv4()
                const userRef = doc(db, 'users', post.creator)
                const creator = users.find(user => user.id === post.creator)
                updateDoc(userRef, {
                  notifications: {
                    value: [...creator.notifications.value, {
                      id: notiId,
                      type: 'post-reply',
                      value: post.id,
                      repliedBy: userAuth,
                      sentAt: time.getTime()
                    }]
                  }
                })
              })
            })
          })
        } else if (commentIsOneVid) {
          const id = uuidv4()
          const selected = files[0]
          let vidUrl
          const avatarRef = ref(storage, `media-comments${userAuth}/${time.getTime().toString()}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              vidUrl = url
            }).then(() => {
              setDoc(doc(commentRef, id), {
                id: id,
                type: 'Video-Comment',
                caption: commentMediaCaption,
                body: vidUrl,
                date: `${day}/${month}/${year}`,
                time: `${hours}:${mins} ${period}`, 
                creator: userAuth,
                createdAt: serverTimestamp(),
                likes: {value: []},
                replies: {value: []},
                shares: {value: []},
                beenChecked: false
              })
            }).then(docRef => {
              const notiId = uuidv4()
              const words = commentMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
              users.map(user => {
                const condition = words.find(word => word === `@${user?.username}` )
                if (condition) {
                  const userRef = doc(db, 'users', user.id)
                  updateDoc(userRef, {
                    notifications: {
                      value: [...user.notifications.value, {
                        id: notiId,
                        type: 'comment-tag', 
                        taggedBy: userAuth,
                        value: id, 
                        postId: postId,
                        sentAt: time.getTime()
                      }]
                    }
                  })
                }
              })
              setProcessing(true)
              setFiles([])
              setFileLength(prev => prev - prev)
              setCommentMediaCaption('')
            }).then(() => {
              const notiId = uuidv4()
              const userRef = doc(db, 'users', post.creator)
              const creator = users.find(user => user.id === post.creator)
              updateDoc(userRef, {
                notifications: {
                  value: [...creator.notifications.value, {
                    id: notiId,
                    type: 'post-reply',
                    value: post.id,
                    repliedBy: userAuth,
                    sentAt: time.getTime()
                  }]
                }
              })
            })
          })
        }
      } else {
        const postsArr = []
        const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']

        for (let i = 0; i < fileLength; i++) {
          let mediaUrl
          const selected = files[i]
          const avatarRef = ref(storage, `img/vid-posts${files[i].name}/${files[i].name}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              mediaUrl = url
            }).then(() => {
              if (types.includes(files[i].type)) {
                postsArr.push({
                  type: 'video',
                  url: mediaUrl
                })
              } else {
                postsArr.push({
                  type: 'img',
                  url: mediaUrl
                })
              }
            }).then(() => {
              if (postsArr.length === fileLength) {
                const id = uuidv4()
                setDoc(doc(commentRef, id), {
                  id: id,
                  type: 'Group-Comment',
                  caption: commentMediaCaption,
                  body: postsArr,
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  createdAt: serverTimestamp(),
                  likes: {value: []},
                  replies: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = commentMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}` )
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'comment-tag', 
                            taggedBy: userAuth,
                            value: id, 
                            postId: postId,
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                  setProcessing(true)
                  setFileLength(prev => prev - prev)
                  setFiles([])
                  setCommentMediaCaption('')
                }).then(() => {
                  const notiId = uuidv4()
                  const userRef = doc(db, 'users', post.creator)
                  const creator = users.find(user => user.id === post.creator)
                  updateDoc(userRef, {
                    notifications: {
                      value: [...creator.notifications.value, {
                        type: 'post-reply',
                        id: notiId,
                        value: post.id,
                        repliedBy: userAuth,
                        sentAt: time.getTime()
                      }]
                    }
                  })
                })
              }
            })
          })
        }
      }

    } catch(err) {
      console.log(err.message)
    } finally {
      onSnapshot(commentRef, snap => {
        let tempComments = []
        snap.docs.forEach(doc => {
          tempComments.push({ ...doc.data() })
        })
        updateDoc(docRef, {
          comments: {
            value: tempComments
          }
        })
      })
    }
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
      <main style={showReplyForm ? { paddingBottom: '55vh' } : { paddingBottom: '3rem' }} className="post-view-main" onClick={e => {
        if (showShareMenu) { 
          setShowShareMenu(false)
        }
      }} >
  
        {post?.creator === userAuth ?
          <Options func={[
            { id: postId , text: 'Bookmark post', prop: 'bookmark-post' },
            { id: postId, text: 'Delete post', prop: 'delete-post red pv' }
            ]}
          />
          : 
          <Options func={[
            { id: postId , text: 'Bookmark post', prop: 'bookmark-post' }
            ]}
          />
        }
        <Header />
        <Nav />
  
        <section className="post-view-content">
  
          <div className="upper-sect">
            <Link to={post?.creator}>
              <div className="upper-sect-img-div">
                <img src={postCreator?.avatarUrl} alt="" />
              </div>
  
              <div className="post-username-div">
                <p className="post-display-name">
                  {postCreator?.displayName}  {postCreator?.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                </p>
                <p className="post-username"> @{postCreator?.username} </p>
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
            {post?.type === 'Text' &&
              <pre>
                {isLinkElement(post?.body) ?
                  
                  <a className='out-link' href={post?.body.includes('http://') || post?.body.includes('https://') ? `${post?.body}` : `http://${post?.body}`} target='_blank'>
                    {post?.body}
                  </a>
                  :
                  <>
                    {post?.body}
                  </>
                }
              </pre>
            }
  
            {post?.type === 'Picture-Media' &&
              <div className="img-post-body-div">
                <pre>
                  {isLinkElement(post?.caption) ?
                    
                    <a className='out-link' href={post?.caption.includes('http://') || post?.caption.includes('https://') ? `${post?.caption}` : `http://${post?.caption}`} target='_blank'>
                      {post?.caption}
                    </a>
                    :
                    <>
                      {post?.caption}
                    </>
                  }
                </pre>
                <img className='img-post-body' src={post?.body} alt="" />
              </div>
            }
  
            {post?.type === 'Video-Media' &&
              <div className="img-post-body-div">
                <pre>
                  {isLinkElement(post?.caption) ?
                    
                    <a className='out-link' href={post?.caption.includes('http://') || post?.caption.includes('https://') ? `${post?.caption}` : `http://${post?.caption}`} target='_blank'>
                      {post?.caption}
                    </a>
                    :
                    <>
                      {post?.caption}
                    </>
                  }
                </pre>
                <video controls className='img-post-body' src={post?.body}></video>
                {/* <div role={'button'} onClick={() => setPlayVideo(!playVideo)}>
                  <div>
                    {playVideo ? <FaPause /> : <FaPlay />}
                  </div>  
                </div> */}
              </div>
            }

            {post?.type === 'Group-Media' &&
              <div ref={groupRef} className="img-post-body-div">
                <pre>
                  {isLinkElement(post?.caption) ?
                    
                    <a className='out-link' href={post?.caption.includes('http://') || post?.caption.includes('https://') ? `${post?.caption}` : `http://${post?.caption}`} target='_blank'>
                      {post?.caption}
                    </a>
                    :
                    <>
                      {post?.caption}
                    </>
                  }
                </pre>

                <div className='group-media-div'>
                  <div className="post-number">
                    {commentIndex + 1}/{post?.body.length}
                  </div>
                  <div ref={btnRef} className="scroll-posts postt">
                    <button className='index-btn' style={{opacity: commentIndex === 0 && '0'}}
                      onClick={() => {
                      commentIndex !== 0 && setCommentIndex(prev => prev - 1)
                    }}>
                      <FaAngleLeft />
                    </button>

                    <button className='index-btn' style={{opacity: commentIndex === post?.body.length - 1 && '0'}}
                      onClick={() => {
                      commentIndex !== post?.body.length - 1 && setCommentIndex(prev => prev + 1)
                    }}>
                      <FaAngleRight />
                    </button>
                  </div>

                  {post?.body.map((item, i) => {
                    return (
                      <div key={i}>
                        {item.type === 'img' ?
                          <>
                            {commentIndex === i &&
                              <img key={i} src={item.url} alt=""
                                className='img-post-body group-media curr-media'
                              />
                            }

                            {(commentIndex + 1) === i &&
                              <img key={i} src={item.url} alt=""
                                className='img-post-body group-media next-media'
                              />
                            }

                            {(commentIndex - 1) === i &&
                              <img key={i} src={item.url} alt=""
                                className='img-post-body group-media prev-media'
                              />
                            }

                            {commentIndex !== i && (commentIndex + 1) !== i && (commentIndex - 1) !== i &&
                              <img key={i} src={item.url} alt=""
                                className='img-post-body group-media'
                              />
                            }
                          </>
                          :
                          item.type === 'video' &&
                          <>
                            {commentIndex === i &&
                              <video key={i} src={item.url} alt="" controls
                                className='vid-post-body group-media curr-media'
                              ></video>
                            }

                            {(commentIndex + 1) === i &&
                              <video key={i} src={item.url} alt="" controls
                                className='vid-post-body group-media next-media'
                              ></video>
                            }

                            {(commentIndex - 1) === i &&
                              <video key={i} src={item.url} alt="" controls
                                className='vid-post-body group-media prev-media'
                              ></video>
                            }

                            {commentIndex !== i && (commentIndex + 1) !== i && (commentIndex - 1) !== i &&
                              <video key={i} src={item.url} alt="" controls
                                className='vid-post-body group-media'
                              ></video>
                            }
                          </>
                        }
                      </div>
                    )
                  })}

                  {post?.body.map((item, i) => {
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
            <span  className="post-time"> {post?.time} </span>
            <span onClick={() => handleLike(postId)}
              style={ post?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }
            >
              <FaRegHeart style={ post?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {post?.likes.value.length}
            </span>
            <span> <FaRegComment /> {post?.comments.value.length} </span>
            <span onClick={() => {
              setShowShareMenu(true)
              setSelectedMessage({
                post: post, typeOf: 'post', type: post.type
              })
            }}> <FaShareSquare /> {post?.shares.value.length} </span>
          </div>
        </section>
  
        <section className="comment-section">
          <form action="submit" onSubmit={e => {
            e.preventDefault()
            addComment(postId, newTextComment)
          }}  >
            <div className='media-icon-div'>
              <label htmlFor='comment-media' >
                <span>
                  <FaImage />
                </span>
                {userAuth &&
                  <input autoComplete='off' type="file" id='comment-media' name='comment-media' multiple='multiple'
                  onClick={e => {
                    e.target.value = null
                    setCommentIsOnePic(false)
                    setCommentIsOneVid(false)
                  }}
                  onChange={e => {
                    setFiles(e.target.files)
                    setFileLength( prev => (prev - prev) + e.target.files.length)
                  }}
                />
                }
              </label>
            </div>
  
            <div className="comment-input-div">
              <textarea autoComplete='off' type="text" placeholder='Leave a Comment' value={newTextComment} onChange={ e => setNewTextComment( e.target.value ) } ></textarea>
            </div>
  
            <button  disabled={!userAuth && true} style={{opacity: !userAuth && 0.5}}>
              <FaPaperPlane />
            </button>
          </form>
  
          <div style={{ display: `${files[0] ? 'block' : 'none'}` }} className="media-comment">
            {fileLength > 0 &&
            <div className="post-number">
              {index + 1}/{fileLength}
            </div>
            }

            {fileLength > 1 &&
              <div className="scroll-posts">
                <button onClick={e => {
                  e.preventDefault()
                  index !== 0 && setIndex(prev => prev - 1)
                }}>
                  <FaAngleLeft />
                </button>

                <button onClick={e => {
                  e.preventDefault()
                  index !== fileLength - 1 && setIndex(prev => prev + 1)
                }}>
                  <FaAngleRight />
                </button>
              </div>
            }
            <textarea autoComplete='off' value={commentMediaCaption} maxLength='500' onChange={e => setCommentMediaCaption(e.target.value)} name="media-comment-caption" id="media-comment-caption" cols="30" rows="10" placeholder='Your Caption'></textarea>

            <div style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} className="comment-media-processing-overlay">
              <video className="comment-media-processing-video" autoPlay muted loop src={loadVideoLight}></video>
            </div>

            {fileLength > 1 && <div className="multiple-media-div"></div>}

            <img className='new-img-comment' style={commentIsOnePic ? { display: 'block' } : { display: 'none' }} src={picComment.current} alt="" />
            
            <video autoPlay className='new-vid-comment' style={commentIsOneVid ? {display: 'block'} : {display: 'none'}} src={vidComment.current}></video>
          </div>
  
          <div className="comments">
            {post?.comments.value.map((comment, index) => {
              const { creator } = comment
              if (creator === userAuth) {
                return (
                  <div key={index} className='post-div'>
                    {index !== 0 && <hr />}
                    <Comment key={comment.id} comment={comment} postId={postId}
                      comtId={comtId} RepId={RepId} comments={post?.comments.value}
                      func={[
                        { id: comtId.current, text: 'Bookmark comment', prop: 'bookmark-comment' },
                        { id: comtId.current, text: 'Delete comment', prop: 'delete-comment red' }
                      ]}
                    />
                  </div>
                ) 
              } else {
                return (
                  <div key={index} className='post-div'>
                    {index !== 0 && <hr />}
                    <Comment key={comment.id} comment={comment} postId={postId}
                      comtId={comtId} RepId={RepId} comments={post?.comments.value}
                      func={[
                        { id: comtId.current, text: 'Bookmark comment', prop: 'bookmark-comment' }
                      ]}
                    />
                  </div>
                ) 
              }
            })}
          </div>
        </section>
  
        <ReplyForm />
        <ReplyReplyForm postId={postId} commentId={commentId} />
        <Footer />
      </main>
    )
  }
}

export default PostView

// else if (notFound) {
//   return (
//     <div className="deleted-comment">
//       Post was not found. Please refresh.
//     </div>
//   )
// }
