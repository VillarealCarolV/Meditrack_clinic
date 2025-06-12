import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ROLE_RESPONSES = {
  patient: {
    keywords: {
      'book': 'I can help you book an appointment!',
      'appointment': 'I can help you book an appointment!',
      'schedule': 'I can help you book an appointment!',
      'prescription': 'I can help you view your prescriptions.',
      'record': 'I can help you access your medical records.',
      'profile': 'I can help you manage your profile.'
    },
    actions: {
      'book': '/booking',
      'appointment': '/booking',
      'schedule': '/booking',
      'prescription': '/dashboard/patient/prescriptions',
      'record': '/dashboard/patient/records',
      'profile': '/profile'
    }
  },
  doctor: {
    keywords: {
      'patient': 'I can help you view patient records.',
      'schedule': 'I can help you view your schedule.',
      'appointment': 'I can help you view your schedule.',
      'appointments': 'I can help you view your schedule.',
      'prescribe': 'I can help you with prescriptions.',
      'record': 'I can help you access patient records.',
      'report': 'I can help you generate reports.'
    },
    actions: {
      'patient': '/dashboard/doctor/patients',
      'schedule': '/dashboard/doctor/appointments',
      'appointment': '/dashboard/doctor/appointments',
      'appointments': '/dashboard/doctor/appointments',
      'prescribe': '/dashboard/doctor/prescriptions',
      'record': '/dashboard/doctor/records',
      'report': '/dashboard/doctor/reports'
    }
  },
  nurse: {
    keywords: {
      'patient': 'I can help you view patient information.',
      'vital': 'I can help you record vital signs.',
      'care': 'I can help you with patient care.',
      'medication': 'I can help you with medication administration.',
      'report': 'I can help you with patient reports.'
    },
    actions: {
      'patient': '/dashboard/nurse/patients',
      'vital': '/dashboard/nurse/vitals',
      'care': '/dashboard/nurse/care',
      'medication': '/dashboard/nurse/medications',
      'report': '/dashboard/nurse/reports'
    }
  },
  owner: {
    keywords: {
      'overview': 'I can help you view the clinic overview.',
      'staff': 'I can help you manage staff.',
      'revenue': 'I can help you with revenue tracking.',
      'approval': 'I can help you with pending approvals.',
      'activity': 'I can help you track clinic activity.',
      'report': 'I can help you generate reports.',
      'settings': 'I can help you with clinic settings.'
    },
    actions: {
      'overview': '/dashboard/owner',
      'staff': '/dashboard/owner/staff',
      'revenue': '/dashboard/owner/revenue',
      'approval': '/dashboard/owner/approvals',
      'activity': '/dashboard/owner/activity',
      'report': '/dashboard/owner/reports',
      'settings': '/dashboard/owner/settings'
    }
  }
};

const RoleBasedHelpBot = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: `Hello! I'm your ${role} assistant. How can I help you today?`, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);

    const lowerInput = input.toLowerCase();
    let response = "I'm not sure I understand. Could you please rephrase that?";
    let action = null;

    const roleResponses = ROLE_RESPONSES[role];
    if (roleResponses) {
      for (const [keyword, responseText] of Object.entries(roleResponses.keywords)) {
        if (lowerInput.includes(keyword)) {
          response = responseText;
          action = roleResponses.actions[keyword];
          break;
        }
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      
      if (action) {
        setTimeout(() => {
          navigate(action);
        }, 2000);
      }
    }, 500);

    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)} Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoleBasedHelpBot; 