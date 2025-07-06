import React, { useState } from 'react';

interface QueryFormProps {
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  setContext: React.Dispatch<React.SetStateAction<string[]>>;
  setTraceId: React.Dispatch<React.SetStateAction<string>>;
}

const QueryForm: React.FC<QueryFormProps> = ({ setAnswer, setContext, setTraceId }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    setAnswer(data.answer);
    setContext(data.context);
    setTraceId(data.trace_id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button type="submit">Ask</button>
    </form>
  );
};

export default QueryForm;