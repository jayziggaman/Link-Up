import React, { useContext } from 'react'
import { appContext } from '../App'
import { NavLink } from 'react-router-dom'
import { auth } from '../firebase/config';
import EmailIcon from '@mui/icons-material/Email';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import NavigationIcon from '../ICONS/NavigationIcon';
import { HiOutlineHome } from "react-icons/hi";
import { HiHome } from "react-icons/hi";
import UserPfp from './GENERAL-COMPONENTS/UserPfp';


const Footer = () => {
  const { footerRef, homeLoading, user, notiRed, messagesRed } = useContext(appContext)


  return (
    <footer role={'button'} ref={footerRef}>
      <div className="footer">
        <NavLink to='/'
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          <NavigationIcon
            path=''
            emptyIcon={<HiOutlineHome />}
            filledIcon={<HiHome />}
          />
        </NavLink>


        <NavLink to='/messages'
          className={({ isActive }) => isActive ? 'active-link': '' } 
        >
          <NavigationIcon
            path='messages'
            emptyIcon={<EmailOutlinedIcon />}
            filledIcon={<EmailIcon />}
          />
          <span className={messagesRed ? 'noti-span show' : 'noti-span'}></span>
        </NavLink>


        <NavLink to='/search'
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          <NavigationIcon
            path='search'
            emptyIcon={<SearchIcon />}
            filledIcon={<SearchIcon />}
          />
        </NavLink>


        <NavLink to='/notifications'
          className={({ isActive }) => isActive ? 'active-link notifications-link' : 'notifications-link'}
        >
          <NavigationIcon
            path='notifications'
            emptyIcon={<NotificationsNoneOutlinedIcon />}
            filledIcon={<NotificationsIcon />}
          />
         
          <span className={notiRed ? 'noti-span show' : 'noti-span'}></span>
        </NavLink>


        {!user?.id && !homeLoading ?
          <NavLink to='/settings'
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <NavigationIcon
              path='settings'
              emptyIcon={<SettingsOutlinedIcon />}
              filledIcon={<SettingsIcon />}
            />
          </NavLink>
          :
          <a href='/profile'>
            <UserPfp user={user} />
          </a>
        }
      </div>
    </footer>
  )
}

export default Footer