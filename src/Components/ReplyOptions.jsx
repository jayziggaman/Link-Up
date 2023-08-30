import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'

const ReplyOptions = ({func, postId, CommentId}) => {
  const { userAuth, user, processingType, setProcessing, users, showRepOptionsDIv, setShowRepOptionsDiv } = useContext(appContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    const optionsDiv = document.querySelector('.reply-options-div')
    if (showRepOptionsDIv) {
      optionsDiv.style.visibility = 'visible';
      optionsDiv.style.zIndex = '1000'
    } else {
      optionsDiv.style.visibility = 'hidden'
      optionsDiv.style.zIndex = '-100'
    }
  }, [showRepOptionsDIv])

  const handleFunc = (e, id) => {
    const deleteReply = async (replyId) => { 
      processingType.current = 'Reply deleted'
      
      const reply = document.getElementById(replyId)
      reply.style.opacity = 0.5

      try {
        const docRef = doc(db, 'posts', postId, 'comments', CommentId, 'replies', replyId)
        deleteDoc(docRef)
      } catch (err) {
        console.log(err.message)
      } finally {
        try {
          const replyRef = collection(db, 'posts', postId, 'comments', CommentId, 'replies')
          onSnapshot(replyRef, snap => {
            const replies = []
            snap.docs.forEach(doc => {
              replies.push({...doc.data(), id: doc.id})
            })
            const docRef = doc(db, 'posts', postId, 'comments', CommentId)
            updateDoc(docRef, {
              replies: {
                value: [...replies]
              }
            })
          })
        } finally {
          const commentRef = collection(db, 'posts', postId, 'comments')
          onSnapshot(commentRef, snap => {
            const comments = []
            snap.docs.forEach(doc => {
              comments.push({...doc.data(), id:doc.id})
            })
            const docRef = doc(db, 'posts', postId)
            updateDoc(docRef, {
              comments: {
                value: [...comments]
              }
            }).then(() => {
              setProcessing(true)
              for (let i = 0; i < users?.length; i++) {
                const userRef = doc(db, 'users', users[i].id)
                const likes = users[i].likes.value.filter(like => like !== replyId)
                const bookmarks = users[i].postSaves.value.filter(post => post.id !== replyId)
        
                updateDoc(userRef, {
                  postSaves: {
                    value: [...bookmarks]
                  },
        
                  likes: {
                    value: [...likes]
                  }
                })
              }
            })
          })
        }
      }
    }
    
    const bookmarkReply = (replyId) => {
      const condition = user.postSaves.value.find(save => save.id === replyId)
      if (!condition) {
        processingType.current = 'Reply bookmarked'
  
        const userRef = doc(db, 'users', userAuth)
        updateDoc(userRef, {
          postSaves: {
            value: [...user.postSaves.value, {
              id: replyId,
              type: 'reply',
              postId, commentId: CommentId, replyId
            }]
          }
        }).then(() => {
          setProcessing(true)
        })
      }
    }

    const removeBookmark = (replyId) => {
      processingType.current = 'Bookmark removed'
      const bk = user?.postSaves.value.filter(post => post.replyId !== replyId)
      const userRef = doc(db, 'users', userAuth)
      updateDoc(userRef, {
        postSaves: {
          value: [...bk]
        }
      }).then(() => {
        setProcessing(true)
      })
    }
    

    if (e.target.classList.contains('delete-reply')) {
      deleteReply(id)
    }

    if (e.target.classList.contains('remove-bookmark')) {
      removeBookmark(id)
    }

    if (e.target.classList.contains('rv')) {
      navigate(-1)
    }
      
    if (e.target.classList.contains('bookmark-reply')) {
      bookmarkReply(id)
    }
  }


  return (
    <div role={'button'} onClick={() => setShowRepOptionsDiv(false)} className='reply-options-div'>
      <div>
        {func.map((x, index) => {
          return <button key={index} className='option' onClick={e => {
            handleFunc(e, x.id)
            setShowRepOptionsDiv(false)
          }}>
            <span className={x.prop}>
              {x.text}
            </span>
          </button>
        } )}
      </div>
    </div>
  )
}

export default ReplyOptions