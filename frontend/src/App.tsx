import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPlaces from './components/SearchPlaces';
import DestinationPage from './components/Details'; // Create this file later
import Map from './components/Map'; // Create this file later
import Trip from './components/WIshList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPlaces />} />
        <Route path="/:id" element={<DestinationPage />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/Plan" element={<Trip />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;