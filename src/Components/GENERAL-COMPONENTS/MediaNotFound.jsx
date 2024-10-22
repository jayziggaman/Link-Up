import React from 'react'
import noPost from '../../Images/no-post-found.jpg'

const MediaNotFound = ({ headerText, text }) => {
  
  return (
    <div className='no-post-found'>
      <img src={noPost} alt="" />
      <h2>
        {headerText}
      </h2>

      <p>
        {text}
      </p>
    </div>
  )
}

export default MediaNotFound