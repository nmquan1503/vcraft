import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Products from './pages/Products/index';
import ProductDetail from './pages/ProductDetail/index';  // ← thêm
import Header from '@/components/layout/Header';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />  {/* ← thêm */}
      </Routes>
    </BrowserRouter>
  );
}