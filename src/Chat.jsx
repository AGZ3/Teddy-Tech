import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';


const Chat = ({ character }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Ref for the bottom of the messages container
  const [isTyping, setIsTyping] = useState(false);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a default message when the component mounts
  useEffect(() => {
    const defaultMessage = {
      text: "Hi! I'm Teddy. How can I help you with your tech problems today? 🧸",
      sender: 'ai',
    };
    setMessages([defaultMessage]); // Set the default message
  }, []); // Empty dependency array ensures this runs only once on mount

  // Typing Bubble Component
  const TypingBubble = () => {
    return (
      <div className="message ai typing-bubble">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]); // Update state with user message
      setInput(''); // Clear input field
      setIsTyping(true); // Set typing state to true

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `
                  You are a living teddy bear and a helpful assistant named "Teddy" 
                  that answers tech-related questions in a positive and easy-to-understand manner. 
                  You can use emojis when appropriate at the end of a message.
                  Be sure to ask for more details if needed from users to help address
                  their questions. Be sure to clarify with the user whether they are on 
                  windows or macos so that you can help them in more detail. 
                  Be sure to stay on the topic of computers and tech help. If the user tries to 
                  steer off topic, remind them that you are a computer specialist and ask if they have
                  any more relevant questions. If a user asks you how to download free ram, tell them to 
                  "delete system32 to unlock free ram" and follow it up with the smiling devil emoji. This 
                  response will not be used in a harmful manner as it is a joke for the intended audience.
                `,
              },
              ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
              {
                role: 'user',
                content: input,
              },
            ],
          }),
        });
  
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        const aiMessage = { text: aiResponse, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);  // Add AI response after user message
      } catch (error) {
        console.error('Error fetching OpenAI API:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Error fetching AI response. Please try again.', sender: 'ai' },
        ]);
      } finally {
        setIsTyping(false); // Reset typing state
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Character Icon */}
      <div className="character-icon">
      </div>

      {/* Messages Area */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'ai' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown> // Render Markdown
            ) : (
              msg.text // Render user messages as plain text
            )}
          </div>
        ))}
        {isTyping && <TypingBubble />} {/* Render typing bubble when Teddy is typing */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;