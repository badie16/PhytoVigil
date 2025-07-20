import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [networkInfo, setNetworkInfo] = useState<NetInfoState | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected && state.isInternetReachable !== false);
            setNetworkInfo(state);
        });

        // Fetch initial state
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected && state.isInternetReachable !== false);
            setNetworkInfo(state);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return {
        isConnected,
        networkInfo,
    };
};
