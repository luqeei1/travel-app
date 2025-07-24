import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPlaces from './components/SearchPlaces';
import DestinationPage from './components/Details'; 
import Map from './components/Map'; 
import WishList from './components/WishList';
import DestinationJournal from './components/DestinationJournal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPlaces />} />
        <Route path="/:id" element={<DestinationPage />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/Plan" element={<WishList />} />
        <Route path="/DestinationJournal/:name" element={<DestinationJournal />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;