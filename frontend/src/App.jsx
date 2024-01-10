import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      {
        isLoading 
          ? <h1 className="text-3xl font-bold underline">Loading...</h1> 
          : <h1 className="text-3xl font-bold underline">{data.message}</h1>
      }
    </>
  )
}

export default App
