import { useState } from 'react'
import './App.css'

const data = [{
  name: "web pages",
  url: ["https://twitter.com/home"]
}]

function App() {
  const [lists , setList] = useState(data)

  const openTabs = (url) => {
    for(const link of url){
      window.open(link, "_blank")
    }
  }

  return (
    <div className='App'>
      <h2>Content Guard</h2>
      <div className='lists'>
        {lists && lists.map((item) => {
          return(
            <button className='button' onClick={() => {openTabs(item.url)}}>Go to X</button>
          )
        })}
      </div>
      
      
    </div>
  )
}

export default App
