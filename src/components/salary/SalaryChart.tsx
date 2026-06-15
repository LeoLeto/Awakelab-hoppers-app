"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SalaryEntry, type EmploymentType } from "@/lib/data/salaryData";
import { roleLabels } from "@/lib/data/sapProfiles";
import { formatCurrency, abbreviateNumber } from "@/lib/utils/formatters";

interface Props {
  data: SalaryEntry[];
  employmentType: EmploymentType;
}

export default function SalaryChart({ data, employmentType }: Props) {
  const chartData = data
    .reduce(
      (acc, entry) => {
        const label = roleLabels[entry.role] || entry.role;
        const shortLabel =
          label.length > 20 ? label.substring(0, 18) + "..." : label;
        const existing = acc.find(
          (d) => d.role === entry.role && d.seniority === entry.seniority
        );
        if (!existing) {
          if (employmentType === "permanent") {
            acc.push({
              role: entry.role,
              seniority: entry.seniority,
              name: `${shortLabel} (${entry.seniority})`,
              min: entry.salaryMin,
              max: entry.salaryMax,
              currency: entry.currency,
            });
          } else {
            acc.push({
              role: entry.role,
              seniority: entry.seniority,
              name: `${shortLabel} (${entry.seniority})`,
              min: entry.dailyRateMin || 0,
              max: entry.dailyRateMax || 0,
              currency: entry.currency,
            });
          }
        }
        return acc;
      },
      [] as {
        role: string;
        seniority: string;
        name: string;
        min: number;
        max: number;
        currency: string;
      }[]
    )
    .slice(0, 10);

  if (chartData.length === 0) return null;

  const currency = chartData[0]?.currency || "EUR";

  return (
    <Card className="border-hopper-beige/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-hopper-black flex items-center gap-2">
          Comparativa salarial
          <span className="text-xs font-normal text-hopper-black/40">
            ({employmentType === "permanent" ? "Bruto anual" : "Tarifa diaria"})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DDC9B320" />
              <XAxis
                type="number"
                tickFormatter={(v) => abbreviateNumber(v)}
                tick={{ fontSize: 11, fill: "#000A1A80" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={170}
                tick={{ fontSize: 11, fill: "#000A1A80" }}
              />
              <Tooltip
                formatter={(value) =>
                  formatCurrency(Number(value), currency)
                }
                contentStyle={{
                  borderColor: "#DDC9B3",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ fontWeight: "bold", color: "#000A1A" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) =>
                  value === "min" ? "Minimo" : "Maximo"
                }
              />
              <Bar
                dataKey="min"
                fill="#B79E80"
                radius={[0, 4, 4, 0]}
                name="min"
              />
              <Bar
                dataKey="max"
                fill="#FF1800"
                radius={[0, 4, 4, 0]}
                name="max"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
