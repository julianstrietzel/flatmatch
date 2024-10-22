import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ConfirmEmail from "./components/ConfirmEmail.tsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.tsx";
import SwipingLandingPage from "./pages/SwipingLandingPage.tsx";
import SwipingPage from "./pages/SwipingPage.tsx";
import PremiumFeaturesPage from "./pages/PremiumFeaturesPage.tsx";
import PaymentResultPage from "./pages/PaymentResultPage.tsx";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";
import SelectionPage from "./pages/SelectionPage.tsx";
import ListPropertyForm from "./pages/ListPropertyForm.tsx";
import SearchProfilePage from "./pages/SearchProfilePage.tsx";
import HelpPage from "./pages/HelpPage.tsx";
import EditFlatProfilePage from "./pages/EditFlatProfilePage.tsx";
import EditSearchProfilePage from "./pages/EditSearchProfilePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/account" element={<AccountSettingsPage />} />
            <Route
              path="/tenantLanding"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <SwipingLandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flat-profiles"
              element={
                <ProtectedRoute allowedRoles={["landlord"]}>
                  <ListPropertyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-flat-profiles"
              element={
                <ProtectedRoute allowedRoles={["landlord"]}>
                  <EditFlatProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/swiping"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <SwipingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/premium" element={<PremiumFeaturesPage />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
            <Route
              path="/selection"
              element={
                <ProtectedRoute allowedRoles={["landlord"]}>
                  <SelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-profiles"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <SearchProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-search-profiles"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <EditSearchProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
