import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import { FaPaperPlane, FaImages } from 'react-icons/fa'
import bgcImg from '../Images/color-palette.jpg'

const StoryForm = () => {
  const {
    storyPosting, showStoryForm, setShowStoryForm, storyText, setStoryText, storyMedia, setStoryMedia, storyIsPic, storyIsVid, storyPic, storyVid, storyCaption, setStoryCaption
  } = useContext(appContext)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [color, setColor] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontStyle, setFontStyle] = useState('')
  const [fontWeight, setFontWeight] = useState('')

  useEffect(() => {
    const textArea = document.querySelector('.text-story-ta')

    const background = document.querySelector('#story-background-colors')
    background.addEventListener('change', (e) => {
      textArea.style.backgroundColor = e.target.value
      setBackgroundColor(e.target.value)
    })

    const textF = document.querySelector('#story-font-family')
    textF.addEventListener('change', (e) => {
      textArea.style.fontFamily = e.target.value
      setFontFamily(e.target.value)
    })

    const fontOptions = document.querySelectorAll('#story-font-family option')
    fontOptions.forEach(opt => {
      opt.style.fontFamily = opt.value
    })

    const textC = document.querySelector('#story-text-colors')
    textC.addEventListener('change', (e) => {
      textArea.style.color = e.target.value
      setColor(e.target.value)
    })

    const fontS = document.querySelector('#story-font-size')
    fontS.addEventListener('change', (e) => {
      textArea.style.fontSize = e.target.value
      setFontSize(e.target.value)
    })

    const fontSt = document.querySelector('#story-font-style')
    fontSt.addEventListener('change', (e) => {
      textArea.style.fontStyle = e.target.value
      setFontStyle(e.target.value)
    })

    const fontW = document.querySelector('#story-font-weight')
    fontW.addEventListener('change', (e) => {
      textArea.style.fontWeight = e.target.value
      setFontWeight(e.target.value)
    })

    const spans = document.querySelectorAll('.story-custom span')
    spans.forEach(span => {
      span.style.display = 'flex'
      span.style.flexDirection = 'row'
      span.style.alignItems = 'center'
    })
  })

  useEffect(() => {
    if (!showStoryForm) {
      setStoryMedia(null)
      setStoryCaption('')
      setStoryText('')
    }
  }, [showStoryForm])

  return (
    <div className={showStoryForm ? 'show story-form-div' : 'story-form-div'}>
      <div className="story-custom">

        <span>
          <img src={bgcImg} alt="" style={{height: '15px', width: '15px', borderRadius: '8px'}} />
          <select name="story-background-colors" id="story-background-colors">
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Purple">Purple</option>
            <option value="Pink">Pink</option>
            <option value="Grey">Grey</option>
            <option value="Brown">Brown</option>
          </select>
        </span>

        <span>
          <p>Tt</p>
          <select name="story-font-family" id="story-font-family">
            <option value="Courier New', Courier, monospace">
              Courier New
            </option>

            <option value="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">
              Franklin Gothic Medium
            </option>

            <option value="'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">
              Gill Sans
            </option>

            <option value="'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif">
              Lucida Sans
            </option>

            <option value=" 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
              Segoe UI
            </option>

            <option value="'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif">
              Trebuchet MS
            </option>

            <option value="'Times New Roman', Times, serif">
              Times New Roman
            </option>

            <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">
              Apple System
            </option>

            <option value="cursive">
              Cursive
            </option>

            <option value="Verdana, Geneva, Tahoma, sans-serif">
              Verdana
            </option>
          </select>
        </span>

        <span>
          <img src={bgcImg} alt="" style={{height: '15px', width: '15px', borderRadius: '8px'}} />
          <select name="story-text-colors" id="story-text-colors">
            <option value="white">White</option>
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Purple">Purple</option>
            <option value="Pink">Pink</option>
            <option value="Grey">Grey</option>
            <option value="Brown">Brown</option>
          </select>
          <p>Tt</p>
        </span>

        

        <span>
          <p>Tt</p>
          <select name="story-font-size" id="story-font-size">
            <option value="10px">10px</option>
            <option value="15px">15px</option>
            <option value="20px">20px</option>
            <option value="25px">25px</option>
            <option value="30px">30px</option>
            <option value="35px">35px</option>
            <option value="40px">40px</option>
            <option value="45px">45px</option>
            <option value="50px">50px</option>
            <option value="55px">55px</option>
          </select>
        </span>

        <span>
          <i>Tt</i> 
          <select name="story-font-style" id="story-font-style">
            <option value="normal">normal</option>
            <option value="italic">italic</option>
            <option value="obique">obique</option>
          </select>
        </span>

        <span>
          <b>Tt</b>
          <select name="story-font-weight" id="story-font-weight">
            <option value="lighter">lighter</option>
            <option value="normal">normal</option>
            <option value="bold">bold</option>
          </select>
        </span>
      </div>

      <form className='story-form' onSubmit={e => storyPosting(e, {
        backgroundColor,
        color,
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight
      })} action="submit">
        <div onClick={() => setShowStoryForm(false)} className='form-cancel-btn-div'>
          <span className='form-cancel-btn'>
            Cancel
          </span>
        </div>

        <div className="textarea-div">
          <textarea autoComplete='off' id='media-post-cap' type="text" style={{ display: `${storyMedia ? 'block' : 'none'}` }} value={storyCaption} onChange={e => setStoryCaption(e.target.value)} maxLength='200' placeholder='Type a short caption'></textarea>
          
          <img style={{ display: `${storyMedia && storyIsPic ? 'block' : 'none'}` }} className='img-story' src={storyPic.current} />
          
          <video className='vid-story' src={storyVid.current} style={{ display: `${storyMedia && storyIsVid ? 'block' : 'none'}` }}></video>
        
          <textarea autoComplete='off' className='text-story-ta' autoFocus value={storyText} name="" placeholder='Add a Story'
            id='new-story-text' onChange={e => setStoryText(e.target.value)} 
            style={{ display: `${storyMedia ? 'none' : 'block'}` }}
          >
          </textarea> 
        
        </div>

        <div>
          <label htmlFor="story-media-input">
            <FaImages />
            <input autoComplete='off' id='story-media-input' name='story-media-input' type="file"
              onClick={e => e.target.value = null}
              onChange={e => setStoryMedia(e.target.files[0])}
            />
          </label>
          <button>
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  )
}

export default StoryForm