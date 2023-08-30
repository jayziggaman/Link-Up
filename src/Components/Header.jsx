import React, { useContext } from 'react'
import { appContext } from '../App'
import { FaReact } from 'react-icons/fa'

const Header = () => {
  const { user, windowWidth, setShowForm, setShowReplyForm, setShowReplyReplyForm, homeLoading } = useContext(appContext)

  const close = () => {
    setShowForm(false)
    setShowReplyForm(false)
    setShowReplyReplyForm(false)
  }
  
  if(homeLoading) {
    return (
      <header className="main-header home-header" role={'button'} onClick={close}>
        {windowWidth > 800 && windowWidth < 1000 && <FaReact />}
  
        {windowWidth < 800 &&
          <>
            <div className="pfp-div">
              <div></div>
            </div>
  
            <div className='app-title-div'>
              <h1> WoWi </h1>
            </div>
          </>
        }
  
        {windowWidth >= 1000 &&
          <>
            <div className="pfp-div">
              <div></div>
            </div>
  
            <div className='app-title-div'>
              <h1> WoWi </h1>
            </div>
          </>
        }
      </header>
    )
  } else {
    return (
      <header className="main-header home-header" role={'button'} onClick={close}>
        {windowWidth > 800 && windowWidth < 1000 && <FaReact />}
  
        {windowWidth < 800 &&
          <>
            <div className="pfp-div">
              <img src={user?.avatarUrl} alt="" />
            </div>
  
            <div className='app-title-div'>
              <h1> WoWi </h1>
            </div>
          </>
        }
  
        {windowWidth >= 1000 &&
          <>
            <div className="pfp-div">
              <img src={user?.avatarUrl} alt="" />
            </div>
  
            <div className='app-title-div'>
              <h1> WoWi </h1>
            </div>
          </>
        }
      </header>
    )
  }
}

export default Header