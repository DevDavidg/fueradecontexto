export type SizeChart = {
  category: string;
  name: string;
  measurements: {
    size: string;
    width: number;
    length: number;
  }[];
};

export const sizeCharts: SizeChart[] = [
  {
    category: "buzos",
    name: "Buzos canguro",
    measurements: [
      { size: "1/S", width: 54, length: 66 },
      { size: "2/M", width: 56, length: 68 },
      { size: "3/L", width: 58, length: 70 },
      { size: "4/XL", width: 60, length: 72 },
      { size: "5/XXL", width: 62, length: 74 },
    ],
  },
  {
    category: "buzos",
    name: "Buzo cuello redondo",
    measurements: [
      { size: "1/S", width: 54, length: 66 },
      { size: "2/M", width: 56, length: 68 },
      { size: "3/L", width: 58, length: 70 },
      { size: "4/XL", width: 60, length: 72 },
      { size: "5/XXL", width: 62, length: 74 },
    ],
  },
  {
    category: "remeras",
    name: "Remera unisex",
    measurements: [
      { size: "S", width: 48, length: 66 },
      { size: "M", width: 51, length: 68 },
      { size: "L", width: 53, length: 70 },
      { size: "XL", width: 55, length: 72 },
      { size: "XXL", width: 57, length: 74 },
    ],
  },
];

export const getSizeChart = (
  category: string,
  productName?: string
): SizeChart | null => {
  const charts = sizeCharts.filter((chart) => chart.category === category);

  if (charts.length === 0) return null;

  if (productName) {
    const specificChart = charts.find((chart) =>
      productName.toLowerCase().includes(chart.name.toLowerCase().split(" ")[0])
    );
    if (specificChart) return specificChart;
  }

  return charts[0];
};
