import React, { useContext } from 'react'
import { appContext } from '../App'
import Messaging from "../COMPONENTS/MESSAGING-COMPONENTS/Messaging"
import Messages from "../COMPONENTS/MESSAGING-COMPONENTS/Messages"
import { Link, NavLink, useParams } from 'react-router-dom'
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
import { auth } from '../firebase/config'
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'


const MessagesMain = () => {
  const { dmUrl } = useParams()
  const { windowWidth } = useContext(appContext)



  return (
    <main className="messages-messaging-main">
      {windowWidth < 500 ?
        <>
          {dmUrl ? <Messaging dmUrl={dmUrl} /> : <Messages dmUrl={dmUrl} />}
        </>
        :
        <>
          {windowWidth > 700 && <Nav />}

          <Messages dmUrl={dmUrl} />

          {dmUrl ? <Messaging dmUrl={dmUrl} /> : <StartChat />}
        </>
      }
    </main>
  )
}

export default MessagesMain



const StartChat = () => {
  return (
    <section className="start-chat-section">
      <svg height="96" role="img" viewBox="0 0 96 96" width="96" className="my-svg">
        <path
          className="my-svg-path"
          d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"
          fill="currentColor"
        ></path>
      </svg>


      <h5>Send a message</h5>
    </section>
  )
}




const Nav = () => {
  const { user, setShowPostForm, windowWidth, homeLoading } = useContext(appContext)
  
  return (
    <div className="nav-container">
      <div className="nav">
        <NavLink to='/'
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          <NavigationIcon
            path=''
            emptyIcon={<HiOutlineHome />}
            filledIcon={<HiHome />}
          />

          {windowWidth >= 1200 && <span>Home</span>}
        </NavLink>


        <NavLink to='/messages'
          className={({ isActive }) => isActive ? 'active-link': '' } 
        >
          <NavigationIcon
            path='messages'
            emptyIcon={<EmailOutlinedIcon />}
            filledIcon={<EmailIcon />}
          />
          {windowWidth >= 1200 && <span>Messages</span>}
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

          {windowWidth >= 1200 && <span>Search</span>}
        </NavLink>


        <NavLink to='/notifications'
          className={({ isActive }) => isActive ? 'active-link notifications-link' : 'notifications-link'}
        >
          <NavigationIcon
            path='notifications'
            emptyIcon={<NotificationsNoneOutlinedIcon />}
            filledIcon={<NotificationsIcon />}
          />

          {windowWidth >= 1200 && <span>Notifications</span>}

          {/* <span className={notiRed ? 'noti-span show' : 'noti-span'}></span> */}
        </NavLink>

        {!user?.id && !homeLoading?
          <></>
          :
          <>
            <a href='/profile'>
              <UserPfp user={user} />

              {windowWidth >= 1200 && <span>Profile</span>}
            </a>
            
            <button onClick={() => setShowPostForm(true)}>
              <BorderColorOutlinedIcon /> 

              {windowWidth >= 1200 && <span>Create</span>}
            </button>
          </>
        }

        <Link to='/settings'>
          <NavigationIcon
            path='settings'
            emptyIcon={<SettingsOutlinedIcon />}
            filledIcon={<SettingsIcon />}
          />

          {windowWidth >= 1200 && <span>Settings</span>}
        </Link>
      </div>
    </div>
  )
}