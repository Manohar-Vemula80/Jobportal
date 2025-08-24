
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import SignUp from './components/auth/Signup'
import Navbar from './components/shared/Navbar'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './admin/Companies'
import CompanyCreate from './admin/CompanyCreate'
import CompanySetup from './admin/CompanySetup'
// import Jobs from'./admin/AdminJobs'
import AdminJobs from './admin/AdminJobs'
import JobCreate from './admin/PostJob'
import Applicants from './admin/Applicants'
import ProtectedRoute from './admin/ProtectedRoute'



const appRouter= createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path:'/login',
    element: <Login />,
  },
  {
    path:'/signup',
    element: <SignUp />,
  },
  {
    path:'/jobs',
    element:<Jobs/>

  },
  {
    path:'/browse',
    element: <Browse />,
  },
  {
    path:'/profile',
    element: <Profile />,
  },
  {
     path:'/description/:id',
    element: <JobDescription />,
  },
  {
     path:'/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
  },
  {
     path:'/admin/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>,
  },
  {
     path:'/admin/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>,
  }
  ,
  {
     path:'/admin/jobs',
    element:<ProtectedRoute> <AdminJobs /></ProtectedRoute>,
  },
  {
     path:'/admin/job/create',
    element: <ProtectedRoute><JobCreate /></ProtectedRoute>,
  },
  {
     path:'/admin/jobs/:id/applicants',
    element:<ProtectedRoute> <Applicants /></ProtectedRoute>,
  },


]);

function App() {

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
