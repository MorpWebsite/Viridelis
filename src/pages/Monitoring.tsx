import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Leaf,
  Thermometer,
  Droplets,
  FlaskConical,
  Waves,
  ArrowLeft,
  RefreshCw,
  History,
  PlugZap,
  Timer,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { database } from "../lib/firebase";
import { ref, onValue, push, get } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Monitoring = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [sensorValues, setSensorValues] = useState({
    temperature: 0,
    humidity: 0,
    ph: 0,
    waterLevel: 0,
    lastUpdate: 0,
  });
  const [sensorHistory, setSensorHistory] = useState<
    Array<{
      timestamp: number;
      temperature: number;
      humidity: number;
      ph: number;
      waterLevel: number;
    }>
  >([]);

  // === Realtime Listener untuk data sensor ===
  useEffect(() => {
    const sensorsRef = ref(database, "sensors");
    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newValues = {
            temperature: data.temperature || 0,
            humidity: data.humidity || 0,
            ph: data.ph || 0,
            waterLevel: data.waterLevel || 0,
            lastUpdate: data.lastUpdate || Date.now(),
          };
          setSensorValues(newValues);
          setIsConnected(true);
          saveToHistory(newValues);
        }
      },
      () => setIsConnected(false)
    );

    const historyRef = ref(database, "sensorHistory");
    const unsubHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.values(data).slice(-20);
        setSensorHistory(historyArray as any);
      }
    });

    return () => {
      unsubscribe();
      unsubHistory();
    };
  }, []);

  // === Auto Refresh koneksi setiap 10 detik ===
  useEffect(() => {
    const interval = setInterval(async () => {
      const start = Date.now();
      try {
        const sensorsRef = ref(database, "sensors");
        const snapshot = await get(sensorsRef);
        if (snapshot.exists()) {
          setIsConnected(true);
          setResponseTime(Date.now() - start);
        } else {
          setIsConnected(false);
        }
      } catch {
        setIsConnected(false);
      }
    }, 10000); // 10 detik
    return () => clearInterval(interval);
  }, []);

  // === Reconnect manual ===
  const handleManualReconnect = async () => {
    setIsReconnecting(true);
    const startTime = Date.now();
    try {
      const sensorsRef = ref(database, "sensors");
      const snapshot = await get(sensorsRef);
      const responseMs = Date.now() - startTime;
      setResponseTime(responseMs);
      if (snapshot.exists()) {
        setIsConnected(true);
        const data = snapshot.val();
        setSensorValues({
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          ph: data.ph || 0,
          waterLevel: data.waterLevel || 0,
          lastUpdate: data.lastUpdate || Date.now(),
        });
        toast({
          title: "Koneksi Berhasil",
          description: "Terhubung kembali ke Firebase & Arduino",
        });
      } else {
        throw new Error("No data");
      }
    } catch {
      setIsConnected(false);
      toast({
        title: "Koneksi Gagal",
        description: "Tidak dapat terhubung ke Firebase",
        variant: "destructive",
      });
    } finally {
      setIsReconnecting(false);
    }
  };

  // === Simpan ke riwayat ===
  const saveToHistory = async (values: typeof sensorValues) => {
    try {
      const historyRef = ref(database, "sensorHistory");
      await push(historyRef, {
        timestamp: Date.now(),
        temperature: values.temperature,
        humidity: values.humidity,
        ph: values.ph,
        waterLevel: values.waterLevel,
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  // === Data untuk tampilan kartu sensor ===
  const sensorData = [
    {
      title: "Suhu",
      value: `${sensorValues.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      status:
        sensorValues.temperature >= 20 && sensorValues.temperature <= 35
          ? "Normal"
          : "Perlu Perhatian",
      color:
        sensorValues.temperature >= 20 && sensorValues.temperature <= 35
          ? "text-primary"
          : "text-red-500",
      range: "20°C - 35°C",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "Kelembaban",
      value: `${sensorValues.humidity.toFixed(0)}%`,
      icon: Droplets,
      status:
        sensorValues.humidity >= 40 && sensorValues.humidity <= 80
          ? "Optimal"
          : "Perlu Perhatian",
      color:
        sensorValues.humidity >= 40 && sensorValues.humidity <= 80
          ? "text-primary"
          : "text-red-500",
      range: "40% - 80%",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "pH Air",
      value: sensorValues.ph.toFixed(1),
      icon: FlaskConical,
      status:
        sensorValues.ph >= 6.0 && sensorValues.ph <= 7.5
          ? "Normal"
          : "Perlu Perhatian",
      color:
        sensorValues.ph >= 6.0 && sensorValues.ph <= 7.5
          ? "text-primary"
          : "text-red-500",
      range: "6.0 - 7.5",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Level Air",
      value: `${sensorValues.waterLevel.toFixed(0)}%`,
      icon: Waves,
      status: sensorValues.waterLevel >= 30 ? "Baik" : "Rendah",
      color: sensorValues.waterLevel >= 30 ? "text-primary" : "text-red-500",
      range: "30% - 100%",
      gradient: "from-teal-500/20 to-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mt-4 mb-4">
            <span className="glow-text">Monitoring Greenhouse</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-4 mb-4">
            Pantau suhu, kelembaban, pH air, dan level air secara realtime
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-primary animate-pulse" : "bg-red-500"
                }`}
              ></span>
              <span className="font-semibold">
                {isConnected ? "Live Monitoring" : "Disconnected"}
              </span>
            </div>
            <Button
              onClick={handleManualReconnect}
              disabled={isReconnecting}
              variant="outline"
              size="sm"
              className="glass-card"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isReconnecting ? "animate-spin" : ""
                }`}
              />
              Reconnect
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="realtime" className="mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="realtime">Data Realtime</TabsTrigger>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-2" /> Riwayat
              </TabsTrigger>
            </TabsList>

            {/* Realtime Data */}
            <TabsContent value="realtime">
              <div className="grid md:grid-cols-2 gap-6">
                {sensorData.map((sensor, i) => (
                  <Card
                    key={i}
                    className="glass-card hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                  >
                    <CardHeader className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-1">{sensor.title}</CardTitle>
                        <CardDescription>Rentang: {sensor.range}</CardDescription>
                      </div>
                      <div
                        className={`bg-gradient-to-br ${sensor.gradient} p-3 rounded-xl`}
                      >
                        <sensor.icon className="w-8 h-8 text-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-bold text-primary">{sensor.value}</div>
                      <div className={`text-sm font-semibold ${sensor.color}`}>
                        Status: {sensor.status}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* === STATUS KONEKSI HORIZONTAL === */}
              <Card className="glass-card mt-8">
                <CardHeader>
                  <CardTitle>Status Koneksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-start items-center gap-6 text-sm md:text-base">
                    <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                      <PlugZap className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Firebase:</span>
                      <span
                        className={`font-bold ${
                          isConnected ? "text-primary" : "text-red-500"
                        }`}
                      >
                        {isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Response Time:</span>
                      <span className="text-foreground font-bold">
                        {responseTime} ms
                      </span>
                    </div>

                    <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Last Update:</span>
                      <span className="text-foreground">
                        {sensorValues.lastUpdate
                          ? new Date(sensorValues.lastUpdate).toLocaleString("id-ID")
                          : "Waiting..."}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History */}
            <TabsContent value="history">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" /> Riwayat Sensor
                  </CardTitle>
                  <CardDescription>20 data terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {sensorHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Belum ada riwayat data
                      </p>
                    ) : (
                      sensorHistory
                        .slice()
                        .reverse()
                        .map((log, i) => (
                          <div
                            key={i}
                            className="glass-card p-4 rounded-lg flex justify-between text-sm"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {new Date(log.timestamp).toLocaleString("id-ID")}
                              </p>
                              <p className="text-muted-foreground">
                                Suhu: {log.temperature}°C | RH: {log.humidity}% | pH:{" "}
                                {log.ph} | Level: {log.waterLevel}%
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Monitoring;