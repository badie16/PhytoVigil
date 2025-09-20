"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/useApi"
import { dashboardService } from "@/services/dashboard.service"
import { Activity, AlertTriangle, Bug, Camera, CheckCircle, Loader2, Target, TrendingUp, Users } from 'lucide-react'
import { useCallback } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function AdminDashboard() {
  const fetchDashboard = useCallback(
    () => dashboardService.getDashboardStats(),
    []
  )
  const { data: dashboardData, loading, error, refetch } = useApi(fetchDashboard)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#00C896]" />
          <span>Chargement du dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement: {error}</p>
          <Button onClick={refetch} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Scans totaux",
      value: dashboardData?.totalScans?.toLocaleString() || "0",
      change: "+12.5%",
      trend: "up",
      icon: <Camera className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Utilisateurs actifs",
      value: dashboardData?.totalUsers?.toLocaleString() || "0",
      change: "+8.2%",
      trend: "up",
      icon: <Users className="w-5 h-5" />,
      color: "text-[#00C896]",
      bgColor: "bg-green-50",
    },
    {
      title: "Maladies détectées",
      value: dashboardData?.totalDiseases?.toString() || "0",
      change: "+3",
      trend: "up",
      icon: <Bug className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Taux de précision",
      value: `${dashboardData?.accuracy?.toFixed(1) || "0"}%`,
      change: "+1.1%",
      trend: "up",
      icon: <Target className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme PhytoVigil</p>
        </div>
        <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20">
          <Activity className="w-4 h-4 mr-1" />
          Système opérationnel
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scans par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Scans quotidiens</CardTitle>
            <CardDescription>Nombre de scans effectués cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData?.scansByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="scans" stackId="1" stroke="#00C896" fill="#00C896" fillOpacity={0.6} />
                <Area type="monotone" dataKey="correct" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des maladies */}
        <Card>
          <CardHeader>
            <CardTitle>Maladies les plus détectées</CardTitle>
            <CardDescription>Répartition par type de maladie ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData?.diseaseDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(dashboardData?.diseaseDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution mensuelle */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>Croissance des utilisateurs et des scans</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.monthlyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#00C896" strokeWidth={3} name="Utilisateurs" />
                <Line type="monotone" dataKey="scans" stroke="#10B981" strokeWidth={3} name="Scans" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes système</CardTitle>
            <CardDescription>État du système et notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Modèle IA opérationnel</p>
                <p className="text-xs text-green-600">Dernière mise à jour: il y a 2h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Base de données synchronisée</p>
                <p className="text-xs text-blue-600">{dashboardData?.totalDiseases || 0} maladies répertoriées</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Maintenance programmée</p>
                <p className="text-xs text-orange-600">Dimanche 3h-5h</p>
              </div>
            </div>

            <Button className="w-full bg-[#00C896] hover:bg-[#00C896]/90">Voir toutes les alertes</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#00C896] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description} - {activity.time}</p>
                </div>
              </div>
            )) || (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune activité récente</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
