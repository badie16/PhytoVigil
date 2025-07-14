"use client"

import { useState, useEffect } from "react"
import { databaseService } from "@/services/database"
import type { PlantScan, Plant, Disease } from "@/types"

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeDatabase()
  }, [])

  const initializeDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await databaseService.init()
      setIsInitialized(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Database initialization failed")
      console.error("Database initialization error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isInitialized,
    isLoading,
    error,
    retryInit: initializeDatabase,
  }
}

export function usePlantScans() {
  const [scans, setScans] = useState<PlantScan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadScans = async (limit?: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await databaseService.getPlantScans(limit)
      setScans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scans")
      console.error("Error loading scans:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveScan = async (scan: Omit<PlantScan, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)
      const id = await databaseService.savePlantScan(scan)
      await loadScans() // Refresh the list
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scan")
      console.error("Error saving scan:", err)
      throw err
    }
  }

  const deleteScan = async (id: string) => {
    try {
      setError(null)
      await databaseService.deletePlantScan(id)
      await loadScans() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete scan")
      console.error("Error deleting scan:", err)
      throw err
    }
  }

  useEffect(() => {
    loadScans()
  }, [])

  return {
    scans,
    isLoading,
    error,
    loadScans,
    saveScan,
    deleteScan,
  }
}

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPlants = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await databaseService.getPlants()
      setPlants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plants")
      console.error("Error loading plants:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const savePlant = async (plant: Omit<Plant, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)
      const id = await databaseService.savePlant(plant)
      await loadPlants() // Refresh the list
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plant")
      console.error("Error saving plant:", err)
      throw err
    }
  }

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    try {
      setError(null)
      await databaseService.updatePlant(id, updates)
      await loadPlants() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plant")
      console.error("Error updating plant:", err)
      throw err
    }
  }

  useEffect(() => {
    loadPlants()
  }, [])

  return {
    plants,
    isLoading,
    error,
    loadPlants,
    savePlant,
    updatePlant,
  }
}

export function useDiseases() {
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDiseases = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await databaseService.getDiseases()
      setDiseases(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load diseases")
      console.error("Error loading diseases:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const searchDiseases = async (query: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await databaseService.searchDiseases(query)
      setDiseases(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search diseases")
      console.error("Error searching diseases:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDiseases()
  }, [])

  return {
    diseases,
    isLoading,
    error,
    loadDiseases,
    searchDiseases,
  }
}

export function useStats() {
  const [stats, setStats] = useState({
    totalScans: 0,
    healthyScans: 0,
    diseasedScans: 0,
    totalPlants: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await databaseService.getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
      console.error("Error loading stats:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    loadStats,
  }
}
