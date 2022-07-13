import ContentViewerProvider from './context/ContentViewerContext';

import NavBar from './components/NavBar';
import Routes from './routes/Routes';

function App() {
  return(
    <ContentViewerProvider>
      <NavBar />
      <Routes />
    </ContentViewerProvider>
  );
}

export default App;