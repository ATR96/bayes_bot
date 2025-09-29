import { useState, useEffect, useRef } from "react";
import QueryForm from "./components/QueryForm.tsx";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [traceId, setTraceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

  const chatHistoryRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      setTimeout(() => {
        chatHistoryRef.current!.scrollTop = chatHistoryRef.current!.scrollHeight;
      }, 50);
    }
  }, [history, isLoading]);

  return (
    <div className="app-wrapper">
      <div className="chatbot-container">
        <header className="header">
          <h1>AI Assistant</h1>
          <p>Ask me anything!</p>
        </header>

        <main className="chat-body">
          <div className="chat-history" ref={chatHistoryRef}>
            {history.map((item, idx) => (
              <div key={idx}>
                {/* User message */}
                <div className="chat-item user">
                  <div className="message user-message">
                    {item.question}
                  </div>
                </div>
                
                {/* Bot message */}
                <div className="chat-item bot">
                  <div className={`message bot-message ${!item.answer && idx === history.length - 1 && isLoading ? 'loading' : ''}`}>
                    {item.answer || (idx === history.length - 1 && isLoading ? (
                      <>
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span style={{ marginLeft: '8px' }}>AI Assistant is thinking...</span>
                      </>
                    ) : (
                      item.answer || "..."
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="chat-input-area">
          <QueryForm
            setAnswer={setAnswer}
            setContext={setContext}
            setTraceId={setTraceId}
            setIsLoading={setIsLoading}
            setHistory={setHistory}
            question={question}
            setQuestion={setQuestion}
            isLoading={isLoading}
            chatHistoryRef={chatHistoryRef}
          />
        </footer>
      </div>
    </div>
  );
}

export default App;