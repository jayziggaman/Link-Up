import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'

const ChatViewModal = ({selectedMediaId, selectedMediaType}) => {
  const { showChatModal, setShowChatModal } = useContext(appContext)
  const [index, setIndex] = useState(0)
  const [mediaLength, setMediaLength] = useState(0)
  const modalRef = useRef()
  const modalArticle = useRef()
  
  const showRef = useRef(true)
  useEffect(() => {
    if (showRef.current) {
      showRef.current = false
    } else {
      if (showChatModal) {
        modalRef.current.classList.add('show-div')

        if (selectedMediaType.current === 'photo-message' ||
          selectedMediaType.current === 'story-photo-message' ||
          selectedMediaType.current === 'reply-photo-message'
        ) { 
          const img = document.createElement('img')
          img.classList.add('full-page')
          img.setAttribute('src', selectedMediaId.current)
          modalArticle.current.appendChild(img)
        }
        

        if (selectedMediaType.current === 'video-message' ||
          selectedMediaType.current === 'story-video-message' ||
          selectedMediaType.current === 'reply-video-message'
        ) { 
          const video = document.createElement('video')
          video.setAttribute('autoPlay', 'autoPlay')
          video.setAttribute('controls', 'controls')
          video.classList.add('full-page')
          video.setAttribute('src', selectedMediaId.current)
          video.pause()
          modalArticle.current.appendChild(video)
        }


        if (selectedMediaType.current === 'group-media-message' ||
          selectedMediaType.current === 'story-group-media-message' ||
          selectedMediaType.current === 'reply-group-media-message'
        ) {
          const info = JSON.parse(selectedMediaId.current)
          setMediaLength(prev => (prev - prev) + info.length)
          // console.log(info)

          for (let i = 0; i < info.length; i++) {

            if (info[i].type === 'img') {
              const img = document.createElement('img')
              img.setAttribute('src', info[i].url)
              img.classList.add('multiple-dm-media-modal')
              if (index === i) {
                img.classList.add('currView')
              } else if ((index - 1) === i) {
                img.classList.add('prevView')
              } else if ((index + 1) === i) {
                img.classList.add('nextView')
              }  
              modalArticle.current.appendChild(img)

            } else {
              const video = document.createElement('video')
              video.setAttribute('src', info[i].url)
              video.classList.add('multiple-dm-media-modal')
              video.setAttribute('autoPlay', 'autoPlay')
              video.setAttribute('controls', 'controls')
              video.pause()
              if (index === i) {
                video.classList.add('currView')
              } else if ((index - 1) === i) {
                video.classList.add('prevView')
              } else if ((index + 1) === i) {
                video.classList.add('nextView')
              }  
              modalArticle.current.appendChild(video)
            }
          }
        }
        

        const media = document.querySelectorAll('.full-page')
        media.forEach((item, i) => {
          if (index !== i) {
            if (item.nodeName === 'VIDEO') {
              item.pause()
            }
          }
        })



      } else {
        modalRef.current.classList.remove('show-div')
        modalArticle.current.innerHTML = null
        setIndex(prev => prev - prev)
      }
    }
  }, [showChatModal])

  useEffect(() => {
    const media = document.querySelectorAll('.multiple-dm-media-modal')
    media.forEach((item, i) => {
      if (index === i) {
        item.classList.add('currView')
        item.classList.remove('prevView')
        item.classList.remove('nextView')

      } else if ((index - 1) === i) {
        item.classList.add('prevView')
        item.classList.remove('currView')
        item.classList.remove('nextView')

      } else if ((index + 1) === i) {
        item.classList.add('nextView')
        item.classList.remove('currView')
        item.classList.remove('prevView')

      } else {
        item.classList.remove('nextView')
        item.classList.remove('currView')
        item.classList.remove('prevView')
      } 
    })
    media.forEach((item, i) => {
      if (index !== i) {
        if (item.nodeName === 'VIDEO') {
          item.pause()
        }
      }
    })
  }, [index])


  return (
    <section ref={modalRef} className="chat-modal-overlay">
      <div className='cancel-dm-media' role={'button'} onClick={() => setShowChatModal(false)}>
        <div style={{height: '20px', right: '20px'}}></div>
        <div style={{height: '20px', right: '20px'}}></div>
      </div>

      <div className="div-one" onClick={() => index !== 0 && setIndex(prev => prev - 1)}></div>
      <div className="div-two" onClick={() => index < mediaLength - 1 && setIndex(prev => prev + 1)}></div>

      <article ref={modalArticle} className="chat-modal-item-view">
      </article>
    </section>
  )
}

export default ChatViewModal