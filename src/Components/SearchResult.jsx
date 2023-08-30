import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import verifiedBadge from '../Images/verified-badge.jpg'
import { appContext } from '../App'

const SearchResult = ({ result }) => {

  return (
    <Link to={result?.id} className="search-result">
      <div className="search-result-img-div">
        <img src={result?.avatarUrl} alt="" />
      </div>
      <div className="search-result-username">
        <p>{result?.username} {result.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />} . {result?.followers.value?.length} {result?.followers.value?.length === 1 ? 'Follower' : 'Followers' }</p>
        <p> {result?.displayName} </p>
      </div>
    </Link>
  )
}

export default SearchResult