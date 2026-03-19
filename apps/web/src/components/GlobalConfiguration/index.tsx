import { useEffect, useState } from 'react'

function GlbalConfig() {

  const [count, setCount] = useState(0)

  useEffect(() => {

  }, [count])

  return (
    <div onClick={() => setCount(1)}>GlbalConfig</div>
  )
}

export default GlbalConfig