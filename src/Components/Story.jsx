import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import { functionsContext } from '../CONTEXTS/FunctionsContext'

const Story = ({ type, follow, stories }) => {
  const { users, user, windowWidth } = useContext(appContext)
  

  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState(null)

  const navigate = useNavigate()
  
  useEffect(() => {
    if (otherUser && users && user) {
      setLoading(false)
    }
  }, [otherUser, users, user])


  useEffect(() => {
    if (users) {
      setOtherUser(users.find(user => user.id === follow))
    }
  }, [users, follow])



  if (!loading) {
    return (
      <div id={follow} className='story'>
        {type === 'user' ?
          <>
            {stories.length === 0 ?
              <div className="story-indicator">
                <UserPfp user={user} />
                
                <div className='story-overlay'
                  onClick={() => navigate('/new-story')}
                >
                  <FaPlus />
                </div>
              </div>
              :
              <>
                <StoryLink
                  stories={stories} storyId={stories[0].id}
                  storyCreator="user" storyUser={user}
                />

                <p> Your story </p>
              </>
            }
          </>
        
        : type === 'following' && stories.length > 0 &&
          <>
            <StoryLink
              stories={stories} storyId={stories[0].id} 
              storyCreator="following" storyUser={otherUser}
            />
            
            {windowWidth < 500 &&
              <OtherUserName num={7} otherUser={otherUser} />
            }
      
            {windowWidth > 500 && windowWidth < 1000 && 
              <OtherUserName num={8} otherUser={otherUser} />
            }
      
            {windowWidth >= 1000 && 
              <OtherUserName num={15} otherUser={otherUser}  />
            } 
          </>
        }
      </div>
    )
  }
}

export default Story



const StoryLink = ({ storyId, storyCreator, storyUser, stories }) => {
  const { user } = useContext(appContext)

  const { isStoryViewed } = useContext(functionsContext)

  const { username } = storyUser

  const storyLink = `/stories/${username.trim()}/${storyId}?storyBy=${storyCreator}`


  
  return (
    <Link
      to={storyLink} role={'button'}
      className={`story-indicator ${!isStoryViewed(user, stories)  ? "active" : ""}`}
    >
      <UserPfp user={storyUser} />
    </Link>
  )
}





const OtherUserName = ({ num, otherUser }) => {
  const { username, userType } = otherUser
  
  return (
    <p>
      {username.length >= num ?
      <>
        {username.slice(0, num)}...
      </>
      :
      <>
        {username}
      </>
      }
      {userType === 'creator' && <VerifiedBadge />}
    </p>
  )
}