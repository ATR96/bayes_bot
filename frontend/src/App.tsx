import { useState } from 'react';
import QueryForm from './components/QueryForm.tsx';
import AnswerDisplay from './components/AnswerDisplay.tsx';
import './App.css';

function App() {
  const [answer, setAnswer] = useState<string>('');
  const [context, setContext] = useState<string[]>([]);
  const [traceId, setTraceId] = useState<string>('');

  return (
    <div className="app-container">
      <h1>bayes_bot</h1>
      <QueryForm setAnswer={setAnswer} setContext={setContext} setTraceId={setTraceId} />
      <AnswerDisplay answer={answer} context={context} traceId={traceId} />
    </div>
  );
}

export default App;
