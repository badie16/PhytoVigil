// pages/plants/add/index.tsx
import AddPlantForm from '@/components/add-plant-form';
import { useRouter } from 'expo-router';

export default function AddPlantScreen() {
    const router = useRouter();
    return <AddPlantForm onSuccess={() => router.replace("/plants")} onBack={router.back} />;
}