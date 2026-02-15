/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'

const CurrentLocationField = ({ formData, setFormData }) => {
  const [search, setSearch] = useState(formData?.propertyLocation || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const dropdownRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  // 🔹 Autocomplete Suggestions
  useEffect(() => {
    if (!isLoaded) return
    if (!search.trim()) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const service = new window.google.maps.places.AutocompleteService()
      service.getPlacePredictions(
        {
          input: search,
          componentRestrictions: { country: 'IN' },
        },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            Array.isArray(predictions)
          ) {
            setSuggestions(predictions)
          } else {
            setSuggestions([])
          }
        },
      )
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [search, isLoaded])

  // 🔹 Click Outside → close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 🔹 Select a place suggestion
  const handleSelect = (prediction) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails(
      { placeId: prediction.place_id, fields: ['formatted_address', 'geometry'] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const address = place.formatted_address
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()

          setFormData({
            ...formData,
            propertyLocation: address,
            location: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          })

          setSearch(address)
          setSuggestions([])
          setShowSuggestions(false)
        }
      },
    )
  }

  // 🔹 Use Current Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported in your browser.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address
            setFormData({
              ...formData,
              propertyLocation: address,
              location: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            })
            setSearch(address)
          }
          setLoading(false)
        })
      },
      () => {
        alert('Unable to get your location.')
        setLoading(false)
      },
    )
  }

  // 🔹 Typing or clearing address
  const handleChange = (e) => {
    const value = e.target.value
    setSearch(value)
    setShowSuggestions(true)

    if (value.trim() === '') {
      // clear coordinates when address deleted
      setFormData({
        ...formData,
        propertyLocation: '',
        location: {
          type: 'Point',
          coordinates: [],
        },
      })
      setSuggestions([])
    }
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* 🔸 Search Box + Current Button */}
      <div className="d-flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Search or use current location"
          onChange={handleChange}
          className="form-control"
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="btn btn-success whitespace-nowrap"
        >
          {loading ? 'Locating...' : 'Current Location'}
        </button>
      </div>

      {/* 🔸 Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="position-absolute bg-white border rounded shadow w-100 mt-1"
          style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}
        >
          {suggestions.map((p) => (
            <div
              key={p.place_id}
              onClick={() => handleSelect(p)}
              className="px-3 py-2 cursor-pointer hover:bg-light"
            >
              {p.description}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrentLocationField
