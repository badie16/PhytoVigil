"use client"

import { activityService, type Activity } from "@/services/remote/activityService"
import { useCallback, useEffect, useState } from "react"

export function useActivities(limit = 10) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const loadActivities = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await activityService.getRecentActivities(limit)
            setActivities(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load activities")
            console.error("Error loading activities:", err)
        } finally {
            setLoading(false)
        }
    }, [limit])

    const refreshActivities = useCallback(async () => {
        await loadActivities()
    }, [loadActivities])

    const createActivity = useCallback(
        async (activity: Omit<Activity, "id" | "timestamp">) => {
            try {
                const newActivity = await activityService.createActivity(activity)
                setActivities((prev) => [newActivity, ...prev.slice(0, limit - 1)])
                return newActivity
            } catch (err) {
                console.error("Error creating activity:", err)
                throw err
            }
        },
        [limit],
    )

    const deleteActivity = useCallback(async (activityId: string) => {
        try {
            await activityService.deleteActivity(activityId)
            setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
        } catch (err) {
            console.error("Error deleting activity:", err)
            throw err
        }
    }, [])

    useEffect(() => {
        loadActivities()
    }, [loadActivities])

    return {
        activities,
        loading,
        error,
        refreshActivities,
        createActivity,
        deleteActivity,
    }
}

export function usePlantActivities(plantId: number, limit = 20) {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPlantActivities = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await activityService.getPlantActivities(plantId, limit)
            setActivities(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load plant activities")
            console.error("Error loading plant activities:", err)
        } finally {
            setLoading(false)
        }
    }, [plantId, limit])

    useEffect(() => {
        loadPlantActivities()
    }, [loadPlantActivities])

    return {
        activities,
        loading,
        error,
        refreshActivities: loadPlantActivities,
    }
}
