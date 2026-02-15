// components/Breadcrumb.js
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = () => {
  const location = useLocation()

  // Split the pathname and filter empty strings
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav aria-label="breadcrumb" className="my-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = '/' + pathnames.slice(0, index + 1).join('/')
          const isLast = index === pathnames.length - 1

          return isLast ? (
            <li className="breadcrumb-item active" aria-current="page" key={index}>
              {decodeURIComponent(name)}
            </li>
          ) : (
            <li className="breadcrumb-item" key={index}>
              <Link to={routeTo}>{decodeURIComponent(name)}</Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
