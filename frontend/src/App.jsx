import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home'
import CustomerLogin from './pages/CustomerLogin'
import CustomerRegister from './pages/CustomerRegisteration'
import CustomerDashboard from './pages/CustomerDashboard'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetail from './pages/VehicleDetail'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import BookingConfirmation from './pages/BookingConfirmation'
import MyBookings from './pages/MyBookings'

function App() {
  const isHome = useLocation().pathname === '/'
  return (
    <>
      {isHome && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path='/' element={<Home />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />

        {/* Customer (protected by page-level redirect) */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/bookings" element={<MyBookings />} />

        {/* Vehicles */}
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />

        {/* Booking Flow */}
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
      </Routes>
    </>
  )
}

export default App