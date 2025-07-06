import React from "react";

interface AnswerDisplayProps {
  answer: string;
  context: string[];
  traceId: string;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, context, traceId }) => {
  return (
    <div className="answer-display">
      {answer && (
        <div className="section">
          <h2>Answer</h2>
          <p>{answer}</p>
        </div>
      )}

      {context.length > 0 && (
        <div className="section">
          <h3>Retrieved Context</h3>
          <ul>
            {context.map((chunk, index) => (
              <li key={index} className="chunk">{chunk}</li>
            ))}
          </ul>
        </div>
      )}

      {traceId && (
        <div className="section">
          <h4>🧾 Trace ID</h4>
          <code>{traceId}</code>
        </div>
      )}
    </div>
  );
};

export default AnswerDisplay;
