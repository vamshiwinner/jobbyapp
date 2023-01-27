import {Switch, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './components/Login'

import Home from './components/Home'
import Jobs from './components/Jobs'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
  </Switch>
)

export default App
