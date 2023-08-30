import React from 'react'

const Button = ({ textContent, postType }) => {
  return (
    <button className={ textContent === postType ? "active" : null } >
      {textContent}
    </button>
  )
}

export default Button