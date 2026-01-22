import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.json())
      .then(json => setData(json.text))
      .catch(err => console.error("Connection failed:", err))
  }, [])

  return (
    <div>
      <h1>Frontend + Backend Connection</h1>
      <p>Message from Server: <strong>{data || 'Connecting...'}</strong></p>
    </div>
  )
}

export default App
