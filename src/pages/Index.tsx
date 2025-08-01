import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Noticeboard from "@/components/Noticeboard";
import Chatbot from "@/components/Chatbot";
import AuthModal from "@/components/AuthModal";
import RoleBasedRedirect from "@/components/RoleBasedRedirect";

interface User {
  id: string;
  role: string;
  // Add other user properties as needed
}

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('afya-user');
    const savedToken = localStorage.getItem('afya-token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('afya-user');
        localStorage.removeItem('afya-token');
      }
    }
  }, []);

  const handleGetStartedClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('afya-token');
    localStorage.removeItem('afya-user');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Role-based redirect */}
      {/* <RoleBasedRedirect user={currentUser} /> */}
     
      
      
      {/* Navigation */}
      <Navbar onGetStartedClick={handleGetStartedClick} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6">
              AfyaSmart Connect
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Complete Hospital Management System - From Registration to Recovery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-medical text-white hover:shadow-hover transition-all duration-300"
                onClick={handleGetStartedClick}
              >
                Get Started Today
              </Button>
             
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-gradient-card p-8 rounded-2xl shadow-medical max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Complete Healthcare Ecosystem</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-3 group">
                <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-primary font-bold text-2xl">👨‍⚕️</span>
                </div>
                <h3 className="font-semibold text-foreground">Multi-Role Access</h3>
                <p className="text-sm text-muted-foreground">
                  Doctors, Patients, Admin, Reception, Pharmacy & more
                </p>
              </div>
              <div className="space-y-3 group">
                <div className="w-16 h-16 bg-accent-light rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-accent font-bold text-2xl">🏥</span>
                </div>
                <h3 className="font-semibold text-foreground">Full Patient Flow</h3>
                <p className="text-sm text-muted-foreground">
                  From registration to pharmacy dispensing
                </p>
              </div>
              <div className="space-y-3 group">
                <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-primary font-bold text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-foreground">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track appointments, billing, and performance
                </p>
              </div>
              <div className="space-y-3 group">
                <div className="w-16 h-16 bg-accent-light rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-accent font-bold text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-foreground">Secure & Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  HIPAA compliant with role-based access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Flow Section */}
        <section className="mb-12 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Patient Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track patients seamlessly through every department from check-in to pharmacy
            </p>
          </div>
          <div className="grid md:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {[
              { name: "Reception", icon: "🏥", desc: "Patient check-in & registration" },
              { name: "Triage", icon: "📋", desc: "Initial assessment & prioritization" },
              { name: "Doctor", icon: "👨‍⚕️", desc: "Consultation & diagnosis" },
              { name: "Lab/Radiology", icon: "🔬", desc: "Tests & imaging" },
              { name: "Billing", icon: "💳", desc: "Payment processing" },
              { name: "Pharmacy", icon: "💊", desc: "Medication dispensing" }
            ].map((dept, index) => (
              <div key={dept.name} className="relative">
                <div className="bg-card border rounded-lg p-4 text-center hover:shadow-hover transition-all duration-300">
                  <div className="text-3xl mb-2">{dept.icon}</div>
                  <h3 className="font-medium text-foreground mb-1">{dept.name}</h3>
                  <p className="text-xs text-muted-foreground">{dept.desc}</p>
                </div>
                {index < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-primary transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Noticeboard Section */}
        <section className="animate-slide-up">
          <Noticeboard isAdmin={currentUser?.role === 'admin'} />
        </section>
      </main>

      {/* Persistent Chatbot */}
      <Chatbot userId={currentUser?.id} />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
