import React, { useContext } from 'react'
import { appContext } from '../App'

const VerifiedMessage = () => {
  const {VerifiedMessageRef} = useContext(appContext)
  return (
    <div ref={VerifiedMessageRef} className='verified-message-div'>
      <p>
        This user is verified because he is the creator of the app.
      </p>
    </div>
  )
}

export default VerifiedMessage