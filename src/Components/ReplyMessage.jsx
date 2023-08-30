import React from 'react'

const ReplyMessage = ({message}) => {
  return (
    <div className='pic-post-body'>

      {message.replyMessage?.type === 'text-message' &&
        <>
          <div className='text-reply-body'>
            <pre className='text-message reply-message'>
              {message?.replyMessage?.body.length >= 100 && `${message?.replyMessage?.body.slice(0, 100)}...`} 
              {message?.replyMessage?.body.length < 100 && message.replyMessage?.body}
            </pre>
          </div>
        </>
      }
      
      {message.replyMessage?.type === 'reply-text-message' &&
        <>
          <div className='text-post-body'>
            <pre className='text-message reply-message'>
              {message?.replyMessage?.body.length >= 300 && `${message?.replyMessage?.body.slice(0, 300)}...`} 
              {message?.replyMessage?.body.length < 300 && message.replyMessage?.body}
            </pre>
          </div>
        </>
      }

      {message.replyMessage?.type === 'story-text-message' &&
        <>
          <div className='text-post-body'>
            <pre className='text-message reply-message'>
              {message?.replyMessage?.body.length >= 100 && `${message?.replyMessage?.body.slice(0, 100)}...`} 
              {message?.replyMessage?.body.length < 100 && message.replyMessage?.body}
            </pre>
          </div>
        </>
      }


      

      {/* text post, comment and reply */}
      {/* <FaReply className='reply-arrow'/> */}

      {message.replyMessage?.type === 'photo-message' &&
        <>
          <div className='reply-media-div'>
            <img src={message?.replyMessage?.body} alt="" className='text-image-story' />
            <pre> 
              {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
            </pre>
          </div>
        </>
      }

      {message.replyMessage?.type === 'reply-photo-message' &&
        <>
        <div className='reply-media-div'>
          <img src={message?.replyMessage?.body} alt="" className='text-image-story' />
          <pre> 
            {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
            {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
          </pre>
        </div>
        </>
      }

      {message.replyMessage?.type === 'story-photo-message' &&
        <>
        <div className='reply-media-div'>
          <img src={message?.replyMessage?.body} alt="" className='text-image-story' />
          <pre> 
            {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
            {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
          </pre>
        </div>
        </>
      }




      {message.replyMessage?.type === 'video-message' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.body}></video>
            <pre> 
              {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'reply-video-message' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.body}></video>
            <pre> 
              {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'story-video-message' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.body}></video>
            <pre> 
              {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }




      {message.replyMessage?.type === 'group-media-message' &&
        <>
        {message.replyMessage.body[0].type === 'img' ?
          <>
            <div className='reply-media-div'>
              <img src={message?.replyMessage?.body[0].url} alt="" className='text-image-story' />
              <pre> 
                {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
              </pre>
              <p>
                {/* {message?.time} */}
              </p>
            </div>
          </>
          :
          <>
            <div className='reply-media-div'>
              {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
              <video className='text-image-story' src={message.replyMessage?.body[0].url}></video>
              <pre> 
                {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
              </pre>
              <p>
                {/* {message?.time} */}
              </p>
            </div>
          </>
          }
        </>
      }

      {message.replyMessage?.type === 'reply-group-media-message' &&
        <>
        {message.replyMessage.body[0].type === 'img' ?
          <>
            <div className='reply-media-div'>
              <img src={message?.replyMessage?.body[0].url} alt="" className='text-image-story' />
              <pre> 
                {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
              </pre>
              <p>
                {/* {message?.time} */}
              </p>
            </div>
          </>
          :
          <>
            <div className='reply-media-div'>
              {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
              <video className='text-image-story' src={message.replyMessage?.body[0].url}></video>
              <pre> 
                {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
              </pre>
              <p>
                {/* {message?.time} */}
              </p>
            </div>
          </>
          }
        </>
      }

      {message.replyMessage?.type === 'story-group-media-message' &&
        <>
          {message.replyMessage.body[0].type === 'img' ?
            <>
              <div className='reply-media-div'>
                <img src={message?.replyMessage?.body[0].url} alt="" className='text-image-story' />
                <pre> 
                  {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
            :
            <>
              <div className='reply-media-div'>
                {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
                <video className='text-image-story' src={message.replyMessage?.body[0].url}></video>
                <pre> 
                  {message?.replyMessage?.caption?.length >= 172 && `${message?.replyMessage?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.caption?.length < 172 && message?.replyMessage?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
          }
        </>
      }



      {message.replyMessage?.type === 'Text-post' &&
        <>
          <div className='text-reply-body'>
            <pre className='text-message reply-message'>
              {message.replyMessage?.post?.body.length >= 100 && `${message.replyMessage?.post?.body.slice(0, 100)}...`} 
              {message.replyMessage?.post?.body.length < 100 && message.replyMessage?.post?.body}
            </pre>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Picture-Media-post' &&
        <>
          <div className='reply-media-div'>
            <img src={message.replyMessage?.post?.body} alt="" className='text-image-story' />
            <pre> 
              {message?.replyMessage?.post?.caption?.length >= 172 && `${message?.replyMessage?.post?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.post?.caption?.length < 172 && message?.replyMessage?.post?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Video-Media-post' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.post?.body}></video>
            <pre> 
              {message?.replyMessage?.post?.caption?.length >= 172 && `${message?.replyMessage?.post?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.post?.caption?.length < 172 && message?.replyMessage?.post?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Group-Media-post' &&
       <>
          {message.replyMessage?.post.body[0].type === 'img' ?
            <>
              <div className='reply-media-div'>
                <img src={message?.replyMessage?.post?.body[0].url} alt="" className='text-image-story' />
                <pre> 
                  {message?.replyMessage?.post?.caption?.length >= 172 && `${message?.replyMessage?.post?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.post?.caption?.length < 172 && message?.replyMessage?.post?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
            :
            <>
              <div className='reply-media-div'>
                {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
                <video className='text-image-story' src={message.replyMessage?.post?.body[0].url}></video>
                <pre> 
                  {message?.replyMessage?.post?.caption?.length >= 172 && `${message?.replyMessage?.post?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.post?.caption?.length < 172 && message?.replyMessage?.post?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
          }
        </>
      }




      {message.replyMessage?.type === 'Text-Comment-comment' &&
        <>
          <div className='text-reply-body'>
            <pre className='text-message reply-message'>
              {message.replyMessage?.comment?.body.length >= 100 && `${message.replyMessage?.comment?.body.slice(0, 100)}...`} 
              {message.replyMessage?.comment?.body.length < 100 && message.replyMessage?.comment?.body}
            </pre>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Photo-Comment-comment' &&
        <>
          <div className='reply-media-div'>
            <img src={message.replyMessage?.comment?.body} alt="" className='text-image-story'/>
            <pre> 
              {message?.replyMessage?.comment?.caption?.length >= 172 && `${message?.replyMessage?.comment?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.comment?.caption?.length < 172 && message?.replyMessage?.comment?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Video-Comment-comment' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.comment?.body}></video>
            <pre> 
              {message?.replyMessage?.comment?.caption?.length >= 172 && `${message?.replyMessage?.comment?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.comment?.caption?.length < 172 && message?.replyMessage?.comment?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Group-Comment-comment' &&
       <>
          {message.replyMessage?.comment.body[0].type === 'img' ?
            <>
              <div className='reply-media-div'>
                <img src={message?.replyMessage?.comment?.body[0].url} alt="" className='text-image-story' />
                <pre> 
                  {message?.replyMessage?.comment?.caption?.length >= 172 && `${message?.replyMessage?.comment?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.comment?.caption?.length < 172 && message?.replyMessage?.comment?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
            :
            <>
              <div className='reply-media-div'>
                {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
                <video className='text-image-story' src={message.replyMessage?.comment?.body[0].url}></video>
                <pre> 
                  {message?.replyMessage?.comment?.caption?.length >= 172 && `${message?.replyMessage?.comment?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.comment?.caption?.length < 172 && message?.replyMessage?.comment?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
          }
        </>
      }





      {message.replyMessage?.type === 'Text-Reply-reply' &&
        <>
          <div className='text-reply-body'>
            <pre className='text-message reply-message'>
              {message.replyMessage?.reply?.body.length >= 100 && `${message.replyMessage?.reply?.body.slice(0, 100)}...`} 
              {message.replyMessage?.reply?.body.length < 100 && message.replyMessage?.reply?.body}
            </pre>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Photo-Reply-reply' &&
        <>
          <div className='reply-media-div'>
            <img src={message.replyMessage?.reply?.body} alt="" className='text-image-story' />
            <pre> 
              {message?.replyMessage?.reply?.caption?.length >= 172 && `${message?.replyMessage?.reply?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.reply?.caption?.length < 172 && message?.replyMessage?.reply?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Video-Reply-reply' &&
        <>
          <div className='reply-media-div'>
            {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
            <video className='text-image-story' src={message.replyMessage?.reply?.body}></video>
            <pre> 
              {message?.replyMessage?.reply?.caption?.length >= 172 && `${message?.replyMessage?.reply?.caption.slice(0, 172)}...`} 
              {message?.replyMessage?.reply?.caption?.length < 172 && message?.replyMessage?.reply?.caption}
            </pre>
            <p>
              {/* {message?.time} */}
            </p>
          </div>
        </>
      }

      {message.replyMessage?.type === 'Group-Reply-reply' &&
       <>
          {message.replyMessage?.reply.body[0].type === 'img' ?
            <>
              <div className='reply-media-div'>
                <img src={message?.replyMessage?.reply?.body[0].url} alt="" className='text-image-story' />
                <pre> 
                  {message?.replyMessage?.reply?.caption?.length >= 172 && `${message?.replyMessage?.reply?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.reply?.caption?.length < 172 && message?.replyMessage?.reply?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
            :
            <>
              <div className='reply-media-div'>
                {/* <img src={message?.replyMessage?.body} alt="" className='text-image-story' /> */}
                <video className='text-image-story' src={message.replyMessage?.reply?.body[0].url}></video>
                <pre> 
                  {message?.replyMessage?.reply?.caption?.length >= 172 && `${message?.replyMessage?.reply?.caption.slice(0, 172)}...`} 
                  {message?.replyMessage?.reply?.caption?.length < 172 && message?.replyMessage?.reply?.caption}
                </pre>
                <p>
                  {/* {message?.time} */}
                </p>
              </div>
            </>
          }
        </>
      }




      {message.replyMessage?.type === 'sent-story' &&
        <>
          {message.replyMessage.storyType === 'Text-Story' &&
            <>
              <div className='text-reply-body'>
                <pre className='text-message reply-message'>
                  {message?.replyMessage?.storyText.length >= 100 && `${message?.replyMessage?.storyText.slice(0, 100)}...`} 
                  {message?.replyMessage?.storyText.length < 100 && message.replyMessage?.storyText}
                </pre>
              </div>
            </>
          }

          {message.replyMessage.storyType === 'Img-Story' &&
            
            <>
            <div className='reply-media-div'>
              <img src={message?.replyMessage?.storyMedia} alt="" className='text-image-story' />
              <pre>
                {message?.replyMessage?.storyMediaCaption.length >= 172 && `${message?.replyMessage?.storyMediaCaption.slice(0, 172)}...`} 
                {message?.replyMessage?.storyMediaCaption.length < 172 && message.replyMessage?.storyMediaCaption}
              </pre>
            </div>
          </>
          }

          {message.replyMessage.storyType === 'Vid-Story' &&
            <>
            <div className='reply-media-div'>
            <video className='text-image-story' src={message.replyMessage?.storyMedia}></video>
              <pre>
                {message?.replyMessage?.storyMediaCaption.length >= 172 && `${message?.replyMessage?.storyMediaCaption.slice(0, 172)}...`} 
                {message?.replyMessage?.storyMediaCaption.length < 172 && message.replyMessage?.storyMediaCaption}
              </pre>
            </div>
          </>
          }
        </>
      }
    </div>
  )
}

export default ReplyMessage