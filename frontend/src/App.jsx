import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AppNavbar from "./components/AppNavbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound.jsx";

// Public
import Home from "./pages/Home";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegisteration";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Vehicles
import VehiclesPage from "./pages/VehiclesPage";
import VehicleDetail from "./pages/VehicleDetail";

// Customer
import CustomerDashboard from "./pages/CustomerDashboard";
import MyBookings from "./pages/MyBookings";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import TrackDelivery from "./pages/TrackDelivery";

// Agency
import AgencyDashboard from "./pages/AgencyDashboard";
import AgencyBookings from "./pages/AgencyBookings";
import AgencyVehicles from "./pages/AgencyVehicles";

// Delivery
import DeliveryDashboard from "./pages/DeliveryDashboard";
import DeliveryActive from "./pages/DeliveryActive";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAgencies from "./pages/AdminAgencies";
import AdminBookings from "./pages/AdminBookings";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuthPage =
    ["/customer/login", "/customer/register", "/forgot-password"].includes(
      location.pathname
    ) || location.pathname.startsWith("/reset-password");

  const showAppNavbar = !isHome && !isAuthPage;

  return (
    <>
      <ScrollToTop />
      {isHome && <Navbar />}
      {showAppNavbar && <AppNavbar />}

      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        {/* ── Vehicles (any logged-in user) ── */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute
              roles={["customer", "agency", "delivery", "admin"]}
            >
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={<ProtectedRoute
            roles={["customer", "agency", "delivery", "admin"]}
          >
            <VehicleDetail />
          </ProtectedRoute>
          }
        />

        {/* ── Customer Routes ── */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute roles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/bookings"
          element={
            <ProtectedRoute roles={["customer"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute
              roles={["customer", "agency", "delivery", "admin"]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute roles={["customer"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute roles={["customer"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirmation/:bookingId"
          element={
            <ProtectedRoute roles={["customer"]}>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track/:bookingId"
          element={
            <ProtectedRoute roles={["customer", "agency", "delivery", "admin"]}>
              <TrackDelivery />
            </ProtectedRoute>
          }
        />

        {/* ── Agency Routes ── */}
        <Route
          path="/agency/dashboard"
          element={
            <ProtectedRoute roles={["agency"]}>
              <AgencyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency/vehicles"
          element={
            <ProtectedRoute roles={["agency"]}>
              <AgencyVehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency/bookings"
          element={
            <ProtectedRoute roles={["agency"]}>
              <AgencyBookings />
            </ProtectedRoute>
          }
        />

        {/* ── Delivery Routes ── */}
        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute roles={["delivery"]}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/active"
          element={
            <ProtectedRoute roles={["delivery"]}>
              <DeliveryActive />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Routes ── */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agencies"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminAgencies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;