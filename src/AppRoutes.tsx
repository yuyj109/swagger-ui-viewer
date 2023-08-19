import { createBrowserRouter } from "react-router-dom";
import App from './App.tsx'

export const router = createBrowserRouter([
  {
    path: "/",
    children: [{ index: true, element: <App /> }],
  },
]);