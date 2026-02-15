/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { CNavGroup, CNavItem } from '@coreui/react'
import { FaRegAddressCard } from 'react-icons/fa'
import { MdOutlineDashboard } from 'react-icons/md'
const useNav = () => {
  const navItems = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <MdOutlineDashboard className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Users',
      to: '/users',
      icon: <MdOutlineDashboard className="me-3" />,
    },
    
    // {
    //   component: CNavItem,
    //   name: 'Gallery',
    //   to: '/gallery',
    //   icon: <MdOutlineDashboard className="me-3" />,
    // },

    {
      component: CNavItem,
      name: 'Payment List',
      to: '/payment-history',
      icon: <MdOutlineDashboard className="me-3" />,
    },
  ]

  return navItems
}

export default useNav
