import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/home'
import CustomerLogin from './pages/CustomerLogin.jsx'
import CustomerRegister from './pages/CustomerRegisteration.jsx'
import CustomerDashboard from './pages/customerDashboard.jsx'
import VehiclesPage from './pages/vehiclesPage.jsx'
import VehicleDetail from './pages/vehicleDetail.jsx'
import BookingPage from './pages/BookingPage.jsx'
import PaymentPage from './pages/paymentPage.jsx'
import BookingConfirmation from './pages/bookingConfirmation.jsx'
import MyBookings from './pages/myBookings.jsx'

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