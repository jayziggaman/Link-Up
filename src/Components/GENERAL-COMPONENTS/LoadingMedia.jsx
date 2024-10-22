import React from 'react'
import Video from './Video'

const LoadingMedia = ({ type, url, index, ind, media, indexIncreasing, imgClass, videoClass }) => {

  return (
    <>
      {type === 'img' ?
        <>
          {index === ind ?
            <img src={url} alt=""
              className={`${imgClass} curr`}
            />
          
          : (index + 1) === ind || index === (media.length - 1) && ind === 0 ?
            <img src={url} alt=""
              className={`${imgClass} next`}
              style={{
                zIndex: !indexIncreasing ? 2 : 0,
              }}
            />

          : (index - 1) === ind || index === 0 && ind === (media.length - 1) ?
            <img src={url} alt=""
              className={`${imgClass} prev`}
              style={{
                zIndex: indexIncreasing ? 2 : 0,
              }}
            />

          : <img src={url} alt=""
              className={`${imgClass}`}
            />
          }
        </>
        :
        type === 'video' &&
        <>
          {index === ind ?
            <Video key={ind} source={url} 
              classname={`${videoClass} curr`}
            />

          : (index + 1) === ind || index === (media.length - 1) && ind === 0 ?
              <Video key={ind} source={url} 
                classname={`${videoClass} next`}
                style={{ zIndex: !indexIncreasing ? 2 : 0 }}
              />

          : (index - 1) === ind || index === 0 && ind === (media.length - 1) ?
            <Video key={ind} source={url} 
              classname={`${videoClass} prev`}
              style={{ zIndex: indexIncreasing ? 2 : 0 }}
            />

          : <Video key={ind} source={url} classname={videoClass} />
          }
        </>
      }
    </>
  )
}

export default LoadingMedia