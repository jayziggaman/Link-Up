import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaImage, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { db, postsRef } from '../firebase/config'
import {v4 as uuidv4} from 'uuid';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LoadingMedia from './GENERAL-COMPONENTS/LoadingMedia';
import { functionsContext } from '../CONTEXTS/FunctionsContext';



const PostForm = () => {
  const {
  showPostForm, setShowPostForm, user, day, month, year, hours, mins, period, users, allPosts, postFormFor, setPostFormFor, PostFormIDs, setPostFormIDs, setProcessingPosts, processingPosts
  } = useContext(appContext)
  const { loadMedia, callError, generateLink, } = useContext(functionsContext)

  const { postId, commentId, replyId } = PostFormIDs

  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState([])
  const [files, setFiles] = useState([])
  const [index, setIndex] = useState(0)
  const [indexIncreasing, setIndexIncreasing] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(false)

  const time = new Date()


  useEffect(() => {
    if (!showPostForm) {
      setCaption("")
      setMedia([])
      setIndex(prev => prev - prev)
      setIndexIncreasing(false)
      setCurrentUrl("")
      setCurrentVideo(null)
      setCurrentVideoPlaying(false)
    }
  }, [showPostForm])



  function startPostProcessing (id) {
    let type = ''

    if (media.length === 0) {
      type = "Text"

    } else if (media.length === 1) {
      if (media[0].type === 'img') {
        type = "Picture-Media"

      } else if (media[0].type === 'video') {
        type = "Video-Media"

      }
    } else {
      type = "Group-Media"
    }

    setProcessingPosts([{ id, caption, media, type }, ...processingPosts])
  }



  useEffect(() => {
    if (media.length !== 0 && media[index]) {
      setCurrentUrl(media[index].url)
    }

  }, [media, index])


  useEffect(() => {
    if (currentUrl !== '' && media[index]) {
      if (media[index].type === "img") {
        setCurrentVideo(null)

      } else {
        const videos = document.querySelectorAll("video");
  
        videos.forEach(video => {
          video.pause();
    
          if (video.src === currentUrl) {
            const handlePlay = () => setCurrentVideoPlaying(true);
            const handlePause = () => setCurrentVideoPlaying(false);
    
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
    
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
    
            setCurrentVideo(video);
          }
        });
      }
    }


    return () => {
      const videos = document.querySelectorAll("video");
      videos.forEach(video => {
        video.removeEventListener('play', () => setCurrentVideoPlaying(true));
        video.removeEventListener('pause', () => setCurrentVideoPlaying(false));
      });
    };
  }, [currentUrl, media, index]);



  useEffect(() => {
    if (!showPostForm) {
      setPostFormFor("")
      setPostFormIDs({
        postId: "", commentId: "", replyId: ""
      })
    }
  }, [showPostForm])



  useEffect(() => {
    const div = document.querySelector('.multiple-media-div')
    const media = div?.querySelectorAll('.media')
    // media?.forEach((item, i) => {
    //   if (index === i) {
    //     item.classList.add('visible')
    //     item.classList.remove('hidden')
    //     item.setAttribute('muted', 'false')
    //   } else {
    //     item.classList.remove('visible')
    //     item.classList.add('hidden')
    //     item.setAttribute('muted', 'true')
    //   }
    // })
  }, [index])



  async function initializePost(e) {
    e.preventDefault()
    setShowPostForm(false)
      
    const id = uuidv4()
    startPostProcessing(id)

    const newMedia = media[0] ? await generateLink(files) : []

    if (media.length === 0) {
      if (caption === '') {
        return
      }
      uploadPost('Text', newMedia, id)

    } else if (media.length === 1) {
      if (media[0].type === 'img') {
        uploadPost('Picture-Media', newMedia, id)

      } else if (media[0].type === 'video') {
        uploadPost('Video-Media', newMedia, id)

      }
    } else {
      uploadPost('Group-Media', newMedia, id)
    }
  }


  const uploadPost = async (type, media, id) => {
    let ref 

    if (postFormFor === 'post') {
      ref = postsRef

    } else if (postFormFor === 'comment') {
      ref = collection(db, 'posts', postId, 'comments')

    } else if (postFormFor === 'reply' || postFormFor === 'reply-reply') {
      ref = collection(db, 'posts', postId, 'comments', commentId, 'replies')
    }

    setDoc(doc(ref, id), {
      id, type, caption, media,
      date: `${day}/${month}/${year}`,
      time: `${hours}:${mins} ${period}`, 
      creator: user.id,
      postId: postId ? postId : '',
      commentId: commentId ? commentId : '',
      replyId: replyId ? replyId : '',
      createdAt: serverTimestamp(),
      likes: { value: [] },
      shares: { value: [] },

    }).then(() => {
      callError(`${postFormFor === 'post' ? 'Post' : "Comment"} sent successfully!`)

      if (postFormFor === 'post') {
        postNotification(id)

      } else if (postFormFor === 'comment') {
        commentNotification(id)
  
      } else if (postFormFor === 'reply') {
        replyNotification(id)

      } else if (postFormFor === 'reply-reply') {
        replyReplyNotification(id)
      }

    }).catch(() => {
      callError("Your post wasn't sent. Please try again.")

    }).finally(() => {
      setProcessingPosts(
        processingPosts.filter(post => post.id !== id)
      )
    })
  }


  function postNotification(id) {
    const notiId = uuidv4()
    const words = caption.split(/['.', '/',' ', ':', ';', ',']/)

    users.map(user => {
      const condition = words.find(word => word === `@${user?.username}`)
      const conditionII = user.id !== user.id

      if (condition && conditionII) {
        const userRef = doc(db, 'users', user.id)

        updateDoc(userRef, {
          notifications: {
            value: [...user.notifications.value, {
              id: notiId,
              type: 'post-tag', 
              taggedBy: user.id,
              postId: id, 
              sentAt: time.getTime()
            }]
          }
        })
      }
    })
  }


  function commentNotification(id) {
    const post = allPosts.find(post => post.id === postId)
    const words = caption.split(/['.', '/',' ', ':', ';', ',']/)

    if (post) {
      users.map(user => {
      const condition = words.find(word => word === `@${user.username}`)
      const conditionII = user.id !== user.id

      if (condition && conditionII) {
        const userRef = doc(db, 'users', user.id)
        const notiId = uuidv4()

        updateDoc(userRef, {
          notifications: {
            value: [...user.notifications.value, {
              id: notiId,
              type: 'comment-tag', 
              taggedBy: user.id,
              commentId: id, 
              postId: post.id,
              sentAt: time.getTime()
            }]
          }
        })
      }
    })


    
    const condition = post.creator !== user.id
    if (condition) {
      const userRef = doc(db, 'users', post.creator)
      const creator = users.find(user => user.id === post.creator)
      const notiId = uuidv4()
      
      updateDoc(userRef, {
        notifications: {
          value: [...creator.notifications.value, {
            id: notiId,
            type: 'post-reply',
            commentId: id,
            postId: post.id,
            repliedBy: user.id,
            sentAt: time.getTime()
          }]
        }
      })
    }
    }
  }


  function replyNotification(id) {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    const words = caption.split(/['.', '/',' ', ':', ';', ',']/)

    if (post && comment) {
      users.map(user => {
        const condition = words.find(word => word === `@${user?.username}`)
        const conditionII = user.id !== user.id
  
        if (condition && conditionII) {
          const userRef = doc(db, 'users', user.id)
          const notiId = uuidv4()
  
          updateDoc(userRef, {
            notifications: {
              value: [...user.notifications.value, {
                id: notiId,
                type: 'reply-tag', 
                taggedBy: user.id,
                replyId: id, 
                postId: post.id,
                commentId: comment.id,
                sentAt: time.getTime()
              }]
            }
          })
        }
      })
  
     
     
      
      const condition = comment.creator !== user.id
      if (condition) {
        const notiId = uuidv4()
        const creator = users.find(user => user.id === comment.creator)
        const userRef = doc(db, 'users', creator.id)
  
        updateDoc(userRef, {
          notifications: {
            value: [...creator.notifications.value, {
              id: notiId,
              type: 'comment-reply',
              commentId: comment.id,
              postId: post.id,
              repliedBy: user.id,
              sentAt: time.getTime()
            }]
          }
        })
      }
    }
  }


  function replyReplyNotification(id) {
    const words = caption.split(/['.', '/',' ', ':', ';', ',']/)
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)


    if (post && comment) {
      users.map(user => {
        const condition = words.find(word => word === `@${user?.username}` )
        const conditionII = user.id !== user.id
        if (condition && conditionII) {
          const userRef = doc(db, 'users', user.id)
          const notiId = uuidv4()
  
          updateDoc(userRef, {
            notifications: {
              value: [...user.notifications.value, {
                id: notiId,
                type: 'reply-tag', 
                taggedBy: user.id,
                replyId: id, 
                postId: post.id,
                commentId: comment.id,
                sentAt: time.getTime()
              }]
            }
          })
        }
      })
      
      const condition = comment.creator !== user.id
      if (condition) {
        const notiId = uuidv4()
        const creator = users.find(user => user.id === comment.creator)
        const userRef = doc(db, 'users', creator.id)
        
        updateDoc(userRef, {
          notifications: {
            value: [...creator.notifications.value, {
              id: notiId,
              type: 'reply-reply',
              replyId: id,
              commentId: comment.id,
              postId: post.id,
              repliedBy: user.id,
              sentAt: time.getTime()
            }]
          }
        })
      }
    }
  }


  function deleteMedia(e) {
    e.preventDefault()

    const mediaUrl = media.find((_, ind) => ind === index).url

    if (media.length === 1) {
      setMedia([])

    } else {
      setMedia(
        media.filter(media => media.url !== mediaUrl)
      )

      if (index === (media.length - 1)) {
        setIndex(index => index - 1)

      } else {
        setIndex(index => index + 1)
      }
    }
  }


  const playPauseVideo = (e) => {
    e.preventDefault()

    if (currentVideo.paused) {
      currentVideo.play(); 

    } else {
      currentVideo.pause(); 
    }
  }



  return (
    <div
      className={showPostForm ? "post-form-overlay active" : "post-form-overlay"}
    >
      <form action="submit" className='new-post-form'>
        <div className='new-post-btn-div'>
          <label htmlFor='new-post-img' >
            <span><FaImage /></span>

            <input autoComplete='off' type="file" id='new-post-img'
              name='new-post-img' onClick={e => e.target.value = null}
              onChange={e => {
                loadMedia(e.target.files, setMedia)
                setFiles(e.target.files)
              }} multiple='multiple'
            />
          </label>
          
          <button type='submit' onClick={e => initializePost(e)}>
            Post
          </button>
        </div>

        <div className="textarea-div">
          <textarea autoComplete='off' className='media-post-cap'
            type="text" placeholder='Type a caption...'
            style={{ display: `${media[0] ? 'block' : 'none'}` }}
            value={caption} onChange={e => setCaption(e.target.value)}>
          </textarea>

          {media.length > 0 &&
            <div className="multiple-media-div">
              <button className='delete-media-btn'
                onClick={e => deleteMedia(e)}
              >
                <DeleteOutlineOutlinedIcon />
              </button>

              {media.length > 1 &&
                <>
                  <div className="post-number">
                    {index + 1}/{media.length}
                  </div>
                  
                  <div className="scroll-posts">
                    <button onClick={e => {
                      e.preventDefault()
                      setIndexIncreasing(false)
                      index !== 0 && setIndex(prev => prev - 1)
                    }}>
                      <FaAngleLeft />
                    </button>

                    <button onClick={e => {
                      e.preventDefault()
                      setIndexIncreasing(true)
                      index !== media.length - 1 && setIndex(prev => prev + 1)
                    }}>
                      <FaAngleRight />
                    </button>
                  </div>
                </>
              }

              {media.map((media, ind) => {
                const { url, type } = media
                
                return (
                  <LoadingMedia
                    key={url} url={url} type={type} index={index} ind={ind}
                    media={media} indexIncreasing={indexIncreasing}
                    imgClass="new-img-post" videoClass="new-vid-post"
                  />
                )
              })}

              {currentVideo &&
                <button className="play-pause-btn"
                  onClick={(e) => playPauseVideo(e)}
                >
                  {!currentVideoPlaying ?
                    <PlayArrowIcon />
                    :
                    <PauseIcon />
                  }
                </button>
              }

            </div>
          }

          <textarea autoComplete='off' autoFocus value={caption}
            style={{ display: `${media[0] ? 'none' : 'block'}` }}
            placeholder="What's happening?" id='new-post-text'
            onChange={e => setCaption(e.target.value)}>
          </textarea> 
        </div>

        <div onClick={() => setShowPostForm(false)} className='form-cancel-btn-div'>
          <span className='form-cancel-btn'>
            Cancel
          </span>
        </div>
      </form>
    </div>
  )
}

export default PostForm




