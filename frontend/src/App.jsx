import { useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Education from './components/Education/Education';
import Work from './components/Work/Work';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { portfolioAPI } from './utils/api';
import { useFetch } from './utils/hooks';
import './App.css';

const defaultPortfolioUsername =
  import.meta.env.VITE_PORTFOLIO_USERNAME || 'kartik';

function PortfolioNotice({ title, message }) {
  return (
    <div className="App min-h-screen bg-[#050414] text-white">
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {message && <p className="mt-4 text-gray-400">{message}</p>}
        </div>
      </main>
    </div>
  );
}

function PortfolioPage() {
  const { username } = useParams();
  const portfolioUsername = username || defaultPortfolioUsername;
  const fetchPortfolio = useCallback(
    () =>
      portfolioUsername
        ? portfolioAPI.get(portfolioUsername)
        : Promise.resolve(null),
    [portfolioUsername]
  );
  const { data: portfolio, loading, error } = useFetch(fetchPortfolio);
  const hasPublishedContent = Boolean(
    portfolio?.about ||
      portfolio?.skills?.length ||
      portfolio?.experience?.length ||
      portfolio?.education?.length ||
      portfolio?.projects?.length
  );

  if (loading) {
    return <PortfolioNotice title="Loading portfolio..." />;
  }

  if (error) {
    return (
      <PortfolioNotice
        title="Portfolio not found"
        message="No public portfolio exists for this username."
      />
    );
  }

  if (!hasPublishedContent) {
    return (
      <PortfolioNotice
        title="Portfolio not published yet"
        message="This page will appear after portfolio details are added."
      />
    );
  }

  return (
    <div className="App min-h-screen bg-[#050414]">
      <Navbar username={portfolioUsername} />
      <About username={portfolioUsername} />
      <Skills username={portfolioUsername} />
      <Experience username={portfolioUsername} />
      <Education username={portfolioUsername} />
      <Work username={portfolioUsername} />
      <Contact username={portfolioUsername} />
      <Footer username={portfolioUsername} />
    </div>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/:username" element={<PortfolioPage />} />
        <Route path="/" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}
