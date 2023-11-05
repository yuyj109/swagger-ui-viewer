import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

function App() {
  const query = useQuery();
  const url = query.get('url');
  const [file, setFile] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], 'UTF-8');
        setSelectedName(e.target.files[0].name);
        fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
          if (readerEvent?.target?.result) {
            setFile(readerEvent.target.result.toString());
          }
        };
      }
    } catch {
      setFile('');
      setSelectedName('');
    }
  };

  if (url && /https:\/\/.*\.[json|y?ml]/.test(url)) {
    return <SwaggerUI url={url} />;
  }

  return (
    <div>
      <div className="app">
        <div className="parent">
          <div className="file-upload">
            <h3> {selectedName || 'Click box to upload'}</h3>
            <input type="file" onChange={handleChange} />
          </div>
        </div>
      </div>
      <br />
      {file !== '' && (
        <SwaggerUI
          spec={JSON.parse(file)}
        />
      )}
    </div>
  );
}

export default App;
