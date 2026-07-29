import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './TrendChart.css';

// Shared sparkline-style trend chart for glucose/blood-pressure readings —
// styled after the Lamplight Pulse signature (amber trace on a quiet grid).
export const TrendChart = ({ data, lines, xKey = 'label', height = 220 }) => {
  if (!data?.length) return null;

  return (
    <div className="trend-chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: 'var(--color-ink-soft)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-soft)' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-dusk)',
              border: 'none',
              borderRadius: 12,
              color: 'var(--color-parchment)',
              fontSize: 13,
            }}
            labelStyle={{ color: 'var(--color-lamplight-dim)' }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
