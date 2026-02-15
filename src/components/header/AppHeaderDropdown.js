import React from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilBell, cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'


import { deleteCookie } from '../../Hooks/cookie'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const logOut = (e) => {
    e.preventDefault()
    console.log('log out')
    deleteCookie('razorPayToken')
    localStorage.removeItem('razorPayUser')
    navigate('/login')
    window.location.reload()
  }

  return (
    <CDropdown
      style={{ width: '50px', height: '50px', borderRadius: '100%' }}
      className="bg-white"
      variant="nav-item"
    >
      <CDropdownToggle placement="bottom-end" className=" py-0 pe-0 p-0 m-0" caret={false}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
          alt="Profile"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />

        {/* <CAvatar src={avatar8} size="md" /> */}
      </CDropdownToggle>
      <CDropdownMenu
        style={{ overflow: 'hidden', cursor: 'pointer' }}
        className="pt-0 p-0 m-0 "
        placement="bottom-end"
      >
        <CDropdownItem className="p-2" onClick={logOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
