import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Components/Home';
import Register from './Components/Register';
import PocketBaseProvider from './Components/PocketBaseProvider';
import { PrivateRoute } from './Components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute element={<Home />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }
]);

function App() {
  return (
    <div className='bg-zinc-50 h-max min-h-screen w-full'>
    <PocketBaseProvider>
      <RouterProvider router={router} />
    </PocketBaseProvider>
    </div>
  );
}

export default App;
