import React from 'react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const T = {
  bg:         '#0B0C12',
  surface:    '#111318',
  raised:     '#181B24',
  border:     '#21253A',
  borderHigh: '#2E3452',
  gold:       '#F59E0B',
  goldDim:    '#D97706',
  goldFaint:  'rgba(245,158,11,0.08)',
  jade:       '#10B981',
  jadeFaint:  'rgba(16,185,129,0.1)',
  ruby:       '#EF4444',
  rubyFaint:  'rgba(239,68,68,0.1)',
  sky:        '#38BDF8',
  skyFaint:   'rgba(56,189,248,0.1)',
  text:       '#F1F5F9',
  textSub:    '#94A3B8',
  textDim:    '#475569',
};

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer border text-[11px]';

  const sizes = {
    sm: 'px-4 py-1.5',
    md: 'px-6 py-2.5',
    lg: 'px-9 py-3.5',
  };

  const variants = {
    primary:
      'bg-amber-500 text-black border-amber-500 hover:bg-amber-400 hover:border-amber-400 active:scale-[0.98]',
    ghost:
      'bg-transparent text-amber-400 border-transparent hover:bg-amber-500/10 hover:border-amber-500/20',
    outline:
      'bg-transparent text-amber-400 border-amber-500/40 hover:bg-amber-500/10 hover:border-amber-500',
    danger:
      'bg-transparent text-red-400 border-red-500/40 hover:bg-red-500/10 hover:border-red-500',
  };

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  noPad?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', glow, noPad, children, ...rest }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      boxShadow: glow ? `0 0 24px rgba(245,158,11,0.07), 0 0 1px rgba(245,158,11,0.2)` : undefined,
    }}
    className={`rounded-md transition-all duration-300 hover:border-amber-500/20 ${noPad ? '' : 'p-6'} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'gold' | 'jade' | 'ruby' | 'sky' | 'neutral' | 'info' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children }) => {
  const styles: Record<string, React.CSSProperties> = {
    gold:    { background: T.goldFaint,  color: T.gold,    border: `1px solid ${T.goldDim}40` },
    jade:    { background: T.jadeFaint,  color: T.jade,    border: `1px solid ${T.jade}40` },
    ruby:    { background: T.rubyFaint,  color: T.ruby,    border: `1px solid ${T.ruby}40` },
    sky:     { background: T.skyFaint,   color: T.sky,     border: `1px solid ${T.sky}40` },
    neutral: { background: T.raised,     color: T.textSub, border: `1px solid ${T.border}` },
    info:    { background: T.goldFaint,  color: T.gold,    border: `1px solid ${T.goldDim}40` },
    success: { background: T.jadeFaint,  color: T.jade,    border: `1px solid ${T.jade}40` },
    warning: { background: T.rubyFaint,  color: '#F59E0B', border: `1px solid #F59E0B40` },
  };
  return (
    <span
      style={styles[variant] || styles.neutral}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest ${className}`}
    >
      {children}
    </span>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...rest }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textDim }}>
          {icon}
        </div>
      )}
      <input
        style={{
          background: T.raised,
          border: `1px solid ${error ? T.ruby : T.border}`,
          color: T.text,
        }}
        className={`w-full rounded-sm py-2.5 text-sm outline-none transition-all focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/10 placeholder:text-slate-700 ${icon ? 'pl-9 pr-4' : 'px-4'} ${className}`}
        {...rest}
      />
    </div>
    {error && <p className="text-xs" style={{ color: T.ruby }}>{error}</p>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, className = '', children, ...rest }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>
        {label}
      </label>
    )}
    <select
      style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
      className={`w-full rounded-sm px-4 py-2.5 text-sm outline-none transition-all focus:border-amber-500/60 appearance-none cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </select>
  </div>
);

// ─── SectionHeading ───────────────────────────────────────────────────────────
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8">
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <div className="w-0.5 h-5 rounded-full" style={{ background: T.gold }} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: T.textSub }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-sm pl-3.5" style={{ color: T.textDim }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  accent?: 'gold' | 'jade' | 'ruby' | 'sky';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, trend, accent = 'gold' }) => {
  const accentColors: Record<string, string> = { gold: T.gold, jade: T.jade, ruby: T.ruby, sky: T.sky };
  return (
    <Card className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight" style={{ color: accentColors[accent] }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs font-medium" style={{ color: trend === 'up' ? T.jade : trend === 'down' ? T.ruby : T.textDim }}>
          {sub}
        </p>
      )}
    </Card>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string; className?: string }> = ({
  value,
  color = T.gold,
  className = '',
}) => (
  <div className={`h-1 rounded-full overflow-hidden ${className}`} style={{ background: T.border }}>
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${Math.min(100, value)}%`, background: color }}
    />
  </div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-px ${className}`} style={{ background: T.border }} />
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center"
      style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.textDim }}
    >
      <div className="w-4 h-4 rounded-full" style={{ border: `2px solid ${T.borderHigh}` }} />
    </div>
    <p className="text-sm font-semibold" style={{ color: T.textSub }}>
      {title}
    </p>
    {subtitle && <p className="text-xs max-w-xs" style={{ color: T.textDim }}>{subtitle}</p>}
    {action}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}> = ({ isOpen, onClose, title, children, width = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,12,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full ${width} rounded-md overflow-hidden`}
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors hover:bg-white/5"
              style={{ color: T.textDim }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table: React.FC<{
  headers: string[];
  children: React.ReactNode;
  className?: string;
}> = ({ headers, children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
          {headers.map((h) => (
            <th
              key={h}
              className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest first:pl-6 last:pr-6"
              style={{ color: T.textDim }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tr
    className={`transition-colors hover:bg-white/[0.015] ${className}`}
    style={{ borderBottom: `1px solid ${T.border}30` }}
  >
    {children}
  </tr>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`py-3.5 px-4 first:pl-6 last:pr-6 ${className}`} style={{ color: T.textSub }}>
    {children}
  </td>
);
