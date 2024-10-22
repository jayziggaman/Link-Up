import React, { useContext } from 'react'
import { appContext } from '../App'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

const NewPostIcon = () => {
  const { windowWidth, user, setShowPostForm, setPostFormFor } = useContext(appContext)

  return (
    <>
      {windowWidth < 700 && user && user.id &&
        <button className='new-post-icon'
          onClick={() => {
            setShowPostForm(true)
            setPostFormFor("post")
          }}
        >
          <BorderColorOutlinedIcon />
        </button>
      }
    </>
  )
}

export default NewPostIcon