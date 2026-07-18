import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeightEntry } from '../../types';
import { formatShortDate } from '../../lib/date';

export function WeightChart({ history, goalWeightLb }: { history: WeightEntry[]; goalWeightLb: number }) {
  const data = history.map((e) => ({ date: e.date, label: formatShortDate(e.date), weight: e.weightLb }));
  const weights = data.map((d) => d.weight);
  const min = Math.min(goalWeightLb, ...weights);
  const max = Math.max(goalWeightLb, ...weights);
  const pad = Math.max(2, (max - min) * 0.15);
  const domain: [number, number] = [Math.floor(min - pad), Math.ceil(max + pad)];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--hairline)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--ink-3)' }}
            axisLine={{ stroke: 'var(--hairline)' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            domain={domain}
            allowDecimals={false}
            tickFormatter={(v: number) => `${Math.round(v)}`}
            tick={{ fontSize: 11, fill: 'var(--ink-3)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            formatter={(value) => [`${value} lb`, 'Weight']}
            labelStyle={{ color: 'var(--ink)', fontWeight: 600 }}
            contentStyle={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--hairline)',
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <ReferenceLine
            y={goalWeightLb}
            stroke="var(--status-on-track)"
            strokeDasharray="4 4"
            label={{ value: `Goal ${goalWeightLb} lb`, position: 'insideTopRight', fill: 'var(--status-on-track)', fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
