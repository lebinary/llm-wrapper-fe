import React, { useState } from 'react';
import { Prompt, Conversation, isTextResponse, isDataResponse, isJsonResponse } from '../types';
import { DataTable } from './DataTable';
import { JsonViewer } from './JsonViewer';

interface ChatProps {
  conversation: Conversation;
  onSendMessage: (message: string) => void;
  onRatePrompt: (promptId: number, rating: number) => void;
}

export const Chat: React.FC<ChatProps> = ({ conversation, onSendMessage, onRatePrompt }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const renderRating = (prompt: Prompt) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatePrompt(prompt.id, star)}
            className={`text-xl focus:outline-none transition-colors duration-150 ${
              prompt.rating && star <= prompt.rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const renderResponse = (prompt: Prompt) => {
    if (!prompt.response) return "No Response";

    let formattedResponse = null;
    if (isTextResponse(prompt.response)) {
      formattedResponse = prompt.response.text;
    } else if (isDataResponse(prompt.response)){
      formattedResponse = <DataTable<typeof prompt.response.data[0]> title={prompt.content} data={ prompt.response.data } />
    } else if (isJsonResponse(prompt.response)) {
      formattedResponse = <JsonViewer json={prompt.response.json} />
    } else {
      formattedResponse = "Response has unsupported data type"
    }

    return formattedResponse
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">{conversation.title}</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.prompts.map((prompt, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-blue-100 p-3 rounded-lg max-w-3/4 shadow">
                <p className="text-blue-800">{prompt.content || message}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg max-w-3/4 shadow">
                <div className="text-gray-800">{renderResponse(prompt)}</div>
                {renderRating(prompt)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
