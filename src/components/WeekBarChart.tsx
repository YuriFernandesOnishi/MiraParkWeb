"use client";

import { useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type VehicleRecord = {
  dataEntrada?: string;
};

const WEEK_DAYS_PT = ["S", "T", "Q", "Q", "S", "S", "D"];

function normalizeColor(input?: string): string | undefined {
  if (!input) return undefined;
  const raw = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) {
    console.warn("[WeekBarChart] cor inválida:", input);
    return undefined;
  }
  return `#${raw}`;
}

export default function WeekBarChart({
                                       records,
                                       barColor,
                                     }: {
  records: VehicleRecord[];
  barColor?: string;
}) {
  useEffect(() => {
    console.log("[WeekBarChart] records recebidos:", records);
  }, [records]);

  const color = useMemo(() => normalizeColor(barColor), [barColor]);

  const chartData = useMemo(() => {
    const counts = Array(7).fill(0);

    for (const r of records ?? []) {
      if (!r.dataEntrada) continue;
      const date = new Date(`${r.dataEntrada}T12:00:00`);
      if (Number.isNaN(date.getTime())) continue;
      const jsDay = date.getDay();
      const mondayIndex = (jsDay + 6) % 7;
      counts[mondayIndex]++;
    }

    const result = counts.map((v, i) => ({
      name: WEEK_DAYS_PT[i],
      veiculos: v,
    }));

    console.log("[WeekBarChart] chartData:", result);
    return result;
  }, [records]);

  return (
    <ChartContainer
      id="week-bar"
      config={{
        veiculos: { label: "Veículos", color },
      }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            padding={{ left: 16, right: 16 }}
          />
          <YAxis allowDecimals={false} />
          <Bar dataKey="veiculos" fill={color} />
        </BarChart>

      </ResponsiveContainer>
    </ChartContainer>
  );
}
