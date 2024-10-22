import ExoplanetCard from "./ExoplanetCard"
import './App.css'
import data from './assets/data.json'
import { useEffect, useState } from "react"

function App() {
  const [planets, setPlanets] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const randomPlanets = getRandomPlanets(data, 20);
    console.log(randomPlanets)
    setPlanets(randomPlanets)
    setIsLoading(false)
  }, []);

  const getRandomPlanets = (data, count) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className='app'>
      <div className="stars"></div>
      {isLoading && <div><h2>Getting Exoplanets</h2></div>}
      {planets && <ExoplanetCard planets={planets}/>}
    </div>
  )
}

export default App
