import React, { useRef, useEffect } from "react";

interface QueryFormProps {
  setAnswer: (ans: string) => void;
  setContext: React.Dispatch<React.SetStateAction<string>>;
  setTraceId: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setHistory: React.Dispatch<React.SetStateAction<{ question: string; answer: string }[]>>;
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chatHistoryRef?: React.RefObject<HTMLDivElement>;
}

const QueryForm: React.FC<QueryFormProps> = ({
  setAnswer,
  setContext,
  setTraceId,
  setIsLoading,
  setHistory,
  question,
  setQuestion,
  isLoading,
  chatHistoryRef,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (chatHistoryRef?.current) {
      setTimeout(() => {
        chatHistoryRef.current!.scrollTop = chatHistoryRef.current!.scrollHeight;
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after submission

    // Add user message to history first
    setHistory((prev) => [...prev, { question: currentQuestion, answer: "" }]);
    scrollToBottom();

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAnswer(data.answer);
      setContext(data.context);
      setTraceId(data.trace_id);
      
      // Update the last message in history with the answer
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          question: currentQuestion,
          answer: data.answer
        };
        return newHistory;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = "Sorry, something went wrong.";
      setAnswer(errorMessage);
      setContext("");
      setTraceId("");
      
      // Update the last message in history with error
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          question: currentQuestion,
          answer: errorMessage
        };
        return newHistory;
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
      // Focus back on input after response
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="input-form">
      <input
        ref={inputRef}
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={handleKeyPress}
        className="query-input"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button 
        onClick={handleSubmit}
        className="query-button"
        disabled={!question.trim() || isLoading}
      >
        {isLoading ? "..." : "Send"}
      </button>
    </div>
  );
};

export default QueryForm;