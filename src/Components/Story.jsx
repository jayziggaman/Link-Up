import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import verifiedBadge from '../Images/verified-badge.jpg'

const Story = ({ type, follow }) => {
  const {users, user, windowWidth, setShowStoryForm, storyType, followStory, userAuth, userStories, followingStories} = useContext(appContext)

  const [person, setPerson] = useState(users.find(user => user.id === follow))
  const [personStories, setPersonStories] = useState([])

  useEffect(() => {
    if (follow) {
      const personRef = collection(db, 'users', follow, 'stories')
      onSnapshot(personRef, snap => {
        const arr = []
        snap.docs.forEach(doc => {
          arr.push({...doc.data(), id:doc.id})
        })
        setPersonStories([...arr])
      })
    }
  }, [person])

  function isStoryViewed(id) {
    let res
    const person = followingStories.find(ind => ind.creatorId === id)
    person.creatorStories.map(story => {
      res = user?.visitedRoutes?.value.some(route => route.includes(story.id))
    })
    return res
  }

  function mineViewed() {
    let res
    userStories.map(story => {
      res = user?.visitedRoutes?.value.some(route => route.includes(story.id))
    })
    return res
  }
  
  return (
    <div id={follow} className='story'>
      {type === 'user' && userStories?.length < 1 &&
        <div style={{border: user?.stories.value?.length < 1 && 'none'}} className="story-indicator">
          <img src={user?.avatarUrl} alt="" />
          <div className='story-overlay' onClick={() => setShowStoryForm(true)}>
            <FaPlus />
          </div>
        </div>
      }
      {type === 'user' && userStories?.length > 0 &&
        <>
        {mineViewed() ?
          <Link
            to={{
              pathname: `stories/${user.username}/${userStories[0]?.id}`,
              state: followStory.current
            }}
            style={{ border: userStories?.length < 1 && 'none',  border: '1.5px solid gray'}}
            className="story-indicator" role={'button'}
            onClick={() => {
              storyType.current = 'user'
              followStory.current = userAuth
          }}>
            <img src={user?.avatarUrl} alt="" />
          </Link>
          :
          <Link
            to={{
              pathname: `stories/${user.username}/${userStories[0]?.id}`,
              state: followStory.current
            }}
            style={{ border: userStories?.length < 1 && 'none',  border: '1.5px solid red'}}
            className="story-indicator" role={'button'}
            onClick={() => {
              storyType.current = 'user'
              followStory.current = userAuth
          }}>
            <img src={user?.avatarUrl} alt="" />
          </Link>
        }
        </>
      }
      
      
      {type === 'following' &&
        <>
          {isStoryViewed(follow) ?
          <Link
            to={{
              pathname: personStories.length > 0 ? `stories/${person.username}/${personStories[0].id}` : '', state: followStory.current
            }}
            className="story-indicator" role={'button'}
            style={{ display: personStories?.length < 1 && 'none', border: '1.5px solid gray'}}
            onClick={() => {
              followStory.current = follow
              storyType.current = 'following'
            }}>
              <img src={person?.avatarUrl} alt="" />
            </Link> 
          :
          <Link
            to={{
              pathname: personStories.length > 0 ? `stories/${person.username}/${personStories[0].id}` : '',
              state: followStory.current
            }} className="story-indicator" role={'button'}
            style={{ display: personStories?.length < 1 && 'none', border: '1.5px solid red' }}
            onClick={() => {
              followStory.current = follow
              storyType.current = 'following'
            }}>
              <img src={person?.avatarUrl} alt="" />
            </Link>
          }
        </>
      }

      {type === 'user' &&
        <p> Your story </p>
      }

      {type === 'following' && windowWidth < 500 && personStories?.length > 0 &&<p>
        {person?.username.length >= 7 ?
          <>
            {person?.username.slice(0, 7)}...
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          :
          <>
            {person?.username}
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          }
        </p>
      }

      {type === 'following' && windowWidth > 500 && windowWidth < 1000 && personStories?.length > 0 &&<p>
        {person?.username.length >= 8 ?
          <>
            {person?.username.slice(0, 8)}...
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          :
          <>
            {person?.username}
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          }
        </p>
      }

      {type === 'following' && windowWidth >= 1000 && personStories?.length > 0 &&<p>
          {person?.username.length >= 15 ?
            <>
            {person?.username.slice(0, 15)}...
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          :
          <>
            {person?.username}
            {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
          </>
          }
        </p>
      } 
        
    </div>
  )
}

export default Story



 // useEffect(() => {
  //   if (person) {
  //     setPersonStories(person.stories.value)
  //   }
  // }, [person])

  // return (
  //   <div id={follow} className='story'>
  //     {type === 'user' && userStories?.length < 1 &&
  //       <div style={{border: user?.stories.value?.length < 1 && 'none'}} className="story-indicator">
  //         <img src={user?.avatarUrl} alt="" />
  //         <div className='story-overlay' onClick={() => setShowStoryForm(true)}>
  //           <FaPlus />
  //         </div>
  //       </div>
  //     }
  //     {type === 'user' && userStories?.length > 0 &&
  //       <Link to={`stories/${user.username}/${userStories[0]?.id}`} style={{ border: userStories?.length < 1 && 'none' }} className="story-indicator" role={'button'} onClick={() => {
  //         storyType.current = 'user'
  //         followStory.current = userAuth
  //       }}>
  //         <img src={user?.avatarUrl} alt="" />
  //       </Link>
  //     }
      
      
  //     {type === 'following' &&
  //       <Link to={personStories?.length > 0 ? `stories/${person.username}/${personStories[0]?.id}` : ''} className="story-indicator" role={'button'}  style={{ display: personStories?.length < 1 && 'none' }} onClick={() => {
  //         followStory.current = follow
  //         storyType.current = 'following'
  //       }}>
  //         <img src={person?.avatarUrl} alt="" />
  //       </Link>
  //     }

  //     {type === 'user' &&
  //       <p> Your story </p>
  //     }

  //     {type === 'following' && windowWidth < 1000 && personStories?.length > 0 &&<p>
  //       {person?.username.length >= 8 ?
  //         <>
  //           {person?.username.slice(0, 8)}...
  //           {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
  //         </>
  //         :
  //         <>
  //           {person?.username}
  //           {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
  //         </>
  //         }
  //       </p>
  //     }

  //     {type === 'following' && windowWidth >= 1000 && personStories?.length > 0 &&<p>
  //         {person?.username.length >= 15 ?
  //           <>
  //           {person?.username.slice(0, 15)}...
  //           {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
  //         </>
  //         :
  //         <>
  //           {person?.username}
  //           {person.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" />}
  //         </>
  //         }
  //       </p>
  //     } 
        
  //   </div>
  // )