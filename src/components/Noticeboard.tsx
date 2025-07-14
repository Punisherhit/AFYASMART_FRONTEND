import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

interface NoticeboardProps {
  isAdmin?: boolean;
}

const Noticeboard = ({ isAdmin = false }: NoticeboardProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "COVID-19 Safety Measures Updated",
      content: "New safety protocols are now in effect. Please wear masks in all common areas and maintain social distancing.",
      createdAt: "2024-01-15T10:00:00Z",
      author: "Dr. Smith"
    },
    {
      id: "2", 
      title: "New Cardiology Department Opening",
      content: "We're excited to announce the opening of our new cardiology department with state-of-the-art equipment.",
      createdAt: "2024-01-14T14:30:00Z",
      author: "Admin"
    },
    {
      id: "3",
      title: "Extended Hours for Emergency Care",
      content: "Emergency services are now available 24/7. Our dedicated team is here to help you round the clock.",
      createdAt: "2024-01-13T09:15:00Z",
      author: "Dr. Johnson"
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch announcements
    setAnnouncements(mockAnnouncements);
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      // In real implementation, replace with actual API call
      // const response = await fetch('/api/v1/announcements?limit=5');
      // const data = await response.json();
      // setAnnouncements(data);
      
      // Simulate loading
      setTimeout(() => {
        setAnnouncements(mockAnnouncements);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        createdAt: new Date().toISOString(),
        author: "Admin"
      };

      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setNewTitle("");
      setNewContent("");
      setIsCreateOpen(false);
      
      toast({
        title: "Success",
        description: "Announcement created successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    toast({
      title: "Success",
      description: "Announcement deleted successfully"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Latest Announcements</h2>
            <p className="text-muted-foreground">Stay updated with important news</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchAnnouncements}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          {isAdmin && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="medical">
                  <Plus className="h-4 w-4" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Announcement title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Announcement content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {announcements.slice(0, 5).map((announcement) => (
          <Card key={announcement.id} className="bg-gradient-card border border-border/50 hover:shadow-hover transition-all duration-200 animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-card-foreground line-clamp-1">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(announcement.createdAt)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {announcement.author}
                    </Badge>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingAnnouncement(announcement)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon" 
                      className="h-8 w-8 hover:text-destructive"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground/80 line-clamp-3">
                {announcement.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No announcements yet</p>
        </div>
      )}
    </div>
  );
};

export default Noticeboard;