import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import yaml from 'js-yaml';
import './App.css';
import mermaid from 'mermaid';

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
    return <SwaggerUI 
        url={url}
        plugins={[MermaidRenderPlugin]}
      />;
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
          plugins={[MermaidRenderPlugin]}
        />
      )}
    </div>
  );
}

// SwaggerUIのdescription内のmermaidコードブロックを自動描画するプラグイン
const MermaidRenderPlugin = function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MermaidMarkdown = ({ Original, ...props }: { Original: any } & Record<string, unknown>) => {
    useEffect(() => {
      setTimeout(() => {
        // class属性に依存せず、codeタグの内容で判定
        const blocks = document.querySelectorAll('.markdown code, .renderedMarkdown code');
        blocks.forEach((block) => {
          // 既に描画済みならスキップ
          if ((block as HTMLElement).classList.contains('mermaid-rendered')) return;
          const code = block.textContent || '';
          // Mermaid記法か判定（主要なMermaid記法すべて対応）
          const mermaidStarters = [
            'graph ',
            'sequenceDiagram',
            'stateDiagram',
            'classDiagram',
            'erDiagram',
            'journey',
            'gantt',
            'pie',
            'requirementDiagram',
            'mindmap',
            'timeline',
            'quadrantChart',
            'flowchart',
            'gitGraph'
          ];
          if (
            mermaidStarters.some(starter => code.trim().startsWith(starter))
          ) {
            const parent = block.parentElement;
            if (!parent) return;
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = code;
            parent.replaceChild(div, block);
            try {
              (async () => {
                await mermaid.run({ nodes: [div] });
                div.classList.add('mermaid-rendered');
              })();
            } catch (e) {
              // 失敗時は何もしない
            }
          }
        });
      }, 0);
    }, [props.children]);
    return <Original {...props} />;
  };
  return {
    wrapComponents: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Markdown: (Original: any) => (props: Record<string, unknown>) => <MermaidMarkdown Original={Original} {...props} />
    }
  };
};

export default App;
