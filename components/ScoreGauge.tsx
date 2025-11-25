import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'lg';
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 'sm' }) => {
  // Brand colors: High = Green, Med = Orange, Low = Red
  const fill = score >= 90 ? '#10B981' : score >= 60 ? '#F59E0B' : '#DC2626';
  const data = [{ name: 'score', value: score, fill }];
  
  const chartSize = size === 'lg' ? 180 : 100;
  const fontSize = size === 'lg' ? 'text-5xl' : 'text-2xl';
  const barSize = size === 'lg' ? 15 : 8;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: chartSize, height: chartSize }}>
        <RadialBarChart 
          width={chartSize} 
          height={chartSize} 
          cx={chartSize / 2} 
          cy={chartSize / 2} 
          innerRadius="75%" 
          outerRadius="100%" 
          barSize={barSize} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#333333' }}
            dataKey="value"
            cornerRadius={30}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`font-black tracking-tighter text-white ${fontSize}`}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mt-3 text-center">{label}</span>
    </div>
  );
};

export default ScoreGauge;