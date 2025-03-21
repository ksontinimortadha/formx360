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

function App() {
  return (
    <Router>
      {/* Routes Section */}
      <Routes>
        {" "}
        {/* auth Routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/reset-password-request" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/verify-email" element={<VerifyEmail />} />
        {/* Company Routes  */}
        <Route path="/companies/company" element={<Company />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/security/:userId" element={<Security />} />
        {/* Form Routes  */}
        <Route path="/forms" element={<Forms />} />
        <Route path="/form-builder/:formId" element={<FormBuilder />} />
        <Route path="/form-styling/:formId" element={<FormStylingPage />} />
        <Route path="/preview/:formId" element={<PreviewPage />} />
        {/* responses Routes  */}
        <Route path="/responses/:formId" element={<FormSubmit />} />
        <Route
          path="/responses/submission-success/:responseId"
          element={<FormSubmissionSuccess />}
        />
      </Routes>
    </Router>
  );
}

export default App;
