import React, { useState, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import jsPDF from 'jspdf'


function ExoplanetCard ({planets}) {
  const [currentIndex, setCurrentIndex] = useState(planets.length - 1)
  const [lastDirection, setLastDirection] = useState()
  
  const [noPlanets, setNoPlanets] = useState([])
  const [yesPlanets, setYesPlanets] = useState([])

  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(planets.length)
        .fill(0)
        .map(() => React.createRef()),
    [planets.length]
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < planets.length - 1

  const canSwipe = currentIndex >= 0

  const swiped = (direction, planet, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
    if (direction === 'left') {
      setNoPlanets((prev) => [...prev, planet])
    } else if (direction == 'right') {
      setYesPlanets((prev) => [...prev, planet])
    }
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < planets.length) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  const restart = async () => {
    for (let i = 0; i < planets.length; i++) {
      if (childRefs[i].current) {
        await childRefs[i].current.restoreCard()
      }
    }

    setCurrentIndex(planets.length -1)
    setNoPlanets([])
    setYesPlanets([])
    setLastDirection(null)
  }

  const downloadPlanetLists = () => {
    console.log('downloading Lists')
    const doc = new jsPDF()

    if (noPlanets.length > 0) {
      doc.setFontSize(14)
      doc.text('No Exoplanets:', 14, 22);
      noPlanets.forEach((planet, index) => {
        doc.text(`${planet.name}`, 14, 30 + index * 10)
      })
    }

    if (yesPlanets.length > 0) {
      doc.addPage()
      doc.setFontSize(14)
      doc.text('Yes Exoplanets:', 14, 22)
      yesPlanets.forEach((planet, index) => {
        doc.text(`${planet.name}`, 14, 30 + index * 10)
      })
    }

    doc.save('swiped_exoplanets.pdf')
  }

  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Exoplanet Picker</h1>
      { currentIndex >= 0 ? (
      <div className='cardContainer'>
      {planets.map((planet, index) => (
        <TinderCard
          ref={childRefs[index]}
          className='swipe'
          key={planet.id}
          onSwipe={(dir) => swiped(dir, planet, index)}
          onCardLeftScreen={() => outOfFrame(planet.id, index)}
          onCardRightScreen={() => outOfFrame(planet.id, index)}
        >
          <div
            className='card'
          >
            <h3>{planet.name}</h3>
          </div>
        </TinderCard>
      ))}
    </div>
    
      ) : (
        <div>
          <h2 className='no-more-planets'>No more planets!</h2>
        </div>
      )}

{currentIndex >= 0 ? (
        <div className='buttons'>
          <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>
            Swipe left!
          </button>
          <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>
            Undo swipe!
          </button>
          <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>
            Swipe right!
          </button>
        </div>
      ) : <div className='buttons'>
          <button onClick={() => restart()}>Reset</button>
          <button onClick={() => downloadPlanetLists()}>Download List</button>
        </div>}
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}


      <div>
      <h2>No Planets</h2>
      <ul>
        {noPlanets.map((planet, idx) => (
          <li key={idx}>
            {planet.name}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Yes Planets</h2>
      <ul>
        {yesPlanets.map((planet, idx) => (
          <li key={idx}>
          {planet.name}</li>
        ))}
      </ul>
    </div>


    </div>
  )
}

export default ExoplanetCard