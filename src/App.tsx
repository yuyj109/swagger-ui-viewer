import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};


function App() {
  const query = useQuery();
  const api = query.get("api");
  if (!api) return;
  if (/https:\/\/.*\.[json|y?ml]/.test(api)) {
    return <SwaggerUI url={api} />
  }
}

export default App
