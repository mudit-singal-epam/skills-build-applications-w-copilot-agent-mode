import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import octofitLogo from './assets/octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const Home = () => (
  <section className="row g-4">
    <div className="col-12">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="display-6 mb-2">Octofit Tracker</h1>
          <p className="text-muted mb-4">
            Track activities, manage teams, and see the latest leaderboard stats.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <NavLink className="btn btn-primary" to="/activities">
              Explore activities
            </NavLink>
            <NavLink className="btn btn-outline-primary" to="/leaderboard">
              View leaderboard
            </NavLink>
            <NavLink className="btn btn-outline-secondary" to="/teams">
              Manage teams
            </NavLink>
          </div>
        </div>
      </div>
    </div>
    <div className="col-12 col-lg-6">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-2">Quick insights</h2>
          <p className="text-muted mb-0">
            Review activity trends, celebrate top performers, and keep everyone aligned with the
            latest workout plans.
          </p>
        </div>
      </div>
    </div>
    <div className="col-12 col-lg-6">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-2">Stay consistent</h2>
          <p className="text-muted mb-0">
            Use the data tables to drill into details, filter results, and keep your training
            decisions evidence based.
          </p>
        </div>
      </div>
    </div>
  </section>
);

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg octo-navbar">
          <div className="container">
            <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
              <img className="app-logo" src={octofitLogo} alt="Octofit app logo" />
              <span>Octofit Tracker</span>
            </NavLink>
            <div className="navbar-nav">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" to="/activities">
                Activities
              </NavLink>
              <NavLink className="nav-link" to="/leaderboard">
                Leaderboard
              </NavLink>
              <NavLink className="nav-link" to="/teams">
                Teams
              </NavLink>
              <NavLink className="nav-link" to="/users">
                Users
              </NavLink>
              <NavLink className="nav-link" to="/workouts">
                Workouts
              </NavLink>
            </div>
          </div>
        </nav>
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
