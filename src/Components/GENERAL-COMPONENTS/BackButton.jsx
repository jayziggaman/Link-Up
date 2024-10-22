import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ navigateLink, alignBottom }) => {
  const navigate = useNavigate()
  
  return (
    <button className='back-button'
      onClick={() => {
        navigate(navigateLink)
      }}

      style={{
        alignItems: alignBottom ? 'flex-end' : 'center'
      }}
    >
      <ArrowBackIcon />
    </button>
  )
}

export default BackButton