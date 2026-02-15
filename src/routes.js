import React from 'react'
import Gallery from './views/Gallery/Gallery'
import Auth from './views/Users/Auth'
import PaymentHistory from './views/PaymentHistory/PaymentHistory'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/Dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/gallery', name: 'Gallery', element: Gallery },
  { path: '/users', name: 'Users', element: Auth },
  { path: '/payment-history', name: 'PaymentHistory', element: PaymentHistory },
]

export default routes
