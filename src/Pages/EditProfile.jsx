import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import {FaArrowLeft, FaPlus} from 'react-icons/fa'
import { doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase/config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import loadVideoLight from '../Images/load-video-light.mp4'
import loadVideoDark from '../Images/load-video-dark.mp4'

const EditProfile = () => {
  const {user, gError, setGlobalError, userAuth, users, darkMode} = useContext(appContext)
  const navigate = useNavigate()
  const [newUsername, setNewUsername] = useState()
  const [newDisplayName, setNewDisplayName] = useState()
  const [newAbout, setNewAbout] = useState()
  const [processing, setProcessing] = useState(false)
  const [processingChange, setProcessingChange] = useState(false)
  const allowedChar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '.']

  useEffect(() => {
    setNewAbout(user?.about)
    setNewDisplayName(user?.displayName)
    setNewUsername(user?.username)
  }, [user])

  const handleEdit = (e) => {
    setProcessingChange(true)
    e.preventDefault()

    if (newUsername !== '') {
      const types = ['image/png', 'image/jpeg', 'image/jpg']
      let newUrl
      
      if (image && types.includes(image.type)) {
        const selected = image

        const avatarRef = ref(storage, `profile-avatars/${userAuth}`)
        uploadBytes(avatarRef, selected).then(() => {
          getDownloadURL(avatarRef).then(url => {
            newUrl = url
          }).then(() => {
            const docRef = doc(db, 'users', userAuth)

            const condition = users.find(user => user.username === newUsername)
            const conditionII = condition?.id === userAuth
            if (condition) {
              if (!conditionII) {
                gError.current.style.visibility = 'visible'
                setGlobalError(`Username already taken`)
                setTimeout(() => {
                  gError.current.style.visibility = 'hidden'
                }, 3000)
              } else {
                updateDoc(docRef, {
                  username: newUsername,
                  displayName: newDisplayName,
                  about: newAbout,
                  avatarUrl: newUrl
                }).then(() => {
                  setProcessingChange(false)
                  navigate(-1)
                })
              }
            } else {
              updateDoc(docRef, {
                username: newUsername,
                displayName: newDisplayName,
                about: newAbout,
                avatarUrl: newUrl
              }).then(() => {
                setProcessingChange(false)
                navigate(-1)
              })
            }
          })
        })
      } else {
        const docRef = doc(db, 'users', userAuth)

        const condition = users.find(user => user.username === newUsername)
        const conditionII = condition?.id === userAuth
        if (condition) {
          if (!conditionII) {
            gError.current.style.visibility = 'visible'
            setGlobalError(`Username already taken`)
            setTimeout(() => {
              gError.current.style.visibility = 'hidden'
            }, 3000)
          } else {
            updateDoc(docRef, {
              username: newUsername,
              displayName: newDisplayName,
              about: newAbout,
            }).then(() => {
              setProcessingChange(false)
              navigate(-1)
            })
          }
        } else {
          updateDoc(docRef, {
            username: newUsername,
            displayName: newDisplayName,
            about: newAbout,
          }).then(() => {
            setProcessingChange(false)
            navigate(-1)
          })
        }

        
      }
    } else {
    gError.current.style.visibility = 'visible'
    setGlobalError( `Username can not be empty` )
    setTimeout(() => {
      gError.current.style.visibility = 'hidden'
    }, 3000 )
    }
  }

  const [image, setImage] = useState(null)
  useEffect(() => {
    const types = ['image/png', 'image/jpeg', 'image/jpg']
    
    
    if (image && types.includes(image.type)) {
      setProcessing(true)
      const selected = image
      let newUrl

      const avatarRef = ref(storage, `pending-profile-avatar/${userAuth}`)
      uploadBytes(avatarRef, selected).then(() => {
        getDownloadURL(avatarRef).then(url => {
          newUrl = url
        }).then(() => {
          setProcessing(false)
          document.querySelector('.sign-up-pfp-img-II').src = newUrl
        })
      })
    } else {
      gError.current.style.visibility = 'visible'
      setGlobalError( `Please select a jpeg or png image` )
      setTimeout(() => {
        gError.current.style.visibility = 'hidden'
      }, 2000 )
    }
  }, [image]);
  
  return (
    <section className="edit-profile">
      <form action="submit" id='edit-profile-form' className="edit-profile-form edit-form" onSubmit={handleEdit}>
        <header className="edit-profile-header">
          <button onClick={ () => navigate(-1) } >
            <FaArrowLeft />
          </button>
        </header>

        <label className='file-input-label' htmlFor="file-input-II">
          <div className="file-input-label-div">
            {!image && <img src={user?.avatarUrl} alt="" className='sign-up-pfp-img' />}
            {image && <img src='' alt="" className='sign-up-pfp-img-II'/>}
            <span>
              <FaPlus />
            </span>
          </div>
          <input autoComplete='off' id='file-input-II' name='file-input-II' className='file-input' type="file"
            onClick={e => e.target.value = null}
            onChange={e => setImage(e.target.files[0])}
          />

          <div style={{ display: `${processing ? 'block' : 'none'}` }}  className="media-processing-overlay">
            {processing &&
              <>
                {darkMode ?
                  <video style={{ display: `${processing ? 'block' : 'none'}` }} 
                  className="media-processing-video"  autoPlay muted loop src={loadVideoDark}>
                  </video>
                  :
                  <video style={{ display: `${processing ? 'block' : 'none'}` }} 
                  className="media-processing-video"  autoPlay muted loop src={loadVideoLight}>
                  </video>
                }
              </>
            }
          </div>
        </label>

        <label htmlFor="new-username"> Enter your new username. </label><br />
        <input id="new-username" autoComplete='off' value={newUsername} onChange={ e => setNewUsername(e.target.value) } name='new-username' type="text" onKeyPress={e => {
        if(allowedChar.indexOf(e.key) < 0 || e.key !== ' ') e.preventDefault()
      }}/><br />

        <label htmlFor="new-displayName"> Enter your new display name. </label><br />
        <input id="new-displayName" autoComplete='off' value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)} name='new-displayName' type="text" /><br />

        <label id="new-displayName" htmlFor="new-displayName"> Describe yourself. </label><br />
        <input autoComplete='off' value={newAbout} onChange={e => setNewAbout(e.target.value)} name='new-displayName' type="text" maxLength='200'/><br />
        
        <button>
          Finish
        </button>
      </form>
    </section>
  )
}

export default EditProfile