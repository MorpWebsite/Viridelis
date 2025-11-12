import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Gauge, User, Home, Leaf } from "lucide-react";

const Menu = () => {
  const menuItems = [
    {
      title: "Home",
      description: "Kembali ke halaman utama",
      icon: Home,
      link: "/",
      color: "from-primary/20 to-primary/10",
    },
    {
      title: "Real-time Monitoring",
      description: "Pantau kondisi greenhouse secara langsung",
      icon: Activity,
      link: "/monitoring",
      color: "from-accent/20 to-accent/10",
    },
    {
      title: "Remote Control",
      description: "Kontrol perangkat dari jarak jauh",
      icon: Gauge,
      link: "/control",
      color: "from-primary/20 to-primary/10",
    },
    {
      title: "Developer Profile",
      description: "Informasi tentang pengembang aplikasi",
      icon: User,
      link: "/developer",
      color: "from-accent/20 to-accent/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold glow-text">Viridelis</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="glow-text">Menu</span> Aplikasi
            </h1>
            <p className="text-xl text-muted-foreground">
              Pilih fitur yang ingin Anda gunakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <Link to={item.link} key={index}>
                <Card className="glass-card hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;