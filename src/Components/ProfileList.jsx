import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { appContext } from '../App'
import { db } from '../firebase/config'
import UserPfp from './GENERAL-COMPONENTS/UserPfp';
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge';

const ProfileList = ({ result, type, person }) => {
  const { users, user } = useContext(appContext)
  const { id, username, displayName, userType } = result
  
  const removeFollower = (userId) => {
    const userRef = doc(db, 'users', user.id)
    updateDoc(userRef, {
      followers: {
        value: [...user.followers.value.filter(follower => follower !== userId)]
      }
    }).then(() => {
      const otherUser = users.find(user => user.id === userId)

      const otherRef = doc(db, 'users', userId)
      updateDoc(otherRef, {
        following: {
          value: [...otherUser.following.value.filter(follower => follower !== user.id)]
        }
      })
    })
  }

  const removeFollowing = (userId) => {
    const userRef = doc(db, 'users', user.id)
    updateDoc(userRef, {
      following: {
        value: [...user.following.value.filter(follower => follower !== userId)]
      }
    }).then(() => {
      const otherUser = users.find(user => user.id === userId)

      const otherRef = doc(db, 'users', userId)
      updateDoc(otherRef, {
        followers: {
          value: [...otherUser.followers.value.filter(follower => follower !== user.id)]
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
      <a href={`/${username}`} className="search-result-img-div">
        <UserPfp user={result} />
      </a>

      <a href={`/${username}`} className="search-result-username">
        <p>
          {displayName} {userType === 'creator' && <VerifiedBadge />}
        </p>

        <p>
          @{username}
        </p>
      </a>

      <div className="remove-follower">
        {user.id === person?.id &&
          <button onClick={() => run(id)}>
            {type === 'followers' && 'remove'}
            {type === 'following' && 'unfollow'}
          </button>
        }
      </div>
    </div>
  )
}

export default ProfileList