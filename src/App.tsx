import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Products from './pages/Products/index';
import ProductDetail from './pages/ProductDetail/index';
import Artisans from './pages/Artisans/index';
import ArtisanDetail from './pages/ArtisanDetail/index';
import Trace from './pages/Trace/index';
import MapPage from './pages/Map/index';
import Header from '@/components/layout/Header';
import Login from './pages/Auth/Login';
import RegisterBuyer from './pages/Auth/RegisterBuyer';
import RegisterArtisan from './pages/Auth/RegisterArtisan';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="/trace/:batchId" element={<Trace />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterBuyer />} />
        <Route path="/register/artisan" element={<RegisterArtisan />} />
      </Routes>
    </BrowserRouter>
  );
}