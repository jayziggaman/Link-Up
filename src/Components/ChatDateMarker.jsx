import React from 'react'

const ChatDateMarker = ({ message }) => {
  const { year, month, day } = message
  const time = new Date()

  const today = {
    day: time.getDate(),
    month: time.getMonth(),
    year: time.getFullYear(),
    createdAt: time.getTime()
  }


  return (
    <div className='chat-date-marker'>
      <p>
        {year === today.year && month === today.month && day === today.day &&
          <>Today</>
        }

        {year === today.year && month === today.month && day === today.day - 1 &&
          <>Yesterday</>
        }

        {year === today.year && month === today.month && day !== today.day - 1 && day !== today.day &&
          <>
            {day}/{month}/{year}
          </>
        }
      </p>
    </div>
  )
}

export default ChatDateMarker