import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaImages, FaPaperPlane } from 'react-icons/fa'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { motion } from 'framer-motion';
import { db } from '../firebase/config'
import { v4 as uuidv4 } from 'uuid';
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import Video from '../COMPONENTS/GENERAL-COMPONENTS/Video';

const NewStoryLayout = () => {
  const { user, sssMenu, setSssMenu, users, userAuth, windowHeight } = useContext(appContext)
  const { routeToLogin, generateLink, loadSingleMedia, callError } = useContext(functionsContext)

  const { username, avatarUrl } = user

  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [media, setMedia] = useState(null)

  const [font, setFont] = useState('')
  const [fontWeight, setFontWeight] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontStyle, setFontStyle] = useState('')
  const [color, setColor] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')

  const storyCoverRef = useRef(null)

  const navigate = useNavigate()


  const newStoryFonts = [
    {
      id: "one",
      value: "Courier New, Courier, monospace",
      text: "Courier New"
    },

    {
      id: "two",
      value: "Franklin Gothic Medium, Arial Narrow, Arial, sans-serif",
      text: "Franklin Gothic Medium"
    },

    {
      id: "three",
      value: "Gill Sans, Gill Sans MT, Calibri, Trebuchet MS, sans-serif",
      text: "Gill Sans"
    },

    {
      id: "four",
      value: "Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif",
      text: "Lucida Sans"
    },

    {
      id: "five",
      value: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      text: "Segoe UI"
    },
    
    {
      id: "six",
      value: "Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif",
      text: "Trebuchet MS"
    },

    {
      id: "seven",
      value: "Times New Roman, Times, serif",
      text: "Times New Roman"
    },

    {
      id: "eight",
      value: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif",
      text: "Apple-system"
    },
    
    {
      id: "nine",
      value: "cursive",
      text: "Cursive"
    },
    
    {
      id: "ten",
      value: "Verdana, Geneva, Tahoma, sans-serif",
      text: "Verdana"
    },
  ]
  const newStoryColors = ['Transparent', 'White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Grey', 'Brown']
  const newStoryFontsSizes = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  const newStoryFontsStyles = [
    {
      id: "one",
      value: "Normal"
    },

    {
      id: "two",
      value: "Italic"
    },

    {
      id: "one",
      value: "Oblique"
    }
  ]
  const newStoryFontsWeights = [
    {
      id: "one",
      value: "Normal"
    },

    {
      id: "two",
      value: "Lighter"
    },

    {
      id: "one",
      value: "Bold"
    }
  ]
  
  const textareaRef = useRef();
  const time = new Date()


  useEffect(() => {
    if (routeToLogin()) {
      navigate('/auth?type=login');
    }
  }, [])


  useEffect(() => {
    if (!file) {
      setMedia(null)
    }
  }, [file]) 

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.setProperty('font-size', `${fontSize}px`, 'important');
    }
  }, [fontSize]);


  const initializeUploadStory = async () => {
    let type = ''
    if (!media) {
      type = 'Text-Story' 

    } else if (media.type === 'img') {
      type = 'Img-Story' 

    } else if (media.type === 'video') {
      type = 'Vid-Story'
    }

    const props = {
      backgroundColor, color, fontWeight, fontStyle,
      fontFamily: font,
      fontSize: `${fontSize}px`
    }

    const newMedia = file ? await generateLink([file]) : []

    uploadStory(type, newMedia, props)
  }


  const clearStoryDetails = () => {
    setFile(null)
    setCaption('')
    setFont('')
    setFontWeight('')
    setFontSize('')
    setFontStyle('')
    setColor('')
    setBackgroundColor('')
  }
  
  

  const uploadStory = (type, media, props) => {
    const userRef = collection(db, "users", user.id, 'stories')
    const id = uuidv4()

    setDoc(doc(userRef, id), {
      id, type, props, caption, media,
      creator: user.id,
      createdAt: time.getTime(), 
      viewers: {
        value: []
      }
    }).then(() => {
      const words = caption.split(/['/', ' ', ':', ';', ',']/)
      const arr = []

      users.map(user => {
        const condition = words.find(word => word === `@${user.username}`)
        const conditionII = user.id !== userAuth
        if (condition && conditionII) {
          arr.push(user)
        }
      })

      for (let i = 0; i < arr.length; i++) {
        const userRef = doc(db, 'users', arr[i].id)
        updateDoc(userRef, {
          notifications: {
            value: [...arr[i].notifications.value, {
              id: id,
              type: 'story-tag', 
              value: id, 
              taggedBy: userAuth,
              sentAt: time.getTime()
            }]
          }
        })
      }

      window.location.replace('/')
      callError("Story sent successfully")
      clearStoryDetails()

    }).catch(() => {
      callError("Oops an error occured. Please try again.")
    })
  }


  function deleteMedia() {
    setFile(null)
  }



  return (
    <main className='story-layout' onClick={(e) => {
      sssMenu && setSssMenu(false)
    }}>
      
      <div className='story-options'>
        <div role={'button'}
          onClick={() => {
            navigate('/')
          }}
          className='story-cancel'
        >
          <CloseIcon />
        </div>
      </div>

      <section className="story-content" id="story-content">
        <div className="story-setters">
          <select name="font" id="font"
            value={font} onChange={e => setFont(e.target.value)}
          >
            {newStoryFonts.map((font, ind) => {
              const { value, text } = font
              
              return (
                <option key={ind} value={value}>
                  {text}
                </option>
              )
            })}
          </select>

          <select name="font-size" id="font-size"
            value={fontSize} onChange={e => setFontSize(e.target.value)}
          >
            {newStoryFontsSizes.map((size, ind) => {
              return (
                <option key={ind} value={size}>
                  {size}px
                </option>
              )
            })}
          </select>

          <select name="background-color" id="background-color"
            value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)}
          >
            {newStoryColors.map((color, ind) => {
              return (
                <option key={ind} value={color}>
                  {color}
                </option>
              )
            })}
          </select>

          <select name="color" id="color"
            value={color} onChange={e => setColor(e.target.value)}
          >
            {newStoryColors.map((color, ind) => {
              return (
                <option key={ind} value={color}>
                  {color}
                </option>
              )
            })}
          </select>

          <select name="font-style" id="font-style"
            value={fontStyle} onChange={e => setFontStyle(e.target.value)}
          >
            {newStoryFontsStyles.map((style, ind) => {
              const { value } = style
              
              return (
                <option key={ind} value={value}>
                  {value}
                </option>
              )
            })}
          </select>

          <select name="font-weight" id="font-weight"
            value={fontWeight} onChange={e => setFontWeight(e.target.value)}
          >
            {newStoryFontsWeights.map((weight, ind) => {
              const { value } = weight
              
              return (
                <option key={ind} value={value}>
                  {value}
                </option>
              )
            })}
          </select>
        </div>

        <div ref={storyCoverRef} className="story-wrapper"
          style={
            windowHeight < 600 ? { display: 'block' } : { display: 'grid' }
          }
        >
          {windowHeight >= 600 &&
            <div className="story-abs" id="story-abs">
              <div className="story-pfp-username">
                <UserPfp user={user} />
                
                <div className="name-time-opt">
                  <span>
                    Your Story
                  </span>
                </div>
              </div>
            </div>
          }

          <Button storyCoverRef={storyCoverRef}
            click={deleteMedia}
            opacity={media ? 1 : 0}
          >
            <DeleteOutlineOutlinedIcon />
          </Button>

          
          <Button storyCoverRef={storyCoverRef}>
            <label htmlFor="new-story-image">
              <input type="file" name='new-story-image' id='new-story-image'
                style={{ display: "none" }} 
                onClick={e => e.target.value = null}
                onChange={e => {
                  setFile(e.target.files[0])
                  loadSingleMedia(e.target.files[0], setMedia)
                }}
              
              />
            </label>
            <FaImages />
          </Button>

          <Button storyCoverRef={storyCoverRef}
            click={initializeUploadStory}
          >
            <FaPaperPlane />
          </Button>

          <div className="story-content-body"
            style={{
              backgroundColor: backgroundColor ? backgroundColor : 'gray'
            }}
          >
            {media &&
              <div className="new-story-media-div">
                {media.type === 'img' ?
                  <img src={media.url} alt="" className='loading-story-media'/>
                  :
                  <Video source={media.url} classname='loading-story-media' />
                }
              </div>
            }
            

            <textarea ref={textareaRef} name="new-story-caption" id="new-story-caption"
              value={caption} onChange={e => setCaption(e.target.value)}
              style={{
                color: color,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
                fontFamily: font,
                fontSize: `${fontSize}px !important`,
              }}
            ></textarea>
          </div>
        </div>
        
      </section>
    </main>
  )
}

export default NewStoryLayout



const Button = ({ children, storyCoverRef, click, opacity }) => {
  
  return (
    <motion.button className='drag-btn'
      drag
      dragConstraints={storyCoverRef}
      dragElastic={0.2}
      style={{ opacity: opacity }}

      onClick={() => click && click()}
    >
      {children}
    </motion.button>
  )
}





const StoryCaption = ({ currStory }) => {
  const { isLinkElement, hrefChecker } = useContext(functionsContext)
  const { props, caption } = currStory
  const { fontFamily, fontSize, fontStyle, fontWeight, color, backgroundColor, } = props

  return (
    <pre className="story-content-container"
      style={{
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        fontFamily: fontFamily,
        color: color,
        fontSize: fontSize,
        backgroundColor: backgroundColor
      }}
    >
      {isLinkElement(caption) ?
        <a className='out-link' href={hrefChecker(caption)} target='_blank'>
          {caption}
        </a>
        :
        <>
          {caption}
        </>
      }
    </pre>
  )
}

















