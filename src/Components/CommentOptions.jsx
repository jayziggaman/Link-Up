import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'

const CommentOptions = ({ func, postId }) => {
  const { userAuth, allPosts, user, processingType, setProcessing, users, showComOptionsDIv, setShowComOptionsDiv } = useContext(appContext)
  const navigate = useNavigate()

  useEffect(() => {
    const optionsDiv = document.querySelector('.comment-options-div')
    if (showComOptionsDIv) {
      optionsDiv.style.visibility = 'visible'
      optionsDiv.style.zIndex = '1000'
    } else {
      optionsDiv.style.visibility = 'hidden'
      optionsDiv.style.zIndex = '-100'
    }

  }, [showComOptionsDIv, allPosts])


  const handleFunc = (e, id) => {
    const deleteComment = async (comId) => {
      processingType.current = 'Comment deleted' 

      const comment = document.getElementById(comId)
      comment.style.opacity = 0.5


      try {
        const docRef = doc(db, 'posts', postId, 'comments', comId)
        deleteDoc(docRef)
      } catch (err) {
        console.log(err.message)
      } finally {
        const commentRef = collection(db, 'posts', postId, 'comments')
        onSnapshot(commentRef, snap => {
          const comments = []
          snap.docs.forEach(doc => {
            comments.push({...doc.data(), id:doc.id})
          })

          const postRef = doc(db, 'posts', postId)
          updateDoc(postRef, {
            comments: {
              value: [...comments]
            }
          }).then(() => {
            setProcessing(true)
          })
        })
      }

      for (let i = 0; i < users?.length; i++) {
        const userRef = doc(db, 'users', users[i].id)
        const likes = users[i].likes.value.filter(like => like !== comId)
        const bookmarks = users[i].postSaves.value.filter(post => post.id !== comId)

        updateDoc(userRef, {
          postSaves: {
            value: [...bookmarks]
          },

          likes: {
            value: [...likes]
          }
        })
      }
    }
    
    const bookmarkComment = (comId) => {
      const condition = user.postSaves.value.find(save => save.id === comId)
      if (!condition) {
        processingType.current = 'Comment bookmarked'
        const userRef = doc(db, 'users', userAuth)
        updateDoc(userRef, {
          postSaves: {
            value: [...user.postSaves.value, {
              id: comId,
              type: 'comment',
              postId, commentId: comId
            }]
          }
        }).then(() => {
          setProcessing(true)
        })
     }
    }

    const removeBookmark = (comId) => {
      processingType.current = 'Bookmark removed'
      const bk = user?.postSaves.value.filter(post => post.commentId !== comId)
      const userRef = doc(db, 'users', userAuth)
      updateDoc(userRef, {
        postSaves: {
          value: [...bk]
        }
      }).then(() => {
        setProcessing(true)
      })
    }
    
    if (e.target.classList.contains('delete-comment')) {
      deleteComment(id)
    }

    if (e.target.classList.contains('remove-bookmark')) {
      removeBookmark(id)
    }

    if (e.target.classList.contains('cv')) {
      navigate(-1)
    }
      
    if (e.target.classList.contains('bookmark-comment')) {
      bookmarkComment(id)
    }
    
  }
  return (
    <div role={'button'} onClick={() => setShowComOptionsDiv(false)}
      className='comment-options-div'>
      <div>
        {func?.map((x, index) => {
          return (
            <button key={index} className='option' onClick={e => {
              handleFunc(e, x.id)
              setShowComOptionsDiv(false)
            }}>
              <span className={x.prop}>
                {x.text}
              </span>
            </button>
          )
        } )}
      </div>
    </div>
  )
}

export default CommentOptions