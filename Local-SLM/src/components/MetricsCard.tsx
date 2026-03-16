import React from 'react';

interface MetricsCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, unit, icon, description, trend }) => {
    return (
        <div className="card animate-fade-in" style={{ flex: 1, minWidth: '240px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>{label}</div>
                <div style={{ color: 'var(--primary)' }}>{icon}</div>
            </div>
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700 }}>{value}</span>
                {unit && <span style={{ color: 'var(--text-muted)', fontSize: '1rem', alignSelf: 'flex-end', paddingBottom: '6px' }}>{unit}</span>}
            </div>
            {description && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{description}</div>}
        </div>
    );
};

export default MetricsCard;
