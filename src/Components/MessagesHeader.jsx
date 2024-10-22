import React, { useContext } from 'react'
import { appContext } from '../App'
import { FaReact } from 'react-icons/fa'

const MessagesHeader = () => {
  const { user, windowWidth, setShowForm, setShowReplyForm, setShowReplyReplyForm, homeLoading, userAuth } = useContext(appContext)

  const close = () => {
    setShowForm(false)
    setShowReplyForm(false)
    setShowReplyReplyForm(false)
  }
  
  if(homeLoading) {
    return (
      <header className="messages-header home-header" role={'button'} onClick={close}>
        {windowWidth > 699 && <FaReact />}
  
        {windowWidth < 700 &&
          <>
            <div className="pfp-div">
              <div></div>
            </div>
  
            <div className='app-title-div'>
              <h1> LinkUp </h1>
            </div>
          </>
        }
      </header>
    )
  } else {
    return (
      <header className="messages-header home-header" role={'button'} onClick={close}>
        {windowWidth > 699 && <FaReact />}
  
        {windowWidth < 700 &&
          <>
            <div className="pfp-div">
            {user?.avatarUrl === '' || !userAuth ?
              <div className='empty-header-pfp'></div>
              :
              <img src={user?.avatarUrl} alt="" />
            }
            </div>
  
            <div className='app-title-div'>
              <h1> LinkUp </h1>
            </div>
          </>
        }
      </header>
    )
  }
}

export default MessagesHeader