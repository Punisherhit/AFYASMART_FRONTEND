import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Minimize2, 
  Maximize2, 
  Send, 
  Bot, 
  User,
  Calendar,
  HelpCircle,
  Clock,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  userId?: string;
}

const Chatbot = ({ userId }: ChatbotProps) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Quick reply options
  const quickReplies = [
    { text: "Book Appointment", icon: Calendar },
    { text: "Ask FAQ", icon: HelpCircle },
    { text: "Hospital Hours", icon: Clock }
  ];

  useEffect(() => {
    // Initialize session ID from localStorage or generate new one
    const storedSessionId = localStorage.getItem('afya-chatbot-session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadChatHistory(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('afya-chatbot-session', newSessionId);
    }

    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        content: "Hi! I'm AfyaBot, your healthcare assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const loadChatHistory = (sessionId: string) => {
    // In real implementation, load from API
    const stored = localStorage.getItem(`afya-chat-${sessionId}`);
    if (stored) {
      try {
        const history = JSON.parse(stored);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  };

  const saveChatHistory = (newMessages: Message[]) => {
    localStorage.setItem(`afya-chat-${sessionId}`, JSON.stringify(newMessages));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isBot: false,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Simulate API call to chatbot backend
      const response = await fetch('/api/v1/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          message: content,
          userId: userId
        })
      });

      // Simulate bot response for demo
      setTimeout(() => {
        const botResponse = generateBotResponse(content);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          isBot: true,
          timestamp: new Date()
        };

        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm currently unavailable. Try again later!",
        isBot: true,
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
      return "I can help you book an appointment! Our doctors are available Monday-Friday 8AM-6PM, and weekends 9AM-4PM. Would you like me to check availability for a specific date?";
    } else if (lowerMessage.includes('hours') || lowerMessage.includes('time')) {
      return "Our hospital hours are:\n• Emergency: 24/7\n• General Services: Mon-Fri 8AM-6PM\n• Weekend Services: Sat-Sun 9AM-4PM\n\nIs there a specific department you need information about?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('faq')) {
      return "I'm here to help! I can assist with:\n• Booking appointments\n• Hospital information\n• General health questions\n• Emergency contacts\n\nWhat would you like to know more about?";
    } else {
      return "Thank you for your message! I'm here to help with your healthcare needs. You can ask me about appointments, hospital services, or general health information.";
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMinimized ? (
        <Button
          onClick={toggleMinimized}
          className="w-14 h-14 rounded-full shadow-hover animate-pulse-medical bg-gradient-hero"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-hover border border-border/50 bg-card">
          <CardHeader className="bg-gradient-medical text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <div>
                  <CardTitle className="text-sm">Chat with AfyaBot</CardTitle>
                  <p className="text-xs opacity-90">Online • Instant replies</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimized}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 animate-slide-up ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {message.isBot && (
                      <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] p-3 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {!message.isBot && (
                      <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center">
                        <User className="h-3 w-3 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 border-t border-border/50">
                <div className="flex flex-wrap gap-1">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply.text)}
                      className="text-xs h-8"
                    >
                      <reply.icon className="h-3 w-3 mr-1" />
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-border/50">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;