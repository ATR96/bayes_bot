import React, { useRef, useEffect } from "react";

interface AnswerDisplayProps {
  answer: string;
  context: string[];
  traceId: string;
  history: { question: string; answer: string }[];
  isLoading: boolean;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  answer, 
  context, 
  traceId, 
  history, 
  isLoading 
}) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  return (
    <div className="chat-history" ref={chatHistoryRef}>
      {history.map((item, index) => (
        <div key={index}>
          {/* User message */}
          <div className="chat-item user">
            <div className="message user-message">
              {item.question}
            </div>
          </div>
          
          {/* Bot message */}
          <div className="chat-item bot">
            <div className={`message bot-message ${!item.answer && index === history.length - 1 ? 'loading' : ''}`}>
              {item.answer || (index === history.length - 1 && isLoading ? (
                <>
                  <span>AI Assistant is typing</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </>
              ) : (
                item.answer
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Debug info - hidden by default */}
      <div className="answer-display-debug" style={{ 
        display: 'none', // Hidden by default
        padding: '10px',
        backgroundColor: '#404040',
        border: '1px solid #555',
        borderRadius: '5px',
        margin: '10px 0',
        fontSize: '12px',
        color: '#ccc'
      }}>
        {answer && (
          <div className="section">
            <h3>Debug - Last Answer:</h3>
            <p>{answer}</p>
          </div>
        )}

        {context.length > 0 && (
          <div className="section">
            <h3>Debug - Retrieved Context:</h3>
            <ul>
              {context.map((chunk, index) => (
                <li key={index} className="chunk">{chunk}</li>
              ))}
            </ul>
          </div>
        )}

        {traceId && (
          <div className="section">
            <h4>🔍 Debug - Trace ID:</h4>
            <code>{traceId}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;