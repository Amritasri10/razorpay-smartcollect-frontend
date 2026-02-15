import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useCookie from '../../../Hooks/cookie'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import logo from '../../../assets/bridge-house-logo.png'
import { validateMobile } from '../../../Utils'
import { postRequest } from '../../../Helpers'
import { IoMdArrowRoundBack } from 'react-icons/io'
const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCookie } = useCookie()
  const [loaginWithPassword, setLoginWithPassword] = useState(false)

  const [isOtp, setiSOtp] = useState(false)

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    phone: '1111111111',
    password: 'Admin@1234',
  })

  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)

  console.log('canResend', canResend)

  const [otp, setOtp] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'phone') {
      setFormData((prev) => ({
        ...prev,
        [name]: validateMobile(value),
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}auth/loginWithPassword`, formData)
      .then((res) => {
        console.log('res==========', res?.data)

        setCookie('razorPayToken', res?.data?.data?.authToken, 30)
        toast.success(res?.data?.message)
        navigate('/')
        window.location.reload()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Login failed')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let timer
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [timeLeft])

  const sendOtp = (e) => {
    e.preventDefault()
    setLoading(true)

    postRequest({
      url: 'auth/registerOrLogin',
      cred: {
        phone: formData?.phone,
      },
    })
      .then((res) => {
        console.log('res', res?.data)
        setLoading(false)
        toast.success(res?.data?.message)
        setiSOtp(true)
        setTimeLeft(60)
        setCanResend(false)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(error?.response?.data?.message)
        console.log('error', error)
      })
  }
  const handleResend = (e) => {
    e.preventDefault()
    setLoading(true)

    postRequest({
      url: 'auth/resendOtp',
      cred: {
        phone: formData?.phone,
      },
    })
      .then((res) => {
        console.log('res', res?.data)
        setLoading(false)
        toast.success(res?.data?.message)
        setiSOtp(true)
        setTimeLeft(60)
        setCanResend(false)
      })
      .catch((error) => {
        setLoading(false)
        toast.error(error?.response?.data?.message)
        console.log('error', error)
      })
  }
  const verifyOtp = (e) => {
    e.preventDefault()
    setLoading(true)

    postRequest({
      url: 'auth/verifyOtp',
      cred: {
        phone: formData?.phone,
        otp: otp,
      },
    })
      .then((res) => {
        console.log('res', res?.data)
        setLoading(false)
        toast.success(res?.data?.message)

        setCookie('razorPayToken', res?.data?.data?.authToken, 30)
        navigate('/')
        window.location.reload()
      })
      .catch((error) => {
        setLoading(false)
        toast.error(error?.response?.data?.message)
        console.log('error', error)
      })
  }

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card p-4 bg-white shadow">
              <div className="card-body text-center">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: '100px', marginBottom: '10px', margin: 'auto' }}
                />
                <h3 className="mb-4  text-black">Login</h3>

                {!loaginWithPassword ? (
                  <>
                    {isOtp ? (
                      <form>
                        <div>
                          <div class="input-block text-start mb-1">
                            <label class="col-form-label text-black">OTP</label>
                            <input
                              type="number"
                              className="form-control bg-white text-black"
                              placeholder="otp"
                              name="otp"
                              value={otp}
                              onChange={(e) => {
                                setOtp(e.target.value)
                              }}
                              required
                            />
                          </div>

                          <div className=" text-start my-2">
                            {canResend ? (
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={handleResend}
                              >
                                Resend OTP
                              </button>
                            ) : (
                              <span className="text-muted">Resend OTP in {timeLeft}s</span>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="btn w-100 text-white"
                            style={{
                              background: 'linear-gradient(to right, #9F8054, #9F8054)',
                            }}
                            onClick={verifyOtp}
                            disabled={loading}
                          >
                            {loading ? 'Loading...' : 'Verify Otp'}
                          </button>
                          <div className="d-flex justify-content-start ">
                            {' '}
                            <span
                              className="d-flex align-items-center gap-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setiSOtp(false)
                              }}
                            >
                              <IoMdArrowRoundBack />
                              <span>back</span>
                            </span>{' '}
                          </div>
                        </div>
                      </form>
                    ) : (
                      <form>
                        <div>
                          <div class="input-block text-start mb-4">
                            <label class="col-form-label text-black">Phone Number</label>
                            <input
                              type="number"
                              className="form-control bg-white text-black"
                              placeholder="phone"
                              name="phone"
                              value={formData?.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn w-100 text-white"
                            style={{
                              background: 'linear-gradient(to right, #9F8054, #9F8054)',
                            }}
                            onClick={sendOtp}
                            disabled={loading}
                          >
                            {loading ? 'Loading...' : 'Send Otp'}
                          </button>
                          <div className="d-flex justify-content-end ">
                            {' '}
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setLoginWithPassword(true)
                              }}
                            >
                              Login With Password
                            </span>{' '}
                          </div>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div class="input-block text-start mb-4">
                      <label class="col-form-label text-black">Phone Number</label>
                      <input
                        type="number"
                        className="form-control bg-white text-black"
                        placeholder="phone"
                        name="phone"
                        value={formData?.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div class="input-block mb-4">
                      <div class="row align-items-center">
                        <div class="col text-start">
                          <label class="col-form-label text-black">Password</label>
                        </div>
                        {/* <div class="col-auto ">
                          <a class=" text-black" href="#">
                            Forgot password?
                          </a>
                        </div> */}
                      </div>
                      <div class="position-relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control bg-white text-black"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '15px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                          }}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="text-black fs-5" />
                          ) : (
                            <FaEye className="text-black fs-5" />
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn w-100 text-white"
                      style={{
                        background: 'linear-gradient(to right, #9F8054, #9F8054)',
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Login'}
                    </button>

                    <div className="d-flex justify-content-end ">
                      {' '}
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setLoginWithPassword(false)
                        }}
                      >
                        Login With Otp
                      </span>{' '}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
