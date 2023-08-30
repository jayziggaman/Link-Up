import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import { db } from '../firebase/config'
import verifiedBadge from '../Images/verified-badge.jpg'

const ProfileList = ({result, type, userId}) => {
  const { users, user, userAuth } = useContext(appContext)
  const location = useLocation()
  
  const removeFollower = (userId) => {
    const userRef = doc(db, 'users', userAuth)
    updateDoc(userRef, {
      followers: {
        value: [...user.followers.value.filter(follower => follower !== userId)]
      }
    }).then(() => {
      const otherUser = users.find(user => user.id === userId)

      const otherRef = doc(db, 'users', userId)
      updateDoc(otherRef, {
        following: {
          value: [...otherUser.following.value.filter(follower => follower !== userAuth)]
        }
      })
    })
  }

  const removeFollowing = (userId) => {
    const userRef = doc(db, 'users', userAuth)
    updateDoc(userRef, {
      following: {
        value: [...user.following.value.filter(follower => follower !== userId)]
      }
    }).then(() => {
      const otherUser = users.find(user => user.id === userId)

      const otherRef = doc(db, 'users', userId)
      updateDoc(otherRef, {
        followers: {
          value: [...otherUser.followers.value.filter(follower => follower !== userAuth)]
        }
      })
    })
  }

  function run(id) {
    if (type === 'followers') {
      removeFollower(id)
    } else if (type === 'following') {
      removeFollowing(id)
    }
  }

  return (
    <div className="profile-list">
      <Link to={result.id} className="search-result-img-div">
        <img src={result?.avatarUrl} alt="" />
      </Link>

      <Link to={result.id} className="search-result-username">
        <p>{result?.username} {result.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />} . {result?.followers.value?.length} {result?.followers.value?.length === 1 ? 'Follower' : 'Followers' }</p>
        <p> {result?.displayName} </p>
      </Link>

      {
        userAuth === userId || location.pathname.includes('profile') &&
        <div className="remove-follower">
          <button onClick={() => run(result.id)}>
            {type === 'followers' && 'remove'}
            {type === 'following' && 'unfollow'}
          </button>
        </div>
      }
    </div>
  )
}

export default ProfileList