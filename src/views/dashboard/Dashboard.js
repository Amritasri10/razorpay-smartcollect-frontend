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
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react'
import { Empty, message, Spin } from 'antd'
import { getRequest } from '../../Helpers'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ Fetch dashboard data from API
  // useEffect(() => {
  //   getRequest('dashboard')
  //     .then((res) => {
  //       setData(res?.data?.data || {})
  //     })
  //     .catch((error) => {
  //       console.error('Dashboard fetch error:', error)
  //       message.error('Failed to fetch dashboard data')
  //     })
  //     .finally(() => setLoading(false))
  // }, [])

  // ✅ Show loader while data is loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Spin size="large" />
        <div className="mt-4 text-blue-500 font-medium text-center">Loading Dashboard...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-20">
        <Empty description="No records found" />
      </div>
    )
  }

  // ✅ Extract the objects from the API response
  const { users, properties, testimonials, enquiries, categories } = data

  const StatCard = ({ title, value, icon: Icon, color, bgColor, subStats }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        </div>
        <span className="text-l sm:text-xl md:text-2xl font-medium text-gray-800">{value}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base md:text-lg text-gray-600 font-semibold mb-2 sm:mb-3">
        {title}
      </h3>

      {/* Sub Stats */}
      {/* {subStats && (
        <div className="grid grid-cols-2 gap-2 pt-2 sm:pt-3 border-t border-gray-100">
          {subStats.map((stat, idx) => (
            <div key={idx} className="text-xs sm:text-sm md:text-base">
              <p className="text-gray-500">{stat.label}</p>
              <p className="font-semibold text-gray-700">{stat.value}</p>
            </div>
          ))}
        </div>
      )} */}

      {subStats && (
        <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
          {subStats.map((stat, idx) => (
            <div key={idx} className="flex justify-between text-sm sm:text-base text-gray-700">
              <span className="text-gray-500">{stat.label}</span>
              <span className="font-semibold">{stat.value}</span>
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
    <div className="bg-white">
      <div className="px-4 sm:px-6 py-6 border-b border-gray-200">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h2>
        </div>

        {/* MAIN STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* PROPERTY STATUS & TESTIMONIALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* PROPERTY STATUS */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Home className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Property Status</h2>
            </div>

            <div className="space-y-3">
              <PropertyStatusCard
                status="Verified"
                count={properties?.verifiedProperties}
                icon={CheckCircle}
                color="text-green-600"
              />
              <PropertyStatusCard
                status="Pending"
                count={properties?.pendingProperties}
                icon={Clock}
                color="text-yellow-600"
              />
              <PropertyStatusCard
                status="Booked"
                count={properties?.bookedProperties}
                icon={Package}
                color="text-blue-600"
              />
              <PropertyStatusCard
                status="Registered"
                count={properties?.registeredProperties}
                icon={CheckCircle2}
                color="text-green-600"
              />
              <PropertyStatusCard
                status="Adopted"
                count={properties?.isAdoptedProperties}
                icon={HeartHandshake}
                color="text-pink-600"
              />
              <PropertyStatusCard
                status="Published"
                count={properties?.publishedProperties}
                icon={TrendingUp}
                color="text-indigo-600"
              />
              <PropertyStatusCard
                status="Rejected"
                count={properties?.isAdoptedProperties}
                icon={XCircle}
                color="text-red-600"
              />
            </div>
          </div>

          {/* TESTIMONIALS & INSIGHTS */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Testimonials & Insights
              </h2>
            </div>

            <div className="space-y-2">
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm sm:text-base font-semibold text-gray-600">
                    Total Testimonials
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-pink-600">
                    {testimonials?.totalTestimonials}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Active Testimonials</span>
                  <span className="text-base sm:text-lg font-semibold text-purple-600">
                    {testimonials?.activeTestimonials}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
