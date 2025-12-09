"use client";

import { useState, useEffect } from "react";
import { Search, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { vehicleService, type VehicleActive, type VehicleRecord } from "@/services/vehicleService";
import Image from "next/image";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ModernDashboard() {
  const [vehicles, setVehicles] = useState<VehicleActive[]>([]);
  const [allRecords, setAllRecords] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedVehiclesCount, setAddedVehiclesCount] = useState(0);
  const [modalOpen, setModalOpen] = useState<"" | "entry" | "exit" | "search">("");
  const [plateInput, setPlateInput] = useState("");
  const [searchResult, setSearchResult] = useState<VehicleRecord[] | null>(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setVehicles(await vehicleService.getActiveVehicles());
      setAllRecords(await vehicleService.getByPlate(""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVehicles();
  }, []);

  const totalActive = vehicles.length;

  const handleEntry = async () => {
    if (!plateInput.trim()) return;
    try {
      await vehicleService.entry(plateInput.trim());
      await loadVehicles();
      toast.success("Entrada registrada!", {
        description: `O veículo ${plateInput.toUpperCase()} foi registrado.`,
      });
      setPlateInput("");
      setModalOpen("");
      setAddedVehiclesCount(prev => prev + 1);
    } catch {
      toast.error("Erro ao registrar entrada");
    }
  };

  const handleExit = async () => {
    if (!plateInput.trim()) return;
    try {
      await vehicleService.exit(plateInput.trim());
      await loadVehicles();
      toast.success("Saída registrada!", {
        description: `O veículo ${plateInput.toUpperCase()} saiu do pátio.`,
      });
      setPlateInput("");
      setModalOpen("");
    } catch {
      toast.error("Erro ao registrar saída");
    }
  };

  const handleSearch = async () => {
    if (!plateInput.trim()) return;
    try {
      const input = plateInput.trim();
      if (/^\d+$/.test(input)) {
        const r = await vehicleService.getById(input);
        setSearchResult(r ? [r] : []);
        return;
      }
      const list = await vehicleService.getByPlate(input);
      setSearchResult(list);
    } catch {
      setSearchResult([]);
    }
  };

  const closeModal = () => {
    setModalOpen("");
    setPlateInput("");
    setSearchResult(null);
  };

  const chartData = [
    { name: "Segunda", veiculos: 12 },
    { name: "Terça", veiculos: 18 },
    { name: "Quarta", veiculos: 8 },
    { name: "Quinta", veiculos: 22 },
    { name: "Sexta", veiculos: 15 },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <header className="border-b bg-card sticky top-0 z-10 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <section className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="Logo MiraPark" className="w-12 h-12" width={12} height={12} />
            <div>
              <h1 className="text-2xl font-bold">MiraPark</h1>
              <p className="text-sm text-muted-foreground">Dashboard de Controle</p>
            </div>
          </section>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void loadVehicles()}
            aria-label="Recarregar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </nav>
      </header>
      <section className="max-w-7xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Veículos Ativos</CardTitle>
              <Badge>Ativos</Badge>
            </CardHeader>
            <CardContent>
              <h2 className="text-4xl font-bold">{totalActive}</h2>
              <p className="text-muted-foreground">No pátio agora</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Entradas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="chart-entradas"
                config={{ veiculos: { color: "#6366F1", label: "Veículos" } }}
              >
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="veiculos" fill="#6366F1" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Saídas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="chart-saidas"
                config={{ veiculos: { color: "#EF4444", label: "Veículos" } }}
              >
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="veiculos" fill="#EF4444" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Veículos Adicionados</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-4xl font-bold">{addedVehiclesCount}</h2>
              <p className="text-muted-foreground">Por você nesta seção</p>
            </CardContent>
          </Card>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Veículos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 max-h-[500px] overflow-y-auto">
                {vehicles.map((v, i) => (
                  <li key={i}>
                    <Card className="p-4 hover:bg-muted transition">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-mono text-lg font-bold">{v.placa}</p>
                          <span className="text-muted-foreground text-sm">
                            {v.dataEntrada} às {v.horarioEntrada}
                          </span>
                        </div>
                        <Badge variant="outline">Ativo</Badge>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setModalOpen("entry")}>
                  <PlusCircle className="w-5 h-5 mr-2" /> Registrar Entrada
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => setModalOpen("exit")}>
                  <MinusCircle className="w-5 h-5 mr-2" /> Registrar Saída
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setModalOpen("search")}>
                  <Search className="w-5 h-5 mr-2" /> Buscar Histórico
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </section>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full animate-in fade-in-0 zoom-in-95 border shadow-xl">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                {modalOpen === "entry" && "Registrar Entrada"}
                {modalOpen === "exit" && "Registrar Saída"}
                {modalOpen === "search" && "Buscar Histórico"}
              </CardTitle>
              <Button size="icon" variant="ghost" onClick={closeModal} className="hover:bg-muted">
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Digite placa ou ID"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-wider"
                autoFocus
              />
              {modalOpen === "entry" && (
                <Button className="w-full" onClick={() => void handleEntry()}>Registrar Entrada</Button>
              )}
              {modalOpen === "exit" && (
                <Button className="w-full" variant="destructive" onClick={() => void handleExit()}>Registrar Saída</Button>
              )}
              {modalOpen === "search" && (
                <Button className="w-full" variant="secondary" onClick={() => void handleSearch()}>Buscar</Button>
              )}
              {searchResult && (
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2 bg-muted/20">
                  {searchResult.length === 0 ? (
                    <p className="text-center text-muted-foreground">Nenhum registro encontrado.</p>
                  ) : (
                    <ul className="space-y-3">
                      {searchResult.map((r, i) => (
                        <li key={i} className="p-3 border rounded-lg bg-background shadow-sm">
                          <p className="font-mono font-bold">{r.placa}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
