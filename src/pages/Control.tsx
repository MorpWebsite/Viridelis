import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import {
  Leaf,
  Fan,
  Lightbulb,
  Sprout,
  Zap,
  ArrowLeft,
  RefreshCw,
  History,
  Mic,
  Wifi,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { database } from "../lib/firebase";
import { ref, onValue, set, push } from "firebase/database";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Control = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [lastConnected, setLastConnected] = useState<string>("Belum Terhubung");
  const [listening, setListening] = useState(false);

  const [devices, setDevices] = useState({
    fans: Array(4).fill(false),
    growLights: Array(8).fill(false),
    pumps: Array(12).fill(false),
    mainLights: Array(8).fill(false),
  });

  const [controlHistory, setControlHistory] = useState<
    Array<{
      timestamp: number;
      device: string;
      action: string;
      state: boolean;
    }>
  >([]);

  // === Listener Riwayat ===
  useEffect(() => {
    const historyRef = ref(database, "controlHistory");
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.values(data).slice(-20);
        setControlHistory(historyArray as any);
      }
    });

    return () => {
      unsubscribeHistory();
    };
  }, []);

  // === Fungsi koneksi Firebase ===
const checkFirebaseConnection = async () => {
  const startTime = Date.now();
  try {
    const devicesRef = ref(database, "devices");
    const snapshot = await new Promise((resolve, reject) => {
      const unsubscribe = onValue(
        devicesRef,
        (snap) => {
          unsubscribe();
          resolve(snap);
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    });

    const data = (snapshot as any).val();
    if (data) {
      // 🔄 Ubah object ke array agar kompatibel dengan UI
      const convertToArray = (obj: any, expectedLength: number) => {
        if (!obj) return Array(expectedLength).fill(false);
        const values = Object.values(obj);
        return values.length === expectedLength
          ? values
          : Array(expectedLength)
              .fill(false)
              .map((_, i) => values[i] ?? false);
      };

      setDevices({
        fans: convertToArray(data.fans, 4),
        growLights: convertToArray(data.growlights, 8),
        pumps: convertToArray(data.pumps, 12),
        mainLights: convertToArray(data.mainlights, 8),
      });
    }

    const responseMs = Date.now() - startTime;
    setResponseTime(responseMs);
    setIsConnected(true);
    setLastConnected(new Date().toLocaleString("id-ID"));

    // ✅ update node connection di Firebase
    await set(ref(database, "connection"), {
      status: "connected",
      lastResponseTime: responseMs,
    });
  } catch (error) {
    console.error("Connection error:", error);
    setIsConnected(false);

    // ❌ update status Firebase
    await set(ref(database, "connection"), {
      status: "disconnected",
      lastResponseTime: 0,
    });
  }
};


  // === Auto-refresh koneksi setiap 10 detik ===
  useEffect(() => {
    checkFirebaseConnection();
    const interval = setInterval(() => {
      checkFirebaseConnection();
    }, 10000); // 10 detik

    return () => clearInterval(interval);
  }, []);

  // === Tombol Reconnect Manual ===
  const handleManualReconnect = async () => {
    setIsReconnecting(true);
    await checkFirebaseConnection();
    toast({
      title: isConnected ? "Koneksi Berhasil" : "Koneksi Gagal",
      description: isConnected
        ? "Terhubung kembali ke Firebase & Arduino"
        : "Tidak dapat terhubung ke Firebase",
      variant: isConnected ? "default" : "destructive",
    });
    setIsReconnecting(false);
  };

  // === Metadata Device ===
  const deviceInfo = {
    fans: {
      name: "Kipas Ventilasi",
      icon: Fan,
      gradient: "from-cyan-500/20 to-blue-500/20",
      description: "Mengatur sirkulasi udara dalam greenhouse",
    },
    growLights: {
      name: "Lampu Grow Light",
      icon: Lightbulb,
      gradient: "from-yellow-500/20 to-orange-500/20",
      description: "Memberikan cahaya tambahan untuk tanaman",
    },
    pumps: {
      name: "Pompa Air",
      icon: Sprout,
      gradient: "from-green-500/20 to-emerald-500/20",
      description: "Mengatur sistem irigasi otomatis",
    },
    mainLights: {
      name: "Lampu Utama",
      icon: Zap,
      gradient: "from-purple-500/20 to-pink-500/20",
      description: "Penerangan utama dalam ruangan greenhouse",
    },
  };

  // === Tombol Switch Manual ===
  const handleToggle = async (deviceType: keyof typeof devices, index: number) => {
    const newDevices = { ...devices };
    const newState = !newDevices[deviceType][index];
    newDevices[deviceType][index] = newState;
    const startTime = Date.now();

    try {
      await set(ref(database, `devices/${deviceType}`), newDevices[deviceType]);
      const responseMs = Date.now() - startTime;
      setResponseTime(responseMs);
      await saveToHistory(deviceType, index, newState);

      const deviceName = `${deviceInfo[deviceType].name} ${index + 1}`;
      toast({
        title: "Perangkat Diperbarui",
        description: `${deviceName} telah ${
          newState ? "diaktifkan" : "dinonaktifkan"
        }`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal memperbarui perangkat",
        variant: "destructive",
      });
    }
  };

  const saveToHistory = async (deviceType: string, index: number, state: boolean) => {
    try {
      const historyRef = ref(database, "controlHistory");
      const deviceName = `${deviceInfo[deviceType as keyof typeof devices].name} ${
        index + 1
      }`;
      await push(historyRef, {
        timestamp: Date.now(),
        device: deviceName,
        action: state ? "Aktifkan" : "Nonaktifkan",
        state: state,
      });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  // === Kontrol Suara ===
  const handleVoiceControl = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Browser Tidak Didukung",
        description: "Gunakan Google Chrome untuk kontrol suara.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      toast({
        title: "🎙️ Mendengarkan...",
        description:
          "Ucapkan: aktifkan kipas 1, matikan pompa 2, nyalakan lampu utama 3, dst.",
      });
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setListening(false);

      const deviceMap: Record<string, keyof typeof devices> = {
        kipas: "fans",
        "grow light": "growLights",
        pompa: "pumps",
        "lampu utama": "mainLights",
      };

      for (const [key, value] of Object.entries(deviceMap)) {
        if (command.includes(key)) {
          const numMatch = command.match(/\d+/);
          if (numMatch) {
            const num = parseInt(numMatch[0]) - 1;
            if (num >= 0 && num < devices[value].length) {
              const action =
                command.includes("mati") || command.includes("nonaktif")
                  ? false
                  : true;

              if (devices[value][num] !== action) {
                handleToggle(value, num);
                toast({
                  title: "Perintah Suara",
                  description: `Berhasil ${
                    action ? "mengaktifkan" : "menonaktifkan"
                  } ${key} ${num + 1}`,
                });
              } else {
                toast({
                  title: "Tidak Ada Perubahan",
                  description: `${key} ${num + 1} sudah dalam keadaan ${
                    action ? "aktif" : "nonaktif"
                  }`,
                });
              }
            }
          }
        }
      }
    };

    recognition.onerror = () => {
      setListening(false);
      toast({
        title: "Gagal Mendeteksi Suara",
        description: "Coba ulangi perintah lagi.",
        variant: "destructive",
      });
    };

    recognition.start();
  };

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

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
      {/* === Judul Halaman === */}
        <div className="text-center mt-4 mb-4">
          <h1 className="text-5xl font-bold mb-4">
            Kontrol Jarak Jauh
          </h1>
          <p className="text-muted-foreground text-lg mt-4 mb-8">
            Kendalikan perangkat greenhouse Anda secara realtime
          </p>
        </div>

        {/* --- Status koneksi di header --- */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
            <Wifi
              className={`w-4 h-4 ${
                isConnected ? "text-green-500 animate-pulse" : "text-red-500"
              }`}
            />
            <span
              className={`font-semibold ${
                isConnected ? "text-green-500" : "text-red-500"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Response: {isConnected ? `${responseTime} ms` : "Not Connected"}
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

          <Button
            size="icon"
            onClick={handleVoiceControl}
            className={`rounded-full glass-card relative ${
              listening
                ? "bg-primary/20 text-primary animate-pulse ring-2 ring-primary/40"
                : "text-foreground"
            }`}
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="control">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="control">Kontrol</TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Kontrol */}
          <TabsContent value="control">
            <div className="space-y-8">
              {Object.entries(deviceInfo).map(([key, info]) => {
                const deviceKey = key as keyof typeof devices;
                const deviceArray = devices[deviceKey];
                const activeCount = deviceArray.filter(Boolean).length;

                return (
                  <Card key={key} className="glass-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                            <div
                              className={`bg-gradient-to-br ${info.gradient} p-2 rounded-lg`}
                            >
                              <info.icon className="w-6 h-6" />
                            </div>
                            {info.name}
                          </CardTitle>
                          <CardDescription>{info.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="text-lg font-bold text-primary">
                            {activeCount}/{deviceArray.length} Aktif
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {deviceArray.map((isActive, index) => (
                          <div
                            key={index}
                            className={`glass-card p-4 rounded-lg transition-all ${
                              isActive
                                ? "border-primary/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                                : "border-border/50"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-sm">
                                #{index + 1}
                              </span>
                              <Switch
                                checked={isActive}
                                onCheckedChange={() =>
                                  handleToggle(deviceKey, index)
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {isActive ? "Aktif" : "Nonaktif"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Riwayat */}
          <TabsContent value="history">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Riwayat Kontrol
                </CardTitle>
                <CardDescription>20 aktivitas terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {controlHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada riwayat kontrol
                    </p>
                  ) : (
                    controlHistory
                      .slice()
                      .reverse()
                      .map((log, i) => (
                        <div
                          key={i}
                          className="glass-card p-4 rounded-lg flex justify-between"
                        >
                          <div>
                            <p className="font-semibold">{log.device}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString("id-ID")}
                            </p>
                          </div>
                          <span
                            className={`font-semibold ${
                              log.state
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer status koneksi */}
      <footer className="border-t border-border bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <Wifi
              className={`w-4 h-4 ${
                isConnected ? "text-green-500 animate-pulse" : "text-red-500"
              }`}
            />
            <span>
              Firebase:{" "}
              <strong
                className={isConnected ? "text-green-500" : "text-red-500"}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </strong>
            </span>
          </div>

          <div>
            Response Time:{" "}
            <strong className="text-primary">
              {isConnected ? `${responseTime} ms` : "N/A"}
            </strong>
          </div>

          <div>
            Last Connected:{" "}
            <strong className="text-foreground">{lastConnected}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Control;