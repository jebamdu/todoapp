import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  function logout() {
    localStorage.removeItem('jwdAuth')
    console.log('log');
    window.location.href = '/'
    return navigate('/')

  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 d-flex justify-content-between">
      <Link to="/" className="navbar-brand pe-auto" >Home</Link>
      <Link className="btn btn-secondary" onClick={() => { logout() }} >Logout</Link>
    </nav>
  );
}

export default Navbar;