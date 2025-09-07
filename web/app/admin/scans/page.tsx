"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Camera, Eye, Edit, CheckCircle, XCircle, Calendar, User, Target } from "lucide-react"
import Image from "next/image"

export default function ScansPage() {
  const [scans, setScans] = useState([
    {
      id: 1,
      user: "Marie Dubois",
      image: "/placeholder.svg?height=200&width=200",
      prediction: "Mildiou de la tomate",
      confidence: 94.2,
      actualDisease: "Mildiou de la tomate",
      status: "Correct",
      date: "2024-01-30 14:30",
      feedback: "",
      expertNote: "",
    },
    {
      id: 2,
      user: "Jean Martin",
      image: "/placeholder.svg?height=200&width=200",
      prediction: "Pucerons",
      confidence: 87.5,
      actualDisease: "Pucerons",
      status: "Correct",
      date: "2024-01-30 12:15",
      feedback: "Très utile, merci !",
      expertNote: "",
    },
    {
      id: 3,
      user: "Sophie Laurent",
      image: "/placeholder.svg?height=200&width=200",
      prediction: "Rouille",
      confidence: 76.3,
      actualDisease: "Oïdium",
      status: "Incorrect",
      date: "2024-01-30 09:45",
      feedback: "La prédiction ne correspond pas",
      expertNote: "Confusion entre rouille et oïdium - améliorer le modèle",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedScan, setSelectedScan] = useState<any>(null)

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.prediction.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || scan.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = [
    { title: "Total scans", value: "24,567", icon: <Camera className="w-5 h-5" /> },
    { title: "Prédictions correctes", value: "23,145", icon: <CheckCircle className="w-5 h-5" /> },
    { title: "Prédictions incorrectes", value: "1,422", icon: <XCircle className="w-5 h-5" /> },
    { title: "Taux de précision", value: "94.2%", icon: <Target className="w-5 h-5" /> },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Correct":
        return "bg-green-100 text-green-800"
      case "Incorrect":
        return "bg-red-100 text-red-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Scans & Détections</h1>
          <p className="text-gray-600">Gérez les scans utilisateurs et validez les prédictions IA</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center text-[#00C896]">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par utilisateur ou maladie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Correct">Correct</SelectItem>
                <SelectItem value="Incorrect">Incorrect</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des scans ({filteredScans.length})</CardTitle>
          <CardDescription>Validez et corrigez les prédictions de l'IA</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Prédiction IA</TableHead>
                <TableHead>Confiance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image src={scan.image || "/placeholder.svg"} alt="Scan" fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {scan.user}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{scan.prediction}</div>
                    {scan.actualDisease !== scan.prediction && (
                      <div className="text-sm text-gray-500">Réel: {scan.actualDisease}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${getConfidenceColor(scan.confidence)}`}>{scan.confidence}%</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(scan.status)}>{scan.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      {scan.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedScan(scan)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du scan #{selectedScan?.id}</DialogTitle>
                            <DialogDescription>Analysez et corrigez la prédiction si nécessaire</DialogDescription>
                          </DialogHeader>
                          {selectedScan && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <Label>Image scannée</Label>
                                  <div className="w-full h-64 relative rounded-lg overflow-hidden border">
                                    <Image
                                      src={selectedScan.image || "/placeholder.svg"}
                                      alt="Scan"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Utilisateur</Label>
                                    <p className="text-sm font-medium">{selectedScan.user}</p>
                                  </div>
                                  <div>
                                    <Label>Date du scan</Label>
                                    <p className="text-sm">{selectedScan.date}</p>
                                  </div>
                                  <div>
                                    <Label>Prédiction IA</Label>
                                    <p className="text-sm font-medium">{selectedScan.prediction}</p>
                                  </div>
                                  <div>
                                    <Label>Score de confiance</Label>
                                    <p className={`text-sm font-medium ${getConfidenceColor(selectedScan.confidence)}`}>
                                      {selectedScan.confidence}%
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Statut actuel</Label>
                                    <Badge className={getStatusColor(selectedScan.status)}>{selectedScan.status}</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="actualDisease">Maladie réelle</Label>
                                  <Select defaultValue={selectedScan.actualDisease}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Mildiou de la tomate">Mildiou de la tomate</SelectItem>
                                      <SelectItem value="Pucerons">Pucerons</SelectItem>
                                      <SelectItem value="Oïdium">Oïdium</SelectItem>
                                      <SelectItem value="Rouille">Rouille</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="feedback">Feedback utilisateur</Label>
                                  <Textarea
                                    id="feedback"
                                    value={selectedScan.feedback}
                                    placeholder="Aucun feedback utilisateur"
                                    readOnly
                                    className="bg-gray-50"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="expertNote">Note d'expert</Label>
                                  <Textarea
                                    id="expertNote"
                                    defaultValue={selectedScan.expertNote}
                                    placeholder="Ajoutez une note d'expert..."
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Annuler</Button>
                                <Button className="bg-[#00C896] hover:bg-[#00C896]/90">Sauvegarder</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
