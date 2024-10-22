import React, { useContext } from 'react'
import { appContext } from '../App'
import { Link, NavLink } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NavigationIcon from '../ICONS/NavigationIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { HiOutlineHome } from "react-icons/hi";
import { HiHome } from "react-icons/hi";
import UserPfp from './GENERAL-COMPONENTS/UserPfp';




const Nav = () => {
  const { showForm, setShowPostForm, user, windowWidth, homeLoading } = useContext(appContext)

  
  return (
    <nav className='main-nav' role={'button'} onClick={() => {
      if (showForm) {
        setShowPostForm(false)
      }
    }}>
      <div className="nav">
        <NavLink to='/'
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          <NavigationIcon
            path=''
            emptyIcon={<HiOutlineHome />}
            filledIcon={<HiHome />}
          />

          {windowWidth >= 1000 && <span>Home</span>}
        </NavLink>


        <NavLink to='/messages'
          className={({ isActive }) => isActive ? 'active-link': '' } 
        >
          <NavigationIcon
            path='messages'
            emptyIcon={<EmailOutlinedIcon />}
            filledIcon={<EmailIcon />}
          />

          {windowWidth >= 1000 && <span>Messages</span>}
          {/* <span className={messagesRed ? 'noti-span show' : 'noti-span'}></span> */}
        </NavLink>


        <NavLink to='/search'
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          <NavigationIcon
            path='search'
            emptyIcon={<SearchIcon />}
            filledIcon={<SearchIcon />}
          />

          {windowWidth >= 1000 && <span>Search</span>}
        </NavLink>


        <NavLink to='/notifications'
          className={({ isActive }) => isActive ? 'active-link notifications-link' : 'notifications-link'}
        >
          <NavigationIcon
            path='notifications'
            emptyIcon={<NotificationsNoneOutlinedIcon />}
            filledIcon={<NotificationsIcon />}
          />

          {windowWidth >= 1000 && <span>Notifications</span>}

          {/* <span className={notiRed ? 'noti-span show' : 'noti-span'}></span> */}
        </NavLink>

        {!user?.id && !homeLoading?
          <></>
          :
          <>
            <a href='/profile'>
              <UserPfp user={user} />

              {windowWidth >= 1000 && <span>Profile</span>}
            </a>
            
            <button onClick={() => setShowPostForm(true)}>
              <BorderColorOutlinedIcon /> 

              {windowWidth >= 1000 && <span>Create</span>}
            </button>
          </>
        }


        <Link to='/settings'>
          <NavigationIcon
            path='settings'
            emptyIcon={<SettingsOutlinedIcon />}
            filledIcon={<SettingsIcon />}
          />

          {windowWidth >= 1000 && <span>Settings</span>}
        </Link>
      </div>
    </nav>
  )
}

export default Nav