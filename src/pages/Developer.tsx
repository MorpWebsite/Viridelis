import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Leaf, Code, Cpu, Database, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Developer = () => {
  const techStack = [
    {
      category: "Hardware",
      icon: Cpu,
      items: [
        "Arduino Uno R4 WiFi",
        "DHT11 Temperature & Humidity Sensor",
        "pH Water Sensor",
        "Water Level Sensor",
      ],
    },
    {
      category: "Software",
      icon: Code,
      items: [
        "React + TypeScript",
        "Tailwind CSS",
        "Vite Build Tool",
        "Arduino IDE",
      ],
    },
    {
      category: "Backend",
      icon: Database,
      items: [
        "Firebase Realtime Database",
        "Firebase Authentication",
        "Cloud Functions",
        "WebSocket Connection",
      ],
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
          <Link to="/menu">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Menu
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="glass-card px-4 py-2 rounded-full">
                <span className="text-accent font-semibold">About Project</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="glow-text">Developer</span> Profile
            </h1>
            <p className="text-xl text-muted-foreground">
              Tentang proyek dan teknologi yang digunakan
            </p>
          </div>

          {/* Project Overview */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">Viridelis</CardTitle>
              <CardDescription className="text-lg">
                Smart Greenhouse Monitoring & Control System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Viridelis adalah sistem monitoring dan kontrol greenhouse berbasis IoT yang dirancang 
                dengan interface modern dan futuristik. Aplikasi ini memungkinkan pengguna untuk 
                memantau kondisi lingkungan greenhouse secara real-time dan mengontrol berbagai 
                perangkat dari jarak jauh.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dengan menggunakan sensor DHT11 untuk suhu dan kelembaban, sensor pH untuk kualitas air, 
                dan sensor level air, sistem ini memberikan data akurat yang dapat diakses kapan saja 
                melalui koneksi Firebase Realtime Database.
              </p>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <div className="space-y-6 mb-8">
            {techStack.map((tech, index) => (
              <Card key={index} className="glass-card hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-xl">
                      <tech.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{tech.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {tech.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Fitur Utama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Monitoring real-time suhu, kelembaban, pH air, dan level air",
                  "Kontrol jarak jauh untuk kipas, lampu, pompa air, dan pemanas",
                  "Interface modern dengan desain futuristik",
                  "Notifikasi otomatis untuk kondisi abnormal",
                  "Integrasi dengan Arduino Uno R4 WiFi",
                  "Data tersimpan di cloud dengan Firebase",
                  "Responsive design untuk berbagai perangkat",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Developer;