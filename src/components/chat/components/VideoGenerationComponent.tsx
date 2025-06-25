
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
  };
}

export const VideoGenerationComponent: React.FC<VideoGenerationComponentProps> = ({ data }) => {
  const [currentStatus, setCurrentStatus] = useState(data?.status || 'generating');
  const [queueTime, setQueueTime] = useState(data?.queueTime || 4);

  useEffect(() => {
    // Simulate status progression if no real data
    if (!data?.status) {
      const timer = setTimeout(() => {
        if (currentStatus === 'queue') {
          setCurrentStatus('generating');
        } else if (currentStatus === 'generating') {
          setCurrentStatus('optimizing');
        } else if (currentStatus === 'optimizing') {
          setCurrentStatus('ready');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStatus, data?.status]);

  useEffect(() => {
    // Countdown timer for queue
    if (currentStatus === 'queue' && queueTime > 0) {
      const timer = setTimeout(() => {
        setQueueTime(prev => prev - 1);
      }, 60000); // Update every minute

      return () => clearTimeout(timer);
    }
  }, [currentStatus, queueTime]);

  const renderLoadingDots = () => (
    <div className="flex justify-center space-x-2 mb-6">
      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );

  const renderStatusMessage = () => {
    switch (currentStatus) {
      case 'queue':
        return `Non-member queue: ${queueTime} mins wait`;
      case 'generating':
        return 'Generating video in progress...';
      case 'optimizing':
        return 'Optimizing prompt in progress...';
      case 'ready':
        return 'Video generation complete';
      default:
        return 'Processing...';
    }
  };

  // If videos are ready, show them
  if (currentStatus === 'ready' && data?.videos && data.videos.length > 0) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Generated Video</h3>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
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
    );
  }

  // Show loading/progress state
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="text-center max-w-md px-6">
        {renderLoadingDots()}
        
        <div className="text-lg font-medium mb-8">
          {renderStatusMessage()}
        </div>

        <button className="px-8 py-3 border border-gray-400 rounded-full text-white hover:bg-white hover:text-gray-800 transition-colors duration-200 font-medium">
          Cancel generation
        </button>
      </div>
    </div>
  );
};
