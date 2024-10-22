import React, { useContext } from 'react'


const attachmentContext = React.createContext()

const ReplyMessageAttachment = ({ message }) => {
  const { replyMessage } = message

  if (replyMessage) {
    const { type, id, caption, media } = replyMessage
    
    const goToOriginalMessage = (id) => { }
    
    
    
    return (
      <attachmentContext.Provider
        value={{
          replyMessage
        }}
      >
        <div className="original-message">
          {type.includes("text-message")  &&
            <>
              {caption}
            </>
          }


          {type.includes("photo-message")  &&
            <MediaReply>
              <img src={media} alt="" />
            </MediaReply>
          }

          
          {type.includes("video-message")  &&
            <MediaReply>
              <video src={media} alt="" />
            </MediaReply>
          }


          {type.includes("group-media-message")  &&
            <MediaReply>
              {media[0]?.type === 'video' ?
                <video src={media[0]?.url}></video>

              : media[0]?.type === 'img' &&
                <img src={media[0]?.url} alt="" />
              }
            </MediaReply>
          }


          {type === 'Text' && 
            <></>
          }


          {type === 'Picture-Media' && 
            <></>
          }


          {type === 'Video-Media' && 
            <></>
          }


          {type === 'Group-Media' &&  
            <></>
          }
          

          {type.includes("Story") &&
            <></>
          }
        </div>
      </attachmentContext.Provider>
    )
  }
}

export default ReplyMessageAttachment




const MediaReply = ({ children }) => {
  const { replyMessage } = useContext(attachmentContext)

  const { caption } = replyMessage
  
  return (
    <>
      {children}

      <div className="reply-message-caption">
        {caption}
      </div>
    </>
  )
}