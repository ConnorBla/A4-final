import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TopNav({ isLoggedIn, setIsLoggedIn }) {
  const [authButtons, setAuthButtons] = useState(null);

  useEffect(() => {
    const buttons = isLoggedIn ? (
      <Link className="btn border-secondary mx-3" to="/Logout" >Logout</Link>
    ) : (
      <>
        <Link className="btn border-secondary mx-3" to="/Login">Login</Link>
        <Link className="btn border-secondary mx-3" to="/Signup">Signup</Link>
      </>
    );
    setAuthButtons(buttons);
  }, [isLoggedIn, setIsLoggedIn]);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between">
        <Link className="btn border-primary mx-3" to="/">Home</Link>
        <div className="d-flex">
          <Link className="btn border-secondary mx-3" to="/Cart">Cart</Link>
          {authButtons}
        </div>
      </div>
    </div>
  );
}