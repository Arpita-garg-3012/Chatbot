import './App.css';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [textarea, setTextarea] = useState("");
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const chatboxRef = useRef(null); // Reference to the chatbox element

  let apiKey = "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"; // Replace with your actual OpenAI API key

  // Function to send a message
  const send = async () => {
    if (textarea.trim() !== "") {
      setIsLoading(true); // Set loading state

      try {
        // Add the user's message to the chat immediately
        setMessages([...messages, { text: textarea, type: "user" }]);
        setTextarea(""); // Clear the textarea

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
              {
                "role": "system",
                "content": "You are a helpful assistant."
              },
              {
                "role": "user",
                "content": textarea
              }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Update the messages state with the chatbot's response
        setMessages([...messages, { text: textarea, type: "user" }, { text: data.choices[0].message.content, type: "bot" }]);
      } catch (error) {
        console.error("Fetch error:", error);
        if (error.response) {
          console.log("Response status:", error.response.status);
          console.log("Response text:", await error.response.text());
        }
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  // Use useEffect to scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);



  return (
    <>
      <div className="container">
        <h2 className="some-element">🤖 ChatBot</h2>
        <hr />
        <ul className="chatbot" ref={chatboxRef}>
          <li>
            {/* <span>🤖</span> */}
            <p>Hi there <br />How can I help you today?</p>
          </li>
          {/* Display chat messages */}
          {messages.map((message, index) => (
            <li key={index} className={message.type === "user" ? "outgoing" : ""}>
              <p>{message.text}</p>
            </li>
          ))}
          {/* Display loading text when isLoading is true */}
          {isLoading && (
            <li className="incoming">
              <p>Chatbot is thinking...</p>
            </li>
          )}
        </ul>
        <div className="input">
          <textarea
            placeholder="Type here...."
            required
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
}

export default App;
