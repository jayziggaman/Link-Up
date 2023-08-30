import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'

const PageOptions = ({func, showPageOptionsDiv, setShowPageOptionsDiv}) => {

  const { userAuth, user, processingType, setProcessing, users } = useContext(appContext)

  useEffect(() => {
    const optionsDiv = document.querySelector('.page-options-div')
    if (showPageOptionsDiv) {
      optionsDiv.style.visibility = 'visible'
      optionsDiv.style.zIndex = '1000'
    } else {
      optionsDiv.style.visibility = 'hidden'
      optionsDiv.style.zIndex = '-100'
    }
  }, [showPageOptionsDiv])


  const handleFunc = (e, id) => {

    const bookmarkPage = (pageId) => {
      processingType.current = 'Bookmark added'

      const condition = user.pageSaves.value.find(save => save === pageId)
      if (!condition) {
        const userRef = doc(db, 'users', userAuth)
        updateDoc(userRef, {
          pageSaves: {
            value: [...user.pageSaves.value, pageId]
          }
        }).then(() => {
          setProcessing(true)
        })
      }
    }

    const blockUser = (pageId) => {
      processingType.current = 'User blocked'
      const docRef = doc(db, 'users', userAuth)
      const condition = user.blocked.value.find(person => person === pageId)
      console.log(condition)
      try {
        if (!condition) {
          setProcessing(true)
          updateDoc(docRef, {
            blocked: {
              value: [...user.blocked.value, pageId]
            }
          }).then(() => {
            updateDoc(docRef, {
              followers: {
                value: [...user.followers.value.filter(follower => follower !== pageId)]
              },
  
              following: {
                value: [...user.following.value.filter(follow => follow !== pageId)]
              },

              friends: {
                value: [...user.following.value.filter(follow => follow !== pageId)]
              }
            })
          }).then(() => {
            const userRef = doc(db, 'users', pageId)
            const user = users.find(user => user.id === pageId)
            updateDoc(userRef, {
              followers: {
                value: [...user.followers.value.filter(follower => follower !== userAuth)]
              },
  
              following: {
                value: [...user.following.value.filter(follow => follow !== userAuth)]
              },

              friends: {
                value: [...user.following.value.filter(follow => follow !== userAuth)]
              }
            })
          })
        }
      } finally {
        setProcessing(true)
      }
    }

    const unblockUser = (pageId) => {
      processingType.current = 'User unblocked'
      setProcessing(true)
      const docRef = doc(db, 'users', userAuth)
      updateDoc(docRef, {
        blocked: {
          value: [...user.blocked.value.filter(user => user !== pageId)]
        }
      }).then(() => {
        setProcessing(true)
      })
    }

    if (e.target.classList.contains('bookmark-page')) {
      bookmarkPage(id)
    }

    if (e.target.classList.contains('block-user')) {
      blockUser(id)
    }

    if (e.target.classList.contains('unblock-user')) {
      unblockUser(id)
    }
  }


  return (
    <div role={'button'} onClick={() => setShowPageOptionsDiv(false)} className='page-options-div'>
      <div>
        {func?.length > 0 && func.map((x, index) => <button key={index} onClick={e => {
          handleFunc(e, x.id)
          setShowPageOptionsDiv(false)
        }} className='option'> <span className={x.prop}> {x.text} </span> </button>)}
      </div>
    </div>
  )
}

export default PageOptions