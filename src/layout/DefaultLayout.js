import React, { useEffect, useState,useContext } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { getRequest } from '../Helpers'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../Hooks/cookie'
import {AppContext} from '../Context/AppContext'


const DefaultLayout = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
     const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    const savedUser = localStorage.getItem('razorPayToken')

    // if (!savedUser) return

    const parsedUser = JSON.parse(savedUser)

    setUserData(parsedUser)

    getRequest(`auth/profile`)
      .then((res) => {
        console.log('res data', res?.data?.data)
        setUser(res?.data?.data)
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          deleteCookie('razorPayToken')
          deleteCookie('UserId')
          navigate('/login')
          console.error('Unauthorized: Redirecting to login page')
        } else {
          console.log('error', error)
        }
      })
  }, [navigate])

  return (
    <div>
      <AppSidebar userData={userData} />
      <div
        style={{ zIndex: 1, position: 'relative' }}
        className="wrapper d-flex flex-column min-vh-100"
      >
        <AppHeader userData={userData} />
        <div className=" flex-grow-1">
          <AppContent userData={userData} />
        </div>
        <AppFooter userData={userData} />
      </div>
    </div>
  )
}

export default DefaultLayout
