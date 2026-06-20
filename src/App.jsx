import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import "nprogress/nprogress.css";
import LoadingBar from "./components/NProgress/LoadingBar";
import ProductPage from "./pages/ProductPages/ProductPage";
import LaptopPage from "./pages/LaptopPages/LaptopPage";
import ComponentPage from "./pages/ComponentPages/ComponentPage";
import ProductMenu from "./pages/ProductMenu";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <LoadingBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/page/:id" element={<ProductPage />} />
        <Route path="/menu/:id" element={<ProductMenu />} />
        <Route path="/laptop/:id" element={<LaptopPage />} />
        <Route path="/component/:id" element={<ComponentPage />} />

        {/* <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
