import React, { useContext } from 'react'
import { appContext } from '../App'
import { FaReact } from 'react-icons/fa'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'

const Header = () => {
  const { user, windowWidth, homeLoading } = useContext(appContext)
  
  
  if(homeLoading) {
    return (
      <header className="main-header home-header" role={'button'}>
        <div className="home-header-div">
        {windowWidth > 699 && windowWidth < 1000 && <FaReact />}
  
        {windowWidth < 700 &&
          <>
            <div className="pfp-div">
              <div></div>
            </div>

            <div className='app-title-div'>
              <h3> LinkUp </h3>
            </div>
          </>
        }

        {windowWidth >= 1000 &&
          <>
            <div className="pfp-div">
              <div></div>
            </div>

            <div className='app-title-div'>
              <h3> LinkUp </h3>
            </div>
          </>
        }
        </div>
      </header>
    )
  } else {
    return (
      <header className="main-header home-header" role={'button'}>
        <div className="home-header-div">
          {windowWidth > 699 && windowWidth < 1000 && <FaReact />}
  
          {windowWidth < 700 &&
            <>
              <div className="pfp-div">
                <UserPfp user={user} />
              </div>
    
              <div className='app-title-div'>
                <h3> LinkUp </h3>
              </div>
            </>
          }
    
          {windowWidth >= 1000 &&
            <>
              <div className="pfp-div">
                <UserPfp user={user} />
              </div>
    
              <div className='app-title-div'>
                <h3> LinkUp </h3>
              </div>
            </>
          }
        </div>
      </header>
    )
  }
}

export default Header