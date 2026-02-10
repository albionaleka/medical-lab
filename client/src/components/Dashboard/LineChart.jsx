const LineChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const padding = 20;
  const width = 600;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((item.value - minValue) / range) * (height - 2 * padding);
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + ratio * (height - 2 * padding)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        <path d={areaData} fill="url(#gradient)" opacity="0.2" />

        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#3b82f6"
              opacity="0"
              className="hover:opacity-20 transition-opacity cursor-pointer"
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-700"
              style={{ fontSize: "11px" }}
            >
              {point.value}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex justify-between px-5 mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-500">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
