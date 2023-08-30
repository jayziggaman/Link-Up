import { doc, setDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { auth, storage, usersRef } from '../firebase/config'
import {v4 as uuidv4} from 'uuid';
import { FaPlus } from 'react-icons/fa'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import loadVideoLight from '../Images/load-video-light.mp4'

const SignIn = ({type}) => {
  const {setGlobalError, gError, cookies, users, enableSIgnIn} = useContext(appContext)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [about, setAbout] = useState('')
  const avatarUrl = useRef(null)
  const [image, setImage] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [corrMedia, setCorrMedia] = useState(false)
  const navigate = useNavigate()
  const allowedChar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '.']

  const createNewUser = async () => {
    if (username !== '') {
      cookies.set('wowi-auth-token', auth.currentUser.uid)
      localStorage.setItem('wowi-auth-token', JSON.stringify(auth.currentUser.uid))
      let selected
      corrMedia ? selected = image : selected = null

      if (selected) {
        const condition = users.find(user => user.username === username)
        if (condition) {
          gError.current.style.visibility = 'visible'
          setGlobalError( 'username already in use' )
          setTimeout(() => {
            gError.current.style.visibility = 'hidden'
          }, 2000)
          console.log(username + 'in use')
        } else {
          const avatarRef = ref(storage, `profile-avatars/${auth.currentUser.uid}`)
          uploadBytes(avatarRef, selected).then(() => {
            getDownloadURL(avatarRef).then(url => {
              avatarUrl.current = url
            }).then(() => {
              setDoc(doc(usersRef, auth.currentUser.uid), {
                username: username,
                displayName: displayName,
                about: about,
                userId: auth.currentUser.uid,
                dmId: uuidv4(),
                avatarUrl: avatarUrl.current,
                posts: { value: [] },
                stories: { value: [] },
                followers: { value: [] },
                following: { value: [] },
                postSaves: { value: [] },
                pageSaves: { value: [] },
                likes: { value: [] },
                directMessages: { value: [] },
                friends: { value: [] },
                blocked: { value: [] },
                notifications: { value: [] },
                visitedRoutes: { value: [] },
                userType: 'user'
              }).then(() => {
                navigate('/', {replace: true})
              })
            }).catch(err => {
              gError.current.style.visibility = 'visible'
              setGlobalError( err.message )
              setTimeout(() => {
                gError.current.style.visibility = 'hidden'
              }, 2000 )
            })
          })
          
        }
      } else {
        const condition = users.find(user => user.username === username)
        if (condition) {
          gError.current.style.visibility = 'visible'
          setGlobalError( 'username already in use' )
          setTimeout(() => {
            gError.current.style.visibility = 'hidden'
          }, 2000)
          console.log(username + 'in use')
        } else {
          setDoc(doc(usersRef, auth.currentUser.uid), {
            username: username,
            displayName: displayName,
            about: about,
            userId: auth.currentUser.uid,
            dmId: uuidv4(),
            avatarUrl: '',
            posts: { value: [] },
            stories: { value: [] },
            followers: { value: [] },
            following: { value: [] },
            postSaves: { value: [] },
            pageSaves: { value: [] },
            likes: { value: [] },
            directMessages: { value: [] },
            friends: { value: [] },
            blocked: { value: [] }, 
            notifications: { value: [] },
            visitedRoutes: { value: [] },
            userType: 'user'
          }).then(() => {
            navigate('/', {replace: true})
          })
        }
      }
    }
  }

  useEffect(() => {
    const input = document.querySelector('.file-input')

    const changeHandler = async (e) => {
      setImage(e.target.files[0])
    }
    input.addEventListener('change', changeHandler)
    
    return () => {
      input.removeEventListener('change', changeHandler)
    }
  }, [])

  
  useEffect(() => {
    const types = ['image/png', 'image/jpeg', 'image/jpg']
    if (image && types.includes(image.type)) {
      setProcessing(true)
      setCorrMedia(true)
      const selected = image
      let pfpUrl

      const avatarRef = ref(storage, `pending-profile-avatars/${auth.currentUser.uid}`)
      uploadBytes(avatarRef, selected).then(() => {
        getDownloadURL(avatarRef).then(url => {
          pfpUrl = url
        }).then(() => {
          setProcessing(false)
          document.querySelector('.sign-up-pfp-img').src = pfpUrl
        })
      })
    }
  }, [image])

  

  return (
    <form action="submit" className={enableSIgnIn ? "show edit-profile-form sign-in-form" : "edit-profile-form sign-in-form"} onSubmit={e => {
      e.preventDefault()
      createNewUser()
    }}>
      <h2> Set up your account </h2>

      <label className='file-input-label' htmlFor="file-input-I">
        <div className="file-input-label-div">
          <img src='' alt="" className='sign-up-pfp-img'/>
          <span>
            <FaPlus />
          </span>
        </div>
        <input autoComplete='off' id='file-input-I' name='file-input-I' className='file-input' type="file"
          onClick={e => e.target.value = null}
        />

        <div style={{ display: `${processing ? 'block' : 'none'}` }}  className="media-processing-overlay">
          <video className="media-processing-video" autoPlay muted loop src={loadVideoLight}></video>
        </div>
      </label>

      <label htmlFor="new-username">
        Enter your username.
      </label><br />
      <input autoComplete='off' required value={username} onChange={e => setUsername(e.target.value)} name='new-username' type="text" onKeyPress={e => {
        if(allowedChar.indexOf(e.key) < 0) e.preventDefault()
      }}/><br />

      <label htmlFor="new-displayName">
        Enter your display name.
      </label><br />
      <input autoComplete='off' value={displayName} onChange={e => setDisplayName(e.target.value)} name='new-displayName' type="text" /><br />

      <label htmlFor="new-about">
        Describe yourself.
      </label><br />
      <input autoComplete='off' value={about} onChange={e => {
        setAbout(e.target.value)
      }} name='new-about' type="text" maxLength='200'/><br />
      
      

      <button>
        Finish
      </button>
    </form>
  )
}

export default SignIn