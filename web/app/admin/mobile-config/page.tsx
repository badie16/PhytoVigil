"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Smartphone,
  Bell,
  MessageSquare,
  Settings,
  Save,
  Plus,
  Edit,
  Trash2,
  Send,
  Globe,
  Shield,
  Zap,
  Target,
} from "lucide-react"

export default function MobileConfigPage() {
  const [appConfig, setAppConfig] = useState({
    app_name: "PhytoVigil",
    version: "2.1.0",
    min_confidence_threshold: 0.7,
    max_scan_per_day: 50,
    enable_notifications: true,
    enable_location: true,
    enable_offline_mode: true,
    default_language: "fr",
    theme: "auto",
  })

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouveau conseil disponible",
      message: "Découvrez nos derniers conseils pour protéger vos plantes",
      type: "info",
      enabled: true,
      schedule: "weekly",
    },
    {
      id: 2,
      title: "Rappel d'arrosage",
      message: "N'oubliez pas d'arroser vos plantes aujourd'hui",
      type: "reminder",
      enabled: true,
      schedule: "daily",
    },
    {
      id: 3,
      title: "Mise à jour disponible",
      message: "Une nouvelle version de PhytoVigil est disponible",
      type: "update",
      enabled: true,
      schedule: "on_demand",
    },
  ])

  const [dynamicContent, setDynamicContent] = useState([
    {
      id: 1,
      type: "tip",
      title: "Conseil du jour",
      content: "Arrosez vos plantes tôt le matin pour éviter l'évaporation",
      priority: 1,
      enabled: true,
      target_audience: "all",
    },
    {
      id: 2,
      type: "alert",
      title: "Alerte météo",
      content: "Risque de gel cette nuit, protégez vos plantes sensibles",
      priority: 3,
      enabled: true,
      target_audience: "premium",
    },
  ])

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    schedule: "weekly",
  })

  const [newContent, setNewContent] = useState({
    type: "tip",
    title: "",
    content: "",
    priority: 1,
    target_audience: "all",
  })

  const stats = [
    { title: "Utilisateurs actifs", value: "8,432", icon: <Smartphone className="w-5 h-5" /> },
    { title: "Notifications envoyées", value: "24,567", icon: <Bell className="w-5 h-5" /> },
    { title: "Taux d'ouverture", value: "78.5%", icon: <MessageSquare className="w-5 h-5" /> },
    { title: "Version actuelle", value: appConfig.version, icon: <Settings className="w-5 h-5" /> },
  ]

  const handleConfigSave = () => {
    // Simulation de sauvegarde
    console.log("Configuration sauvegardée:", appConfig)
  }

  const sendTestNotification = (notification: any) => {
    // Simulation d'envoi de notification test
    console.log("Notification test envoyée:", notification)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configuration Mobile</h1>
          <p className="text-gray-600">Gérez les paramètres et le contenu de l'application mobile</p>
        </div>
        <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20">
          <Smartphone className="w-4 h-4 mr-1" />
          App v{appConfig.version}
        </Badge>
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

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Paramètres App</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="content">Contenu Dynamique</TabsTrigger>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration générale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration générale
                </CardTitle>
                <CardDescription>Paramètres principaux de l'application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="app_name">Nom de l'application</Label>
                  <Input
                    id="app_name"
                    value={appConfig.app_name}
                    onChange={(e) => setAppConfig({ ...appConfig, app_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={appConfig.version}
                    onChange={(e) => setAppConfig({ ...appConfig, version: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Langue par défaut</Label>
                  <Select
                    value={appConfig.default_language}
                    onValueChange={(value) => setAppConfig({ ...appConfig, default_language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select
                    value={appConfig.theme}
                    onValueChange={(value) => setAppConfig({ ...appConfig, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Paramètres IA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Paramètres IA
                </CardTitle>
                <CardDescription>Configuration du modèle de détection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Seuil de confiance minimum: {appConfig.min_confidence_threshold}</Label>
                  <Slider
                    value={[appConfig.min_confidence_threshold]}
                    onValueChange={(value) => setAppConfig({ ...appConfig, min_confidence_threshold: value[0] })}
                    max={1}
                    min={0.1}
                    step={0.05}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Prédictions en dessous de ce seuil seront marquées comme incertaines
                  </p>
                </div>
                <div>
                  <Label>Scans maximum par jour: {appConfig.max_scan_per_day}</Label>
                  <Slider
                    value={[appConfig.max_scan_per_day]}
                    onValueChange={(value) => setAppConfig({ ...appConfig, max_scan_per_day: value[0] })}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Limite pour les utilisateurs gratuits</p>
                </div>
              </CardContent>
            </Card>

            {/* Fonctionnalités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Fonctionnalités
                </CardTitle>
                <CardDescription>Activer/désactiver les fonctionnalités</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-xs text-gray-500">Envoyer des notifications aux utilisateurs</p>
                  </div>
                  <Switch
                    checked={appConfig.enable_notifications}
                    onCheckedChange={(checked) => setAppConfig({ ...appConfig, enable_notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Géolocalisation</Label>
                    <p className="text-xs text-gray-500">Permettre la localisation des scans</p>
                  </div>
                  <Switch
                    checked={appConfig.enable_location}
                    onCheckedChange={(checked) => setAppConfig({ ...appConfig, enable_location: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode hors ligne</Label>
                    <p className="text-xs text-gray-500">Fonctionnement sans connexion internet</p>
                  </div>
                  <Switch
                    checked={appConfig.enable_offline_mode}
                    onCheckedChange={(checked) => setAppConfig({ ...appConfig, enable_offline_mode: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleConfigSave} className="w-full bg-[#00C896] hover:bg-[#00C896]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder la configuration
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Globe className="w-4 h-4 mr-2" />
                  Publier les changements
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Tester la configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gestion des notifications</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une notification</DialogTitle>
                  <DialogDescription>Configurez une nouvelle notification push</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notif_title">Titre</Label>
                    <Input
                      id="notif_title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      placeholder="Titre de la notification"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notif_message">Message</Label>
                    <Textarea
                      id="notif_message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      placeholder="Contenu de la notification"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newNotification.type}
                        onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="reminder">Rappel</SelectItem>
                          <SelectItem value="update">Mise à jour</SelectItem>
                          <SelectItem value="alert">Alerte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fréquence</Label>
                      <Select
                        value={newNotification.schedule}
                        onValueChange={(value) => setNewNotification({ ...newNotification, schedule: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuelle</SelectItem>
                          <SelectItem value="on_demand">À la demande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-[#00C896] hover:bg-[#00C896]/90">Créer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge
                          className={
                            notification.type === "alert"
                              ? "bg-red-100 text-red-800"
                              : notification.type === "reminder"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {notification.type}
                        </Badge>
                        <Badge variant="outline">{notification.schedule}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={notification.enabled} />
                      <Button size="sm" variant="outline" onClick={() => sendTestNotification(notification)}>
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contenu dynamique</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau contenu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter du contenu</DialogTitle>
                  <DialogDescription>Créez du contenu dynamique pour l'application</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newContent.type}
                        onValueChange={(value) => setNewContent({ ...newContent, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tip">Conseil</SelectItem>
                          <SelectItem value="alert">Alerte</SelectItem>
                          <SelectItem value="news">Actualité</SelectItem>
                          <SelectItem value="promo">Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priorité</Label>
                      <Select
                        value={newContent.priority.toString()}
                        onValueChange={(value) => setNewContent({ ...newContent, priority: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Basse</SelectItem>
                          <SelectItem value="2">Normale</SelectItem>
                          <SelectItem value="3">Élevée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content_title">Titre</Label>
                    <Input
                      id="content_title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      placeholder="Titre du contenu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_text">Contenu</Label>
                    <Textarea
                      id="content_text"
                      value={newContent.content}
                      onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                      placeholder="Texte du contenu"
                    />
                  </div>
                  <div>
                    <Label>Audience cible</Label>
                    <Select
                      value={newContent.target_audience}
                      onValueChange={(value) => setNewContent({ ...newContent, target_audience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les utilisateurs</SelectItem>
                        <SelectItem value="free">Utilisateurs gratuits</SelectItem>
                        <SelectItem value="premium">Utilisateurs premium</SelectItem>
                        <SelectItem value="new">Nouveaux utilisateurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-[#00C896] hover:bg-[#00C896]/90">Créer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {dynamicContent.map((content) => (
                  <div key={content.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{content.title}</h4>
                        <Badge
                          className={
                            content.type === "alert"
                              ? "bg-red-100 text-red-800"
                              : content.type === "tip"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {content.type}
                        </Badge>
                        <Badge variant="outline">Priorité {content.priority}</Badge>
                        <Badge variant="outline">{content.target_audience}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{content.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={content.enabled} />
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Déploiement et mise à jour</CardTitle>
              <CardDescription>Gérez les versions et déploiements de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Version de développement</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">v2.2.0-dev</Badge>
                      <p className="text-xs text-gray-500 mt-2">En cours de développement</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Version de test</h4>
                      <Badge className="bg-blue-100 text-blue-800">v2.1.5-beta</Badge>
                      <p className="text-xs text-gray-500 mt-2">Tests en cours</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Version production</h4>
                      <Badge className="bg-green-100 text-green-800">v2.1.0</Badge>
                      <p className="text-xs text-gray-500 mt-2">Actuellement déployée</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-[#00C896] hover:bg-[#00C896]/90">
                  <Globe className="w-4 h-4 mr-2" />
                  Déployer en production
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer notification de mise à jour
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Rollback vers version précédente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
