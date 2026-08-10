import './App.css'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Authentication from './auth/Authentication'
import Authorization from './auth/Authorization'
import { UserRole } from './enums/user.enum'
import getENV from './utils/getENV.ut'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './layout/DashboardLayout'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Orders from "./pages/Orders";
import Shipping from "./pages/Shipping";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import Coupons from "./pages/Coupons";
import Payouts from "./pages/Payouts";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import CMS from "./pages/CMS";
import Admins from "./pages/Admins";
import Settings from "./pages/Settings";
import Brands from './pages/Brands'
import Profile from './pages/Profile'
import VendorDetail from './pages/VendorDetail'
import ProductDetail from './pages/ProductDetail'
import CategoryDetail from './pages/CategoryDetail'
import GiftCards from './pages/GiftCards'
import Tickets from './pages/Tickets'
import Returns from './pages/Returns'
import Reviews from './pages/Reviews'
import Warehouses from './pages/Warehouses'
import Refunds from './pages/Refunds'
import VendorPayouts from './pages/VendorPayouts'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {

    useEffect(() => getENV(), [])

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route element={<Authentication />}>
                    <Route path='/admin/*' element={<Authorization authRole={UserRole.ADMIN} />}>
                        <Route element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path="products" element={<Products />} />
                            <Route path="products/:slug" element={<ProductDetail />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="categories/:id" element={<CategoryDetail />} />
                            <Route path="brands" element={<Brands />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="shipping" element={<Shipping />} />
                            <Route path="returns" element={<Returns />} />
                            <Route path="reviews" element={<Reviews />} />
                            <Route path="vendors" element={<Vendors />} />
                            <Route path="vendors/:id" element={<VendorDetail />} />
                            <Route path="customers" element={<Customers />} />
                            <Route path="coupons" element={<Coupons />} />
                            <Route path="gift-cards" element={<GiftCards />} />
                            <Route path="payouts" element={<Payouts />} />
                            <Route path="tickets" element={<Tickets />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="cms" element={<CMS />} />
                            <Route path="admins" element={<Admins />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="warehouses" element={<Warehouses />} />
                            <Route path="refunds" element={<Refunds />} />
                            <Route path="vendor-payouts" element={<VendorPayouts />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App