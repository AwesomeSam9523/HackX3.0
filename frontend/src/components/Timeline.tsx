import React from 'react';

interface TimelineItem {
  date: string;
  title: string;
  subtitle?: string;
  description: string[];
  status: 'opening' | 'round' | 'closing';
}

interface TimelineProps {
  items?: TimelineItem[];
}

const defaultItems: TimelineItem[] = [
  {
    date: '31ST OCT (OPENING)',
    title: '1ST ROUND - 31ST OCT',
    subtitle: 'OPENING',
    description: [
      'Inauguration & Speech by dignitaries',
      'Announcement of track of event',
      'Report Submission Guidelines'
    ],
    status: 'opening'
  },
  {
    date: '31ST OCT (ROUND 1)',
    title: '31ST OCT (ROUND 1)',
    subtitle: '1ST ROUND - 31ST OCT',
    description: [
      'Report Round | General submission and checks for participant teams'
    ],
    status: 'round'
  },
  {
    date: '1ST NOV (ROUND 1 CONT\'D)',
    title: '1ST NOV (ROUND 1 CONT\'D)',
    subtitle: '1ST ROUND CONTINUED',
    description: [
      'Round 1 continues',
      'Mentors check team progress'
    ],
    status: 'round'
  },
  {
    date: '1ST NOV (ROUND 2)',
    title: '1ST NOV (ROUND 2)',
    subtitle: '2ND ROUND - 1ST NOV',
    description: [
      'Presentation pitch for Round 2',
      'Screening of teams',
      'Final scoring of teams'
    ],
    status: 'round'
  },
  {
    date: '1ST NOV (CLOSING)',
    title: '1ST NOV (CLOSING)',
    subtitle: 'CLOSING CEREMONY',
    description: [
      'Result declaration',
      'Closing ceremony & speeches',
      'Award and prize distribution'
    ],
    status: 'closing'
  }
];

const HackathonTimeline: React.FC<TimelineProps> = ({ items = defaultItems }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Main vertical line - centered */}
         <div
  className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-400 to-cyan-400"
  style={{
    border: '5.8px solid rgba(0, 221, 255, 1)',
    boxShadow: '0px 0px 17.01px 0px rgba(0, 221, 255, 1)'
  }}
></div>

          
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div key={index} className="relative mb-16 last:mb-0">
                {/* Timeline dot - centered */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-slate-900 shadow-lg shadow-cyan-400/50 z-10"></div>
                
                {/* Connecting line from box to center dot */}
                <div className={`absolute top-6 ${
                  isLeft 
                    ? 'right-0 w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-300' 
                    : 'left-0 w-20 h-0.5 bg-gradient-to-l from-cyan-400 to-cyan-300 transform -translate-x-full'
                }`}></div>
                
                {/* Content container - alternating sides */}
                <div className={`w-5/12 ${isLeft ? 'pr-16' : 'ml-auto pl-16'}`}>
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6 shadow-xl relative">
                    
                    {/* Date badge */}
                    <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                      {item.date}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Subtitle */}
                    {item.subtitle && (
                      <p className="text-cyan-300 text-sm font-medium mb-4 uppercase tracking-wide">
                        {item.subtitle}
                      </p>
                    )}
                    
                    {/* Description list */}
                    <ul className="space-y-2">
                      {item.description.map((desc, descIndex) => (
                        <li key={descIndex} className="flex items-start text-gray-300">
                          <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Status indicator */}
                    <div className="mt-4 flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        item.status === 'opening' 
                          ? 'bg-green-400 shadow-green-400/50' 
                          : item.status === 'round' 
                          ? 'bg-blue-400 shadow-blue-400/50' 
                          : 'bg-purple-400 shadow-purple-400/50'
                      } shadow-lg`}></div>
                      <span className="text-xs text-gray-400 uppercase font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Connecting line segment */}
                {index < items.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-0.5 top-4 w-0.5 h-16 bg-gradient-to-b from-cyan-400/80 to-cyan-400/30"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HackathonTimeline;