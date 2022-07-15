import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContentViewerProvider from './context/ContentViewerContext';
import PageLayout from './routes/PageLayout';

import Home from './routes/Home';
import MusicList from './routes/MusicList';
import NoRoute from './routes/NoRoute';

function App() {
  return(
    <ContentViewerProvider>
      <BrowserRouter>
      	<Routes>

          <Route path='/' element={ <PageLayout /> }>
            <Route path='/' element={ <Home /> } />
            <Route path='list' element={ <MusicList /> } />
            <Route path='*' element={ <NoRoute /> } />
          </Route>

        </Routes>
      </BrowserRouter>
    </ContentViewerProvider>
  );
}

export default App;