import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import yaml from 'js-yaml';
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

  const isJson = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], 'UTF-8');
        setSelectedName(e.target.files[0].name);
        fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
          if (readerEvent?.target?.result) {
            let result = readerEvent.target.result.toString();
            if (!isJson(result)) {
              result = JSON.stringify(yaml.load(result));
            }
            setFile(result);
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
