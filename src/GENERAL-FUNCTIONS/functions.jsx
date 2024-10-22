import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase/config"
import {v4 as uuidv4} from 'uuid';

const time = new Date()





export const textAreaResize = (e) => {
  const textarea = e.currentTarget;

  if (textarea) {
    const elementHeight = e.currentTarget.getBoundingClientRect().height
    textarea.style.height = "auto";

    // Adjust height based on scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (textarea.scrollHeight > (elementHeight + 50)) {
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
};



// export const textAreaResize = (e, text) => {
//   const textarea = e.currentTarget 
//   if (textarea) {

//     console.log(text)

//     if (text === '' || text === ' ') {
//       textarea.style.height = "auto"

//     } else if (textarea.scrollHeight > (elementHeight + 20)) {
//       textarea.style.height = textarea.scrollHeight + 'px';
//     }
//   }
// }


export const compareStrings = (stringOne, stringTwo) => {
  const idCompare = stringOne.localeCompare(stringTwo)

  if (idCompare === -1) {
    return `${stringOne}${stringTwo}`

  } else {
    return `${stringTwo}${stringOne}`
  }
}


export const copyText = (textToCopy) => {
  navigator.clipboard.writeText(textToCopy)
  .then(() => {
    alert('Text copied to clipboard!');
  })
  .catch(err => {
    alert(`Oops...couldn't copy to clipboard!`);
  });
}


export const setAuthInStorage = (id) => {
  localStorage.setItem('wowi-auth-token', JSON.stringify(id));
}


    


// useEffect(() => {
//   const messagesRight = document.querySelectorAll('.message .align-right')
//   const messagesLeft = document.querySelectorAll('.message .align-left')
//   const videos = document.querySelectorAll('video')

//   function click(e) {
//     setShowOptionsDiv(true)
//   }
  


//   messagesRight.forEach(message => {
//     message.addEventListener('click', click)
//   })

//   messagesLeft.forEach(message => {
//     message.addEventListener('click', click)
//   })
  
//   return () => {
//     messagesRight.forEach(message => {
//       message.removeEventListener('click', click)
//     })

//     messagesLeft.forEach(message => {
//       message.removeEventListener('click', click)
//     })
//   }
// }, [])





// const finish = (type) => {
//   if (paraCondition === 1) {
//     const meRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}a`)
//     updateDoc(meRef, {
//       mostRecentMessage: newMessage,
//       mostRecentMessageTime: `${hours}:${mins} ${period}`,
//       mostRecentMessageCreator: userAuth,
//       createdAt: time.getTime(),
//       mostRecentMessageType: type ,
//     }).then(() => {
//       const otherRef = doc(db, 'users', otherUser.id, 'directMessages', `${inboxId}b`)

//       updateDoc(otherRef, {
//         mostRecentMessage: newMessage,
//         mostRecentMessageTime: `${hours}:${mins} ${period}`,
//         mostRecentMessageCreator: userAuth,
//         createdAt: time.getTime(),
//         mostRecentMessageType: type,
//       })
//     }).then(() => {
//       setNewMessage('')
//       setMediaText('')
//       setFiles([])
//       photoUrl.current = ''
//       videoUrl.current = ''
//       divRef.current.innerHTML = null
//       setFileLength(prev => prev - prev)
//     })
//   } else {
//     const meRef = doc(db, 'users', userAuth, 'directMessages', `${inboxId}b`)
//     updateDoc(meRef, {
//       mostRecentMessage: newMessage,
//       mostRecentMessageTime: `${hours}:${mins} ${period}`,
//       mostRecentMessageCreator: userAuth,
//       createdAt: time.getTime(),
//       mostRecentMessageType: type,
//     }).then(() => {
//       const otherRef = doc(db, 'users', otherUser.id, 'directMessages', `${inboxId}a`)

//       updateDoc(otherRef, {
//         mostRecentMessage: newMessage,
//         mostRecentMessageTime: `${hours}:${mins} ${period}`,
//         mostRecentMessageCreator: userAuth,
//         createdAt: time.getTime(),
//         mostRecentMessageType: type,
//       })
//     }).then(() => {
//       setNewMessage('')
//       setMediaText('')
//       setFiles([])
//       photoUrl.current = ''
//       videoUrl.current = ''
//       divRef.current.innerHTML = null
//       setFileLength(prev => prev - prev)
//     })
//   }
//   const button = document.querySelector('.messaging-main .send-btn')
//   button.disabled = false
// }

// const sendReply = async (replyId, type) => {
//   const id = uuidv4()

//   const overlay = document.querySelector('.reply-overlay')
//   overlay.style.visibility = 'hidden'

//   const messagesSect = document.querySelector('.messages-sect')
//   messagesSect.style.paddingBottom = '30px'

//   if (document.querySelector(`[id='${messageId.current}'] .align-right`)) {
//     const message = document.querySelector(`[id='${messageId.current}'] .align-right`)
//     message.style.zIndex = 0
//   } else {
//     const message = document.querySelector(`[id='${messageId.current}'] .align-left`)
//     message.style.zIndex = 0
//   }
  

//   try {
//     const docRefA = doc(db, 'directMessages', `${inboxId}a`)
//     onSnapshot(docRefA, doc => {
//       const { chatDateMarker } = doc.data()
//       let condition
//       chatDateMarker === [] ? condition = false :
//       condition = chatDateMarker.find(date => {
//         return date?.year === today.year && date?.month === today.month && date?.day === today.day
//       })

//       if (!condition) {
//         updateDoc(docRefA, {
//           chatDateMarker: [...chatDateMarker, today]
//         })
//       }
//     })


//     const docRefB = doc(db, 'directMessages', `${inboxId}b`)
//     onSnapshot(docRefB, doc => {
//       const { chatDateMarker } = doc.data()
//       let condition
//       chatDateMarker === [] ? condition = false :
//       condition = chatDateMarker.find(date => {
//         return date?.year === today.year && date?.month === today.month && date?.day === today.day
//       })

//       if (!condition) {
//         updateDoc(docRefB, {
//           chatDateMarker: [...chatDateMarker, today]
//         })
//       }
//     })
//   } finally {
//     try {
//       if (files[0] === undefined) {
//         if (newMessage !== '') {
//           try {
//             const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
//             setDoc(doc(ref, id), {
//               id: id,
//               body: newMessage,
//               createdAt: time.getTime(),
//               date: `${day}/${month}/${year}`,
//               time: `${hours}:${mins} ${period}`,
//               creator: userAuth,
//               type: 'reply-text-message',
//               replyMessage: replyMessageBody,
//               replyMessageType: type,
//               replyMessageId: replyId,
//               isSent: false
      
//             }).then(() => {
//               const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
//               setDoc(doc(ref, id), {
//                 id: id,
//                 body: newMessage,
//                 createdAt: time.getTime(),
//                 date: `${day}/${month}/${year}`,
//                 time: `${hours}:${mins} ${period}`,
//                 creator: userAuth,
//                 type: 'reply-text-message',
//                 replyMessage: replyMessageBody,
//                 replyMessageType: type,
//                 replyMessageId: replyId,
//                 isSent: false
        
//               })
//             }).then(() => {
//               finish('text-message')
//             })
//           } catch (err) {
//             console.log(err.message)
//           }
//         }
//       } else if (fileLength === 1) {
//         if (isOnePic) {
//           try {
//             let mediaUrl
//             const selected = files[0]
      
//             const avatarRef = ref(storage, `photo-message${userAuth}/${time.getTime().toString()}`)
//             uploadBytes(avatarRef, selected).then(() => {
//               getDownloadURL(avatarRef).then(url => {
//                 mediaUrl = url
//               }).then(() => {
//                 const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
//                 setDoc(doc(ref, id), {
//                   id: id,
//                   caption: mediaText,
//                   body: mediaUrl,
//                   createdAt: time.getTime(),
//                   date: `${day}/${month}/${year}`,
//                   time: `${hours}:${mins} ${period}`, 
//                   creator: userAuth,
//                   type: 'reply-photo-message',
//                   replyMessage: replyMessageBody,
//                   replyMessageType: type,
//                   replyMessageId: replyId,
//                   isSent: false
          
//                 }).then(() => {
//                   const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
//                   setDoc(doc(ref, id), {
//                     id: id,
//                     caption: mediaText,
//                     body: mediaUrl,
//                     createdAt: time.getTime(),
//                     date: `${day}/${month}/${year}`,
//                     time: `${hours}:${mins} ${period}`, 
//                     creator: userAuth,
//                     type: 'reply-photo-message',
//                     replyMessage: replyMessageBody,
//                     replyMessageType: type,
//                     replyMessageId: replyId,
//                     isSent: false
            
//                   })
//                 })
//               }).then(() => {
//                 finish('photo-message')
//               })
//             })
            
//           } catch (err) {
//             console.log(err.message)
//           } 
//         } else if (isOneVid) {
//           try {
//             let mediaUrl
//             const selected = files[0]
      
//             const avatarRef = ref(storage, `video-message${userAuth}/${time.getTime().toString()}`)
//             uploadBytes(avatarRef, selected).then(() => {
//               getDownloadURL(avatarRef).then(url => {
//                 mediaUrl = url
//               }).then(() => {
//                 const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
//                 setDoc(doc(ref, id), {
//                   id: id,
//                   caption: mediaText,
//                   body: mediaUrl,
//                   createdAt: time.getTime(),
//                   date: `${day}/${month}/${year}`,
//                   time: `${hours}:${mins} ${period}`, 
//                   creator: userAuth,
//                   type: 'reply-video-message',
//                   replyMessage: replyMessageBody,
//                   replyMessageType: type,
//                   replyMessageId: replyId,
//                   isSent: false
          
//                 }).then(() => {
//                   const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
//                   setDoc(doc(ref, id), {
//                     id: id,
//                     caption: mediaText,
//                     body: mediaUrl,
//                     createdAt: time.getTime(),
//                     date: `${day}/${month}/${year}`,
//                     time: `${hours}:${mins} ${period}`, 
//                     creator: userAuth,
//                     type: 'reply-video-message',
//                     replyMessage: replyMessageBody,
//                     replyMessageType: type,
//                     replyMessageId: replyId,
//                     isSent: false
            
//                   })
//                 })
//               })
//             }).then(() => {
//               finish('video-message')
//             })

//           } catch (err) {
//             console.log(err.message)
//           } 
//         }
//       } else {
//         try {
//           const postsArr = []

//           for (let i = 0; i < fileLength; i++) {
//             let mediaUrl
//             const selected = files[i]
//             const avatarRef = ref(storage, `img/vid-posts${files[i].name}/${files[i].name}`)
//             uploadBytes(avatarRef, selected).then(() => {
//               getDownloadURL(avatarRef).then(url => {
//                 mediaUrl = url
//               }).then(() => {
//                 if (files[i].type === 'video/mp4') {
//                   postsArr.push({
//                     type: 'video',
//                     url: mediaUrl
//                   })
//                 } else {
//                   postsArr.push({
//                     type: 'img',
//                     url: mediaUrl
//                   })
//                 }
//               }).then(() => {
//                 if (postsArr.length === fileLength) {
//                   const ref = collection(db, 'directMessages', `${inboxId}a`, 'messages')
//                   setDoc(doc(ref, id), {
//                     id: id,
//                     caption: mediaText,
//                     body: postsArr,
//                     createdAt: time.getTime(),
//                     date: `${day}/${month}/${year}`,
//                     time: `${hours}:${mins} ${period}`, 
//                     creator: userAuth,
//                     type: 'reply-group-media-message',
//                     replyMessage: replyMessageBody,
//                     replyMessageType: type,
//                     replyMessageId: replyId,
//                     isSent: false
            
//                   }).then(() => {
//                     const ref = collection(db, 'directMessages', `${inboxId}b`, 'messages')
//                     setDoc(doc(ref, id), {
//                       id: id,
//                       caption: mediaText,
//                       body: postsArr,
//                       createdAt: time.getTime(),
//                       date: `${day}/${month}/${year}`,
//                       time: `${hours}:${mins} ${period}`, 
//                       creator: userAuth,
//                       type: 'reply-group-media-message',
//                       replyMessage: replyMessageBody,
//                       replyMessageType: type,
//                       replyMessageId: replyId,
//                       isSent: false
//                     })
//                   })
//                 }
//               }).then(() => {
//                 finish('group-media-message')
//               })
//             })
//           }
//         } catch (err) {
//           console.log(err)
//         }
//       }
//     } finally {
//       setIsReply(false)
//       replyMessageType.current = ''
//       messageId.current = ''
//       if (messagesSect.current) {
//         messagesSect.current.style.paddingBottom = '30px'
//       }
//     }
//   }
// }










// try {
//   if (commentMedia[0] === undefined) {
//     if (textComment !== '') {
      
//     } else {
//       callError('Can not send an empty comment')
//     }

//   } else if (commentMedia.length === 1) {
//     if (commentIsOnePic) {
//       const selected = commentMedia[0]
//       let photoUrl
//       const avatarRef = ref(storage, `photo-comments${userAuth}/${time.getTime().toString()}`)
//       uploadBytes(avatarRef, selected).then(() => {
//         getDownloadURL(avatarRef).then(url => {
//           photoUrl = url
//         }).then(() => {
//           const id = uuidv4()
//           setDoc(doc(commentRef, id), {
//             id: id,
//             type: 'Photo-Comment',
//             caption: mediaCommentCaption,
//             body: photoUrl,
//             date: `${day}/${month}/${year}`,
//             time: `${hours}:${mins} ${period}`,
//             creator: userAuth,
//             createdAt: serverTimestamp(),
//             likes: { value: [] },
//             replies: { value: [] },
//             shares: {value: []},
//             beenChecked: false
//           }).then(docRef => {
//             const notiId = uuidv4()
//             const words = mediaCommentCaption.split(/['.', '/',' ', ':', ';', ',']/)
//             users.map(user => {
//               const condition = words.find(word => word === `@${user.username}` )
//               const conditionII = user.id !== userAuth
//               if (condition && conditionII) {
//                 const userRef = doc(db, 'users', user.id)
//                 updateDoc(userRef, {
//                   notifications: {
//                     value: [...user.notifications.value, {
//                       id: notiId,
//                       type: 'comment-tag', 
//                       taggedBy: userAuth,
//                       value: id, 
//                       postId: postId,
//                       sentAt: time.getTime()
//                     }]
//                   }
//                 })
//               }
//             })
//             setProcessing(true)
//             setTextComment('')
//             setCommentMedia([])
//             setcommentMedia.length(prev => prev - prev)
//             setMediaCommentCaption('')
//           }).then(() => {
//             const notiId = uuidv4()
//             const userRef = doc(db, 'users', post.creator)
//             const creator = users.find(user => user.id === post.creator)
//             const condition = post.creator !== userAuth
//             if (condition) {
//               updateDoc(userRef, {
//                 notifications: {
//                   value: [...creator.notifications.value, {
//                     id: notiId,
//                     type: 'post-reply',
//                     value: post.id,
//                     repliedBy: userAuth,
//                     sentAt: time.getTime()
//                   }]
//                 }
//               })
//            }
//           })
//         })
//       })
//     } else if (commentIsOneVid) {
//       const id = uuidv4()
//       const selected = commentMedia[0]
//       let vidUrl
//       const avatarRef = ref(storage, `media-comments${userAuth}/${time.getTime().toString()}`)
//       uploadBytes(avatarRef, selected).then(() => {
//         getDownloadURL(avatarRef).then(url => {
//           vidUrl = url
//         }).then(() => {
//           setDoc(doc(commentRef, id), {
//             id: id,
//             type: 'Video-Comment',
//             caption: mediaCommentCaption,
//             body: vidUrl,
//             date: `${day}/${month}/${year}`,
//             time: `${hours}:${mins} ${period}`, 
//             creator: userAuth,
//             createdAt: serverTimestamp(),
//             likes: {value: []},
//             replies: {value: []},
//             shares: {value: []},
//             beenChecked: false
//           })
//         }).then(docRef => {
//           const notiId = uuidv4()
//           const words = mediaCommentCaption.split(/['.', '/',' ', ':', ';', ',']/)
//           users.map(user => {
//             const condition = words.find(word => word === `@${user.username}` )
//             const conditionII = user.id !== userAuth
//             if (condition && conditionII) {
//               const userRef = doc(db, 'users', user.id)
//               updateDoc(userRef, {
//                 notifications: {
//                   value: [...user.notifications.value, {
//                     id: notiId,
//                     type: 'comment-tag', 
//                     taggedBy: userAuth,
//                     value: id, 
//                     postId: postId,
//                     sentAt: time.getTime()
//                   }]
//                 }
//               })
//             }
//           })
//           setProcessing(true)
//           setCommentMedia([])
//           setcommentMedia.length(prev => prev - prev)
//           setMediaCommentCaption('')
//         }).then(() => {
//           const notiId = uuidv4()
//           const userRef = doc(db, 'users', post.creator)
//           const creator = users.find(user => user.id === post.creator)
//           const condition = post.creator !== userAuth
//           if (condition) {
//             updateDoc(userRef, {
//               notifications: {
//                 value: [...creator.notifications.value, {
//                   id: notiId,
//                   type: 'post-reply',
//                   value: post.id,
//                   repliedBy: userAuth,
//                   sentAt: time.getTime()
//                 }]
//               }
//             })
//           }
//         })
//       })
//     }
//   } else {
//     const postsArr = []
//     const types = ['video/mp4', 'video/mov', 'video/quicktime', 'video/wmv']

//     for (let i = 0; i < commentMedia.length; i++) {
//       let mediaUrl
//       const selected = commentMedia[i]
//       const avatarRef = ref(storage, `img/vid-posts${commentMedia[i].name}/${commentMedia[i].name}`)
//       uploadBytes(avatarRef, selected).then(() => {
//         getDownloadURL(avatarRef).then(url => {
//           mediaUrl = url
//         }).then(() => {
//           if (types.includes(commentMedia[i].type)) {
//             postsArr.push({
//               type: 'video',
//               url: mediaUrl
//             })
//           } else {
//             postsArr.push({
//               type: 'img',
//               url: mediaUrl
//             })
//           }
//         }).then(() => {
//           if (postsArr.length === commentMedia.length) {
//             const id = uuidv4()
//             setDoc(doc(commentRef, id), {
//               id: id,
//               type: 'Group-Comment',
//               caption: mediaCommentCaption,
//               body: postsArr,
//               date: `${day}/${month}/${year}`,
//               time: `${hours}:${mins} ${period}`, 
//               creator: userAuth,
//               createdAt: serverTimestamp(),
//               likes: {value: []},
//               replies: {value: []},
//               shares: {value: []},
//               beenChecked: false
//             }).then(docRef => {
//               const notiId = uuidv4()
//               const words = mediaCommentCaption.split(/['.', '/',' ', ':', ';', ',']/)
//               users.map(user => {
//                 const condition = words.find(word => word === `@${user.username}` )
//                 const conditionII = user.id !== userAuth
//                 if (condition && conditionII) {
//                   const userRef = doc(db, 'users', user.id)
//                   updateDoc(userRef, {
//                     notifications: {
//                       value: [...user.notifications.value, {
//                         id: notiId,
//                         type: 'comment-tag', 
//                         taggedBy: userAuth,
//                         value: id, 
//                         postId: postId,
//                         sentAt: time.getTime()
//                       }]
//                     }
//                   })
//                 }
//               })
//               setProcessing(true)
//               setcommentMedia.length(prev => prev - prev)
//               setCommentMedia([])
//               setMediaCommentCaption('')
//             }).then(() => {
//               const notiId = uuidv4()
//               const userRef = doc(db, 'users', post.creator)
//               const creator = users.find(user => user.id === post.creator)
//               const condition = post.creator !== userAuth
//               if (condition) {
//                 updateDoc(userRef, {
//                   notifications: {
//                     value: [...creator.notifications.value, {
//                       id: notiId,
//                       type: 'post-reply',
//                       value: post.id,
//                       repliedBy: userAuth,
//                       sentAt: time.getTime()
//                     }]
//                   }
//                 })
//               }
//             })
//           }
//         })
//       })
//     }
//   }

// } catch(err) {
//   console.log(err.message)
// } finally {
//   onSnapshot(commentRef, snap => {
//     let tempComments = []
//     snap.docs.forEach(doc => {
//       tempComments.push({ ...doc.data() })
//     })
//     updateDoc(docRef, {
//       comments: {
//         value: tempComments
//       }
//     })
//   })
// }






{/* <div className="upper-sect">
            <Link to={user.id}>
              <div className="upper-sect-img-div">
                
                {user.avatarUrl === '' ?
                  <div className='empty-comment-pfp'></div>
                  :
                  <img src={user.avatarUrl} alt="" />
                }
              </div>
  
              <div className="post-username-div">
                <p className="post-display-name">
                  {user.displayName}  {user.userType === 'creator' && <img src={verifiedBadge} className='verified-badge' alt="" />}
                </p>
                <p className="post-username"> @{user.username} </p>
              </div>
            </Link>
  
            <div className='upper-sect-options' onClick={() => {
              if (user.id === userAuth) {
                setShowOptionsDiv(!showOptionsDiv)
              } else {
                setShowOtherOptionsDiv(!showOtherOptionsDiv)
              }
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
              </div>
            }

            {post?.type === 'Group-Media' &&
              <div ref={groupRef} className="img-post-body-div">
                <PostCaption />

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
                        <GroupMedia item={item} index={commentIndex} i={i} />
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
            <span onClick={() => {
              if (userAuth) {
                handleLike(postId)
              }
            }}
              style={ post?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }
            >
              <FaRegHeart style={ post?.likes.value.find(like => like === userAuth) ? { color: 'red' } : null }/> {post?.likes.value.length}
            </span>
            <span> <FaRegComment /> {post?.comments.value.length} </span>
            <span onClick={() => {
              if (userAuth) {
                setShowShareMenu(true)
                setSelectedMessage({
                  post: post, typeOf: 'post', type: post.type
                })
              }
            }}> <FaShareSquare /> {post?.shares.value.length} </span>
          </div> */}