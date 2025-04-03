import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/VerifyEmail";
import Company from "./components/Company";
import RequestReset from "./components/RequestReset";
import Forms from "./components/Forms";
import FormBuilder from "./components/FormBuilder";
import FormStylingPage from "./components/FormStylingPage";
import Profile from "./components/Profile";
import Security from "./components/Security";
import PreviewPage from "./components/PreviewPage";
import FormSubmit from "./components/FormSubmit";
import FormSubmissionSuccess from "./components/FormSubmissionSuccess";
import ProtectedRoute from "./components/ProtectedRoute ";
import ResponsePage from "./components/ResponsePage ";
import Reports from "./components/Reports";
import ReportBuilder from "./components/ReportBuilder";

function App() {
  return (
    <Router>
      {/* Routes Section */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/reset-password-request" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/verify-email" element={<VerifyEmail />} />

        {/* Company Routes */}
        <Route path="/companies/company" element={<Company />} />

        {/* Protected Routes (Only accessible when logged in) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/:userId"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />

        {/* Form Routes */}
        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <Forms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-builder/:formId"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-styling/:formId"
          element={
            <ProtectedRoute>
              <FormStylingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview/:formId"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />

        {/* Responses Routes */}
        <Route path="/responses/public/:formId" element={<FormSubmit />} />
        <Route path="/responses/private/:formId" element={<FormSubmit />} />
        <Route
          path="/responses/submission-success/:responseId"
          element={<FormSubmissionSuccess />}
        />
        <Route
          path="/responses/form/:formId"
          element={
            <ProtectedRoute>
              <ResponsePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-builder/:reportId"
          element={
            <ProtectedRoute>
              <ReportBuilder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
