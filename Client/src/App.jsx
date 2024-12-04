import { Outlet } from 'react-router-dom'
import TopNav from './ui/TopNav.jsx'
import Sidebar from './ui/Sidebar.jsx'

function App() {
  return (
    <>
      <div className="container-fluid w-100">
        <div className='row sticky-top'>
          <TopNav />
        </div>
        <div className='row w-100'>
          <div className=''>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
