"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Send, Copy, RefreshCw, Wand2, MessageSquare, Save, History, Eye } from "lucide-react"

export default function GeminiPage() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const templates = [
    {
      id: "disease-description",
      name: "Description de maladie",
      prompt:
        "Génère une description complète de la maladie '{disease_name}' incluant : symptômes, causes, cycle de développement, conditions favorables, et impact sur la plante.",
    },
    {
      id: "treatment-advice",
      name: "Conseils de traitement",
      prompt:
        "Propose des solutions de traitement naturelles et écologiques pour '{disease_name}' en incluant : méthodes préventives, traitements biologiques, et conseils d'application.",
    },
    {
      id: "scan-summary",
      name: "Résumé de scan",
      prompt:
        "Résume les résultats du scan : maladie détectée '{disease_name}' avec {confidence}% de confiance. Explique les symptômes visibles et donne des conseils immédiats.",
    },
    {
      id: "user-feedback",
      name: "Analyse feedback",
      prompt: "Analyse ce feedback utilisateur et propose des améliorations : '{user_feedback}'",
    },
  ]

  const recentGenerations = [
    {
      id: 1,
      type: "Description de maladie",
      input: "Mildiou de la tomate",
      date: "2024-01-30 14:30",
      preview: "Le mildiou de la tomate est une maladie fongique causée par Phytophthora infestans...",
    },
    {
      id: 2,
      type: "Conseils de traitement",
      input: "Pucerons sur rosier",
      date: "2024-01-30 12:15",
      preview: "Pour traiter les pucerons naturellement, utilisez une solution de savon noir...",
    },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    // Simulation d'appel API Gemini
    setTimeout(() => {
      const mockResponse = `# Réponse générée par Gemini AI

Basé sur votre demande : "${prompt}"

## Analyse

Cette maladie présente des caractéristiques spécifiques qui nécessitent une approche ciblée. Les symptômes observés indiquent un développement dans des conditions d'humidité élevée.

## Recommandations

### Traitement immédiat
- Application de fongicide cuivré en pulvérisation foliaire
- Amélioration de la ventilation autour des plantes
- Suppression des parties infectées

### Prévention
- Rotation des cultures sur 3-4 ans
- Éviter l'arrosage sur le feuillage
- Paillage du sol pour limiter les éclaboussures

### Solutions naturelles
- Décoction de prêle (renforce les défenses naturelles)
- Bicarbonate de soude (1 cuillère à soupe/L d'eau)
- Purin d'ortie dilué à 10%

## Suivi recommandé
Surveiller l'évolution sur 7-10 jours et renouveler le traitement si nécessaire.`

      setResponse(mockResponse)
      setIsLoading(false)
    }, 2000)
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setPrompt(template.prompt)
      setSelectedTemplate(templateId)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">API Gemini</h1>
          <p className="text-gray-600">Générez du contenu intelligent avec l'IA Gemini</p>
        </div>
        <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20">
          <Sparkles className="w-4 h-4 mr-1" />
          IA Activée
        </Badge>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Générateur</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Prompt d'entrée
                </CardTitle>
                <CardDescription>Décrivez ce que vous souhaitez générer avec Gemini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template">Modèle rapide (optionnel)</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt">Votre prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Décrivez ce que vous voulez générer..."
                    rows={8}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full bg-[#00C896] hover:bg-[#00C896]/90"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Générer avec Gemini
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <CardTitle>Réponse Gemini</CardTitle>
                  </div>
                  {response && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>Contenu généré par l'intelligence artificielle</CardDescription>
              </CardHeader>
              <CardContent>
                {response ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">{response}</pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>La réponse Gemini apparaîtra ici</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de prompts</CardTitle>
              <CardDescription>Utilisez ces modèles prédéfinis pour générer du contenu spécialisé</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="border-2 hover:border-[#00C896]/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Button size="sm" variant="outline" onClick={() => handleTemplateSelect(template.id)}>
                          Utiliser
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{template.prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Historique des générations
              </CardTitle>
              <CardDescription>Consultez vos générations précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGenerations.map((generation) => (
                  <Card key={generation.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{generation.type}</Badge>
                          <span className="text-sm text-gray-500">{generation.date}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium mb-1">Input: {generation.input}</p>
                      <p className="text-sm text-gray-600">{generation.preview}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
