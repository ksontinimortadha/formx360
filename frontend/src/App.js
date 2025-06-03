import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/auth/VerifyEmail";
import Company from "./components/Company";
import RequestReset from "./components/auth/RequestReset";
import Forms from "./components/forms/Forms";
import FormBuilder from "./components/forms/FormBuilder";
import FormStylingPage from "./components/forms/FormStylingPage";
import Profile from "./components/Profile";
import Security from "./components/Security";
import PreviewPage from "./components/forms/PreviewPage";
import FormSubmit from "./components/forms/FormSubmit";
import FormSubmissionSuccess from "./components/forms/FormSubmissionSuccess";
import ProtectedRoute from "./components/ProtectedRoute ";
import ResponsePage from "./components/responses/ResponsePage ";
import Reports from "./components/reports/Reports";
import ReportBuilder from "./components/reports/ReportBuilder";
import ReportDashboard from "./components/reports/ReportDashboard";
import { useEffect } from "react";
import socket from "./socket";
import ViewResponse from "./components/responses/ViewResponse";
import EditResponse from "./components/responses/EditResponse";
import UserDashboard from "./components/UserDashboard";
import FormBuilderFeatures from "./components/home/FormBuilderFeatures";
import UserResponsePage from "./components/userResponses/UserResponsePage ";
import ShareFormsFeature from "./components/home/ShareFormsFeature";

function App() {
  useEffect(() => {
    socket.connect();

    // Optionally handle errors or logs
    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      {/* Routes Section */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/form-builder-features"
          element={<FormBuilderFeatures />}
        />
        <Route path="/share-forms" element={<ShareFormsFeature />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/reset-password-request" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/verify-email" element={<VerifyEmail />} />
        <Route path="/users/verify" element={<VerifyEmail />} />

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
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-responses/:userId"
          element={
            <ProtectedRoute>
              <UserResponsePage />
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
        <Route
          path="/responses/private/:formId"
          element={
            <ProtectedRoute>
              <FormSubmit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/responses/submission-success/:responseId"
          element={<FormSubmissionSuccess />}
        />
        <Route path="/view-response/:responseId" element={<ViewResponse />} />
        <Route path="/edit-response/:responseId" element={<EditResponse />} />
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
        {
          <Route
            path="/report-dashboard/:formId"
            element={
              <ProtectedRoute>
                <ReportDashboard />
              </ProtectedRoute>
            }
          />
        }
      </Routes>
    </Router>
  );
}

export default App;
