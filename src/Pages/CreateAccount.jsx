import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person';
import { appContext } from '../App'
import Loading from '../COMPONENTS/GENERAL-COMPONENTS/Loading'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IoImageOutline } from "react-icons/io5";
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { usersRef } from '../firebase/config';
import { textAreaResize } from '../GENERAL-FUNCTIONS/functions';
import { functionsContext } from '../CONTEXTS/FunctionsContext';


const CreateAccount = ({ formFor }) => {
  const { ALLUSERNAMES, setUser, user } = useContext(appContext)
  const { generateLink, callError, routeToLogin, loadSingleMedia } = useContext(functionsContext)

  const [HEADER, SETHEADER] = useState('')
  const [BUTTON, SETBUTTON] = useState('')

  const [pageLoading, setPageLoading] = useState(true)
  const [usernameExists, setUsernameExists] = useState(false)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [about, setAbout] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [file, setFile] = useState(null)
  const navigate = useNavigate()
  const allowedChar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '.']


  useEffect(() => {
    if (formFor === 'edit') {
      if (routeToLogin()) {
        navigate('/auth?type=login');
      }
    }
  }, [])


  useEffect(() => {
    if (formFor === 'edit') {
      SETHEADER('Edit your account')
      SETBUTTON('Save changes')

    } else {
      SETHEADER('Create your account')
      SETBUTTON('Create account')
    }
  }, [formFor])


  useEffect(() => {
    if (!file) {
      setAvatar(null)

    } else {
      if (file.type.startsWith('image/')) {
        loadSingleMedia(file, setAvatar)
        
      } else {
        setFile(null)
      }
    }
  }, [file])

  // saintmichael
  // I AM SAINT MICHAEL
  // ACCOUNT FOR SAINT MICHAEL, BY SAINT MICHAEL.



  useEffect(() => {
    if (ALLUSERNAMES) {
      const thisUsernameExists = ALLUSERNAMES
        .filter(name => name !== user?.username)
        .find(name => name.trim().toLowerCase() === username.trim().toLowerCase())

      if (thisUsernameExists) {
        setUsernameExists(true)

      } else {
        setUsernameExists(false)
      }


      if (formFor === 'edit') {
        if (user) {
          setPageLoading(false)
        }

      } else {
        setPageLoading(false)
      }
    }


    if (user?.id && !formFor) {
      navigate('/', { replace: true })
    }
  }, [username, ALLUSERNAMES, user, formFor])


  const setUserDetails = useRef(false)
  useEffect(() => {
    if (user && !setUserDetails.current && formFor === "edit") {
      setUserDetails.current = true
      const { username, displayName, avatarUrl, about } = user

      setUsername(username)
      setDisplayName(displayName)
      setAbout(about)
      setAvatar({ url: avatarUrl })
    }
  }, [user])

  

  const createNewUser = async () => {
    const id = JSON.parse(localStorage.getItem('wowi-auth-token'))
    const avatarUrl = file ? await generateLink(file) : '';

    const thisUser = {
      id, username, displayName, about, avatarUrl,
      firstUsername: username,
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
    }

    setDoc(doc(usersRef, id), thisUser).then(() => {
      setUser(thisUser)
      window.location.replace('/')
      
    }).catch(() => {
      callError(`Couldn't create account. Please try again`)
    })
  }


  const handleEdit = async () => {
    try {
      const userRef = doc(usersRef, user.id);
      const avatarUrl = file ? await generateLink(file) : avatar?.url;
  
      await updateDoc(userRef, {
        username: username,
        avatarUrl: avatarUrl,
        displayName: displayName,
        about: about
      });
  
      navigate('/profile');
      callError('Account updated successfully');

    } catch (error) {
      console.error('Error updating account:', error);
      callError("Couldn't update your account. Please try again");
    }
  };
  



  const removeAvatar = () => {
    if (file || avatar) {
      setFile(null)
      setAvatar(null)
    }
  }


  const checkUsername = e => {
    if (allowedChar.indexOf(e.key) < 0) {
      e.preventDefault()
    }
  }


  const buttonCondition = formFor === 'edit' && username === user?.username &&
    displayName === user?.displayName && about === user?.about &&
    avatar?.url === user?.avatarUrl




  if (pageLoading) {
    return (
      <Loading />
    )

  } else {
    return (
      <main className="create-account-main">
        <form className="sign-in-form"
          onSubmit={e => {
            e.preventDefault()
            if (formFor === 'edit') {
              handleEdit()

            } else {
              createNewUser()
            }
          }}
        >
        <h2> {HEADER} </h2>
  
        <label className='file-input-label' htmlFor="file-input-I">
          <div className="file-input-label-div">
            {avatar ? 
              <img src={avatar.url} alt="" className='sign-up-pfp-img'/>
              :
              <PersonIcon />
            }
          
            <span role='button' onClick={() => removeAvatar()}>
              {avatar ? 
                <DeleteOutlineIcon /> :
                <IoImageOutline />
              }
            </span>
          </div>
  
          {!avatar ?
            <input autoComplete='off' id='file-input-I' name='file-input-I'
              className='file-input' type="file"
                onChange={e => {
                setFile(e.target.files[0])
              }}
              onClick={e => e.target.value = null}
            />
            : <></>
          }
        </label>
  
        <label className='username-label' htmlFor="new-username">
          <span className="title">
            Your username
          </span>
          
          <span style={{ opacity: 0.5 }}>
            @
          </span>
          
          <input autoComplete='off' required value={username} type="text"
            onChange={e => setUsername(e.target.value)} name='new-username'  maxLength='30' 
            onKeyPress={e => checkUsername(e)}
          />
          
          
          <span>
            {username !== '' &&
              <>
                {usernameExists ? 
                  <CloseIcon style={{ color: 'red' }} /> : 
                  <CheckIcon style={{ color: '#3ce83c' }} />
                }
              </>
            }
          </span>
        </label>
  
        <label htmlFor="new-displayName">
          <span className='title'>
            Your display name
          </span>
          
          <input required autoComplete='off' value={displayName} onChange={e => setDisplayName(e.target.value)} name='new-displayName' maxLength='50' type="text" />
        </label>
  
        <label htmlFor="new-about">
          <span className="title">
            Tell us a little about yourself
          </span>
          
          <textarea name='new-about' id='new-about' maxLength='200'
              autoComplete='off' value={about} onInput={e => textAreaResize(e, about)}
              onPaste={e => textAreaResize(e, about)}
            onChange={e => setAbout(e.target.value)}
          ></textarea>
        </label>
        
  
        <div className="sign-in-form-btns-div">
          <button className='create-acct-btn'
            style={{ opacity: buttonCondition ? 0.25 : 1 }}
            disabled={buttonCondition}
          >
            {BUTTON}
          </button>
            
            {formFor === 'edit' &&
              <Link onClick={ () => navigate('/settings')} className='cancel-btn'>
                Cancel
              </Link>
            }
        </div>
        
      </form>
      </main>
    )
  }
}

export default CreateAccount