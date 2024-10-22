import React from 'react'

const Video = ({ source, classname, haveControls, shouldAutoplay, videoRef, loadedData, style }) => {
  
  return (
    <video
      controls={haveControls ? true : false}
      autoPlay={shouldAutoplay ? true : false}
      className={classname ? classname : ''}
      ref={videoRef ? videoRef : null}
      onLoadedData={e => loadedData && loadedData(e)}
      // poster={source} 
      style={style ? style : null}
    >
      <source src={source}/>
    </video>
  )
}

export default Video