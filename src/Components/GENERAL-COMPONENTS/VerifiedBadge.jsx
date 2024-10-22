import React from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';

const VerifiedBadge = ({ fontSize }) => {
  
  return (
    <VerifiedIcon className="verified-badge"
      sx={{
        fontSize: fontSize ? fontSize : ''
      }}
    />
  )
}

export default VerifiedBadge