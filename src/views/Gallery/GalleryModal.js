/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../Helpers'

const GalleryModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    isActive: true,
  })

  // Prefill data in edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        title: modalData.title || '',
        url: modalData.url || modalData.url || '', // ✅ handle both cases
        isActive: modalData.isActive ?? true,
      })
    } else {
      setFormData({ title: '', url: '', isActive: true })
    }
  }, [modalData])

  // Close modal
  const handleCancel = () => {
    setFormData({ title: '', url: '', isActive: true })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // ✅ Clear error for that field when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  // Upload image and update url
  const handleChangeImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)

    fileUpload({
      url: 'upload/uploadImage',
      cred: { file },
    })
      .then((res) => {
        const uploadedUrl = res.data?.data?.imageUrl
        if (uploadedUrl) {
          setFormData((prev) => ({ ...prev, url: uploadedUrl }))
          toast.success(res.data?.data?.imageUrl || 'Image uploaded successfully')
        } else {
          toast.error(err?.res?.message || 'Image URL not received')
        }
      })
      .catch((error) => {
        console.error('Image upload failed:', error)
        toast.error(err?.res?.message || 'Image upload failed')
      })
      .finally(() => setLoading(false))
  }

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, url: '' }))
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.url) newErrors.url = 'Image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit new gallery
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    postRequest({
      url: 'gallery',
      cred: formData, // ✅ title, url, isActive
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Gallery added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  // Update existing gallery
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    putRequest({
      url: `gallery/${modalData?._id}`,
      cred: formData, // ✅ title, url, isActive
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Gallery updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  return (
    <Modal
      title={modalData ? 'Edit Gallery' : 'Add Gallery'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label fw-bold">Image</label>
          <input
            type="file"
            className={`form-control ${errors.url ? 'is-invalid' : ''}`}
            disabled={loading}
            onChange={handleChangeImage}
          />
          {errors.url && <div className="invalid-feedback">{errors.url}</div>}

          {/* Image Preview */}
          {formData.url && (
            <div className="mt-2" style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={formData.url}
                alt="Preview"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Active Checkbox */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            id="isActive"
          />
          <label className="form-check-label" htmlFor="isActive">
            Active
          </label>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Gallery'
              : loading
                ? 'Uploading...'
                : 'Save Gallery'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default GalleryModal
