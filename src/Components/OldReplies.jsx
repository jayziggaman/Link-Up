import React from 'react'

const OldReplies = () => {
  return (
    <div>
      {/* text-reltaed-replies */}
      {replyMessageBody?.type === 'text-message' &&
        <>
          <pre>
            {replyMessageBody?.body?.length > 123 && `${replyMessageBody?.body?.slice(0, 123)}...`}
            {replyMessageBody?.body?.length < 123 && replyMessageBody?.body}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'reply-text-message' &&
        <>
          <pre>
            {replyMessageBody?.body?.length > 123 && `${replyMessageBody?.body?.slice(0, 123)}...`}
            {replyMessageBody?.body?.length < 123 && replyMessageBody?.body}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'story-text-message' &&
        <>
          <pre>
            {replyMessageBody?.body?.length > 123 && `${replyMessageBody?.body.slice(0, 123)}...`}
            {replyMessageBody?.body?.length < 123 && replyMessageBody?.body}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Text-post' &&
        <>
          <pre>
            {replyMessageBody?.post?.body.length > 123 && `${replyMessageBody?.post?.body.slice(0, 123)}...`}
            {replyMessageBody?.post?.body.length < 123 && replyMessageBody?.post.body}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Text-Comment-comment' &&
        <>
          <pre>
            {replyMessageBody?.comment?.body.length > 123 && `${replyMessageBody?.comment?.body.slice(0, 123)}...`}
            {replyMessageBody?.comment?.body.length < 123 && replyMessageBody?.comment.body}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Text-Reply-reply' &&
        <>
          <pre>
            {replyMessageBody?.reply?.body.length > 123 && `${replyMessageBody?.reply?.body.slice(0, 123)}...`}
            {replyMessageBody?.reply?.body.length < 123 && replyMessageBody?.reply.body}
          </pre>
        </>
      }





      {/* photo-reltaed-replies */}
      {replyMessageBody?.type === 'photo-message' &&
        <>
          <img src={replyMessageBody?.body} alt="" className='img-message'/>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'story-photo-message' &&
        <>
          <img src={replyMessageBody?.body} alt="" className='img-message'/>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Picture-Media-post' &&
        <>
          <img src={replyMessageBody?.post.body} alt="" className='img-message'/>
          <pre>
            {replyMessageBody?.post?.caption.length > 123 && `${replyMessageBody?.post?.caption.slice(0, 123)}...`}
            {replyMessageBody?.post?.caption.length < 123 && replyMessageBody?.post.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Photo-Comment-comment' &&
        <>
          <img src={replyMessageBody?.comment.body} alt="" className='img-message'/>
          <pre>
            {replyMessageBody?.comment?.caption.length > 123 && `${replyMessageBody?.comment?.caption.slice(0, 123)}...`}
            {replyMessageBody?.comment?.caption.length < 123 && replyMessageBody?.comment.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Photo-Reply-reply' &&
        <>
          <img src={replyMessageBody?.reply.body} alt="" className='img-message'/>
          <pre>
            {replyMessageBody?.reply?.caption.length > 123 && `${replyMessageBody?.reply?.caption.slice(0, 123)}...`}
            {replyMessageBody?.reply?.caption.length < 123 && replyMessageBody?.reply.caption}
          </pre>
        </>
      }




      
      {/* video-reltaed-replies */}
      {replyMessageBody?.type === 'video-message' &&
        <>
          <video controls src={replyMessageBody?.body} alt="" className='video-message'></video>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'story-video-message' &&
        <>
          <video controls src={replyMessageBody?.body} alt="" className='video-message'></video>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Video-Media-post' &&
        <>
          <video controls src={replyMessageBody?.post.body} alt="" className='video-message'></video>
          <pre>
            {replyMessageBody?.post?.caption.length > 123 && `${replyMessageBody?.post?.caption.slice(0, 123)}...`}
            {replyMessageBody?.post?.caption.length < 123 && replyMessageBody?.post.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Video-Comment-comment' &&
        <>
        <video controls src={replyMessageBody?.comment.body} alt="" className='video-message'></video>
          <pre>
            {replyMessageBody?.comment?.caption.length > 123 && `${replyMessageBody?.comment?.caption.slice(0, 123)}...`}
            {replyMessageBody?.comment?.caption.length < 123 && replyMessageBody?.comment.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Video-Reply-reply' &&
        <>
        <video controls src={replyMessageBody?.reply.body} alt="" className='video-message'></video>
          <pre>
            {replyMessageBody?.reply?.caption.length > 123 && `${replyMessageBody?.reply?.caption.slice(0, 123)}...`}
            {replyMessageBody?.reply?.caption.length < 123 && replyMessageBody?.reply.caption}
          </pre>
        </>
      }




      {/* group-media-reltaed-replies */}
      {replyMessageBody?.type === 'group-media-message' &&
        <>
          <div ref={mediaDiv} className="multiple-dm-media-div multi-media-div">
            {replyMessageBody?.body.map(message => {
              if (message.type === 'video') {
                return (
                  <video src={message.url} className='video-message' autoPlay='autoplay'></video>
                )
                
              } else if (message.type === 'img') {
                return (
                  <img src={message.url} alt="" className='img-message'/>
                )
                
              } 
              })
              
            }
          </div>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }   
      
      {replyMessageBody?.type === 'story-group-media-message' &&
        <>
          <div ref={mediaDiv} className="multiple-dm-media-div multi-media-div">
            {replyMessageBody?.body.map(message => {
              if (message.type === 'video') {
                return (
                  <video src={message.url} className='video-message' autoPlay='autoplay'></video>
                )
                
              } else if (message.type === 'img') {
                return (
                  <img src={message.url} alt="" className='img-message'/>
                )
                
              } 
              })
              
            }
          </div>
          <pre>
            {replyMessageBody?.caption?.length > 123 && `${replyMessageBody?.caption?.slice(0, 123)}...`}
            {replyMessageBody?.caption?.length < 123 && replyMessageBody?.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Group-Media-post' &&
        <>
          <div ref={mediaDiv} className="multiple-dm-media-div multi-media-div">
            {replyMessageBody?.post.body[0].type === 'img' ?
              <img src={replyMessageBody?.post.body[0].url} alt="" className='img-message'/>
              :
              <video src={replyMessageBody?.post.body[0].url} className='video-message'></video>
            }
          </div>
          <pre>
            {replyMessageBody?.post?.caption.length > 123 && `${replyMessageBody?.post?.caption.slice(0, 123)}...`}
            {replyMessageBody?.post?.caption.length < 123 && replyMessageBody?.post.caption}
          </pre>
        </>
      }

      {replyMessageBody?.type === 'Group-Comment-comment' &&
        <>
          <div ref={mediaDiv} className="multiple-dm-media-div multi-media-div">
            {replyMessageBody?.comment.body[0].type === 'img' ?
              <img src={replyMessageBody?.comment.body[0].url} alt="" className='img-message'/>
              :
              <video src={replyMessageBody?.comment.body[0].url} className='video-message'></video>
            }
          </div>
          <pre>
            {replyMessageBody?.comment?.caption.length > 123 && `${replyMessageBody?.comment?.caption.slice(0, 123)}...`}
            {replyMessageBody?.comment?.caption.length < 123 && replyMessageBody?.comment.caption}
          </pre>
        </>
      }

      
      {replyMessageBody?.type === 'Group-Reply-reply' &&
        <>
          <div ref={mediaDiv} className="multiple-dm-media-div multi-media-div">
            {replyMessageBody?.reply.body[0].type === 'img' ?
              <img src={replyMessageBody?.reply.body[0].url} alt="" className='img-message'/>
              :
              <video src={replyMessageBody?.reply.body[0].url} className='video-message'></video>
            }
          </div>
          <pre>
            {replyMessageBody?.reply?.caption.length > 123 && `${replyMessageBody?.reply?.caption.slice(0, 123)}...`}
            {replyMessageBody?.reply?.caption.length < 123 && replyMessageBody?.reply.caption}
          </pre>
        </>
      }



      {/* sent stories */}
      {replyMessageBody?.type === 'sent-story' &&
        <>
          {replyMessageBody?.storyType === 'Text-Story' &&
            <pre>
              {replyMessageBody?.storyMedia?.length > 123 && `${replyMessageBody?.storyMedia?.slice(0, 123)}...`}
              {replyMessageBody?.storyMedia?.length < 123 && replyMessageBody?.storyMedia}
            </pre>
          }

          {replyMessageBody?.storyType === 'Img-Story' &&
            <>
              <img src={replyMessageBody?.storyMedia} alt="" className='img-message'/>
              <pre>
                {replyMessageBody?.storyMediaCaption?.length > 123 && `${replyMessageBody?.storyMediaCaption?.slice(0, 123)}...`}
                {replyMessageBody?.storyMediaCaption?.length < 123 && replyMessageBody?.storyMediaCaption}
              </pre>
            </>
          }

          {replyMessageBody?.storyType === 'Vid-Story' &&
            <>
              <video controls src={replyMessageBody?.storyMedia} alt="" className='video-message'></video>
              <pre>
                {replyMessageBody?.storyMediaCaption?.length > 123 && `${replyMessageBody?.storyMediaCaption?.slice(0, 123)}...`}
                {replyMessageBody?.storyMediaCaption?.length < 123 && replyMessageBody?.storyMediaCaption}
              </pre>
            </>
          }
        </>
      }
    </div>
  )
}

export default OldReplies