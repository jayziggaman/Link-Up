import React from 'react'

const Button = ({ textContent, postType }) => {
  return (
    <button className={ textContent === postType ? "active" : "" } >
      {textContent}
    </button>
  )
}

export default Button