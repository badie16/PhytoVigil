import { Plant, PlantScan } from '@/types';
import { AlertCircle, Apple, Carrot, CheckCircle, Flower, HelpCircle, Leaf, Sprout, TreeDeciduous } from 'lucide-react-native';
export class PlantUtils {
    static PLANT_TYPES = [
        { id: 'vegetable', label: 'Vegetable', icon: Leaf, color: '#10B981' },
        { id: 'fruit', label: 'Fruit', icon: Apple, color: '#F59E0B' },
        { id: 'flower', label: 'Flower', icon: Flower, color: '#EC4899' },
        { id: 'herb', label: 'Herb', icon: Leaf, color: '#8B5CF6' },
    ];

    static COMMON_VARIETIES = {
        vegetable: ['Tomato', 'Lettuce', 'Carrot', 'Pepper', 'Cucumber', 'Spinach'],
        fruit: ['Apple', 'Orange', 'Banana', 'Strawberry', 'Grape', 'Lemon'],
        flower: ['Rose', 'Tulip', 'Sunflower', 'Daisy', 'Lily', 'Orchid'],
        herb: ['Basil', 'Mint', 'Rosemary', 'Thyme', 'Parsley', 'Cilantro'],
    };
    static getPlantIcon = (type: string, color = "#fff", size = 18) => {
        const t = type.toLowerCase();
        if (["vegetable", "legume", "cereal", "grain"].includes(t)) {
            return <Carrot size={size} color={color} />;
        }
        if (["fruit", "citrus", "banana", "cherry"].includes(t)) {
            return <Apple size={size} color={color} />;
        }
        if (["herb", "aromatic", "sprout"].includes(t)) {
            return <Sprout size={size} color={color} />;
        }
        if (["flower"].includes(t)) {
            return <Flower size={size} color={color} />;
        }
        if (["tree", "palm", "forest"].includes(t)) {
            return <TreeDeciduous size={size} color={color} />;
        }
        return <Leaf size={size} color={color} />;
    };

    static getStatusIcon = (status: PlantScan['status']) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle size={20} color="#10B981" />;
            case 'diseased':
                return <AlertCircle size={20} color="#EF4444" />;
            case 'unknown':
                return <HelpCircle size={20} color="#6B7280" />;
            default:
                return <HelpCircle size={20} color="#6B7280" />;
        }
    }
    static getHealthBackground = (health: Plant['health'] | PlantScan['status']) => {
        switch (health) {
            case 'healthy':
                return '#F0FDF4';
            case 'warning':
                return '#FFFBEB';
            case 'diseased':
                return '#FEF2F2';
            default:
                return '#F9FAFB';
        }
    };
    static getHealthColor(health: Plant['health'] | PlantScan['status']) {
        switch (health) {
            case 'healthy':
                return '#10B981'; // vert
            case 'warning':
                return '#F59E0B'; // orange
            case 'danger':
            case 'diseased':
                return '#EF4444'; // rouge
            case 'unknown':
            case 'not scanned':
            default:
                return '#6B7280'; // gris
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
    static getHealthLabel(health: Plant['health'] | PlantScan['status']) {
        switch (health) {
            case 'healthy':
                return 'Healthy';
            case 'warning':
                return 'Needs Care';
            case 'danger':
            case 'diseased':
                return 'Critical';
            case 'unknown':
                return 'Unknown';
            case 'not scanned':
                return 'Not Scanned';
            default:
                return 'Unknown';
        }
    }


    static getConfidenceColor = (confidence: number): string => {
        if (confidence >= 80) return '#10B981'; // Green
        if (confidence >= 60) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    static getConfidenceLabel = (confidence: number): string => {
        if (confidence >= 80) return 'High Confidence';
        if (confidence >= 60) return 'Medium Confidence';
        return 'Low Confidence';
    };
    static getHealthColorWithAlpha(hex: string, alpha: number): string {
        const [r, g, b] = this.hexToRgb(hex);
        console.log(`rgba(${r}, ${g}, ${b}, ${alpha})`)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    static hexToRgb(hex: string): [number, number, number] {
        const sanitized = hex.replace('#', '');
        const bigint = parseInt(sanitized, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }

}
