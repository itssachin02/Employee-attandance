"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ProtectedRoute({ children, userType }) {
  const { currentUser, userType: currentUserType } = useAuth()

  if (!currentUser) {
    return <Navigate to="/auth" />
  }

  if (userType && currentUserType !== userType) {
    // If specific user type is required and doesn't match
    if (userType === "admin") {
      return <Navigate to="/employeehome" />
    } else {
      return <Navigate to="/admindashboard" />
    }
  }

  return children
}

export default ProtectedRoute
