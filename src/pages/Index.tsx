import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAppSelector } from '@/store/hooks';
import { useParams } from 'react-router-dom';

const Index = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { sessionId } = useParams();

  return (
    <div className="h-screen bg-background flex animate-fade-in">
      <Sidebar selectedSessionId={sessionId} />
      <div className="flex-1 animate-fade-in " style={{ animationDelay: '0.2s' }}>
        <ChatInterface sessionId={sessionId} />
      </div>
    </div>
  );
};

export default Index;
