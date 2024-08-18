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
            className={`text-2xl ${
              prompt.rating && star <= prompt.rating ? 'text-yellow-500' : 'text-gray-300'
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
    <div className="col-span-2 border rounded p-4">
      <h2 className="text-xl font-bold mb-2">{conversation.title}</h2>
      <div className="h-96 overflow-y-auto mb-4 space-y-4">
        {conversation.prompts.map((prompt, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-blue-100 p-2 rounded">User: {prompt.content}</div>
            <div className="bg-green-100 p-2 rounded">
              AI: {renderResponse(prompt)}
              {renderRating(prompt)}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border p-2 rounded"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};
