import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './AppRoutes';
import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
