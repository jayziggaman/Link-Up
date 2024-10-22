import React from 'react'

const ChopText = ({ text, num }) => {
  
  
  return (
    <>
      {text?.length > num ? 
        <>
          {`${text?.slice(0, num)}...`}
        </>
        :
        <>
          {text}
        </>
      }
    </>
  )
}

export default ChopText