import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

function App() {
  const query = useQuery();
  const url = query.get('url');
  if (!url) return;
  if (/https:\/\/.*\.[json|y?ml]/.test(url)) {
    return <SwaggerUI url={url} />;
  }
}

export default App;
