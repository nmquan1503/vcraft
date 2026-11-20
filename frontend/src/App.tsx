import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ApiNotice from './components/ui/ApiNotice';

const CartPage = lazy(() => import('./pages/Shopping/Cart'));
const OrdersPage = lazy(() => import('./pages/Shopping/Orders'));
const OrderDetail = lazy(() => import('./pages/Shopping/OrderDetail'));
const Products = lazy(() => import('./pages/Products/index'));
const ProductDetail = lazy(() => import('./pages/ProductDetail/index'));
const Artisans = lazy(() => import('./pages/Artisans/index'));
const ArtisanDetail = lazy(() => import('./pages/ArtisanDetail/index'));
const Trace = lazy(() => import('./pages/Trace/index'));
const MapPage = lazy(() => import('./pages/Map/index'));
const Login = lazy(() => import('./pages/Auth/Login'));
const RegisterBuyer = lazy(() => import('./pages/Auth/RegisterBuyer'));
const RegisterArtisan = lazy(() => import('./pages/Auth/RegisterArtisan'));
const QuoteList = lazy(() => import('./pages/Quote/index'));
const NewQuote = lazy(() => import('./pages/Quote/New'));
const QuoteDetail = lazy(() => import('./pages/Quote/Detail'));
const ManageBatch = lazy(() => import('./pages/Batches/Manage'));
const Batches = lazy(() => import('./pages/Batches/index'));
const NewsList = lazy(() => import('./pages/News/index'));
const NewsDetail = lazy(() => import('./pages/News/Detail'));
const ArtisanOverview = lazy(() => import('./pages/Dashboard/Artisan/index'));
const ArtisanProfileEdit = lazy(() => import('./pages/Dashboard/Artisan/Profile'));
const NewProduct = lazy(() => import('./pages/Dashboard/Artisan/NewProduct'));
const NewBatch = lazy(() => import('./pages/Dashboard/Artisan/NewBatch'));
const PasswordRecovery = lazy(() => import('./pages/Auth/PasswordRecovery'));
const AdminDashboard = lazy(() => import('./pages/Dashboard/Admin'));

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <ApiNotice />
      <Suspense fallback={<main className="pt-32 px-6">Đang tải trang…</main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute roles={['BUYER']}><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['BUYER', 'ARTISAN']}><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute roles={['BUYER', 'ARTISAN', 'ADMIN']}><OrderDetail /></ProtectedRoute>} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="/trace/:batchId" element={<Trace />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordRecovery reset />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterBuyer />} />
        <Route path="/register/artisan" element={<RegisterArtisan />} />
        <Route path="/quote" element={<QuoteList />} />
        <Route path="/quote/new" element={<ProtectedRoute roles={['BUYER', 'ADMIN']}><NewQuote /></ProtectedRoute>} />
        <Route path="/quote/:id" element={<QuoteDetail />} />
        <Route path="/batches/:id/manage" element={<ProtectedRoute roles={['ARTISAN']}><ManageBatch /></ProtectedRoute>} />
        <Route path="/batches" element={<ProtectedRoute roles={['ARTISAN']}><Batches /></ProtectedRoute>} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        {/* ─── Artisan Dashboard ─── */}
        <Route
          path="/dashboard/artisan"
          element={
            <ProtectedRoute roles={['ARTISAN']}>
              <ArtisanOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/artisan/profile"
          element={
            <ProtectedRoute roles={['ARTISAN']}>
              <ArtisanProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/artisan/products/new"
          element={
            <ProtectedRoute roles={['ARTISAN']}>
              <NewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/artisan/batches/new"
          element={
            <ProtectedRoute roles={['ARTISAN']}>
              <NewBatch />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<main className="min-h-screen p-8 pt-32"><h1 className="text-3xl">Không tìm thấy trang</h1><a href="/" className="underline">Về trang chủ</a></main>}/>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}