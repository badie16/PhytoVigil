"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Sparkles,
  Bug,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react"
import Image from "next/image"

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState([
    {
      id: 1,
      name: "Mildiou de la tomate",
      scientific_name: "Phytophthora infestans",
      description: "Maladie fongique grave affectant les tomates et pommes de terre",
      symptoms: "Taches brunes sur les feuilles, pourriture des fruits",
      treatment: "Fongicide cuivré, amélioration de la ventilation",
      prevention: "Éviter l'arrosage sur les feuilles, rotation des cultures",
      severity_level: 4,
      image_url: "/placeholder.svg?height=200&width=200",
      created_at: "2024-01-15T10:30:00Z",
      scan_count: 1234,
      detection_accuracy: 94.2,
    },
    {
      id: 2,
      name: "Pucerons",
      scientific_name: "Aphidoidea",
      description: "Insectes suceurs de sève causant des déformations",
      symptoms: "Petits insectes verts/noirs, feuilles collantes, déformation",
      treatment: "Savon noir, coccinelles, jet d'eau",
      prevention: "Plantes répulsives, surveillance régulière",
      severity_level: 2,
      image_url: "/placeholder.svg?height=200&width=200",
      created_at: "2024-01-10T14:20:00Z",
      scan_count: 987,
      detection_accuracy: 89.5,
    },
    {
      id: 3,
      name: "Oïdium",
      scientific_name: "Erysiphales",
      description: "Champignon formant un duvet blanc sur les feuilles",
      symptoms: "Poudre blanche sur les feuilles, jaunissement",
      treatment: "Bicarbonate de soude, soufre, fongicides",
      prevention: "Espacement des plants, éviter l'humidité stagnante",
      severity_level: 3,
      image_url: "/placeholder.svg?height=200&width=200",
      created_at: "2024-01-08T09:15:00Z",
      scan_count: 756,
      detection_accuracy: 91.8,
    },
  ])

  const [newDisease, setNewDisease] = useState({
    name: "",
    scientific_name: "",
    description: "",
    symptoms: "",
    treatment: "",
    prevention: "",
    severity_level: 1,
    image_url: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState<any>(null)

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || disease.severity_level.toString() === filterSeverity
    return matchesSearch && matchesSeverity
  })

  const stats = [
    { title: "Total maladies", value: diseases.length.toString(), icon: <Bug className="w-5 h-5" /> },
    {
      title: "Sévérité élevée",
      value: diseases.filter((d) => d.severity_level >= 4).length.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      title: "Détections ce mois",
      value: diseases.reduce((sum, d) => sum + d.scan_count, 0).toLocaleString(),
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      title: "Précision moyenne",
      value: `${(diseases.reduce((sum, d) => sum + d.detection_accuracy, 0) / diseases.length).toFixed(1)}%`,
      icon: <Sparkles className="w-5 h-5" />,
    },
  ]

  const generateWithGemini = async () => {
    setIsGeneratingWithAI(true)
    setTimeout(() => {
      setNewDisease({
        ...newDisease,
        treatment: `Traitement naturel recommandé pour ${newDisease.name} :
• Pulvérisation de décoction d'ail et bicarbonate (1 c. à soupe/L)
• Application matin/soir, éviter les heures chaudes
• Renforcer avec purin d'ortie dilué à 10%
• Suppression des parties infectées`,
        prevention: `Prévention efficace :
• Rotation des cultures sur 3-4 ans minimum
• Améliorer la circulation d'air entre les plants
• Éviter l'arrosage sur le feuillage
• Paillage du sol pour limiter les éclaboussures
• Surveillance hebdomadaire des premiers symptômes`,
        description: `${newDisease.name} est une maladie qui se développe particulièrement dans des conditions d'humidité élevée. Elle peut rapidement se propager et causer des dégâts importants si elle n'est pas traitée rapidement. Un diagnostic précoce est essentiel pour un traitement efficace.`,
      })
      setIsGeneratingWithAI(false)
    }, 2000)
  }

  const getSeverityColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-yellow-100 text-yellow-800"
      case 3:
        return "bg-orange-100 text-orange-800"
      case 4:
        return "bg-red-100 text-red-800"
      case 5:
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityLabel = (level: number) => {
    const labels = ["", "Très faible", "Faible", "Moyenne", "Élevée", "Critique"]
    return labels[level] || "Inconnue"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des maladies</h1>
          <p className="text-gray-600">Base de données des maladies végétales et leurs traitements</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une maladie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle maladie</DialogTitle>
              <DialogDescription>
                Remplissez les informations sur la maladie. Utilisez l'IA pour générer automatiquement les traitements.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informations de base</TabsTrigger>
                <TabsTrigger value="medical">Médical</TabsTrigger>
                <TabsTrigger value="media">Média</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom de la maladie *</Label>
                    <Input
                      id="name"
                      value={newDisease.name}
                      onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
                      placeholder="Ex: Mildiou de la tomate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scientific_name">Nom scientifique</Label>
                    <Input
                      id="scientific_name"
                      value={newDisease.scientific_name}
                      onChange={(e) => setNewDisease({ ...newDisease, scientific_name: e.target.value })}
                      placeholder="Ex: Phytophthora infestans"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="severity">Niveau de sévérité *</Label>
                  <Select
                    value={newDisease.severity_level.toString()}
                    onValueChange={(value) => setNewDisease({ ...newDisease, severity_level: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Très faible</SelectItem>
                      <SelectItem value="2">2 - Faible</SelectItem>
                      <SelectItem value="3">3 - Moyenne</SelectItem>
                      <SelectItem value="4">4 - Élevée</SelectItem>
                      <SelectItem value="5">5 - Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description générale</Label>
                  <Textarea
                    id="description"
                    value={newDisease.description}
                    onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })}
                    placeholder="Description détaillée de la maladie..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptômes *</Label>
                  <Textarea
                    id="symptoms"
                    value={newDisease.symptoms}
                    onChange={(e) => setNewDisease({ ...newDisease, symptoms: e.target.value })}
                    placeholder="Décrivez les symptômes visibles..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
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

                <div>
                  <Label htmlFor="treatment">Traitement recommandé *</Label>
                  <Textarea
                    id="treatment"
                    value={newDisease.treatment}
                    onChange={(e) => setNewDisease({ ...newDisease, treatment: e.target.value })}
                    placeholder="Solutions de traitement naturelles et chimiques..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="prevention">Mesures préventives *</Label>
                  <Textarea
                    id="prevention"
                    value={newDisease.prevention}
                    onChange={(e) => setNewDisease({ ...newDisease, prevention: e.target.value })}
                    placeholder="Mesures préventives et bonnes pratiques..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label htmlFor="image_url">Image de référence</Label>
                  <div className="space-y-2">
                    <Input
                      id="image_url"
                      value={newDisease.image_url}
                      onChange={(e) => setNewDisease({ ...newDisease, image_url: e.target.value })}
                      placeholder="URL de l'image ou chemin local"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Télécharger une image
                    </Button>
                  </div>
                  {newDisease.image_url && (
                    <div className="mt-2">
                      <div className="w-32 h-32 relative rounded-lg overflow-hidden border">
                        <Image
                          src={newDisease.image_url || "/placeholder.svg"}
                          alt="Aperçu"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline">Annuler</Button>
              <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  placeholder="Rechercher par nom ou nom scientifique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sévérités</SelectItem>
                <SelectItem value="1">Très faible</SelectItem>
                <SelectItem value="2">Faible</SelectItem>
                <SelectItem value="3">Moyenne</SelectItem>
                <SelectItem value="4">Élevée</SelectItem>
                <SelectItem value="5">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Diseases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Base de données des maladies ({filteredDiseases.length})</CardTitle>
          <CardDescription>Gérez les informations sur les maladies végétales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Maladie</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Détections</TableHead>
                <TableHead>Précision</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiseases.map((disease) => (
                <TableRow key={disease.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image
                        src={disease.image_url || "/placeholder.svg"}
                        alt={disease.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{disease.name}</div>
                      <div className="text-sm text-gray-500 italic">{disease.scientific_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(disease.severity_level)}>
                      {getSeverityLabel(disease.severity_level)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{disease.scan_count.toLocaleString()}</div>
                      <div className="text-gray-500">scans</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-green-600">{disease.detection_accuracy}%</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(disease.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDisease(disease)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de {selectedDisease?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedDisease && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Image de référence</Label>
                                  <div className="w-full h-48 relative rounded-lg overflow-hidden border">
                                    <Image
                                      src={selectedDisease.image_url || "/placeholder.svg"}
                                      alt={selectedDisease.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label>Nom scientifique</Label>
                                    <p className="text-sm italic">{selectedDisease.scientific_name}</p>
                                  </div>
                                  <div>
                                    <Label>Sévérité</Label>
                                    <Badge className={getSeverityColor(selectedDisease.severity_level)}>
                                      {getSeverityLabel(selectedDisease.severity_level)}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Statistiques</Label>
                                    <div className="text-sm space-y-1">
                                      <div>{selectedDisease.scan_count} détections</div>
                                      <div>{selectedDisease.detection_accuracy}% de précision</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <p className="text-sm text-gray-600">{selectedDisease.description}</p>
                              </div>
                              <div>
                                <Label>Symptômes</Label>
                                <p className="text-sm text-gray-600">{selectedDisease.symptoms}</p>
                              </div>
                              <div>
                                <Label>Traitement</Label>
                                <p className="text-sm text-gray-600">{selectedDisease.treatment}</p>
                              </div>
                              <div>
                                <Label>Prévention</Label>
                                <p className="text-sm text-gray-600">{selectedDisease.prevention}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
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
    </div>
  )
}
