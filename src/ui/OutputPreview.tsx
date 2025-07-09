import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface OutputPreviewProps {
  outputFileName: string;
}

const OutputPreview: React.FC<OutputPreviewProps> = ({ outputFileName }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOutput = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/yui-protocol-static/data/outputs.json');
        if (!response.ok) throw new Error('outputs.json not found');
        const outputsData = await response.json();
        const key = outputFileName.replace('.md', '');
        const fileContent = outputsData[key];
        if (!fileContent) throw new Error('File content not found in outputs.json');
        setContent(fileContent);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchOutput();
  }, [outputFileName]);

  if (loading) return <div className="p-8 text-gray-400">Loading preview...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 rounded shadow mt-8 prose prose-invert max-w-none">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Preview: {outputFileName}</h2>
      <ReactMarkdown
        remarkPlugins={[]}
        rehypePlugins={[]}
        components={{
          p: ({ children }) => <p className="mb-3 text-gray-300">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-100 my-4 border-b border-gray-700 pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-gray-100 my-3 border-b border-gray-700 pb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-gray-100 my-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold text-gray-100 my-2">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold text-gray-100 my-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-bold text-gray-100 my-1">{children}</h6>,
          strong: ({ children }) => <strong className="font-bold text-gray-100">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
          code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 text-sm text-gray-100 rounded overflow-x-auto whitespace-pre-wrap break-words">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-900 p-4 overflow-x-auto text-sm text-gray-100 rounded mb-3 whitespace-pre-wrap break-words">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-800">{children}</blockquote>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-4 text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          hr: () => <hr className="border-gray-700 my-4" />, 
          br: () => <br />,
          table: () => <div className="bg-gray-800 p-4 rounded mb-3 text-gray-300">[Table content]</div>,
          thead: () => null,
          tbody: () => null,
          tr: () => null,
          th: () => null,
          td: () => null,
          a: () => <span className="text-blue-400">[Link]</span>,
          img: () => <span className="text-gray-400">[Image]</span>,
          div: ({ children }) => <div className="text-gray-300">{children}</div>,
          span: ({ children }) => <span className="text-gray-300">{children}</span>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default OutputPreview; 