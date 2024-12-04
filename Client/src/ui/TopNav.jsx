import { Link } from 'react-router-dom';

export default function TopNav() {
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between">
        <Link className="btn border-primary mx-3" to="/Home">Home</Link>
        <div className="d-flex">
          <Link className="btn border-secondary mx-3" to="/Cart">Cart</Link>
          <Link className="btn border-secondary mx-3" to="/Login">Login</Link>
          <Link className="btn border-secondary mx-3" to="/Logout">Logout</Link>
          <Link className="btn border-secondary mx-3" to="/Signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}