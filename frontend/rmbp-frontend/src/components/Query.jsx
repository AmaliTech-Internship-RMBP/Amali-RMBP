import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Loader } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

const BASE_URL = "http://16.171.19.134:5000/api/v1";

const Query = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
    
    if (inputContainerRef.current) {
      const isMultiline = inputRef.current.scrollHeight > 40;
      inputContainerRef.current.style.borderRadius = isMultiline ? '20px' : '9999px';
    }
  }, [inputText]);

  const sendMessageToApi = async (message) => {
    let url = `${BASE_URL}/chat`;
    let body = { message };

    if (message.startsWith('/translate: ')) {
      url = `${BASE_URL}/translate`;
      body = { text: message.replace('/translate: ', '') };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return message.startsWith('/translate: ') ? data.translated_text : data.response;
    } catch (error) {
      console.error("Error:", error);
      return "Error in fetching response. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { type: 'sender', content: inputText };
      setMessages([...messages, newMessage]);
      setInputText('');
      setIsLoading(true);

      const responseMessage = await sendMessageToApi(inputText);
      setMessages(prevMessages => [...prevMessages, { type: 'receiver', content: responseMessage }]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <div className=" max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.type === 'sender' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div 
                className={`inline-block rounded-lg p-3 break-words ${
                  message.type === 'sender' 
                    ? 'bg-[#2b9997] text-[#fff]' 
                    : 'bg-[#1f7271] text-[#fff]'
                }`}
                style={{
                  maxWidth: '70%',
                  width: 'fit-content'
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-[#1f7271] text-[#fff] rounded-lg p-3">
                <Loader className="animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="w-full p-4 flex justify-center">
  <div
    ref={inputContainerRef}
    className=" w-full max-w-4xl relative flex items-center bg-gradient-to-b from-transparent to-[#97FFB3] rounded-full p-2 text-[#000] transition-all duration-300"
  >
    <textarea
      ref={inputRef}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ask me anything ..."
      className="flex-grow p-2 sm:p-3 shadow-md shadow-olive border-olive bg-white rounded overflow-y-auto text-black placeholder-gray-500 outline-none text-sm sm:text-base resize-none overflow-hidden min-h-[20px] max-h-[200px]"
      style={{ paddingRight: "40px" }}
    />
    <button
      onClick={handleSendMessage}
      disabled={!inputText.trim()}
      className={`p-1 sm:p-2 ml-3 sm:mr-[6px] bg-[#004A4F] text-white rounded-full flex items-center justify-center ${
        !inputText.trim() ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Send className="w-6 h-6 sm:w-8 sm:h-8 mr-1 text-[#fff]" />
    </button>
    <button
      onClick={toggleRecording}
      className="p-1 sm:p-2 ml-3 bg-transparent rounded-full border bg-olive text-[#fff]"
    >
      <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-[#fff]" />
    </button>
  </div>
</div>


      {isRecording && <AudioRecorder onClose={toggleRecording} />}
    </div>
  );
};

export default Query;
