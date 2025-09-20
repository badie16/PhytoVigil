"use client"

import type { ApiError, ApiResponse } from "@/lib/api-client"
import { useCallback, useEffect, useState } from "react"

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  { immediate = true, onSuccess, onError }: UseApiOptions = {}
) {
  const [data, setData] = useState<T>([] as T)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiCall()
      console.log("API Response:", response)
      if (response.success && response.data !== undefined) {
        setData(response.data)
        onSuccess?.(response.data)
      } else {
        const errorMessage = response.error || "Une erreur est survenue"
        setError(errorMessage)
        onError?.({ message: errorMessage, status: 0 })
      }
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.message || "Une erreur est survenue"
      setError(errorMessage)
      onError?.(apiError)
    } finally {
      setLoading(false)
    }
  }, [apiCall, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, refetch: execute, execute, setData }
}



// Hook spécialisé pour les listes avec pagination
export function usePaginatedApi<T>(apiCall: (params: any) => Promise<ApiResponse<T[]>>, initialParams: any = {}) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [params, setParams] = useState(initialParams)

  const fetchData = useCallback(
    async (newParams?: any) => {
      try {
        setLoading(true)
        setError(null)

        const finalParams = { ...params, ...newParams }
        const response = await apiCall(finalParams)

        if (response.success && response.data) {
          setData(response.data)
          if (response.pagination) {
            setPagination(response.pagination)
          }
        } else {
          setError(response.error || "Une erreur est survenue")
        }
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message || "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    },
    [apiCall, params],
  )

  const updateParams = useCallback(
    (newParams: any) => {
      setParams((prev) => ({ ...prev, ...newParams }))
      fetchData(newParams)
    },
    [fetchData],
  )

  const goToPage = useCallback(
    (page: number) => {
      updateParams({ page })
    },
    [updateParams],
  )

  const changeLimit = useCallback(
    (limit: number) => {
      updateParams({ page: 1, limit })
    },
    [updateParams],
  )

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changeLimit,
    refresh,
  }
}

// Hook pour les mutations (create, update, delete)
export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: ApiError, variables: TVariables) => void
  } = {},
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setLoading(true)
        setError(null)

        const response = await mutationFn(variables)

        if (response.success && response.data !== undefined) {
          options.onSuccess?.(response.data, variables)
          return { success: true, data: response.data }
        } else {
          const errorMessage = response.error || "Une erreur est survenue"
          setError(errorMessage)
          options.onError?.({ message: errorMessage, status: 0 }, variables)
          return { success: false, error: errorMessage }
        }
      } catch (err) {
        const apiError = err as ApiError
        const errorMessage = apiError.message || "Une erreur est survenue"
        setError(errorMessage)
        options.onError?.(apiError, variables)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, options],
  )

  return {
    mutate,
    loading,
    error,
  }
}
