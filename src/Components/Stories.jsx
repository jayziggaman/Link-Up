import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'
import Story from './Story'

const Stories = () => {
  const { user, homeLoading, followingStories, userStories } = useContext(appContext)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]


  
  if(homeLoading) {
    return (
      <div className="stories">
        {loadArr.map((_, index) => {
          return(
            <div key={index} className="story-loading">
              <div className="story-img-loading"></div>
              <div className="story-text-loading"></div>
            </div>
          )
        })}
      </div>
    )

    
  } else {
    return (
      <>
         {user && user.id &&
          <div className="stories">
            {
              !user ?
                <div className='empty-story'>
                  <div className='story-overlay'></div>
                  <p> Your story </p>
                </div>
              :
              <>
                <Story type='user' follow={user.id} stories={userStories} />
                
                {followingStories.map((follow, ind) => {
                  const { creatorId, creatorStories } = follow
                  
                  return (
                    <Story key={creatorId} type='following' follow={creatorId}
                      stories={creatorStories}
                    />
                  )
                })}
              </>
            }
          </div>
        }
      </>
    )
  }
}

export default Stories