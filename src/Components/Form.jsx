import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaPaperPlane, FaImage, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import loadVideoDark from '../Images/load-video-dark.mp4'
import loadVideoLight from '../Images/load-video-light.mp4'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, postsRef, storage } from '../firebase/config'
import {v4 as uuidv4} from 'uuid';
import { addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'

const Form = () => {
  const {
  showForm, setNewMediaPost, setNewTextPost, newMediaPost, newTextPost, mediaCaption, setMediaCaption, isPic, isVid, setShowForm, setIsPic, setIsVid, userAuth, day, month, year, hours, mins, period, gError, taggedPosts, setTaggedPosts, users, setGlobalError, darkMode, processingType, processing, setProcessing
  } = useContext(appContext)
  const [files, setFiles] = useState([])
  const [fileLength, setFileLength] = useState(0)
  const picPost = useRef()
  const vidPost = useRef()
  const [index, setIndex] = useState(0)
  const [isOnePic, setIsOnePic] = useState(false)
  const [isOneVid, setIsOneVid] = useState(false)
  const [mediaProcessing, setMediaProcessing] = useState(false)
  const time = new Date()
  const newFormRef = useRef()

  // useEffect(() => {
  //   setProcessing(true)
  // }, [])
  // console.log(processing)

  useEffect(() => {
    const textArea = document.getElementById('new-post-text')
    if (!showForm) {
      setFiles([])
      setFileLength(prev => prev - prev)
      setIsOnePic(false)
      setIsOneVid(false)
    } else {
      textArea.focus()
    }
  }, [showForm])
  
  useEffect(() => {
    const div = document.querySelector('.multiple-media-div')
    const photoTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const vidTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
    if (fileLength === 1) {
      if (photoTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setMediaProcessing(true)
        setIsOnePic(true)
        setIsOneVid(false)
  
        const avatarRef = ref(storage, `pending-img-posts${time.getTime()}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            picPost.current = url
          }).then(() => {
            document.querySelector('.new-img-post').src = picPost.current
            setMediaProcessing(false)
          })
        })
      } else if (vidTypes.includes(files[0]?.type)) {
        const selected = files[0]
        setMediaProcessing(true)
        setIsOnePic(false)
        setIsOneVid(true)
  
        const avatarRef = ref(storage, `pending-vid-posts${userAuth}/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            vidPost.current = url
          }).then(() => {
            document.querySelector('.new-vid-post').src = vidPost.current
            setMediaProcessing(false)
          })
        })
      } else {
        setFiles([])
        setFileLength(prev => prev - prev)
        gError.current?.classList.add('show-error')
        setGlobalError(`File type not valid`)
        setTimeout(() => {
          gError.current?.classList.remove('show-error')
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

  // const div = document.querySelector('.multiple-media-div')
  // const video = div?.querySelectorAll('video')
  // video?.forEach(vid => {
  //   vid.addEventListener('click', function () {
  //     if (!vid.paused) {
  //       vid.pause()
  //     } else {
  //       vid.play()
  //     }
  //   })
  // })

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
  
  const createNewPost = async (e) => {
    processingType.current = 'Post sent'
    setShowForm(false)
    e.preventDefault()

    try {
      if (files[0] === undefined) {
        if (newTextPost !== '') {
          addDoc(postsRef, {
            type: 'Text',
            body: newTextPost,
            date: `${day}/${month}/${year}`,
            time: `${hours}:${mins} ${period}`, 
            creator: userAuth,
            createdAt: serverTimestamp() ,
            likes: {value: []},
            comments: {value: []},
            shares: { value: [] },
            beenChecked: false
          }).then(docRef => {
            const notiId = uuidv4()
            const words = newTextPost.split(/['.', '/',' ', ':', ';', ',']/)
            users.map(user => {
              const condition = words.find(word => word === `@${user?.username}`)
              console.log(condition)
              if (condition) {
                const userRef = doc(db, 'users', user.id)
                updateDoc(userRef, {
                  notifications: {
                    value: [...user.notifications.value, {
                      id: notiId,
                      type: 'post-tag', 
                      taggedBy: userAuth,
                      value: docRef.id, 
                      sentAt: time.getTime()
                    }]
                  }
                })
              }
            })
            setNewTextPost('')
          }).then(() => {
            setProcessing(true)
          }).catch(() => {
            gError.current?.classList.add('show-error')
            // setGlobalError(`Your post wasn't sent. Try Again.`)
            setTimeout(() => {
              gError.current?.classList.remove('show-error')
            }, 3000 )
          }) 
        } else {
          gError?.classList.add('show-error')
          setGlobalError('Can not send an empty post')
          setTimeout(() => {
            gError?.classList.remove('show-error')
          }, 3000 )
        }

      } else if (fileLength === 1) {
        if (isOnePic) {
          let mediaUrl
          const types = ['image/png', 'image/jpeg', 'image/jpg']
          if (types.includes(files[0].type)) {
            const selected = files[0]
    
            const avatarRef = ref(storage, `media-posts${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                addDoc(postsRef, {
                  type: 'Picture-Media',
                  body: mediaUrl,
                  caption: mediaCaption,
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  createdAt: serverTimestamp() ,
                  likes: {value: []},
                  comments: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = mediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}`)
                    console.log(condition)
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'post-tag', 
                            taggedBy: userAuth,
                            value: docRef.id, 
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                })
              }).then(() => {
                setProcessing(true)
                setFiles([])
                setFileLength(prev => prev - prev)
                setMediaCaption('')
              })
            })
          }
        } else if (isOneVid) {
          let mediaUrl
          const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']
          if (types.includes(files[0].type)) {
            const selected = files[0]
    
            const avatarRef = ref(storage, `media-posts${userAuth}/${time.getTime().toString()}`)
            uploadBytes(avatarRef, selected).then(() => {
              getDownloadURL(avatarRef).then(url => {
                mediaUrl = url
              }).then(() => {
                addDoc(postsRef, {
                  type: 'Video-Media',
                  body: mediaUrl,
                  caption: mediaCaption,
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  createdAt: serverTimestamp() ,
                  likes: {value: []},
                  comments: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = mediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}`)
                    console.log(condition)
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'post-tag', 
                            taggedBy: userAuth,
                            value: docRef.id, 
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                }).then(() => {
                  setProcessing(true)
                  setFiles([])
                  setFileLength(prev => prev - prev)
                  setMediaCaption('')
                })
              })
            })
          }
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
                addDoc(postsRef, {
                  type: 'Group-Media',
                  body: postsArr,
                  caption: mediaCaption,
                  date: `${day}/${month}/${year}`,
                  time: `${hours}:${mins} ${period}`, 
                  creator: userAuth,
                  createdAt: serverTimestamp() ,
                  likes: {value: []},
                  comments: {value: []},
                  shares: {value: []},
                  beenChecked: false
                }).then(docRef => {
                  const notiId = uuidv4()
                  const words = mediaCaption.split(/['.', '/',' ', ':', ';', ',']/)
                  users.map(user => {
                    const condition = words.find(word => word === `@${user?.username}`)
                    console.log(condition)
                    if (condition) {
                      const userRef = doc(db, 'users', user.id)
                      updateDoc(userRef, {
                        notifications: {
                          value: [...user.notifications.value, {
                            id: notiId,
                            type: 'post-tag', 
                            taggedBy: userAuth,
                            value: docRef.id, 
                            sentAt: time.getTime()
                          }]
                        }
                      })
                    }
                  })
                }).then(() => {
                  setProcessing(true)
                  setFiles([])
                  setFileLength(prev => prev - prev)
                  setMediaCaption('')
                })
              }
            })
          })
        }
      }

    } catch(err) {
      console.log(err.message)
    } 
  }


  return (
    <form ref={newFormRef} action="submit" className={showForm ? 'show new-post-form' : 'new-post-form'}>
      
      <div className='new-post-btn-div'>
        <label htmlFor='new-post-img' >
          <span><FaImage /></span>
          {userAuth &&
            <input autoComplete='off' type="file" id='new-post-img' name='new-post-img'
            onClick={e => e.target.value = null}
            onChange={e => {
              setFiles(e.target.files)
              setFileLength( prev => (prev - prev) + e.target.files.length)
            }} multiple='multiple'
          />
          }
        </label>
        <button type='submit' onClick={createNewPost} disabled={!userAuth && true} style={{opacity: !userAuth && 0.5}}>
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

        
        <textarea autoComplete='off' className='media-post-cap' type="text" maxLength='500' placeholder='Type a caption...' style={{ display: `${files[0] ? 'block' : 'none'}` }} value={mediaCaption} onChange={e => setMediaCaption(e.target.value)}></textarea>

        <div style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} className="post-media-processing-overlay">
          {files[0] && mediaProcessing &&
            <>
              {darkMode ?
                <video style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoDark}>
                </video>
                :
                <video style={{ display: `${files[0] && mediaProcessing ? 'block' : 'none'}` }} 
                className="post-media-processing-video" autoPlay muted loop src={loadVideoLight}>
                </video>
              }
            </>
          }
        </div>

        {fileLength > 1 && <div className="multiple-media-div"></div>}
        
        <img style={{ display: `${isOnePic ? 'block' : 'none'}` }} className='new-img-post'/>
        
        <video autoPlay className='new-vid-post' style={{ display: `${isOneVid ? 'block' : 'none'}` }}></video>

        <textarea autoComplete='off' autoFocus value={newTextPost} style={{display: `${files[0] ? 'none' : 'block'}` }} placeholder="What's happening?" id='new-post-text'
          onChange={e => setNewTextPost(e.target.value)} name="" cols="30" rows="10"></textarea> 
      </div>

      <div onClick={() => setShowForm(false)} className='form-cancel-btn-div'>
        <span className='form-cancel-btn'>
          Cancel
        </span>
      </div>
    </form>
  )
}

export default Form