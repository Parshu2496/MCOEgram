import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="634795321652-5gnhm916t4vgv0ipv0cs5h5rj6rrnbu4.apps.googleusercontent.com">
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </GoogleOAuthProvider>
)

