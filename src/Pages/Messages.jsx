import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import StartChat from '../Components/StartChat'
import MessagesMain from '../Components/MessagesMain'
import { useParams } from 'react-router-dom'
import Messaging from './Messaging'
import NewChatForm from '../Components/NewChatForm'
import DmList from '../Components/DmList'
import Options from '../Components/Options'

const Messages = () => {
  const {user, windowWidth, chatId} = useContext(appContext)
  const [showUserList, setShowUserList] = useState(false)
  const selectedMediaId = useRef('')
  const selectedMediaType = useRef('')
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const { inboxId } = useParams()
  
  useEffect(() => {
    if(user) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [user])

  
 
  return (
    <div className='messages-main-start-chat'>
      {/* {windowWidth > 850 && windowWidth < 950 &&
        <h1 style={{paddingTop: inboxId ? '2rem' : '4rem'}}>
          Messages
        </h1>
      } */}

      { windowWidth > 850 &&
        <h1 style={{paddingTop: '1.75rem'}}>
          Messages
        </h1>
      }

      {/* { windowWidth < 500 &&
        <h1>
          Messages
        </h1>
      } */}

      <div className="content-div">
        {windowWidth > 500 &&
          <MessagesMain inboxId={inboxId} showUserList={showUserList} setShowUserList={setShowUserList} />
        }

        {windowWidth < 501 && 
          <>
          {inboxId ? <Messaging selectedMediaId={selectedMediaId} selectedMediaType={selectedMediaType} />
            : <MessagesMain showUserList={showUserList} setShowUserList={setShowUserList} />}
          </>
        }

        {windowWidth > 500 && 
          <>
          {inboxId ? <Messaging selectedMediaId={selectedMediaId} selectedMediaType={selectedMediaType} />
            : <StartChat />}
          </>
        }
      </div>

      <DmList selected={selected} setSelected={setSelected} showUserList={showUserList} setShowUserList={setShowUserList}/>
      <NewChatForm selected={selected} setSelected={setSelected} />
      <Options func={[
      { text: 'Clear chat', id: chatId.current,  prop: 'clear-chat red' }
    ]}
    />
    </div>
  )
}

export default Messages








// if(loading) { 
//   return (
//     <div className='messages-main-start-chat'>
//       {/* {windowWidth > 700 && windowWidth < 950 &&
//         <h1 style={{paddingTop: inboxId ? '2rem' : '4rem'}}>
//           Messages
//         </h1>
//       } */}

//       { windowWidth > 849 &&
//         <h1 style={{paddingTop: '1.75rem'}}>
//           Messages
//         </h1>
//       }
//       <main className="messages-main">
//         <div className="overlay" role={'button'} onClick={() => setShowOptionsDiv(false)}>
//         </div>
//         {!inboxId && <MessagesHeader />}
        
//         <MessagesNav />

//         <div className="messages-loading">
//           <div className="messages-loading-div">
//             {loadArr.map((item, index) => {
//               return (
//                 <div key={index} className="chat-loading">
//                   <div className='chat-pfp-loading'></div>

//                   {windowWidth > 849 &&
//                     <>
//                       <div className='chat-name-text-loading'>
//                         <div className="chat-name-loading"></div>
//                         <div className="chat-text-loading"></div>
//                       </div>
                      
//                       <div className='chat-time-loading'></div>
//                     </>
//                   }
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//         {windowWidth <= 799 && !inboxId && <Footer />}
//       </main>

//       {windowWidth > 500 && 
//         <>
//           {inboxId ? <Messaging /> : <StartChat />}
//         </>
//       }
//     </div>
//   )
// } else {