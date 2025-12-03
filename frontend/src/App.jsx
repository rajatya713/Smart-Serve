
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/home.jsx'
import CustomerLogin from './pages/CustomerLogin.jsx'
import CustomerRegister from './pages/CustomerRegisteration.jsx'

function App() {
  const isHome = useLocation().pathname === '/'
  return (
    <>
      {isHome && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />

      </Routes>
    </>
  )
}

export default App