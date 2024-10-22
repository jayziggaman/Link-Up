import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Video from './Video';

const DMMedia = ({ media, setFiles, setMedia }) => {
  
  return (
    <div className="story-media-input-div"
      style={media[0] ? { display: 'block' } : { display: 'none' }}
    >
      <div className="story-media-input-inner-div">
        <div className="multiple-story-media-div">
          {media.map((mediaItem, ind) => {
            const { type, url } = mediaItem
            
            return (
              <div key={ind} className="story-reply-media">
                {type === 'img' ?
                  <img key={ind} src={url} alt="" />
                  : 
                  <Video source={url} key={ind}/>
                }

                <span role="button" onClick={() => {
                  setMedia(media.filter(item => item.url !== url))
                }}>
                  <DeleteOutlineOutlinedIcon />
                </span>
              </div>
            )
          })}
        </div>

        <button className='cancel-story-media' role={'button'}
          onClick={() => setFiles([])}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

export default DMMedia