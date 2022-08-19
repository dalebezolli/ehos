import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContentViewerProvider from './context/ContentViewerContext';
import PageLayout from './routes/PageLayout';

import Home from './routes/Home';
import NoRoute from './routes/NoRoute';
import Search from './routes/Search';
import Login from './routes/Login';
import TagEditor from './routes/TagEditor';

import UserProvider, { AuthRoute } from './context/UserContext';
import TrackPopup from './components/TrackPopup';

function App() {
  return(
      <ContentViewerProvider>
        <BrowserRouter>
          <UserProvider>
            <TrackPopup>
              <Routes>

                <Route path='/' element={ <PageLayout /> }>
                  <Route path='/' element={ <Home /> } />
                  <Route path='login' element={ <Login /> } />
                  <Route path='search/:searchQuery' element={ <Search /> } />
                  <Route path='tageditor' element={ <AuthRoute><TagEditor /></AuthRoute> } />
                  <Route path='*' element={ <NoRoute /> } />
                </Route>

              </Routes>
            </TrackPopup>
          </UserProvider>
        </BrowserRouter>
      </ContentViewerProvider>
  );
}

export default App;