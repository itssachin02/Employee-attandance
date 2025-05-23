"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ProtectedRoute({ children, userType }) {
  const { currentUser, userType: currentUserType } = useAuth()

  if (!currentUser) {
    return <Navigate to="/auth" />
  }

  if (userType && currentUserType !== userType) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
