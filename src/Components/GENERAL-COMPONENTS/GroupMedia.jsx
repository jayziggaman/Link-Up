import React, { useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Video from './Video';

const GroupMedia = ({ linkTo, post }) => {
  const { media } = post

  const [index, setIndex] = useState(0)



  // const indexRef = useRef(true)
  // useEffect(() => {
  //   if (indexRef.current) {
  //     indexRef.current = false

  //   }
  // }, [index])




  const handlers = useSwipeable({
    onSwipedLeft: () => {
      increaseIndex()
    } ,

    onSwipedRight: () => {
      decreaseIndex()
    },
  });


  function increaseIndex() {
    if (index !== media.length - 1) {
      setIndex(prev => prev + 1)
    }
  }


  function decreaseIndex() {
    if (index !== 0) {
      setIndex(prev => prev - 1)
    }
  }




  return (
    <div onClick={e => linkTo(e)} className='in-link' {...handlers}>
      <div className='group-media-div'>
        <div className="post-number">
          {index + 1}/{media.length}
        </div>
        <div className="scroll-posts postt">
          <button className='index-btn' style={{opacity: index === 0 && '0'}}
            onClick={() => decreaseIndex()}
          >
            <KeyboardArrowLeftIcon />
          </button>

          <button className='index-btn'  style={{opacity: index === media.length - 1 && '0'}}
            onClick={() => increaseIndex()}
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
        
        {media.map((item, i) => {
          return (
            <GroupMediaContent key={i} item={item} index={index} i={i} />
          )
        })}

        {media.map((item, i) => {
          return  item.type === 'img' ?
            <img key={i} src={item.url} alt=""
              className="img-post-body sample"
            /> 
          :
          item.type === 'video' &&
          <Video key={i} source={item.url} haveControls={true} classname="vid-post-body sample"/>
        })}
      </div>
    </div>
    )
}

export default GroupMedia



const GroupMediaContent = ({ item, index, i }) => {
  return (
    <>
      {item.type === 'img' ?
        <>
          {index === i &&
            <img key={i} src={item.url} alt=""
              className='img-post-body group-media curr-media'
            />
          }

          {(index + 1) === i &&
            <img key={i} src={item.url} alt=""
              className='img-post-body group-media next-media'
            />
          }

          {(index - 1) === i &&
            <img key={i} src={item.url} alt=""
              className='img-post-body group-media prev-media'
            />
          }

          {index !== i && (index + 1) !== i && (index - 1) !== i &&
            <img key={i} src={item.url} alt=""
              className='img-post-body group-media'
            />
          }
        </>
        :
        item.type === 'video' &&
        <>
          {index === i &&
            <Video key={i} source={item.url} haveControls={true}
              classname="vid-post-body group-media curr-media" 
            />
          }

          {(index + 1) === i &&
            <Video key={i} source={item.url} haveControls={true}
              classname="vid-post-body group-media next-media" 
            />
          }

          {(index - 1) === i &&
            <Video key={i} source={item.url} haveControls={true}
              classname="vid-post-body group-media prev-media" 
            />
          }

          {index !== i && (index + 1) !== i && (index - 1) !== i &&
            <Video key={i} source={item.url} haveControls={true}
              classname="vid-post-body group-media" 
            />
          }
        </>
      }
    </>
  )
}