import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'

const OtherOption = ({ func, creator }) => {
  const {userAuth, user, setProcessing, processingType, showOtherOptionsDIv, setShowOtherOptionsDiv } = useContext(appContext)
  const navigate = useNavigate()

  useEffect(() => {
    const optionsDiv = document.querySelector('.other-options-div')
    if (showOtherOptionsDIv) {
      optionsDiv.style.visibility = 'visible'
      optionsDiv.style.zIndex = '1000'
    } else {
      optionsDiv.style.visibility = 'hidden'
      optionsDiv.style.zIndex = '-100'
    }
  }, [showOtherOptionsDIv])


  const handleFunc = (e, id) => {
    const bookmarkPost = (postId) => {
      processingType.current = 'Post bookmarked'

      const docRef = doc(db, 'users', userAuth)
      const condition = user.postSaves.value.find(save => save === postId)
      if (!condition) {
        updateDoc(docRef, {
          postSaves: {
            value: [...user.postSaves.value, {
              type: 'post',
              postId
            }]
          }
        }).then(() => {
          setProcessing(true)
        })
      } 
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
    <div role={'button'} onClick={() => setShowOtherOptionsDiv(false)} className='other-options-div'>
      <div>
        {func?.length > 0 && func.map((x, index) => <button key={index} onClick={e => {
          handleFunc(e, x.id)
          setShowOtherOptionsDiv(false)
        }} className='option'> <span className={x.prop}> {x.text} </span> </button>)}
      </div>
    </div>
  )
}

export default OtherOption
