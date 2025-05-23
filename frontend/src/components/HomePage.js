import { Link } from "react-router-dom"
import { Users, Clock, Shield, CheckCircle } from "lucide-react"

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Employee Management System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Employee Attendance
            <span className="text-indigo-600"> Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your workforce management with our comprehensive attendance tracking system. Monitor employee
            attendance, manage staff, and maintain accurate records effortlessly.
          </p>
          <Link
            to="/auth"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition duration-200 inline-flex items-center"
          >
            Get Started
            <CheckCircle className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Attendance</h3>
            <p className="text-gray-600">
              Track employee attendance in real-time with photo verification and timestamp recording.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Management</h3>
            <p className="text-gray-600">
              Easily add, edit, and manage employee profiles with comprehensive admin controls.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Role-based access control ensures data security with separate admin and employee portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
