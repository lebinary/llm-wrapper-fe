import React from 'react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId: number | undefined;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}) => {
  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">Conversations:</h2>
      <ul className="space-y-2">
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`cursor-pointer p-2 rounded ${
              conversation.id === selectedConversationId ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            {conversation.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
