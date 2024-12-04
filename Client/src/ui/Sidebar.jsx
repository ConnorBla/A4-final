import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <>
    <h4>SIDEBAR</h4>
      <Link to="/Home">Home</Link> <br />
      <Link to="/Cart">Cart</Link> <br />
      <Link to="/Login">Login</Link> <br />
      <Link to="/Logout">Logout</Link> <br />
      <br />
      <br />
      <br />

    </>
  )
}