import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

// Pages
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CropAdvisory from './pages/CropAdvisory';
import MarketPrices from './pages/MarketPrices';
import SchemesDirectory from './pages/SchemesDirectory';
import DiseaseCheck from './pages/DiseaseCheck';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 selection:bg-emerald-200">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Layout>
              <Onboarding />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/advisory"
          element={
            <Layout>
              <CropAdvisory />
            </Layout>
          }
        />
        <Route
          path="/market"
          element={
            <Layout>
              <MarketPrices />
            </Layout>
          }
        />
        <Route
          path="/schemes"
          element={
            <Layout>
              <SchemesDirectory />
            </Layout>
          }
        />
        <Route
          path="/disease-check"
          element={
            <Layout>
              <DiseaseCheck />
            </Layout>
          }
        />
        <Route
          path="/contacts"
          element={
            <Layout>
              <Contacts />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
