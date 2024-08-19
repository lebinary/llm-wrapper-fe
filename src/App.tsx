import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from './components/FileUpload';
import { Conversation, UploadedFile } from './types';
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

  const handleFileUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post(`${HOST}/conversations/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setConversations([...conversations, response.data]);
      setSelectedConversation(response.data);
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
      await axios.put(`${HOST}/prompts/${promptId}/rating`, { rating });
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

  const handleUpdateFile = async (fileId: number, fileData: Partial<UploadedFile>) => {
    try {
      await axios.put(`${HOST}/files/${fileId}`, fileData);
      if (selectedConversation) {
        const updatedFiles = selectedConversation.files.map((file) =>
          file.id === fileId ? { ...file, ...fileData } : file
        );
        const updatedConversation = { ...selectedConversation, files: updatedFiles };
        setSelectedConversation(updatedConversation);
        setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)));
      }
    } catch (error) {
      console.error('Error rating prompt:', error);
    }
  };

  const startConversation = () => {
    setSelectedConversation(null);
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <header className="bg-white shadow-sm rounded-lg mb-8 p-6">
          <h1 className="text-3xl font-bold text-gray-800">LLM Wrapper</h1>
        </header>
        <div className="flex flex-grow overflow-hidden bg-white shadow-lg rounded-lg">
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={startConversation}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                New Conversation
              </button>
            </div>
            <div className="overflow-y-auto flex-grow p-4">
              <ConversationList
                conversations={conversations}
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
          </div>
          <div className="w-2/3 p-6">
            {selectedConversation ? (
              <Chat
                conversation={selectedConversation}
                onSendMessage={handleChat}
                onRatePrompt={handleRating}
                onUpdateFile={handleUpdateFile}
              />
            ) : (
              <FileUpload onUpload={handleFileUpload} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
