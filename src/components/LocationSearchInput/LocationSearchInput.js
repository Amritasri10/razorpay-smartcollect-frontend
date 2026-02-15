/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import axios from 'axios'

const LocationSearchInput = ({ formData, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState(formData?.address)
  const [places, setPlaces] = useState([])
  const [detailsVisible, setDetailsVisible] = useState(false)

  const apiKey = 'AIzaSyAQqh6qd0umyH9zAmfsfbVHuMvFcN_m3kQ' // Secure this key in production
  const url = 'https://places.googleapis.com/v1/places:searchText'

  const handleSearch = async (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setDetailsVisible(true)

    if (value.trim().length < 3) {
      setPlaces([])
      return
    }

    try {
      const response = await axios.post(
        url,
        { textQuery: value },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'places.displayName,places.formattedAddress,places.priceLevel,places.location',
          },
        },
      )

      if (response.data?.places) {
        setPlaces(response.data.places)
      } else {
        setPlaces([])
      }
    } catch (error) {
      console.error('Error fetching places:', error)
      setPlaces([])
    }
  }

  const handlePlaceSelect = (place) => {
    const location = {
      type: 'Point',
      coordinates: [place.location.longitude, place.location.latitude],
    }

    setFormData({ ...formData, location: location, address: place.formattedAddress })
    setSearchTerm(place.formattedAddress)
    setDetailsVisible(false)
  }
  const handleCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        setPermissionStatus('unsupported')
        return
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      const { latitude, longitude } = position.coords
      console.log('Fetched Location:', latitude, longitude)

      setLocation({ latitude, longitude })
      setPermissionStatus('granted')

      // 🌍 Reverse geocoding with Google API
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
      )

      let currentAddress = `${latitude}, ${longitude}`
      if (res.data?.results?.length > 0) {
        currentAddress = res.data.results[0].formatted_address
      }

      setSearchTerm(currentAddress)

      onSelect({
        address: currentAddress,
        latitude,
        longitude,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      })

      setDetailsVisible(false)
    } catch (error) {
      console.error('Location permission error:', error)
      setPermissionStatus('denied')
    }
  }

  return (
    <div className="location-container position-relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for a location"
        className="form-control"
        required
      />

      {detailsVisible && places.length > 0 && (
        <div className="bg-white border rounded shadow position-absolute w-100 z-10 mt-1 p-2 max-h-60 overflow-auto">
          {places.map((place, idx) => (
            <div
              key={idx}
              onClick={() => handlePlaceSelect(place)}
              className="cursor-pointer py-1 px-2 hover:bg-gray-100 border-bottom text-sm"
            >
              <p className="m-0 p-0">
                <strong>{place.displayName?.text}</strong>
              </p>
              <p className="m-0 p-0">{place.formattedAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationSearchInput
