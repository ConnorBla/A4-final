import { Outlet } from 'react-router-dom';
import TopNav from './ui/TopNav.jsx';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div className="container-fluid w-100">
        <div className='row sticky-top'>
          <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
        <div className='row w-100'>
          <div className=''>
            <Outlet context={{ setIsLoggedIn }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;