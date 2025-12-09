import api from "./api";

export type VehicleActive = {
  placa: string;
  dataEntrada: string;
  horarioEntrada: string;
};

export type VehicleRecord = {
  placa: string;
  dataEntrada: string;
  horarioEntrada: string;
  dataSaida?: string;
  horarioSaida?: string;
  valorPago?: number;
};

export type DefaultResponse = {
  mensagem: string;
};

export const vehicleService = {
  getById: async (id: string): Promise<VehicleRecord> => {
    const res = await api.get<VehicleRecord>(`/api/veiculos/id/${id}`);
    return res.data;
  },

  getByPlate: async (placa: string): Promise<VehicleRecord[]> => {
    const res = await api.get<VehicleRecord[]>(`/api/veiculos/placa/${placa}`);
    return res.data;
  },

  getActiveVehicles: async (): Promise<VehicleActive[]> => {
    const res = await api.get<VehicleActive[]>(`/api/veiculos`);
    return res.data;
  },

  entry: async (placa: string): Promise<DefaultResponse> => {
    const res = await api.post<DefaultResponse>(`/api/veiculos/entrada`, { placa });
    return res.data;
  },

  exit: async (placa: string): Promise<DefaultResponse> => {
    const res = await api.put<DefaultResponse>(`/api/veiculos/saida`, { placa });
    return res.data;
  },
};
