"use client";

import { useState, useMemo } from "react";
import { Search, Filter, BarChart3, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  allSalaryData,
  filterSalaries,
  type Seniority,
  type EmploymentType,
  seniorityLabels,
} from "@/lib/data/salaryData";
import { roleLabels } from "@/lib/data/sapProfiles";
import {
  countries,
  regions,
  getCountriesByRegion,
  type Country,
} from "@/lib/data/countries";
import {
  formatSalaryRange,
  formatDailyRate,
  formatCurrency,
} from "@/lib/utils/formatters";
import SalaryChart from "./SalaryChart";

export default function SalaryExplorer() {
  const [selectedRegion, setSelectedRegion] = useState<string>("europe");
  const [selectedCountry, setSelectedCountry] = useState<string>("ES");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("all");
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("permanent");

  const availableCountries = useMemo(
    () =>
      getCountriesByRegion(
        selectedRegion as "europe" | "latam" | "usa"
      ),
    [selectedRegion]
  );

  const filteredData = useMemo(() => {
    return filterSalaries({
      country: selectedCountry || undefined,
      role: selectedRole !== "all" ? selectedRole : undefined,
      seniority:
        selectedSeniority !== "all"
          ? (selectedSeniority as Seniority)
          : undefined,
      employmentType,
    });
  }, [selectedCountry, selectedRole, selectedSeniority, employmentType]);

  const uniqueRoles = useMemo(() => {
    const rolesInCountry = allSalaryData
      .filter((e) => e.country === selectedCountry && e.employmentType === employmentType)
      .map((e) => e.role);
    return [...new Set(rolesInCountry)];
  }, [selectedCountry, employmentType]);

  const countryInfo = countries.find((c) => c.code === selectedCountry);

  const handleRegionChange = (region: string | null) => {
    if (!region) return;
    setSelectedRegion(region);
    const firstCountry = getCountriesByRegion(
      region as "europe" | "latam" | "usa"
    )[0];
    if (firstCountry) setSelectedCountry(firstCountry.code);
    setSelectedRole("all");
    setSelectedSeniority("all");
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card className="border-hopper-beige/60">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-hopper-red" />
            <span className="text-sm font-semibold text-hopper-black">
              Filtros
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Region */}
            <div>
              <label className="text-xs font-medium text-hopper-black/50 mb-1.5 block">
                Region
              </label>
              <Select
                value={selectedRegion}
                onValueChange={handleRegionChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-medium text-hopper-black/50 mb-1.5 block">
                Pais
              </label>
              <Select
                value={selectedCountry}
                onValueChange={(v) => v && setSelectedCountry(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-medium text-hopper-black/50 mb-1.5 block">
                Perfil SAP
              </label>
              <Select value={selectedRole} onValueChange={(v) => v && setSelectedRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los perfiles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role] || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seniority */}
            <div>
              <label className="text-xs font-medium text-hopper-black/50 mb-1.5 block">
                Experiencia
              </label>
              <Select
                value={selectedSeniority}
                onValueChange={(v) => v && setSelectedSeniority(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {(
                    Object.entries(seniorityLabels) as [Seniority, string][]
                  ).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employment type toggle */}
          <div className="mt-4">
            <Tabs
              value={employmentType}
              onValueChange={(v) => setEmploymentType(v as EmploymentType)}
            >
              <TabsList className="bg-hopper-beige/20">
                <TabsTrigger value="permanent">En nomina</TabsTrigger>
                <TabsTrigger value="freelance">Freelance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-hopper-black/50">
          <span className="font-semibold text-hopper-black">
            {filteredData.length}
          </span>{" "}
          resultados para{" "}
          <span className="font-medium">{countryInfo?.flag} {countryInfo?.name}</span>
        </p>
        <Badge variant="outline" className="text-xs">
          Datos actualizados: Abril 2026
        </Badge>
      </div>

      {/* Chart */}
      {filteredData.length > 0 && (
        <SalaryChart data={filteredData} employmentType={employmentType} />
      )}

      {/* Salary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((entry, i) => (
            <Card
              key={`${entry.country}-${entry.role}-${entry.seniority}-${entry.employmentType}-${i}`}
              className="border-hopper-beige/60 hover:border-hopper-murray/50 transition-all hover:shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-hopper-black text-sm">
                      {roleLabels[entry.role] || entry.role}
                    </h3>
                    <p className="text-xs text-hopper-black/40 mt-0.5">
                      {seniorityLabels[entry.seniority]}
                    </p>
                  </div>
                  {entry.certificationBonusPct && (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-green-600 bg-green-50 border-green-200"
                    >
                      +{entry.certificationBonusPct}% cert.
                    </Badge>
                  )}
                </div>

                {entry.employmentType === "permanent" ? (
                  <div>
                    <p className="text-lg font-bold text-hopper-black">
                      {formatSalaryRange(
                        entry.salaryMin,
                        entry.salaryMax,
                        entry.currency
                      )}
                    </p>
                    <p className="text-xs text-hopper-black/40 mt-1">
                      Bruto anual
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-hopper-black">
                      {entry.dailyRateMin && entry.dailyRateMax
                        ? formatDailyRate(
                            entry.dailyRateMin,
                            entry.dailyRateMax,
                            entry.currency
                          )
                        : "N/A"}
                    </p>
                    <p className="text-xs text-hopper-black/40 mt-1">
                      Tarifa diaria
                    </p>
                  </div>
                )}

                {/* Salary bar */}
                <div className="mt-3 h-2 bg-hopper-beige/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-hopper-red/60 to-hopper-red rounded-full"
                    style={{
                      width: `${Math.min(
                        ((entry.salaryMax || entry.dailyRateMax || 0) /
                          (employmentType === "permanent" ? 200000 : 1000)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <BarChart3 className="h-10 w-10 text-hopper-black/20 mx-auto mb-3" />
            <p className="text-hopper-black/50">
              No se encontraron datos para los filtros seleccionados.
            </p>
            <p className="text-sm text-hopper-black/30 mt-1">
              Prueba con un pais o perfil diferente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
