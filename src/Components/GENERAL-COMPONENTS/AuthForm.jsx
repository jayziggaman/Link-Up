import React, { useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setAuthInStorage } from '../../GENERAL-FUNCTIONS/functions';
import { auth, db, postsRef, usersRef } from '../../firebase/config';
import { appContext } from '../../App';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { functionsContext } from '../../CONTEXTS/FunctionsContext';
import Loading from './Loading';

const AuthForm = ({ showState, setShowState, authType, formFor, routedFrom }) => {
  const { users, setUser, user, allPosts, setShowLoading } = useContext(appContext)
  const { callError } = useContext(functionsContext)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')


  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()



  useEffect(() => {
    if (!showState) {
      setEmail('')
      setPassword('')
      setCPassword('')
    }
  }, [showState])


  const checkForAuth = () => {
    const userAuth = localStorage.getItem('wowi-auth-token')

    if (userAuth) {
      return true
    }
    return false
  }
  


  const login = async () => { 
    const isUserAuthenticated = checkForAuth()

    if (isUserAuthenticated) {
      navigate('/create-account')

    } else {
      try {
        setShowLoading(true)
        const result = await signInWithEmailAndPassword(auth, email, password)
        const { user } = result
        const { uid } = user;
          
        const thisUser = users.find(user => user.id === uid);
        setAuthInStorage(uid)
  
        setUser(thisUser)
        window.location.replace(routedFrom)
  
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          callError("Oops, looks like that account does not exist")
  
        } else if (error.code === "auth/wrong-password") {
          callError(`Incorrect password. Please enter the password linked to this account`)
  
        } else {
          callError(`Couldn't complete ${authType}. Please try again`)
        }

      } finally {
        setShowLoading(false)
      }
    }
  }
  


  const signUp = async () => { 
    try {
      setShowLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const { user } = result
      const { uid } = user;

      setAuthInStorage(uid)
      navigate('/create-account')

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        callError("This email is already linked to another account")

      } else {
        callError(`Couldn't complete ${authType}. Please try again`)
      }

    } finally {
      setShowLoading(false)
    }
  }

  // second@gmail.com

  const reAuthenticateUser = async (errorMessage) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      const user = result.user.auth.currentUser
      const credential = EmailAuthProvider.credential(email, password);

      await reauthenticateWithCredential(user, credential);
      localStorage.removeItem('wowi-auth-token')

      return user

    } catch (error) {
      setLoading(false)
      if (error.code === "auth/wrong-password") {
        callError(`Incorrect password. Please enter the password linked to this account`)

      } else {
        callError(errorMessage)
      }
    }
  }




  const logout = async (errorMessage) => {
    const user = await reAuthenticateUser(errorMessage ? errorMessage : `We couldn't log you out. Please try again`)
    await signOut(auth); 
    setLoading(false)
    window.location.replace('/')
    return user
  };


  

  const deleteAccount = async () => {
    const user = await logout(`We couldn't delete your account. Please try again`)
    const { uid } = user

    users.map(user => {
      if (user) {
        const { id, followers, following, pageSaves, friends } = user
      
        const ref = doc(db, 'users', id)

        updateDoc(ref, {
          followers: {
            value: [...followers.value.filter(follower => follower !== uid)]
          },

          following: {
            value: [...following.value.filter(follow => follow !== uid)]
          },

          friends: {
            value: [...friends.value.filter(friend => friend !== uid)]
          },

          pageSaves: {
            value: [...pageSaves.value.filter(save => save !== uid)]
          }
        })
      }
    })

    allPosts.map(post => {
      if (post) {
        const { id, likes, creator } = post
      
        const ref  = doc(postsRef, id)

        updateDoc(ref, {
          likes: {
            value: [...likes.value.filter(like => like === uid)]
          }
        })

        const commentsRef = collection(postsRef, id, 'comments')

        onSnapshot(commentsRef, snap => {
          const commentsArr = []
          snap.docs.forEach(doc => {
            commentsArr.push({ ...doc.data(), id: doc.id })
          })

          commentsArr.map(comment => {
            const { id: commentId, likes: commentLikes, creator: commentCreator } = comment

            const commentRef = doc(postsRef, id, 'comments', commentId)

            updateDoc(commentRef, {
              likes: {
                value: [...commentLikes.value.filter(like => like === uid)]
              }
            })




            const repliesRef = collection(postsRef, id, 'comments', commentId, 'replies')

            onSnapshot(repliesRef, snap => {
              const replyArr = []
              snap.docs.forEach(doc => {
                replyArr.push({ ...doc.data(), id: doc.id })
              })

              replyArr.map(reply => {
                const { id: replyId, likes: replyLikes, creator: replyCreator } = reply

                const replyRef = doc(postsRef, id, 'comments', commentId, 'replies', replyId)

                updateDoc(replyRef, {
                  likes: {
                    value: [...replyLikes.value.filter(like => like === uid)]
                  }



                }).then(() => {
                  if (replyCreator === uid) {
                    deleteDoc(replyRef)
                  }

                  if (commentCreator === uid) {
                    deleteDoc(commentRef)
                  }

                  if (creator === uid) {
                    deleteDoc(ref)
                  }
                })
              })
            })
          })
        })
      }
    })

    const docRef = doc(usersRef, uid)
    deleteDoc(docRef)
    
    await deleteUser(user); 
  }



  return (
    <div className={showState ? "auth-form-div show-form" : "auth-form-div"}>
      <form className='auth-form'>
        <button className='cancel-btn'
          onClick={(e) => {
            e.preventDefault()
            setShowState(false)
          }}
        >
          <CloseIcon />
        </button>

        <input autoComplete='off' value={email} onChange={e => setEmail(e.target.value)} className='text-input' type="email" placeholder='Email' /> 
        
        <input autoComplete='off' value={password} onChange={e => setPassword(e.target.value)} className='text-input' type="password" placeholder='Password' />

        <button
          onClick={e => {
            e.preventDefault()

            if (formFor === 'auth') {
              if (authType === 'login') {
                login()
  
              } else if (authType === 'signup') {
                signUp()
              }

            } else if (formFor === 'logout') {
              setLoading(true)
              logout()

            } else if (formFor === 'delete-acct') {
              deleteAccount()
            }
          }}
        >
          Submit
        </button>
        {/* michaelchisom700@gmail.com */}
        
        <LinkToOtherType type={authType} />

        {loading && <Loading called={true}/>}
      </form>
    </div>
  )
}

export default AuthForm




const LinkToOtherType = ({ type }) => {
  const linkTo = type === 'login' ? '/auth?type=signup' :
    type === 'signup' && '/auth?type=login'

  const linkText =
    type === 'login' ? `Don't have an account? Sign up` :
      type === 'signup' && 
      `Already have an account? Log in`
  
  return (
    <Link to={linkTo}> {linkText} </Link>
  )
}