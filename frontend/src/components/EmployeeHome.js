"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { doc, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { Camera, Calendar, CheckCircle, Clock, LogOut, User, Lock } from "lucide-react"

function EmployeeHome() {
  const [employeeName, setEmployeeName] = useState("")
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [password, setPassword] = useState("")
  const [capturedImage, setCapturedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const { currentUser, logout } = useAuth()

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "month",
    day: "numeric",
  })

  const todayDate = new Date().toISOString().split("T")[0]

  useEffect(() => {
    fetchEmployeeData()
    checkTodayAttendance()
  }, [currentUser])

  const fetchEmployeeData = async () => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (userDoc.exists()) {
        setEmployeeName(userDoc.data().name)
      }
    }
  }

  const checkTodayAttendance = async () => {
    if (currentUser) {
      try {
        const attendanceQuery = query(
          collection(db, "attendance"),
          where("employeeId", "==", currentUser.uid),
          where("date", "==", todayDate),
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)
        setAttendanceMarked(!attendanceSnapshot.empty)
      } catch (error) {
        console.error("Error checking attendance:", error)
      }
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
    } catch (error) {
      setMessage("Error accessing camera: " + error.message)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      const imageData = canvas.toDataURL("image/jpeg", 0.8)
      setCapturedImage(imageData)

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      setShowCamera(false)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const submitAttendance = async () => {
    if (!capturedImage || !password) {
      setMessage("Please capture a photo and enter your password.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      // Verify password by attempting to sign in
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const { auth } = await import("../firebase")

      await signInWithEmailAndPassword(auth, currentUser.email, password)

      // Save attendance record
      const now = new Date()
      await addDoc(collection(db, "attendance"), {
        employeeId: currentUser.uid,
        employeeName: employeeName,
        date: todayDate,
        time: now.toLocaleTimeString(),
        timestamp: now.toISOString(),
        photo: capturedImage,
      })

      setAttendanceMarked(true)
      setCapturedImage(null)
      setPassword("")
      setMessage("Attendance marked successfully!")
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        setMessage("Invalid password. Please try again.")
      } else {
        setMessage("Error marking attendance: " + error.message)
      }
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Employee Portal</span>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 flex items-center">
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello, {employeeName}!</h1>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{today}</span>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Attendance</h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("Error") || message.includes("Invalid")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {attendanceMarked ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Marked!</h3>
              <p className="text-gray-600">Your attendance for today has been successfully recorded.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!showCamera && !capturedImage && (
                <div className="text-center">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mark Your Attendance</h3>
                  <p className="text-gray-600 mb-6">
                    Click the button below to capture your photo and mark attendance.
                  </p>
                  <button
                    onClick={startCamera}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Mark Attendance
                  </button>
                </div>
              )}

              {/* Camera View */}
              {showCamera && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-80 h-60 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="mt-4 space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={() => {
                        if (streamRef.current) {
                          streamRef.current.getTracks().forEach((track) => track.stop())
                        }
                        setShowCamera(false)
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Photo and Password */}
              {capturedImage && (
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured"
                      className="w-80 h-60 object-cover rounded-lg border-2 border-gray-300 mx-auto"
                    />
                    <button onClick={retakePhoto} className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm">
                      Retake Photo
                    </button>
                  </div>

                  <div className="max-w-md mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Your Password to Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={submitAttendance}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Attendance"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeHome
