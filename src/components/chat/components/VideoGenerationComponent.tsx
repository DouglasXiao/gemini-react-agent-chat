
import React, { useState, useEffect } from 'react';

interface Video {
  id: string;
  url: string;
  title?: string;
}

interface VideoGenerationComponentProps {
  data?: {
    videos?: Video[];
    status?: 'generating' | 'optimizing' | 'ready' | 'queue';
    queueTime?: number;
    prompt?: string;
  };
}

export const VideoGenerationComponent: React.FC<VideoGenerationComponentProps> = ({ data }) => {
  const [currentStatus, setCurrentStatus] = useState(data?.status || 'queue');
  const [queueTime, setQueueTime] = useState(data?.queueTime || 2);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  
  // Sample prompt - in real app this would come from data
  const prompt = data?.prompt || "A close-up of a hand holding a knife slicing a kiwi fruit that looks like transparent glass on a wooden board. A kiwi fruite made of glass that is extremely realistic and beautiful, resembling a translucent green crystal, is placed on a clean wooden cutting board. The knife smoothly slices through the fruit, creating thin, transparent slices. The sound of the knife cutting through the glass-like fruit is amplified";
  
  const CHARACTER_LIMIT = 120;
  const shouldTruncate = prompt.length > CHARACTER_LIMIT;
  const displayPrompt = shouldTruncate && !isPromptExpanded 
    ? `${prompt.substring(0, CHARACTER_LIMIT)}...` 
    : prompt;

  useEffect(() => {
    // Simulate status progression
    if (!data?.status) {
      const timer = setTimeout(() => {
        if (currentStatus === 'queue') {
          setCurrentStatus('generating');
        } else if (currentStatus === 'generating') {
          setCurrentStatus('optimizing');
        } else if (currentStatus === 'optimizing') {
          setCurrentStatus('ready');
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStatus, data?.status]);

  useEffect(() => {
    // Countdown timer for queue
    if (currentStatus === 'queue' && queueTime > 0) {
      const timer = setTimeout(() => {
        setQueueTime(prev => Math.max(0, prev - 0.1));
      }, 6000); // Update every 6 seconds to simulate countdown

      return () => clearTimeout(timer);
    }
  }, [currentStatus, queueTime]);

  const renderProgressIndicator = () => {
    const steps = [
      { key: 'queue', label: 'In the queue', active: currentStatus === 'queue' },
      { key: 'generating', label: 'Generation', active: currentStatus === 'generating' || currentStatus === 'optimizing' }
    ];

    return (
      <div className="flex items-center justify-center space-x-4 mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex items-center space-x-2">
              <div className={`flex space-x-1 ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      step.active ? 'bg-green-400' : 'bg-gray-500'
                    } ${step.active ? 'animate-pulse' : ''}`}
                    style={{ 
                      animationDelay: step.active ? `${i * 0.2}s` : '0s',
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
              <span className={`text-sm ${step.active ? 'text-white' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex space-x-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-600"
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderMovingProgressBar = () => (
    <div className="w-full bg-gray-700 rounded-full h-1 mb-6 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full animate-pulse"
        style={{
          width: currentStatus === 'queue' ? '20%' : 
                 currentStatus === 'generating' ? '60%' : 
                 currentStatus === 'optimizing' ? '90%' : '100%',
          transition: 'width 2s ease-in-out'
        }}
      />
    </div>
  );

  // If videos are ready, show them
  if (currentStatus === 'ready' && data?.videos && data.videos.length > 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Generated Video</h3>
        </div>
        
        <div className="flex-1 p-6">
          {/* Prompt Display */}
          <div className="mb-6">
            <div 
              className={`text-sm text-gray-700 leading-relaxed ${shouldTruncate ? 'cursor-pointer' : ''}`}
              onClick={() => shouldTruncate && setIsPromptExpanded(!isPromptExpanded)}
            >
              {displayPrompt}
              {shouldTruncate && (
                <span className="text-blue-600 ml-1 font-medium">
                  {isPromptExpanded ? 'Show less' : 'Show more'}
                </span>
              )}
            </div>
          </div>

          {/* Video Display */}
          <div className="space-y-4">
            {data.videos.map((video, index) => (
              <div key={video.id || index} className="w-full">
                {video.title && (
                  <h4 className="text-md font-medium text-gray-800 mb-2">{video.title}</h4>
                )}
                <video
                  controls
                  className="w-full rounded-lg shadow-md"
                  style={{ maxHeight: '400px' }}
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show loading/progress state
  return (
    <div className="h-full flex flex-col bg-black text-white p-6">
      {/* Video Icon and Mode Info */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border border-white rounded flex items-center justify-center">
            <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="font-medium">Video</span>
        </div>
        <span className="text-gray-400">|</span>
        <span className="text-sm text-gray-300">Kling 1.6</span>
        <span className="text-sm text-gray-300">Standard Mode</span>
      </div>

      {/* Prompt Display */}
      <div className="mb-6">
        <div 
          className={`text-sm text-gray-300 leading-relaxed ${shouldTruncate ? 'cursor-pointer hover:text-white' : ''} transition-colors`}
          onClick={() => shouldTruncate && setIsPromptExpanded(!isPromptExpanded)}
        >
          {displayPrompt}
          {shouldTruncate && (
            <span className="text-blue-400 ml-1 font-medium">
              {isPromptExpanded ? ' Show less' : ' Show more'}
            </span>
          )}
        </div>
      </div>

      {/* Video-like Frame */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-900 rounded-lg p-8 mb-6 min-h-[300px]">
        {renderProgressIndicator()}
        {renderMovingProgressBar()}
        
        <div className="text-center">
          <div className="text-lg font-medium mb-2">
            {currentStatus === 'queue' && `In the queue... Estimated waiting time: longer than ${Math.ceil(queueTime)} hour`}
            {currentStatus === 'generating' && 'Generation in progress...'}
            {currentStatus === 'optimizing' && 'Optimizing prompt in progress...'}
          </div>
          
          {currentStatus === 'queue' && (
            <div className="text-sm text-gray-400 mb-4">
              You can work on other projects, or{' '}
              <span className="text-blue-400 underline cursor-pointer">explore the Community</span>{' '}
              Upgrade to Fast-Track Generation to start the generation process sooner.
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button className="px-6 py-2 border border-gray-600 rounded text-white hover:bg-gray-800 transition-colors duration-200">
          {currentStatus === 'queue' ? 'Upgrade >' : 'Cancel generation'}
        </button>
      </div>
    </div>
  );
};
