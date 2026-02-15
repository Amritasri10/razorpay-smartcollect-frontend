/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import {
  Users,
  Home,
  MessageSquare,
  Mail,
  FolderOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Package,
} from 'lucide-react'
import { message } from 'antd'
import { getRequest } from '../../Helpers'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequest('dashboard')
      .then((res) => {
        setData(res?.data?.data || {})
      })
      .catch((err) => {
        console.error('Dashboard API error:', err)
        message.error('Failed to fetch dashboard data')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">No data available</div>
  }

  const { users, properties, testimonials, enquiries, categories } = data

  const StatCard = ({ title, value, icon: Icon, color, bgColor, subStats }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-gray-600 font-semibold mb-3">{title}</h3>

      {subStats && (
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
          {subStats.map((stat, idx) => (
            <div key={idx} className="text-sm">
              <p className="text-gray-500">{stat.label}</p>
              <p className="font-semibold text-gray-700">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const PropertyStatusCard = ({ status, count, icon: Icon, color }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm text-gray-700">{status}</span>
      </div>
      <span className="font-semibold text-gray-800">{count}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={users.totalUsers}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
            subStats={[
              { label: 'Buyers', value: users.totalBuyers },
              { label: 'Sellers', value: users.totalSellers },
              { label: 'Admins', value: users.totalAdmins },
            ]}
          />

          <StatCard
            title="Total Properties"
            value={properties.totalProperties}
            icon={Home}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            subStats={[
              { label: 'Available', value: properties.availableProperties },
              { label: 'Sold', value: properties.soldProperties },
            ]}
          />

          <StatCard
            title="Enquiries"
            value={enquiries.totalEnquiries}
            icon={Mail}
            color="text-purple-600"
            bgColor="bg-purple-100"
            subStats={[
              { label: 'New', value: enquiries.newEnquiries },
              { label: 'Contacted', value: enquiries.contactedEnquiries },
            ]}
          />

          <StatCard
            title="Categories"
            value={categories.totalCategories}
            icon={FolderOpen}
            color="text-orange-600"
            bgColor="bg-orange-100"
            subStats={[
              { label: 'Active', value: categories.activeCategories },
              { label: 'Total', value: categories.totalCategories },
            ]}
          />
        </div>

        {/* Property Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Property Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Home className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Property Status</h2>
            </div>
            <div className="space-y-3">
              <PropertyStatusCard
                status="Verified"
                count={properties.verifiedProperties}
                icon={CheckCircle}
                color="text-green-600"
              />
              <PropertyStatusCard
                status="Pending"
                count={properties.pendingProperties}
                icon={Clock}
                color="text-yellow-600"
              />
              <PropertyStatusCard
                status="Booked"
                count={properties.bookedProperties}
                icon={Package}
                color="text-blue-600"
              />
              <PropertyStatusCard
                status="Published"
                count={properties.publishedProperties}
                icon={TrendingUp}
                color="text-indigo-600"
              />
              <PropertyStatusCard
                status="Rejected"
                count={properties.rejectedProperties}
                icon={XCircle}
                color="text-red-600"
              />
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Testimonials & Insights</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Total Testimonials</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {testimonials.totalTestimonials}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Active Testimonials</span>
                  <span className="text-lg font-semibold text-purple-600">
                    {testimonials.activeTestimonials}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Registered</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {properties.registeredProperties}
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Adopted</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {properties.isAdoptedProperties}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
