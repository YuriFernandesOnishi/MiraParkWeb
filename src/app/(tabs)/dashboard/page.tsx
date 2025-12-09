"use client";

import { useEffect, useState } from "react";
import {
  vehicleService,
  VehicleActive,
  VehicleRecord,
} from "@/services/vehicleService";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  Cell,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import {
  Car,
  Search,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";

export default function VehicleDashboardClient() {
  const [vehicles, setVehicles] = useState<VehicleActive[]>([]);
  const [loading, setLoading] = useState(false);

  // SEARCH
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VehicleRecord | VehicleRecord[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // ENTRY/EXIT
  const [modalPlate, setModalPlate] = useState("");
  const [entryOpen, setEntryOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  async function loadVehicles(): Promise<void> {
    try {
      setLoading(true);
      const data = await vehicleService.getActiveVehicles();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  }

  async function search(): Promise<void> {
    const q = query.trim();
    if (!q) return;

    const isId = /^\d+$/.test(q);
    const isPlate = /^[A-Za-z0-9]{7}$/.test(q);

    try {
      setSearchLoading(true);

      if (isId) {
        const r = await vehicleService.getById(q);
        setResult(r);
      } else if (isPlate) {
        const r = await vehicleService.getByPlate(q.toUpperCase());
        setResult(r);
      } else {
        setResult(null);
      }
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleEntry() {
    const placa = modalPlate.trim().toUpperCase();
    if (!placa) return;

    await vehicleService.entry(placa);
    setModalPlate("");
    setEntryOpen(false);
    await loadVehicles();
  }

  async function handleExit() {
    const placa = modalPlate.trim().toUpperCase();
    if (!placa) return;

    await vehicleService.exit(placa);
    setModalPlate("");
    setExitOpen(false);
    await loadVehicles();
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  const chartData = [
    { name: "Ativos", value: vehicles.length, color: "hsl(var(--primary))" },
    { name: "Finalizados", value: 20, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Painel de Veículos
          </h1>
        </div>
        <p className="text-muted-foreground">
          Acompanhe o fluxo de veículos e registre entradas e saídas em tempo real.
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid variant="default" maxWidth="full" gap="md">

        {/* Card: Total de Veículos */}
        <BentoGridItem
          size="md"
          className="md:col-span-1"
          hoverEffect="lift"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-lg bg-primary/10">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-500">
                <TrendingUp className="w-3 h-3" />
                Ativo
              </div>
            </div>

            <div className="mt-auto">
              <div className="text-5xl font-bold mb-2">
                {loading ? "..." : vehicles.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Veículos Estacionados
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total no pátio agora
              </div>
            </div>
          </div>
        </BentoGridItem>

        {/* Card: Gráfico de Distribuição */}
        <BentoGridItem
          size="md"
          className="md:col-span-2"
          hoverEffect="lift"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-bold text-lg">Distribuição</h3>
                <p className="text-xs text-muted-foreground">Visão geral do status</p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <ChartContainer
                className="w-full h-[200px]"
                config={{
                  active: { label: "Ativos", color: "hsl(var(--primary))" },
                  inactive: { label: "Finalizados", color: "hsl(var(--muted))" },
                }}
              >
                <PieChart>
                  <ChartTooltip />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Ativos: {vehicles.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm">Finalizados: 20</span>
              </div>
            </div>
          </div>
        </BentoGridItem>

        {/* Card: Ações Rápidas */}
        <BentoGridItem
          size="md"
          className="md:col-span-1 md:row-span-2"
          hoverEffect="lift"
        >
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-1">Ações Rápidas</h3>
              <p className="text-xs text-muted-foreground">Gerenciar veículos</p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {/* Botão Adicionar */}
              <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-14 text-base font-medium group"
                    variant="default"
                  >
                    <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Adicionar Veículo
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary" />
                      Registrar Entrada
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Digite a placa (ex: ABC1D23)"
                      value={modalPlate}
                      onChange={(e) => setModalPlate(e.target.value.toUpperCase())}
                      maxLength={7}
                      className="text-lg font-mono tracking-wider"
                    />

                    <Button
                      onClick={() => void handleEntry()}
                      className="w-full"
                      size="lg"
                    >
                      Confirmar Entrada
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botão Remover */}
              <Dialog open={exitOpen} onOpenChange={setExitOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-14 text-base font-medium group"
                    variant="secondary"
                  >
                    <MinusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Remover Veículo
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MinusCircle className="w-5 h-5 text-primary" />
                      Registrar Saída
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Digite a placa (ex: ABC1D23)"
                      value={modalPlate}
                      onChange={(e) => setModalPlate(e.target.value.toUpperCase())}
                      maxLength={7}
                      className="text-lg font-mono tracking-wider"
                    />

                    <Button
                      onClick={() => void handleExit()}
                      className="w-full"
                      size="lg"
                    >
                      Confirmar Saída
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botão Buscar */}
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-14 text-base font-medium group"
                    variant="outline"
                  >
                    <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Buscar Veículo
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Buscar Veículo
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 pt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite ID ou PLACA"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        maxLength={10}
                        className="flex-1"
                      />
                      <Button onClick={() => void search()} disabled={searchLoading}>
                        {searchLoading ? "Buscando..." : "Buscar"}
                      </Button>
                    </div>

                    {/* Resultados */}
                    <div className="space-y-3 max-h-[400px] overflow-auto">
                      {result && typeof result === "object" && !Array.isArray(result) && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Car className="w-5 h-5 text-primary" />
                              </div>
                              <p className="font-bold text-2xl font-mono">{result.placa}</p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Entrada:</span>
                                <span className="font-medium">{result.dataEntrada} {result.horarioEntrada}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Saída:</span>
                                <span className="font-medium">{result.dataSaida ?? "-"} {result.horarioSaida ?? ""}</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Valor Pago:</span>
                                <span className="font-bold text-primary">{result.valorPago ?? "-"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {Array.isArray(result) && result.map((v, i) => (
                        <Card key={i}>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Car className="w-5 h-5 text-primary" />
                              </div>
                              <p className="font-bold text-2xl font-mono">{v.placa}</p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Entrada:</span>
                                <span className="font-medium">{v.dataEntrada} {v.horarioEntrada}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Saída:</span>
                                <span className="font-medium">{v.dataSaida ?? "-"} {v.horarioSaida ?? ""}</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Valor Pago:</span>
                                <span className="font-bold text-primary">{v.valorPago ?? "-"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botão Atualizar */}
              <Button
                variant="ghost"
                onClick={() => void loadVehicles()}
                className="w-full h-12 group mt-auto"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
                {loading ? "Atualizando..." : "Atualizar Lista"}
              </Button>
            </div>
          </div>
        </BentoGridItem>

        {/* Card: Lista de Veículos Ativos */}
        <BentoGridItem
          size="lg"
          className="md:col-span-2"
          hoverEffect="lift"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">Veículos Ativos</h3>
                  <p className="text-xs text-muted-foreground">Estacionados no momento</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                {vehicles.length}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-auto pr-2 max-h-[350px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Car className="w-12 h-12 mb-2 opacity-30" />
                  <p>Nenhum veículo ativo no momento</p>
                </div>
              ) : (
                vehicles.map((v, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-xl border bg-card hover:bg-accent/50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-bold font-mono tracking-wider">
                            {v.placa}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {v.dataEntrada} às {v.horarioEntrada}
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </BentoGridItem>

      </BentoGrid>
    </div>
  );
}