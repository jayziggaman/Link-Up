import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import {v4 as uuidv4} from 'uuid';
import { FaImage, FaPaperPlane, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import loadVideoLight from '../Images/load-video-light.mp4'
import loadVideoDark from '../Images/load-video-dark.mp4'
import { collection, doc, onSnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, postsRef, storage } from '../firebase/config'

const ReplyForm = () => {
  const {
    showReplyForm, setShowReplyForm, userAuth, processingType, setProcessing, day, month, year, hours, mins, period, user, gError, setGlobalError, users, allPosts, replyFormPostId, replyFormCommentId, darkMode
  } = useContext(appContext)
  const [newTextReply, setNewTextReply] = useState('')
  const [replyMediaCaption, setReplyMediaCaption] = useState('')
  const [replyMediaProcessing, setReplyMediaProcessing] = useState(false)
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const [index, setIndex] = useState(0)
  const [replyIsOnePic, setReplyIsOnePic] = useState(false)
  const [replyIsOneVid, setReplyIsOneVid] = useState(false)
  const picReply = useRef(null)
  const vidReply = useRef(null)

  const time = new Date()


  useEffect(() => {
    if (!showReplyForm) {
      setFiles([])
      setFileLength(prev => prev - prev)
      setReplyIsOnePic(false)
      setReplyIsOneVid(false)
    }
  }, [showReplyForm])

  useEffect(() => {
    const div = document.querySelector('.multiple-media-div')
    const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
    if (fileLength === 1) {
      if (photoTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setReplyMediaProcessing(true)
        setReplyIsOnePic(true)
        setReplyIsOneVid(false)
  
        const avatarRef = ref(storage, `pending-img-reply${time.getTime()}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            picReply.current = url
          }).then(() => {
            document.querySelector('.new-img-reply').src = picReply.current
            setReplyMediaProcessing(false)
          })
        })
      } else if (vidTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setReplyMediaProcessing(true)
        setReplyIsOnePic(false)
        setReplyIsOneVid(true)
  
        const avatarRef = ref(storage, `pending-vid-reply${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            vidReply.current = url
          }).then(() => {
            document.querySelector('.new-vid-reply').src = vidReply.current
            setReplyMediaProcessing(false)
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
              vid.setAttribute('autoplay', 'autoplay')
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
              gError?.classList.add('show-error')
              // setGlobalError(`Your post wasn't sent. Try Again.`)
              setTimeout(() => {
                gError?.classList.remove('show-error')
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
        item.setAttribute('muted', 'false')
      } else {
        item.classList.remove('visible')
        item.classList.add('hidden')
        item.setAttribute('muted', 'true')
      }
    })
  }, [index])

  const replyComment = (postId, commentId, reply) => {
    processingType.current = 'Reply sent'
    setShowReplyForm(false)
    const replyRef = collection(db, 'posts', postId, 'comments', commentId, 'replies')

    try {
      if (files[0] === undefined) {
        if (newTextReply !== '') {
          const id = uuidv4()
          setDoc(doc(replyRef, id), {
            id: id,
            type: 'Text-Reply' ,
            body: reply,
            createdAt: Timestamp.now(),
            date: `${day}/${month}/${year}`,
            time: `${hours}:${mins} ${period}`, 
            creator: userAuth,
            replies: {value: []},
            likes: {value: []},
            shares: {value: []},
            beenChecked: false
          }).then(docRef => {
            const notiId = uuidv4()
            const words = newTextReply.split(/['.', '/',' ', ':', ';', ',']/)
            users.map(user => {
              const condition = words.find(word => word === `@${user?.username}` )
              if (condition) {
                const userRef = doc(db, 'users', user.id)
                updateDoc(userRef, {
                  notifications: {
                    value: [...user.notifications.value, {
                      id: notiId,
                      type: 'reply-tag', 
                      taggedBy: userAuth,
                      value: id, 
                      postId: postId,
                      commentId: commentId,
                      sentAt: time.getTime()
                    }]
                  }
                })
              }
            })
            setNewTextReply('')
          }).then(() => {
            const notiId = uuidv4()
            const post = allPosts.find(post => post.id === postId)
            const comment = post.comments.value.find(comment => comment.id === commentId)
            const creator = users.find(user => user.id === comment.creator)
            const userRef = doc(db, 'users', creator.id)
            updateDoc(userRef, {
              notifications: {
                value: [...creator.notifications.value, {
                  id: notiId,
                  type: 'comment-reply',
                  value: commentId,
                  postId: postId,
                  repliedBy: userAuth,
                  sentAt: time.getTime()
                }]
              }
            })
          }).catch(() => {
            gError.current?.classList.add('show-error')
            setGlobalError(`Your reply wasn't sent. Try Again.`)
            setTimeout(() => {
              gError.current?.classList.remove('show-error')
            }, 3000 )
          }) 
        } else {
          gError.current.classList.add('show-error')
          setGlobalError(' Can not send an empty reply ')
          setTimeout(() => {
            gError.current.classList.remove('show-error')
          }, 3000 )
        }

      }
      else if (fileLength === 1) {
        if (replyIsOnePic) {
          let mediaUrl
          const types = ['image/png', 'image/jpeg', 'image/jpg']
          if (types.includes(files[0].type)) {
            const selected = files[0]

            const avatarRef = ref(storage, `photo-reply${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                const id = uuidv4()
                setDoc(doc(replyRef,id), {
                  id: id,
                  type: 'Photo-Reply',
                  caption: replyMediaCaption,
                  body: mediaUrl,
                  createdAt: Timestamp.now(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  likes: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = replyMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}` )
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'reply-tag', 
                            taggedBy: userAuth,
                            value: id, 
                            postId: postId,
                            commentId: commentId,
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                  setFiles([])
                  setReplyMediaCaption('')
                  setShowReplyForm(false)
                  setFileLength(prev => prev - prev)
                }).then(() => {
                  const notiId = uuidv4()
                  const post = allPosts.find(post => post.id === postId)
                  const comment = post.comments.value.find(comment => comment.id === commentId)
                  const creator = users.find(user => user.id === comment.creator)
                  const userRef = doc(db, 'users', creator.id)
                  updateDoc(userRef, {
                    notifications: {
                      value: [...creator.notifications.value, {
                        id: notiId,
                        type: 'comment-reply',
                        value: commentId,
                        postId: postId,
                        repliedBy: userAuth,
                        sentAt: time.getTime()
                      }]
                    }
                  })
                })
              })
            })
          }
        } else if (replyIsOneVid) {
          let mediaUrl
          const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
          if (types.includes(files[0].type)) {
            const selected = files[0]

            const avatarRef = ref(storage, `video-reply${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                const id = uuidv4()
                setDoc(doc(replyRef, id), {
                  id: id,
                  type: 'Video-Reply',
                  caption: replyMediaCaption,
                  body: mediaUrl,
                  createdAt: Timestamp.now(),
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  likes: {value: []},
                  replies: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = replyMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}` )
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'reply-tag', 
                            taggedBy: userAuth,
                            value: id, 
                            postId: postId,
                            commentId: commentId,
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                  setReplyMediaCaption('')
                  setShowReplyForm(false)
                  setFiles([])
                  setFileLength(prev => prev - prev)
                }).then(() => {
                  const notiId = uuidv4()
                  const post = allPosts.find(post => post.id === postId)
                  const comment = post.comments.value.find(comment => comment.id === commentId)
                  const creator = users.find(user => user.id === comment.creator)
                  const userRef = doc(db, 'users', creator.id)
                  updateDoc(userRef, {
                    notifications: {
                      value: [...creator.notifications.value, {
                        id: notiId,
                        type: 'comment-reply',
                        value: commentId,
                        postId: postId,
                        repliedBy: userAuth,
                        sentAt: time.getTime()
                      }]
                    }
                  })
                })
              })
            })
          }
        }
      } else {
        setReplyIsOnePic(false)
        setReplyIsOneVid(false)

        const postsArr = []
        const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']

        for (let i = 0; i < fileLength; i++) {
          let mediaUrl
          const selected = files[i]
          const avatarRef = ref(storage, `img/vid-replies${files[i].name}/${files[i].name}`)
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
                setDoc(doc(replyRef, id), {
                  id: id,
                  type: 'Group-Reply',
                  body: postsArr,
                  caption: replyMediaCaption,
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  createdAt: Timestamp.now() ,
                  caption: replyMediaCaption,
                  likes: {value: []},
                  replies: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = replyMediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}` )
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'reply-tag', 
                            taggedBy: userAuth,
                            value: id, 
                            postId: postId,
                            commentId: commentId,
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                  setFileLength(prev => prev - prev)
                  setFiles([])
                  setReplyMediaCaption('')
                  setShowReplyForm(false)
                }).then(() => {
                  const notiId = uuidv4()
                  const post = allPosts.find(post => post.id === postId)
                  const comment = post.comments.value.find(comment => comment.id === commentId)
                  const creator = users.find(user => user.id === comment.creator)
                  const userRef = doc(db, 'users', creator.id)
                  updateDoc(userRef, {
                    notifications: {
                      value: [...creator.notifications.value, {
                        id: notiId,
                        type: 'comment-reply',
                        value: commentId,
                        postId: postId,
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
    } catch (err) {
      console.log(err.message)
    } finally {
      const docRefIII = doc(db, 'posts', postId, 'comments', commentId)
      const repliesRef = collection(postsRef, postId, 'comments', commentId, 'replies')
      onSnapshot(repliesRef, snap => {
        let arr = []
        snap.docs.forEach(doc => {
          arr.push({ ...doc.data(), id: doc.id })
        })
        updateDoc(docRefIII, {
          replies: {
            value: [...arr]
          }
        }).then(() => {

          const commentRef = collection(postsRef, postId, 'comments')
          const docRefIV = doc(db, 'posts', postId)
          onSnapshot(commentRef, snap => {
            const commentsArr = []
            snap.docs.forEach(doc => {
              commentsArr.push({...doc.data(), id: doc.id})
            })
            updateDoc(docRefIV, {
              comments: {
                value: [...commentsArr]
              }
            })
          })
        })
      })
      setFileLength(prev => prev - prev)
      setFiles([])
      setProcessing(true)
    }
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      replyComment(replyFormPostId.current, replyFormCommentId.current, newTextReply)
      setNewTextReply('')
    } } action="submit"
      className={showReplyForm ? 'show new-post-form' : 'new-post-form'}
    >
      <div className='new-post-btn-div'>
        <label htmlFor='new-post-img' >
          <span><FaImage /></span>
          <input autoComplete='off' type="file" id='new-post-img' name='new-post-img'
            onClick={e => e.target.value = null} multiple='multiple'
            onChange={e => {
              setFileLength( prev => (prev - prev) + e.target.files.length)
              setFiles(e.target.files)
            }}
          />
        </label>
        <button type='submit'>
          <FaPaperPlane />
        </button>
      </div>

      <div className="textarea-div">
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

        <textarea autoComplete='off' maxLength='500' className='media-post-cap' type="text" placeholder='Type a caption...' style={{ display: `${files[0] ? 'block' : 'none'}` }} value={replyMediaCaption} onChange={e => setReplyMediaCaption(e.target.value)}></textarea>

        <div style={{ display: `${files[0] && replyMediaProcessing ? 'block' : 'none'}` }} className="post-media-processing-overlay">
          {files[0] && replyMediaProcessing &&
            <>
              {darkMode ?
                <video style={{ display: `${files[0] && replyMediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoDark}>
                </video>
                :
                <video style={{ display: `${files[0] && replyMediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoLight}>
                </video>
              }
            </>
          }
        </div>

        {fileLength > 1 && <div className="multiple-media-div"></div>}
        
        <img style={{ display: `${replyIsOnePic ? 'block' : 'none'}` }} className='new-img-reply' src={picReply.current} />

        <video autoPlay className='new-vid-reply' src={vidReply.current} style={{ display: `${replyIsOneVid ? 'block' : 'none'}` }}></video>
        
        <textarea autoComplete='off' className='reply-textarea' value={newTextReply}
          onChange={e => setNewTextReply(e.target.value)} cols="30" rows="10" style={{display: `${files[0] ? 'none' : 'block'}` }}
        ></textarea> 
      </div>

      <div onClick={() => setShowReplyForm(false)} className='form-cancel-btn-div'>
        <span className='form-cancel-btn'>
          Cancel
        </span>
      </div>
    </form>
  )
}

export default ReplyForm