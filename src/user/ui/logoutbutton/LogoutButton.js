import React from 'react'

const LogoutButton = ({ onLogoutUserClick }) => {
  return(
    <li className="pure-menu-item" style={{position: 'absolute', right: 0, top: '0px', }}>
      <a href="#" className="pure-menu-link" onClick={(event) => onLogoutUserClick(event)}>Logout</a>
    </li>
  )
}

export default LogoutButton
