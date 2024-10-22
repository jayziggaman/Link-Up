import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import {motion} from "framer-motion"
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, messageRoomsRef, usersRef } from '../firebase/config'
import FriendsList from '../COMPONENTS/FriendsList'
import StoryList from '../COMPONENTS/StoryList'
import {v4 as uuidv4} from 'uuid';
import { compareStrings, textAreaResize } from '../GENERAL-FUNCTIONS/functions'
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from '../COMPONENTS/GENERAL-COMPONENTS/VerifiedBadge'
import { FaPlus, FaEye, FaAngleUp, FaAngleDown, FaImages, FaPaperPlane } from 'react-icons/fa'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DMMedia from '../COMPONENTS/GENERAL-COMPONENTS/DMMedia';
import Loading from '../COMPONENTS/GENERAL-COMPONENTS/Loading';
import Video from '../COMPONENTS/GENERAL-COMPONENTS/Video';


const StoryLayout = () => {
  const { userName, storyId } = useParams()
  const { users, user, userStories, followingStories } = useContext(appContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const [storyBy, setStoryBy] = useState(null)
  const [storyDoesnNotExist, setStoryDoesNotExist] = useState(false)

  const [loading, setLoading] = useState(true)
  const [storyCreator, setStoryCreator] = useState(null)
  const [storyIndex, setStoryIndex] = useState(0)
  const [index, setIndex] = useState(0)

  const [stories, setStories] = useState(null)
  const [currStory, setCurrStory] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  
  
  const time = new Date()

  //user's stories - userStories
  //other person's story - stories + their id
  //stories.stories - another person's story list
  //collection of other user's stories - followingStories
  //currStory - current story in view
  //a user's storylist to cause a rerender - stories



  useEffect(() => {
    const thisStoryBy = searchParams.get("storyBy")

    if (thisStoryBy) {
      setStoryBy(thisStoryBy)

    } else {
      navigate(-1)
    }
  }, [searchParams])



 
  useEffect(() => {
    setIndex(prev => prev - prev)
  }, [storyIndex])



  useEffect(() => {
    if (user) {
      if (storyBy === 'user' && userStories) {
        if (userStories.length !== 0) {
          setStories([...userStories])
  
        } else {
          setStoryDoesNotExist(true)
        }
        
      } else if (storyBy === 'following' && followingStories) {
        if (followingStories.length !== 0) {
          const theseStories = followingStories.find(storyObj => storyObj.creatorUsername === userName)?.creatorStories

          if (theseStories) {
            setStories([...theseStories])

          } else {
            setStoryDoesNotExist(true)
          }

        } else {
          if (!user?.id) {
            const thisUser = users.find(person => person.username.trim() === userName.trim())
            const storiesRef = collection(usersRef, thisUser.id, 'stories')
            const storyQuery = query(storiesRef, orderBy('createdAt', 'asc'))



            onSnapshot(storyQuery, snap => {
              const arr = []
              snap.docs.forEach(doc => {
                arr.push({...doc.data(), id: doc.id})
              })
              setStories([...arr])
            })
            
          }
        }
      }
      const thisIndex = followingStories.findIndex(storyObj => storyObj.creatorUsername === userName)
      
      setStoryIndex(prev => prev - prev + (thisIndex))
    }
  }, [followingStories, location.pathname, userName, storyBy, userStories, user])




  useEffect(() => {
    if (stories) {
      const thisStory = stories.find(story => story.id === storyId)

      if (thisStory) {
        setCurrStory(thisStory)
        setStoryDoesNotExist(false);

      } else {
        setStoryDoesNotExist(true)
      }
    }
  }, [stories, location.pathname, storyId])



  useEffect(() => {
    if (users && currStory) {
      setStoryCreator(users.find(user => user.id === currStory.creator))
    }
  }, [users, currStory])

  useEffect(() => {
    if (storyDoesnNotExist) {
      setLoading(false)

    } else {
      if (currStory && storyCreator && stories && storyBy) {
        setLoading(false)
  
      } else {
        setLoading(true)
      }
    }
  }, [currStory, storyCreator, stories, storyDoesnNotExist, storyBy])


  

  useEffect(() => {
    if (stories && currStory && user && user.id && storyCreator) {
      function updateStoryViews() {
        const i = stories.findIndex(story => story.id === currStory.id)
        stories && setIndex(prev => (prev - prev) + i)


        const storyViewers = currStory.viewers.value
        const condition = storyViewers.find(view => view === user.id)

        if (condition) {
          return

        } else {
          const storyRef = doc(db, 'users', storyCreator.id, 'stories', currStory.id)

          updateDoc(storyRef, {
            viewers: {
              value: [...storyViewers, user.id]
            }

          }).catch(() => {
            updateStoryViews()
          })
        }
      }

      updateStoryViews()
    }


    if (user && user.id) {
      function updateUserRoutes() {
        const userRoutes = user.visitedRoutes.value

        const userHasSeenStory = userRoutes.find(url => url.value === location.pathname)

        if (userHasSeenStory) {
          return

        } else {
          const userRef = doc(db, 'users', user.id)
          updateDoc(userRef, {
            visitedRoutes: {
              value: [...userRoutes,
              { createdAt: time.getTime(), value: location.pathname }]
            }

          }).catch(() => {
            updateUserRoutes()
          })
        }
      }
      
      updateUserRoutes()
    }
  }, [currStory, user, location.pathname, storyCreator])
  


  const goToNextStory = () => {
    if (index !== (stories.length - 1)) {
      const newIndex = index + 1
      setIndex(prev => (prev - prev) + newIndex)

      const nextStoryId = stories[newIndex].id

      const storyLink =
        `/stories/${storyCreator.username}/${nextStoryId}?storyBy=${storyBy}`

      navigate(storyLink)

    } else if (storyIndex !== (followingStories.length - 1)) {
      if (storyBy === 'following') {
        goToNextStories()

      } 
    } else {
      const FROM = location.state.from
      FROM ? navigate(FROM) : navigate('/')
    }
  }


  const goToPrevStory = () => {
    if (index !== 0) {
      const newIndex = index - 1
      setIndex(prev => (prev - prev) + newIndex)

      const nextStoryId = stories[newIndex].id
      const storyLink =
        `/stories/${storyCreator.username}/${nextStoryId}?storyBy=${storyBy}`

      navigate(storyLink)

    } else if (storyIndex !== 0 && storyBy === 'following') {
      goToPrevStories()
    }
  }


  const goToNextStories = () => {
    const newIndex = storyIndex + 1
    setStoryIndex(prev => (prev - prev) + newIndex)

    const nextUser = users.find(user => user.id === followingStories[newIndex].creatorId)
    const nextStoryId = followingStories[newIndex].creatorStories[0].id

    const storyLink =
        `/stories/${nextUser.username}/${nextStoryId}?storyBy=${storyBy}`

    navigate(storyLink)

  }


  const goToPrevStories = () => {
    const newIndex = storyIndex - 1
    setStoryIndex(prev => (prev - prev) + newIndex)

    const prevUser = users.find(user => user.id === followingStories[newIndex].creatorId)
    const prevStoryId = followingStories[newIndex].creatorStories[0].id

    const storyLink =
        `/stories/${prevUser.username}/${prevStoryId}?storyBy=${storyBy}`

    navigate(storyLink)
  }



  useEffect(() => {
    if (stories && stories.length !== 0) {
      const interval = setInterval(() => {
        goToNextStory()
      }, 10000)
  
      return () => clearInterval(interval)
    }
  }, [index, storyIndex, stories, followingStories, storyCreator])



  
  if (loading) {
    return (
      <StoryBody bodyFor="loading" />
    )
   
  } else if (storyDoesnNotExist) {
    return (
      <StoryBody bodyFor="not-found" />
    )

  } else {
    const { id, type, media, viewers, createdAt, props } = currStory

    const { displayName, userType } = storyCreator

    return (
      <StoryBody
        id={id} type={type} media={media} viewers={viewers}
        createdAt={createdAt} props={props} displayName={displayName}
        userType={userType} currStory={currStory} storyCreator={storyCreator}
        goToNextStories={goToNextStories} goToPrevStories={goToPrevStories}
        goToNextStory={goToNextStory} goToPrevStory={goToPrevStory}
        index={index} setIndex={setIndex} storyBy={storyBy} stories={stories}
        storyIndex={storyIndex}
      />
    )
 }
}

export default StoryLayout



const StoryBody = ({
  id, type, media, viewers, createdAt, props, displayName, userType, currStory, storyCreator, goToNextStories, goToNextStory, goToPrevStories, goToPrevStory, storyBy, index, setIndex, storyIndex, stories, bodyFor
}) => {
  const { followingStories, user, deleteStory, setShowShareMenu, setSelectedMessage, selectedMessage } = useContext(appContext)

  const { timeSincePosted } = useContext(functionsContext)

  const [showViews, setShowViews] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()


  const FROM = location.state?.from
  

  return (
    <main className='story-layout'>
      <div className='story-options'>
        <button className='story-cancel'
          onClick={() => FROM ? navigate(FROM) : navigate('/')}
        >
          <CloseIcon />
        </button>

        {storyCreator?.id === user?.id && 
          <div className='add-story' role={'button'}
            onClick={() => {
              navigate('/new-story')
            }}
          >
            <FaPlus />
          </div>
        }
      </div>

      {bodyFor !== 'loading' && bodyFor !== "not-found" ?
        <>
          {user.id === storyCreator.id &&
            <div className="story-viewers">
              <div className='views-icon' role={'button'}
                onClick={() => setShowViews(!showViews)}
              >
                <span>
                  {showViews ? <FaAngleDown /> : <FaAngleUp />}
                </span>
                  <FaEye /> {viewers.value.length}
              </div>

              <div className='story-viewers-list'>
                {showViews &&
                  viewers.value.map((viewer, index) => {
                    return (
                      <StoryList key={index} viewer={viewer} />
                    )
                  })}
              </div>
            </div>
          }
        </>
        : <></>
      }

      <section className="story-content" id="story-content">
        {storyBy === 'following' && followingStories.length > 1 && !bodyFor ?
          <>
            <button onClick={() => goToPrevStories()}
              style={{ display: storyIndex !== 0 ? 'flex' : 'none' }}
              className="change-stories"
            >
              <ArrowBackIosIcon />
            </button>

            <button onClick={() => goToNextStories()}
              style={{ display: storyIndex !== (followingStories.length - 1) ? 'flex' : 'none' }}
              className="change-stories"
            >
              <ArrowForwardIosIcon />
            </button>
          </>
          : <></>
        }

        <div className="story-wrapper">
          {!bodyFor ?
            <>
              <div role={'button'} className='story-minus-one'
                onClick={() => goToPrevStory()}
              >
              </div>
              
              <div className='story-plus-one' role={'button'}
                onClick={() => goToNextStory()}
              >
              </div>

              <div className="story-abs" id="story-abs">
                <div className='story-amt'>
                  {stories.map((_, ind) => {
                    return (
                      <div key={ind}
                        className={index === ind ? 'curr' : ''}
                      >
                        <motion.span
                          initial={{ width: '0%' }} 
                          animate={index === ind ? { width: '100%' } : { width: '0%' }} 
                          transition={{ duration: 10 }} 
                        ></motion.span>
                      </div>
                    )
                  })}
                </div>

                <div className="story-pfp-username">
                  <>
                    <UserPfp user={storyCreator} />

                    <div className="name-time-opt">
                      <span>
                        <span className='story-username'>
                          <span>
                            {storyBy === "user" ?
                              "Your Story"
                              :
                              displayName.length > 10 ?
                                `${displayName.slice(0, 10)}...` : displayName
                            }
                          </span>

                          {userType === 'creator' && <VerifiedBadge />}
                        </span>
                        

                        <span className='timeSincePosted-span'>
                          {timeSincePosted(createdAt)}
                        </span>
                      </span>

                      <div className='delete-share-btn-div'>
                        <button className='share-btn'
                          onClick={() => {
                            setShowShareMenu(true)
                            setSelectedMessage({
                              ...selectedMessage, storyId: id, post: currStory, creator: storyCreator
                            })
                          }}
                        >
                          <IosShareIcon />
                        </button>

                        {user.id === storyCreator.id &&
                          <button className='delete-btn' id='delete-btn'
                            onClick={() => {
                              deleteStory(id)

                              if (stories.length - 1 > 0) {
                                index === 0 ?
                                  setIndex(ind => ind + 1) : goToPrevStory()
                              } else {
                                navigate('/')
                              }
                            }}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </button>
                        }
                      </div>
                    </div>
                  </>
                </div>
              </div>

              <div className="story-content-body"
                style={{
                  backgroundColor: props.backgroundColor
                }}
              >
                {type === 'Text-Story' ?
                  <StoryCaption currStory={currStory} />
      
                : type === 'Img-Story' ?
                  <>
                    <img className='story-content-img' src={media} alt="" />
                    
                    <StoryCaption currStory={currStory} />
                  </>
      
                : type === 'Vid-Story' &&
                  <>
                    <Video shouldAutoplay={true} source={media}
                      classname='story-content-vid'
                    />
                    
                    <StoryCaption currStory={currStory} />
                  </>
                }

                {user?.id && user.id !== storyCreator.id &&
                  <StoryReplyForm
                    storyCreator={storyCreator} currStory={currStory}
                  />
                }
              </div>
            </>
            :
            <>
              {bodyFor === 'loading' ?
                <Loading called={true} />

                : bodyFor === 'not-found' &&
                <StoryNotFound FROM={FROM} />
              }
            </>
          }
        </div>
      </section>
    </main>
  )
}





const StoryNotFound = ({ FROM }) => {
  return (
    <div className='story-not-found'>
      ☹️
      <span>
        Oops...looks like this story has been deleted
      </span>

      <Link
        to={FROM ? FROM : '/'}
      >
        Go Back
      </Link>
    </div>
  )
}






const StoryCaption = ({ currStory }) => {
  const { isLinkElement, hrefChecker } = useContext(functionsContext)
  const { props, caption } = currStory
  const { fontFamily, fontSize, fontStyle, fontWeight, color, backgroundColor, } = props

  return (
    <pre
      style={{
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        fontFamily: fontFamily,
        color: color,
        fontSize: fontSize
      }}
    >
      {isLinkElement(caption) ?
        <a className='out-link' href={hrefChecker(caption)} target='_blank'>
          {caption}
        </a>
        :
        <>
          {caption}
        </>
      }
    </pre>
  )
}




const StoryReplyForm = ({ storyCreator, currStory }) => {
  const { day, month, year, hours, mins, period, location, user } = useContext(appContext)
  const { checkIfDMExists, createDM, loadMedia, callError, generateLink } = useContext(functionsContext)

  const [dmUrl, setDmUrl] = useState(null)
  const [files, setFiles] = useState([])
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState([])



  useEffect(() => {
    if (files[0] === undefined) {
      setMedia([])
    }
  }, [files])



  useEffect(() => {
    if (user && user.id && storyCreator) {
      setDmUrl(
        compareStrings(user.id, storyCreator.id)
      )
    }
  }, [user, storyCreator])
  

  const initializeReplyStory = async () => {
    let type = ''
    if (media.length === 0) {
      type = 'story-text-message'

    } else if (media.length === 1) {
      if (media[0].type === 'img') {
        type = 'story-photo-message'

      } else if (media[0].type === 'video') {
        type = 'story-video-message'

      }
    } else {
      type = 'story-group-media-message'
    }


    try {
      const messageRoomRef = doc(messageRoomsRef, dmUrl);
      const dmExists = await checkIfDMExists(messageRoomRef);
  
      if (dmExists) {
        replyStory(type);

      } else {
        await createDM(user, storyCreator, dmUrl);
        replyStory(type); 
      }

    } catch (error) {
      callError(`Couldn't send reply to ${storyCreator.displayName}, please try again`)
    }
  }


  const replyStory = async (type) => {
    const ref = collection(messageRoomsRef, dmUrl, 'messages');
    const id = uuidv4()

    const newMedia = files[0] ? await generateLink(files) : []

    setDoc(doc(ref, id), {
      id, type, caption,
      media: newMedia,
      date: `${day}/${month}/${year}`,
      time: `${hours}:${mins} ${period}`, 
      creator: user.id,
      createdAt: serverTimestamp(),
      
      story: currStory,

    }).then(() => {
      callError("Reply sent!")
      setCaption('')
      setFiles([])

    }).catch(() => {
      callError("Couldn't send reply. Please try again.")
    })
  }



  return (
    <form action="submit" className="story-reply-form"
      onSubmit={e => {
        initializeReplyStory()
        e.preventDefault()
      }}
    >
      <div className="story-reply-form-div">
        <DMMedia media={media} setFiles={setFiles} setMedia={setMedia} />


        <label htmlFor="story-reply-media-input">
          <span>
            <FaImages />
          </span>

          <input type="file" name='story-reply-media-input' id='story-reply-media-input'
            onClick={e => {
              e.target.files = null
            }}
            onChange={e => {
              loadMedia(e.target.files, setMedia)
              setFiles(e.target.files)
            }} multiple='multiple'
          />
        </label>

        <textarea autoComplete='off' placeholder="Reply Story..."
          name="story-caption" id="story-caption" value={caption}
          style={{ height: caption === '' ? '2.5rem' : '' }}
          onChange={e => setCaption(e.target.value)}
          onInput={e => textAreaResize(e, caption)}
          onPaste={e => textAreaResize(e, caption)}
        ></textarea>

        <button>
          <FaPaperPlane />
        </button>
      </div>
    </form>
  )
}