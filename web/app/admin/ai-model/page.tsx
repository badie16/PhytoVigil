"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Brain,
  Upload,
  Download,
  Activity,
  FileText,
  Link,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export default function AIModelPage() {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [modelDescription, setModelDescription] = useState("")

  const currentModel = {
    name: "PhytoVigil CNN v2.1",
    version: "2.1.0",
    accuracy: 94.2,
    status: "Actif",
    lastUpdate: "2024-01-25",
    size: "45.2 MB",
    architecture: "Convolutional Neural Network",
    framework: "TensorFlow 2.14",
    classes: 156,
    trainingData: "50,000 images",
    description: "Modèle CNN optimisé pour la détection de maladies végétales avec architecture ResNet-50 modifiée.",
  }

  const modelMetrics = [
    { name: "Précision globale", value: 94.2, color: "text-green-600" },
    { name: "Rappel", value: 92.8, color: "text-blue-600" },
    { name: "F1-Score", value: 93.5, color: "text-purple-600" },
    { name: "Temps d'inférence", value: "0.3s", color: "text-orange-600" },
  ]

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/predict",
      description: "Prédiction de maladie à partir d'une image",
      example: `{
  "image": "base64_encoded_image",
  "confidence_threshold": 0.7
}`,
    },
    {
      method: "GET",
      endpoint: "/api/v1/model/info",
      description: "Informations sur le modèle actuel",
      example: `{
  "model_version": "2.1.0",
  "classes": 156,
  "accuracy": 94.2
}`,
    },
  ]

  const generateDescription = async () => {
    setIsGeneratingDescription(true)
    // Simulation d'appel Gemini
    setTimeout(() => {
      setModelDescription(`# PhytoVigil CNN v2.1 - Documentation

## Vue d'ensemble
Ce modèle de réseau de neurones convolutionnel (CNN) a été spécialement conçu pour la détection automatique des maladies végétales. Basé sur une architecture ResNet-50 modifiée, il offre une précision exceptionnelle de 94.2% sur un ensemble de test diversifié.

## Architecture technique
- **Base**: ResNet-50 pré-entraîné sur ImageNet
- **Couches personnalisées**: 3 couches denses avec dropout
- **Fonction d'activation**: ReLU pour les couches cachées, Softmax pour la sortie
- **Optimiseur**: Adam avec learning rate adaptatif

## Données d'entraînement
- **Volume**: 50,000 images haute résolution
- **Classes**: 156 types de maladies végétales
- **Augmentation**: Rotation, zoom, flip horizontal/vertical
- **Validation**: Split 80/20 avec validation croisée

## Performance
- **Précision**: 94.2% sur l'ensemble de test
- **Temps d'inférence**: 0.3 secondes par image
- **Taille du modèle**: 45.2 MB (optimisé pour mobile)

## Cas d'usage
Idéal pour l'identification rapide et précise des maladies sur diverses espèces végétales, particulièrement efficace sur les cultures maraîchères et ornementales.`)
      setIsGeneratingDescription(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Modèle IA</h1>
          <p className="text-gray-600">Gérez et surveillez votre modèle de détection des maladies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                <Upload className="w-4 h-4 mr-2" />
                Nouveau modèle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
                <DialogDescription>Téléchargez et configurez un nouveau modèle IA</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="modelName">Nom du modèle</Label>
                  <Input id="modelName" placeholder="PhytoVigil CNN v3.0" />
                </div>
                <div>
                  <Label htmlFor="modelFile">Fichier du modèle</Label>
                  <Input id="modelFile" type="file" accept=".h5,.pb,.tflite" />
                </div>
                <div>
                  <Label htmlFor="modelUrl">URL du modèle (optionnel)</Label>
                  <Input id="modelUrl" placeholder="https://example.com/model.h5" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description du modèle..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Annuler</Button>
                  <Button className="bg-[#00C896] hover:bg-[#00C896]/90">Télécharger</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Model Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#00C896]" />
                  </div>
                  <div>
                    <CardTitle>{currentModel.name}</CardTitle>
                    <CardDescription>Version {currentModel.version}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {currentModel.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Précision</p>
                  <p className="text-2xl font-bold text-green-600">{currentModel.accuracy}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Classes</p>
                  <p className="text-2xl font-bold text-gray-800">{currentModel.classes}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taille</p>
                  <p className="text-2xl font-bold text-gray-800">{currentModel.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dernière MAJ</p>
                  <p className="text-sm font-medium text-gray-800">{currentModel.lastUpdate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture</span>
                  <span className="font-medium">{currentModel.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework</span>
                  <span className="font-medium">{currentModel.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Données d'entraînement</span>
                  <span className="font-medium">{currentModel.trainingData}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classes supportées</span>
                  <span className="font-medium">{currentModel.classes} maladies</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État du système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Modèle opérationnel</p>
                    <p className="text-xs text-green-600">Prêt pour les prédictions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">API disponible</p>
                    <p className="text-xs text-blue-600">Endpoints actifs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Mise à jour disponible</p>
                    <p className="text-xs text-orange-600">Version 2.2 disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {modelMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className={`text-3xl font-bold ${metric.color}`}>
                      {typeof metric.value === "number" ? `${metric.value}%` : metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des performances</CardTitle>
              <CardDescription>Précision du modèle au fil des versions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Graphique de performance (à implémenter avec Recharts)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Endpoints API
              </CardTitle>
              <CardDescription>Intégrez le modèle IA dans vos applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={
                        endpoint.method === "POST" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                  <div>
                    <Label className="text-xs text-gray-500">Exemple de requête :</Label>
                    <pre className="text-xs bg-gray-50 p-3 rounded mt-1 overflow-x-auto">{endpoint.example}</pre>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentation du modèle
                  </CardTitle>
                  <CardDescription>Documentation technique générée automatiquement</CardDescription>
                </div>
                <Button
                  onClick={generateDescription}
                  disabled={isGeneratingDescription}
                  variant="outline"
                  className="border-[#00C896] text-[#00C896] hover:bg-[#00C896]/10 bg-transparent"
                >
                  {isGeneratingDescription ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Générer avec IA
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {modelDescription ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">{modelDescription}</pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Cliquez sur "Générer avec IA" pour créer la documentation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
