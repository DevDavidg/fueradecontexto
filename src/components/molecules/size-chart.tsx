"use client";

import * as React from "react";
import { clsx } from "clsx";
import { type SizeChart } from "@/lib/size-charts";

type SizeChartComponentProps = {
  sizeChart: SizeChart;
  className?: string;
};

export const SizeChartComponent: React.FC<SizeChartComponentProps> = ({
  sizeChart,
  className,
}) => {
  return (
    <div className={clsx("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-pink-500"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Tabla de Talles - {sizeChart.name}
        </h3>
        <p className="text-xs text-neutral-400">Medidas en centímetros (cm)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-neutral-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-neutral-800">
              <th className="border border-neutral-700 px-3 py-2 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                Talle
              </th>
              <th className="border border-neutral-700 px-3 py-2 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                Ancho
              </th>
              <th className="border border-neutral-700 px-3 py-2 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                Largo
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900/50">
            {sizeChart.measurements.map((measurement, index) => (
              <tr
                key={measurement.size}
                className={clsx(
                  "hover:bg-neutral-800/50 transition-colors",
                  index % 2 === 0 ? "bg-neutral-900/30" : "bg-neutral-900/50"
                )}
              >
                <td className="border border-neutral-700 px-3 py-2 text-sm font-medium text-white">
                  {measurement.size}
                </td>
                <td className="border border-neutral-700 px-3 py-2 text-sm text-neutral-300">
                  {measurement.width}cm
                </td>
                <td className="border border-neutral-700 px-3 py-2 text-sm text-neutral-300">
                  {measurement.length}cm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-500/20">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <div>
            <p className="text-xs text-blue-300 font-medium mb-1">Cómo medir</p>
            <p className="text-xs text-blue-200">
              <strong>Ancho:</strong> Medir de costura a costura en el pecho.{" "}
              <strong>Largo:</strong> Medir desde el hombro hasta la parte
              inferior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SizeChartComponent as SizeChart };
export default SizeChartComponent;
