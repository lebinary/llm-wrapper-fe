import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from './components/FileUpload';
import { Conversation } from './types';
import { ConversationList } from './components/ConversationList';
import { Chat } from './components/Chat';

export const HOST = "http://localhost:8000";

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${HOST}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleFileUpload = async (files: File[], title?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    if (title) {
      formData.append('title', title);
    }

    try {
      const response = await axios.post(`${HOST}/conversations/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setConversations([...conversations, response.data]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleChat = async (prompt_chat: string) => {
    if (!selectedConversation) return;

    try {
      const response = await axios.post(`${HOST}/conversations/${selectedConversation.id}/chat`, { prompt_chat: prompt_chat });
      const new_prompt = response.data;
      console.log('NEW PROMPT', new_prompt)
      const updatedConversation = {
        ...selectedConversation,
        prompts: [...selectedConversation.prompts, new_prompt],
      };
      setSelectedConversation(updatedConversation);
      setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)));
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const handleRating = async (promptId: number, rating: number) => {
    try {
      await axios.post(`${HOST}/conversations/${promptId}/rating`, { rating });
      if (selectedConversation) {
        const updatedPrompts = selectedConversation.prompts.map((prompt) =>
          prompt.id === promptId ? { ...prompt, rating } : prompt
        );
        const updatedConversation = { ...selectedConversation, prompts: updatedPrompts };
        setSelectedConversation(updatedConversation);
        setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)));
      }
    } catch (error) {
      console.error('Error rating prompt:', error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">File Chat App</h1>
      <FileUpload onUpload={handleFileUpload} />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <ConversationList
          conversations={conversations}
          onSelectConversation={setSelectedConversation}
          selectedConversationId={selectedConversation?.id}
        />
        {selectedConversation && (
          <Chat
            conversation={selectedConversation}
            onSendMessage={handleChat}
            onRatePrompt={handleRating}
          />
        )}
      </div>
    </div>
  )
}

export default App
