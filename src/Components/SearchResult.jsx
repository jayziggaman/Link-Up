import React from 'react'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'

const SearchResult = ({ result, suggested }) => {

  if (result) {
    const { username, displayName, userType, followers } = result
    
    return (
      <a href={username} className="search-result">
        <div className="search-result-img-div">
          <UserPfp user={result} />
        </div>

        <div className="search-result-username">
          <p>
            {displayName} {userType === 'creator' && <VerifiedBadge />} 
            {!suggested &&
              <>
                . {followers.value?.length} {followers.value?.length === 1 ? 'Follower' : 'Followers'}
              </>
            }
          </p>
          <p> @{username} </p>
        </div>
      </a>
    )
  }
}

export default SearchResult