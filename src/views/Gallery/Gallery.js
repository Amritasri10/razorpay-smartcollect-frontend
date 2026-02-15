/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import axios from 'axios'
import GalleryModal from './GalleryModal'
import GalleryFilters from './GalleryFilters'

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const [tempFilters, setTempFilters] = useState(filters)
  // ✅ Fetch  with Pagination + Search
  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams({
      search: searchTerm,
      page,
      limit,
      ...filters,
    }).toString()
    getRequest(`gallery?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.gallery || [])
        setTotal(responseData?.totalGallery || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, filters, updateStatus])

  // Apply filters
  const applyFilters = () => {
    // Only include isActive if it's true
    // const newFilters = {};
    // if (tempFilters.isActive) {
    //   newFilters.isActive = true;
    // }
    setFilters(tempFilters)
    setPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {}
    setTempFilters(defaultFilters)
    setFilters(defaultFilters)
    setPage(1)
    setSearchTerm('')
  }

  // ✅ Delete handler
  const confirmDelete = () => {
    deleteRequest(`gallery/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
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
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700"
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gallery</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Gallery</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Property Type.xlsx" sheetName="Property Type" />
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center rounded-md text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Gallery
          </button>
        </div>
      </div>

      {/* Search */}
      <GalleryFilters
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
          // Loader when fetching data
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Gallery...</div>
          </div>
        ) : !data || data.length === 0 ? (
          // Empty state when no data found
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3">Sr. No.</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Active</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(page - 1) * limit + (index + 1)}
                    </td>

                    <td className="px-6 py-4">{item?.title}</td>
                    <td className="px-6 py-4">
                      <img
                        src={item?.url}
                        alt="gallery"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {item?.isActive ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Pagination (only show if there’s data) */}
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
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <GalleryModal
          setUpdateStatus={setUpdateStatus}
          setModalData={setSelectedItem}
          modalData={selectedItem}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default Gallery
