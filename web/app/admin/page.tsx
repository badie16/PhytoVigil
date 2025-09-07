"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, Bug, BarChart3, Sparkles, Leaf, ArrowLeft, Save, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [diseases, setDiseases] = useState([
    {
      id: 1,
      name: "Mildiou de la tomate",
      category: "Champignon",
      severity: "Élevée",
      symptoms: "Taches brunes sur les feuilles",
      treatment: "Fongicide cuivré",
      status: "Actif",
    },
    {
      id: 2,
      name: "Pucerons",
      category: "Insecte",
      severity: "Moyenne",
      symptoms: "Petits insectes verts sur les tiges",
      treatment: "Savon noir dilué",
      status: "Actif",
    },
  ])

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie@example.com",
      role: "Utilisateur",
      scans: 45,
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean@example.com",
      role: "Premium",
      scans: 128,
      joinDate: "2023-11-20",
    },
  ])

  const [newDisease, setNewDisease] = useState({
    name: "",
    category: "",
    severity: "",
    symptoms: "",
    treatment: "",
    prevention: "",
    description: "",
  })

  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)

  const generateWithGemini = async () => {
    setIsGeneratingWithAI(true)
    // Simulation d'appel API Gemini
    setTimeout(() => {
      setNewDisease({
        ...newDisease,
        treatment:
          "Traitement naturel recommandé : Pulvérisation de décoction d'ail et de bicarbonate de soude (1 cuillère à soupe pour 1L d'eau). Appliquer le matin ou le soir, éviter les heures chaudes.",
        prevention:
          "Prévention : Assurer une bonne circulation d'air, éviter l'arrosage sur les feuilles, rotation des cultures, paillage du sol.",
        description:
          "Cette maladie fongique se développe dans des conditions d'humidité élevée. Elle peut rapidement se propager et causer des dégâts importants si elle n'est pas traitée rapidement.",
      })
      setIsGeneratingWithAI(false)
    }, 2000)
  }

  const stats = [
    { title: "Utilisateurs totaux", value: "12,543", icon: <Users className="w-5 h-5" /> },
    { title: "Maladies répertoriées", value: "156", icon: <Bug className="w-5 h-5" /> },
    { title: "Scans ce mois", value: "8,921", icon: <BarChart3 className="w-5 h-5" /> },
    { title: "Précision IA", value: "94.2%", icon: <Sparkles className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#00C896] transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour au site
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">PhytoVigil Admin</h1>
              </div>
            </div>
            <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20">Interface d'administration</Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content */}
        <Tabs defaultValue="diseases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseases">Gestion des maladies</TabsTrigger>
            <TabsTrigger value="users">Gestion des utilisateurs</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>

          {/* Diseases Management */}
          <TabsContent value="diseases" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Maladies des plantes</CardTitle>
                    <CardDescription>Gérez la base de données des maladies et leurs traitements</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une maladie
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle maladie</DialogTitle>
                        <DialogDescription>
                          Remplissez les informations sur la maladie. Utilisez l'IA pour générer automatiquement les
                          traitements et préventions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nom de la maladie</Label>
                            <Input
                              id="name"
                              value={newDisease.name}
                              onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
                              placeholder="Ex: Mildiou de la tomate"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Catégorie</Label>
                            <Select
                              value={newDisease.category}
                              onValueChange={(value) => setNewDisease({ ...newDisease, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Champignon">Champignon</SelectItem>
                                <SelectItem value="Bactérie">Bactérie</SelectItem>
                                <SelectItem value="Virus">Virus</SelectItem>
                                <SelectItem value="Insecte">Insecte</SelectItem>
                                <SelectItem value="Carence">Carence nutritionnelle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="severity">Niveau de sévérité</Label>
                          <Select
                            value={newDisease.severity}
                            onValueChange={(value) => setNewDisease({ ...newDisease, severity: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la sévérité" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Faible">Faible</SelectItem>
                              <SelectItem value="Moyenne">Moyenne</SelectItem>
                              <SelectItem value="Élevée">Élevée</SelectItem>
                              <SelectItem value="Critique">Critique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="symptoms">Symptômes</Label>
                          <Textarea
                            id="symptoms"
                            value={newDisease.symptoms}
                            onChange={(e) => setNewDisease({ ...newDisease, symptoms: e.target.value })}
                            placeholder="Décrivez les symptômes visibles..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newDisease.description}
                            onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })}
                            placeholder="Description détaillée de la maladie..."
                          />
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Traitement et prévention</h4>
                            <Button
                              onClick={generateWithGemini}
                              disabled={isGeneratingWithAI || !newDisease.name}
                              variant="outline"
                              size="sm"
                              className="border-[#00C896] text-[#00C896] hover:bg-[#00C896]/10 bg-transparent"
                            >
                              {isGeneratingWithAI ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                              )}
                              Générer avec IA
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="treatment">Traitement recommandé</Label>
                              <Textarea
                                id="treatment"
                                value={newDisease.treatment}
                                onChange={(e) => setNewDisease({ ...newDisease, treatment: e.target.value })}
                                placeholder="Solutions de traitement naturelles..."
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label htmlFor="prevention">Prévention</Label>
                              <Textarea
                                id="prevention"
                                value={newDisease.prevention}
                                onChange={(e) => setNewDisease({ ...newDisease, prevention: e.target.value })}
                                placeholder="Mesures préventives..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline">Annuler</Button>
                          <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead>Symptômes</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diseases.map((disease) => (
                      <TableRow key={disease.id}>
                        <TableCell className="font-medium">{disease.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{disease.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              disease.severity === "Élevée"
                                ? "bg-red-100 text-red-800"
                                : disease.severity === "Moyenne"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {disease.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{disease.symptoms}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#00C896]/10 text-[#00C896]">{disease.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>Gérez les comptes utilisateurs et leurs permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Scans</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.role === "Premium" ? "bg-[#00C896]/10 text-[#00C896]" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.scans}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scans par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique des scans mensuels
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maladies les plus détectées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Mildiou de la tomate</span>
                      <Badge>1,234 détections</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pucerons</span>
                      <Badge>987 détections</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Oïdium</span>
                      <Badge>756 détections</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
