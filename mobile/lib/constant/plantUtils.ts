import { Plant, PlantScan } from '@/types';
export class PlantUtils {
    static getHealthColor(health: Plant['health'] | PlantScan['status']) {
        switch (health) {
            case 'healthy':
                return '#10B981';
            case 'warning':
                return '#F59E0B';
            case 'diseased':
                return '#EF4444';
            case 'unknown':
                return '#6B7280';
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

    static formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    static formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
}
