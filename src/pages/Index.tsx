import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, Activity, Droplets, Gauge } from "lucide-react";


const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
      
      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold glow-text">Viridelis</span>
          </div>
          <div className="flex gap-4">
            <Link to="/menu">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Menu
              </Button>
            </Link>
            <Link to="/monitoring">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Monitoring
              </Button>
            </Link>
            <Link to="/control">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Control
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <div className="glass-card px-4 py-2 rounded-full">
              <span className="text-accent font-semibold">Smart Greenhouse Technology</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="glow-text">Viridelis</span>
            <br />
            <span className="text-primary">Greenhouse Monitor</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Monitor dan kontrol greenhouse Anda secara real-time dengan teknologi IoT modern. 
            Pantau suhu, kelembaban, pH air, dan level air dari mana saja.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-20">
            <Link to="/monitoring">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(74,222,128,0.3)] transition-all hover:shadow-[0_0_40px_rgba(74,222,128,0.5)]">
                <Activity className="mr-2 h-5 w-5" />
                Mulai Monitoring
              </Button>
            </Link>
            <Link to="/control">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Gauge className="mr-2 h-5 w-5" />
                Remote Control
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="glass-card p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all animate-float">
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Pantau kondisi greenhouse secara real-time dengan sensor DHT11
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all animate-float" style={{ animationDelay: "1s" }}>
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Water Management</h3>
              <p className="text-muted-foreground">
                Monitor pH dan level air untuk pertumbuhan optimal
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all animate-float" style={{ animationDelay: "2s" }}>
              <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote Control</h3>
              <p className="text-muted-foreground">
                Kontrol perangkat greenhouse dari jarak jauh dengan mudah
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 mt-20 border-t border-border">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">© 2024 Viridelis. Smart Greenhouse Monitoring System.</p>
          <Link to="/developer">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Developer Profile
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;