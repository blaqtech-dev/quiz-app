import { useState } from "react"
import { Link } from "react-router-dom"
import './mainhome.css'

export function MainHome() {

  const [category, setCategory] = useState("9")

  return (
    <div className='coverall-mainhome'>

      <div className='home-card'>

        <h2>
          Brain <span>Bolt</span>
        </h2>

        <p>
          Test your intellect against friends
        </p>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value='9'>General Knowledge</option>
          <option value='10'>Books</option>
          <option value='11'>Film</option>
          <option value='13'>Musicals & Theatres</option>
          <option value='20'>Mythology</option>
          <option value='18'>Computer Science</option>
          <option value='23'>History</option>
          <option value='15'>Video Games</option>
          <option value='28'>Vehicles</option>
          <option value='30'>Gadgets</option>
          <option value='27'>Animals</option>
          <option value='31'>Anime & Manga</option>
          <option value='12'>Music</option>
          <option value='19'>Mathematics</option>
          <option value='24'>Politics</option>
          <option value='26'>Celebrities</option>
        </select>

        {/* SINGLE PLAYER */}
        <Link to={`/singlequiz?category=${category}`}>
          <button className='single-btn'>
            Single Player
          </button>
        </Link>

        {/* MULTIPLAYER */}
        <Link to={`/lobby?category=${category}`}>
          <button
            className='multi-btn'
            style={{ color: '#0a3081' }}
          >
            Multiplayer
          </button>
        </Link>

      </div>

    </div>
  )
}