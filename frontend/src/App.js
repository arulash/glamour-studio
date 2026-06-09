import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";

import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import BookingPage from "@/pages/BookingPage";
import AdminPage from "@/pages/AdminPage";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const PageWrap = ({ children }) => {
  const { pathname } = useLocation();
  return <div key={pathname} className="page-enter">{children}</div>;
};

const SiteChrome = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <LoadingScreen />
        <ScrollTop />
        <SiteChrome>
          <PageWrap>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </PageWrap>
        </SiteChrome>
        <Toaster theme="dark" position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
