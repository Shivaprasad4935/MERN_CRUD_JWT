import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Users from './Users'
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import { AuthProvider } from './AuthProvider'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Users/>}></Route>
        <Route path='/create' element={<CreateUser/>} ></Route>
        <Route path='/update/:id' element={<UpdateUser/>} ></Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
