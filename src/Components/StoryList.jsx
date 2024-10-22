import React, { useContext, useState } from 'react'
import { appContext } from '../App'
import VerifiedBadge from "../COMPONENTS/GENERAL-COMPONENTS/VerifiedBadge"
import UserPfp from './GENERAL-COMPONENTS/UserPfp'


const StoryList = ({ viewer }) => {
  const { users } = useContext(appContext)
  const [user, setUser] = useState(users.find(user => user.id === viewer))


  if (user && user.id) {
    const { username, avatarUrl, displayName, userType } = user

    return (
      <a href={`/${username}`} className="friends-list">
        <div className="search-result-img-div">
          <UserPfp user={user} />
        </div>

        <div className="search-result-username">
          <p>
            {displayName} 
            {userType === 'creator' && <VerifiedBadge />}
          </p>
          <p> @{username}</p>
        </div>
      </a>
    )
  }
}

export default StoryList