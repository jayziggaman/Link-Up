import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../../App'
import Footer from '../Footer'
import NewPostIcon from '../../ICONS/NewPostIcon'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DMRoom from '../DMRoom'
import imgOne from "../../Images/me.png"
import imgTwo from "../../Images/no-media-found-IV.jpg"
import imgThree from "../../Images/no-media-found.jpg"
import imgFour from "../../Images/no-post-found.jpg"
import imgFive from "../../Images/signup-bg.jpeg"



const Messages = ({ dmUrl }) => {
  const { user, windowWidth, messageRooms } = useContext(appContext)
  
  const [userMessageRooms, setUserMessageRooms] = useState(null)
  const [displayMessageRooms, setDisplayMessageRooms] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  

  useEffect(() => {
    if (user && user.id) {
      const { firstUsername } = user

      setUserMessageRooms([...messageRooms.filter(dm => dm.users[firstUsername] !== undefined)])

    } else if (user && !user?.id) {
      setUserMessageRooms([])
    }
  }, [user])

  
  useEffect(() => {
    if(userMessageRooms) {
      setLoading(false)
    }
  }, [userMessageRooms])


  useEffect(() => {
    if (search === '') {
      if (userMessageRooms) {
        setDisplayMessageRooms([...userMessageRooms])
      }

    } else {
      const newMessages = userMessageRooms.filter(dm => {
        const { users } = dm
        
        if (users) {
          const theseUsers = Object.keys(users)
          const otherUser = theseUsers?.find(person => person !== user.firstUsername)?.trim()?.toLowerCase()

          if (otherUser?.includes(search.trim().toLowerCase())) {
            return dm
          }
        }
      })

      setDisplayMessageRooms([...newMessages])
    }
  }, [search, userMessageRooms])




  
  return (
    <section className="messages-section">
      {windowWidth < 500 || windowWidth > 850 ?
        <header>
          <h1>
            Messages
          </h1>

          <div className="messages-header-search">
            <SearchOutlinedIcon />
            <input type="text" placeholder='Search Chats'
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>
        : <></>
      }
      
      {loading ?
        <>
          <div className="messages-loading">
            {loadArr.map((_, index) => {
              return (
                <div key={index} className="chat-loading">
                  <div className='chat-pfp-loading'></div>

                  {windowWidth < 500 || windowWidth > 850 ?
                    <>
                      <div className='chat-name-text-loading'>
                        <div className="chat-name-loading"></div>
                        <div className="chat-text-loading"></div>
                      </div>
                      
                      <div className='chat-time-loading'></div>
                    </>
                    : <></>
                  }
                </div>
              )
            })}
          </div>
        </>
        :
        <>
          <div className="chat-list">
            {userMessageRooms?.length === 0 ?
              <NoChats search={search} />
              :
              <>
                {displayMessageRooms?.length === 0 ?
                  <Paragraph />
                  :
                  <>
                    {displayMessageRooms?.map(dmRoom => {
                      const { id } = dmRoom
                      
                      return (
                        <DMRoom key={id} dmRoom={dmRoom} />
                      )
                    })}
                  </>
                }
              </>
            }
          </div>
        </>
      }
      

      {!dmUrl &&
        <>
          <Footer />
        </>
      }
        
    </section>
 )
}

export default Messages








const NoChats = ({ search }) => {
  
  const { windowWidth, user } = useContext(appContext)

  

  const [emptyChats, setEmptyChats] = useState([
    {
      img: imgOne,
      name: "Michael",
      text: "welcome to Link up 👋🏾"
    }, 

    {
      img: imgThree,
      name: "Isreal",
      text: `Whats up ${user?.username ? user.username : "friend"} ?`
    },

    {
      img: imgTwo,
      name: 'Lizzy',
      text: "Send me that picture you told me about 😂"
    },

    {
      img: imgFour,
      name: 'Sandra B.',
      text: "Haha, I know you would like it 😏"
    },

    {
      img: imgFive,
      name: 'Aang',
      text: "Yooo, what do you think about this?"
    }
  ])
  const [displayChats, setDisplayChats] = useState([])


  useEffect(() => {
    if (search === '') {
      setDisplayChats([...emptyChats])

    } else {
      const newMessages = emptyChats.filter(chat => {
        const { name, text } = chat
        
        return name.trim().toLowerCase().includes(search) || text.trim().toLowerCase().includes(search)
      })

      setDisplayChats([...newMessages])
    }
  }, [search, emptyChats])
  
  
  return (
    <>
      {user?.id ? 
        <Paragraph />
        :
        <>
          {windowWidth < 500 || windowWidth >= 850 ?
            <>
              {displayChats.length === 0 ?
                <Paragraph />
                :
                <>
                  {displayChats.map((chat, ind) => {
                    const { img, text, name } = chat
                    
                    return (
                      <Chat key={ind} img={img}>
                        <div className="chat-username-empty-chat">
                          <p>{name}</p>
                          <p>{text}</p>
                        </div>
                      </Chat>
                    )
                  })}
                </>
              }
            </>
            :
            <>
              {displayChats.map((chat, ind) => {
                const { img } = chat

                return (
                  <Chat key={ind} img={img} />
                )
              })}
            </>
          }
        </>
      }
    </>
  )
}




const Chat = ({ children, img }) => {
  
  return (
    <div className="empty-chat">
      <img className="empty-chat-pfp" src={img} alt="" />

      {children}
    </div>
  )
}



const Paragraph = () => {
  return (
    <p
      style={{ padding: "1rem" }}
    >
      No chats to show
    </p>
  )
}
