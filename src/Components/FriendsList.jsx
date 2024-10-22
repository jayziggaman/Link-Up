import React from 'react'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'

const FriendsList = ({ result, handleSelected, remove }) => {

  if (result) {
    const { username, displayName, userType } = result

    return (
      <div className="friends-list" onClick={() => handleSelected(result)}>
        <div className="search-result-img-div">
          <UserPfp user={result} />
        </div>
  
        <div className="search-result-username">
          <p>
            {displayName} {userType === 'creator' && <VerifiedBadge />}
            
            
            {/* {!suggested &&
              <>
                . {followers.value?.length} {followers.value?.length === 1 ? 'Follower' : 'Followers'}
              </>
            } */}
          </p>

          <p> @{username} </p>
        </div>
      </div>
    )
  }
}

export default FriendsList