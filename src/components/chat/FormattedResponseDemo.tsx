import React from 'react';
import FormattedResponseViewer from './FormattedResponseViewer';

const sampleRawData = `data: {"type": "status", "content": "Starting agent"}

data: {"type": "status", "content": "Agent is preparing to process your request"}

data: {"type": "status", "content": "Agent is analyzing your request"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent is using engagement_data_tool"}

data: {"type": "status", "content": "Completed tool execution"}

data: {"type": "status", "content": "Agent is planning next moves"}

data: {"type": "heartbeat", "content": "Agent still working... (10s)"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent is analyzing data"}

data: {"type": "status", "content": "Completed tool execution"}

data: {"type": "status", "content": "Agent is refining approach"}

data: {"type": "status", "content": "Agent has completed analysis"}

data: {"type": "status", "content": "Agent execution completed, preparing response"}

data: {"type": "status", "content": "Agent completed request"}

data: {"type": "response", "content": "Based on the engagement analysis, here are the mos"}

data: {"type": "response", "content": "t engaged producers across different activities:\nT"}

data: {"type": "response", "content": "OP PORTAL USERS (Most Portal Logins YTD)\n- Yusuf M"}

data: {"type": "response", "content": "itchell: 109 logins\n- Mei Rivera: 107 logins  \n- P"}

data: {"type": "response", "content": "edro Nakamura: 106 logins\n- Kavitha Jones: 104 log"}

data: {"type": "response", "content": "ins\n- Hassan Taylor: 103 logins\n- Ashley Parker: 1"}

data: {"type": "response", "content": "02 logins\n- Olivia Meyer: 101 logins\n- Carlos Zhou"}

data: {"type": "response", "content": ": 101 logins\n- Elena Wojcik: 101 logins\n- Ashley W"}

data: {"type": "response", "content": "isniewski: 100 logins\nTRAINING ATTENDANCE\nNo train"}

data: {"type": "response", "content": "ing attendance data is currently available in the "}

data: {"type": "response", "content": "system.\nEVENT ATTENDANCE & OVERALL ENGAGEMENT\nThe "}

data: {"type": "response", "content": "analysis shows strong portal engagement, with top "}

data: {"type": "response", "content": "producers logging 100+ portal sessions this year. "}

data: {"type": "response", "content": "For complete event attendance rankings and overall"}

data: {"type": "response", "content": " engagement scores, the data indicates active part"}

data: {"type": "response", "content": "icipation across your producer network.\nThese high"}

data: {"type": "response", "content": "ly engaged producers represent your most active re"}

data: {"type": "response", "content": "lationship prospects for deeper collaboration and "}

data: {"type": "response", "content": "potential growth opportunities."}

data: {"type": "complete", "content": "Response complete", "session_id": "60c88e3c-43c8-4107-ad54-0882a3b6a4fe", "user_id": "ui_dev_user@spyglaz.com", "metadata": {"tool_calls": 0, "response_length": 931, "files_count": 0}}`;

export const FormattedResponseDemo: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Formatted Response Viewer Demo</h1>
      <p className="text-muted-foreground mb-6">
        This demo shows how streaming responses are formatted and displayed. 
        The component can parse raw streaming data and present it in a structured, 
        visually appealing format similar to the HTML example you provided.
      </p>
      
      <FormattedResponseViewer 
        rawData={sampleRawData}
        className="w-full"
      />
    </div>
  );
};

export default FormattedResponseDemo;
