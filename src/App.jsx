import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContentViewerProvider from './context/ContentViewerContext';
import PageLayout from './routes/PageLayout';

import Home from './routes/Home';
import MusicList from './components/MusicList';
import NoRoute from './routes/NoRoute';
import Login from './routes/Login';
import AuthProvider, { AuthRoute } from './context/AuthContext';

function App() {
  return(
      <ContentViewerProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>

              <Route path='/' element={ <PageLayout /> }>
                <Route path='/' element={ <Home /> } />
                <Route path='list' element={ <AuthRoute><MusicList /></AuthRoute> } />
                <Route path='login' element={ <Login /> } />
                <Route path='*' element={ <NoRoute /> } />
              </Route>

            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ContentViewerProvider>
  );
}

export default App;