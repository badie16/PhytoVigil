export const getSeverityConfig = (level?: number) => {
    switch (level) {
        case 1:
            return {
                color: '#22C55E',          // Vert moderne et vibrant
                gradient: ['#22C55E', '#16A34A', '#15803D'],
                text: 'Très faible',
                bgColor: '#F0FDF4',
                lightBg: '#DCFCE7',
                darkColor: '#166534',
                shadowColor: 'rgba(34, 197, 94, 0.3)',
            };
        case 2:
            return {
                color: '#EAB308',          // Jaune moderne et vibrant
                gradient: ['#EAB308', '#CA8A04', '#A16207'],
                text: 'Faible',
                bgColor: '#FEFCE8',
                lightBg: '#FEF3C7',
                darkColor: '#713F12',
                shadowColor: 'rgba(234, 179, 8, 0.3)',
            };
        case 3:
            return {
                color: '#F59E0B',          // Orange chaleureux et équilibré
                gradient: ['#F59E0B', '#D97706', '#B45309'],
                text: 'Modéré',
                bgColor: '#FFFBEB',
                lightBg: '#FEF3C7',
                darkColor: '#92400E',
                shadowColor: 'rgba(245, 158, 11, 0.3)',
            };
        case 4:
            return {
                color: '#EF4444',          // Rouge vif mais pas agressif
                gradient: ['#EF4444', '#DC2626', '#B91C1C'],
                text: 'Élevé',
                bgColor: '#FEF2F2',
                lightBg: '#FECACA',
                darkColor: '#991B1B',
                shadowColor: 'rgba(239, 68, 68, 0.3)',
            };
        case 5:
            return {
                color: '#7C2D12',          // Rouge bordeaux sophistiqué
                gradient: ['#7C2D12', '#92400E', '#A16207'],
                text: 'Très élevé',
                bgColor: '#FFF7ED',
                lightBg: '#FFEDD5',
                darkColor: '#431407',
                shadowColor: 'rgba(124, 45, 18, 0.4)',
            };
        default:
            return {
                color: '#64748B',          // Gris moderne et neutre
                gradient: ['#64748B', '#475569', '#334155'],
                text: 'Inconnu',
                bgColor: '#F8FAFC',
                lightBg: '#E2E8F0',
                darkColor: '#1E293B',
                shadowColor: 'rgba(100, 116, 139, 0.2)',
            };
    }
};
