import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'
import Story from './Story'

const Stories = () => {
  const { users, user, homeLoading, followingStories, setFollowingStories, userAuth } = useContext(appContext)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  useEffect(() => {
    const arr = []
    for (let i = 0; i < user?.following.value.length; i++) {
      const follow = users.find(person => person.id === user.following.value[i])

      const userRef = collection(db, 'users', follow.id, 'stories')
      // const userQuery = query(userRef, orderBy('createdAt', 'asc'))
      onSnapshot(userRef, snap => {
        const userArr = []
        snap.docs.forEach(doc => {
          userArr.push({ ...doc.data(), id: doc.id })
        })
        const sort = userArr.sort((a, b) => a.createdAt - b.createdAt)
        // sort.map(story => console.log(story.createdAt))
        if (sort.length > 0) {
          const condition = arr.find(storyObj => storyObj.creatorId === follow.id)
          if (!condition) {
            arr.push({
              creatorId: follow?.id,
              creatorStories: sort,
              lastSeenStory: 0
            })
          }
          const sortII = arr.sort((a, b) => {
            return b.creatorStories[b.creatorStories.length - 1].createdAt - a.creatorStories[a.creatorStories.length - 1].createdAt
          })
          setFollowingStories([...sortII])
        } 
      })
    }
  }, [users, user])

  // console.log(followingStories)
  
  // useEffect(() => {
  //   const arr = []
  //   for (let i = 0; i < user?.following.value.length; i++) {
  //     const follow = users.find(person => person.id === user.following.value[i])
  //     // console.log(follow)

  //     const sort = follow.stories.value?.sort((a, b) => a.createdAt - b.createdAt)
  //     if (sort.length > 0) {
  //       arr.push({
  //         creatorId: follow?.id,
  //         creatorStories: sort
  //       })
  //     }
  //     setFollowingStories([...arr])
  //   }
  // }, [users, user])
  // console.log(followingStories)
  
  if(homeLoading) {
    return (
      <div className="stories">
        {loadArr.map((item, index) => {
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
      <div className="stories">
        {
          !user ?
            <div className='empty-story'>
              <div className='story-overlay'></div>
              <p> Your story </p>
            </div>
          :
          <>
            <Story type='user' follow={userAuth} />
            {
              followingStories.map(follow => <Story key={follow.creatorId} type='following' follow={follow.creatorId} followStory={follow.creatorStories} />)
            }
          </>
        }
        
      </div>
    )
  }
}

export default Stories