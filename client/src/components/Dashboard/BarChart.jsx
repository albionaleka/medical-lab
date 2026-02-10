const BarChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = 40;
  const barWidth = 40;
  const gap = 20;
  const width = data.length * (barWidth + gap) + 2 * padding;

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={padding}
              y1={padding + ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={padding + ratio * (height - 2 * padding)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={padding + ratio * (height - 2 * padding) + 5}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="end"
            >
              {Math.round((1 - ratio) * maxValue)}
            </text>
          </g>
        ))}

        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 2 * padding);
          const x = padding + index * (barWidth + gap);
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || "#3b82f6"}
                rx="4"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </rect>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="12"
                fill="#374151"
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - padding + 15}
                fontSize="11"
                fill="#6b7280"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
