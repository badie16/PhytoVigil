import { Plant } from '@/types';
export class PlantUtils {
    static getHealthColor(health: Plant['health']) {
        switch (health) {
            case 'healthy':
                return '#10B981';
            case 'warning':
                return '#F59E0B';
            case 'danger':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    }
    static getHealthGradient(health: Plant['health']) {
        switch (health) {
            case 'healthy':
                return ['#10B981', '#059669'];
            case 'warning':
                return ['#F59E0B', '#D97706'];
            case 'danger':
                return ['#EF4444', '#DC2626'];
            default:
                return ['#6B7280', '#4B5563'];
        }
    }
    static getHealthLabel(health: Plant['health']) {
        switch (health) {
            case 'healthy':
                return 'Healthy';
            case 'warning':
                return 'Needs Care';
            case 'danger':
                return 'Critical';
            default:
                return 'Unknown';
        }
    }
}

