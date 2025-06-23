
interface ChatMessage {
  id: string;
  author: {
    role: 'user' | 'assistant';
  };
  create_time: number;
  content: {
    content_type: 'text';
    parts: string[];
  };
}

interface ChatRequest {
  action: 'next';
  messages: ChatMessage[];
  conversation_id?: string;
  parent_message_id: string;
  model: string;
  timezone_offset_min: number;
  timezone: string;
  conversation_mode: {
    kind: 'primary_assistant';
  };
  enable_message_followups: boolean;
  system_hints: any[];
  supports_buffering: boolean;
  supported_encodings: string[];
  client_contextual_info: {
    is_dark_mode: boolean;
    time_since_loaded: number;
    page_height: number;
    page_width: number;
    pixel_ratio: number;
    screen_height: number;
    screen_width: number;
  };
  paragen_cot_summary_display_override: string;
}

export const createChatRequest = (
  message: string,
  conversationId?: string,
  parentMessageId: string = 'client-created-root'
): ChatRequest => {
  const userMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: {
      role: 'user'
    },
    create_time: Date.now() / 1000,
    content: {
      content_type: 'text',
      parts: [message]
    }
  };

  const request: ChatRequest = {
    action: 'next',
    messages: [userMessage],
    parent_message_id: parentMessageId,
    model: 'gpt-4o',
    timezone_offset_min: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    conversation_mode: {
      kind: 'primary_assistant'
    },
    enable_message_followups: true,
    system_hints: [],
    supports_buffering: true,
    supported_encodings: ['v1'],
    client_contextual_info: {
      is_dark_mode: false,
      time_since_loaded: Date.now() - performance.timeOrigin,
      page_height: window.innerHeight,
      page_width: window.innerWidth,
      pixel_ratio: window.devicePixelRatio,
      screen_height: window.screen.height,
      screen_width: window.screen.width
    },
    paragen_cot_summary_display_override: 'allow'
  };

  if (conversationId) {
    request.conversation_id = conversationId;
  }

  return request;
};

export const sendChatMessage = async (request: ChatRequest): Promise<{ conversationId?: string; messageId?: string }> => {
  const response = await fetch('/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return {
    conversationId: data.conversation_id,
    messageId: data.message_id
  };
};
