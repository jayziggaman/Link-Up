import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'

const Options = ({ func }) => {
  const { showOptionsDIv, setShowOptionsDiv, userAuth, user, setProcessing, processingType, processing, users } = useContext(appContext)
  const navigate = useNavigate()

  useEffect(() => {
    const optionsDiv = document.querySelector('.options-div')
    if (showOptionsDIv) {
      optionsDiv.style.visibility = 'visible'
      optionsDiv.style.zIndex = '1000'
    } else {
      optionsDiv.style.visibility = 'hidden'
      optionsDiv.style.zIndex = '-100'
    }
  }, [showOptionsDIv])

  // console.log(creator === userAuth, 'opt')


  const handleFunc = (e, id) => {

    const clearChat = async (chatId) => {
      processingType.current = 'Chat deleted'
      const dmRef = collection(db, 'directMessages', chatId, 'messages')
        
      try {
        const querySnapshot = await getDocs(dmRef);
        
        if (querySnapshot.empty) {
          return;
        }

        // Create a batch
        const batch = writeBatch(db);

        // Add delete operations to the batch
        querySnapshot.forEach((doc) => {
          const docRef = doc.ref;
          batch.delete(docRef);
        });

        // Commit the batch (execute all the delete operations)
        await batch.commit();

        console.log("Documents successfully deleted.");
      } catch (error) {
        console.error("Error deleting documents:", error);
      } finally {
        const meRef = doc(db, 'users', userAuth, 'directMessages', chatId)
        updateDoc(meRef, {
          mostRecentMessage: '',
          mostRecentMessageTime: '',
          mostRecentMessageCreator: '',
          createdAt: '',
          mostRecentMessageType: '',
        }).then(() => {
          const docRef = doc(db, 'directMessages', chatId)
          updateDoc(docRef, {
            chatDateMarker: []
          }).then(() => {
            setProcessing(true)
          })
        })
      }
    }

    const deletePost = (postId) => {
      processingType.current = 'Post deleted'

      const post = document.getElementById(postId)
      post.style.opacity = 0.5


      const docRef = doc(db, 'posts', postId)
      deleteDoc(docRef).then(() => {
        setProcessing(true)
      })

      for (let i = 0; i < users?.length; i++) {
        const userRef = doc(db, 'users', users[i].id)
        const likes = users[i].likes.value.filter(like => like !== postId)
        const bookmarks = users[i].postSaves.value.filter(post => post.id !== postId)

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

    const bookmarkPost = (postId) => {
      processingType.current = 'Post bookmarked'
      const docRef = doc(db, 'users', userAuth)
      const condition = user.postSaves.value.find(save => save.id === postId)
      if (!condition) {
        updateDoc(docRef, {
          postSaves: {
            value: [...user.postSaves.value, {
              id: postId,
              type: 'post',
              postId
            }]
          }
        }).then(() => {
          setProcessing(true)
        })
      } else return
    }

    const removeBookmark = async (postId) => {
      processingType.current = 'Bookmark removed'
      const bk = user?.postSaves.value.filter(post => post.postId !== postId)
      const userRef = doc(db, 'users', userAuth)
      updateDoc(userRef, {
        postSaves: {
          value: [...bk]
        }
      }).then(() => {
        setProcessing(true)
      })
    } 

    if (e.target.classList.contains('clear-chat')) {
      clearChat(id)
    }

    if (e.target.classList.contains('delete-post')) {
      deletePost(id)
    }

    if (e.target.classList.contains('pv')) {
      navigate(-1)
    }

    if (e.target.classList.contains('bookmark-post')) {
      bookmarkPost(id)
    }

    if (e.target.classList.contains('remove-bookmark')) {
      removeBookmark(id)
    }
  }

  return (
    <div role={'button'} onClick={() => setShowOptionsDiv(false)} className='options-div'>
      <div>
        {func?.length > 0 && func.map((x, index) => <button key={index} onClick={e => {
          handleFunc(e, x.id)
          setShowOptionsDiv(false)
        }} className='option'> <span className={x.prop}> {x.text} </span> </button>)}
      </div>
    </div>
  )
}

export default Options
