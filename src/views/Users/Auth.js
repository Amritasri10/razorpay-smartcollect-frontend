/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import moment from 'moment'
import AuthFilter from './AuthFilter'

const Auth = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expandedAddresses, setExpandedAddresses] = React.useState({})
  const [filters, setFilters] = useState({ accountType: '' })
  const [tempFilters, setTempFilters] = useState(filters)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleAddress = (id) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A'
  }

  // Fetch Users
  useEffect(() => {
    setLoading(true)
       const query = new URLSearchParams({
         search: searchTerm,
         page,
         limit,
         ...filters,
       }).toString()
       getRequest(`auth/getAllusers?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.users || [])
        setTotal(responseData?.totalUsers || 0)
      })
      .catch((error) => {
        console.error('Fetch error:', error)
        toast.error('Failed to fetch users')
      })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, sortBy,filters, updateStatus])

  const applyFilters = () => {
    setFilters(tempFilters)
    setPage(1) // reset page
  }

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      accountType: '',
    }
    setTempFilters(defaultFilters)
    setFilters(defaultFilters)
    setPage(1)
    setSearchTerm('')
  }
  // Delete handler
  const confirmDelete = () => {
    if (!selectedItem?._id) return toast.error('No user selected')

    deleteRequest(`auth/delete/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message || 'User deleted successfully')
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((error) => {
        console.error('Delete error:', error)
        toast.error('Failed to delete user')
      })
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.name || 'this user'}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Users</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Users.xlsx" sheetName="Users" />
        </div>
      </div>

      {/* Search */}
     <AuthFilter
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        page={setPage}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Users...</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3">Sr. No.</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">E-mail</th>
                  <th className="px-6 py-3">Gender</th>
                  <th className="px-6 py-3">Dob</th>
                  <th className="px-6 py-3">Profile</th>
                  <th className="px-6 py-3">Account Type</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-6 py-4">{item?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{item?.phone || 'N/A'}</td>
                    <td className="px-6 py-4">{item?.email || 'N/A'}</td>
                    <td className="px-6 py-4">{item?.gender || 'N/A'}</td>
                    <td className="px-6 py-4">{formatDate(item?.dob)}</td>
                    <td className="px-6 py-4">
                      {item?.profilepic ? (
                        <img
                          src={item?.profilepic}
                          alt="profilepic"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">{item?.accountType || 'N/A'}</td>

                    <td className="px-6 py-4 ">
                      <Tooltip title={item?.address} placement="topLeft">
                        <span
                          style={{
                            display: 'inline-block',
                            width: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                          }}
                        >
                          {item?.address?.split(' ')?.slice(0, 2)?.join(' ') || '-'}
                          {item?.address?.split(' ')?.length > 2 ? '…' : ''}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Pagination */}
      {!loading && data?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              pageSizeOptions={['5', '10', '20', '50', '100', '200', '500', '1000']}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Auth
