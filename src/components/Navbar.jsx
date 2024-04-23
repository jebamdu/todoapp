import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({createProject}) => {
   const [isDropdownOpen, setisDropdownOpen] = useState(false);
   const navigate = useNavigate()
   function logout(){
    localStorage.removeItem('jwdAuth')
    navigate('/')
    
   }
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      
        <a className="navbar-brand pe-auto" >Home</a>
        <a className='ml-3 navbar-brand pe-auto' onClick={()=>{createProject()}}>Create project</a>
      
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" onClick={()=>{setisDropdownOpen((data)=>(!data))}} aria-haspopup="true" aria-expanded="false">
                Profile
              </a>
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
              <a className="dropdown-item" onClick={()=>{setisDropdownOpen(false);logout()}} >Logout</a>
            </div>
            </li>
          </ul>
        </div>
      </nav>
     );
}
 
export default Navbar;