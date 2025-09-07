"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Settings,
  User,
  Shield,
  Database,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const [currentAdmin, setCurrentAdmin] = useState({
    name: "Admin User",
    email: "admin@phytovigil.com",
    role: "Super Admin",
    last_login: "2024-01-30 14:30:00",
  })

  const [systemSettings, setSystemSettings] = useState({
    site_name: "PhytoVigil",
    site_url: "https://phytovigil.com",
    admin_email: "admin@phytovigil.com",
    support_email: "support@phytovigil.com",
    maintenance_mode: false,
    registration_enabled: true,
    email_verification: true,
    max_file_size: 10,
    session_timeout: 30,
    backup_frequency: "daily",
    log_level: "info",
  })

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Admin Principal",
      email: "admin@phytovigil.com",
      role: "Super Admin",
      status: "Actif",
      last_login: "2024-01-30 14:30:00",
      created_at: "2024-01-01",
    },
    {
      id: 2,
      name: "Modérateur",
      email: "moderator@phytovigil.com",
      role: "Modérateur",
      status: "Actif",
      last_login: "2024-01-29 16:45:00",
      created_at: "2024-01-15",
    },
  ])

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Modérateur",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [passwordChange, setPasswordChange] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const stats = [
    { title: "Administrateurs", value: admins.length.toString(), icon: <User className="w-5 h-5" /> },
    { title: "Taille DB", value: "2.4 GB", icon: <Database className="w-5 h-5" /> },
    { title: "Dernière sauvegarde", value: "Il y a 2h", icon: <Shield className="w-5 h-5" /> },
    { title: "Uptime", value: "99.9%", icon: <Settings className="w-5 h-5" /> },
  ]

  const handleSystemSave = () => {
    console.log("Paramètres système sauvegardés:", systemSettings)
  }

  const handlePasswordChange = () => {
    if (passwordChange.new !== passwordChange.confirm) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    console.log("Mot de passe changé")
    setPasswordChange({ current: "", new: "", confirm: "" })
  }

  const createBackup = () => {
    console.log("Création de sauvegarde...")
  }

  const exportData = () => {
    console.log("Export des données...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Paramètres système</h1>
          <p className="text-gray-600">Configuration générale et gestion des administrateurs</p>
        </div>
        <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20">
          <Settings className="w-4 h-4 mr-1" />
          Configuration
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="admins">Administrateurs</TabsTrigger>
          <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configuration du site
                </CardTitle>
                <CardDescription>Paramètres généraux de l'application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_name">Nom du site</Label>
                  <Input
                    id="site_name"
                    value={systemSettings.site_name}
                    onChange={(e) => setSystemSettings({ ...systemSettings, site_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="site_url">URL du site</Label>
                  <Input
                    id="site_url"
                    value={systemSettings.site_url}
                    onChange={(e) => setSystemSettings({ ...systemSettings, site_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="admin_email">Email administrateur</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={systemSettings.admin_email}
                    onChange={(e) => setSystemSettings({ ...systemSettings, admin_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Email support</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={systemSettings.support_email}
                    onChange={(e) => setSystemSettings({ ...systemSettings, support_email: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Fonctionnalités
                </CardTitle>
                <CardDescription>Activer/désactiver les fonctionnalités</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode maintenance</Label>
                    <p className="text-xs text-gray-500">Désactiver temporairement le site</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenance_mode}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenance_mode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inscription ouverte</Label>
                    <p className="text-xs text-gray-500">Permettre les nouvelles inscriptions</p>
                  </div>
                  <Switch
                    checked={systemSettings.registration_enabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings({ ...systemSettings, registration_enabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vérification email</Label>
                    <p className="text-xs text-gray-500">Vérifier les emails à l'inscription</p>
                  </div>
                  <Switch
                    checked={systemSettings.email_verification}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, email_verification: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limites système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max_file_size">Taille max fichier (MB)</Label>
                  <Input
                    id="max_file_size"
                    type="number"
                    value={systemSettings.max_file_size}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, max_file_size: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="session_timeout">Timeout session (min)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={systemSettings.session_timeout}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, session_timeout: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="log_level">Niveau de log</Label>
                  <Select
                    value={systemSettings.log_level}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, log_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSystemSave} className="w-full bg-[#00C896] hover:bg-[#00C896]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les paramètres
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Redémarrer le système
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Changer le mot de passe
                </CardTitle>
                <CardDescription>Modifiez votre mot de passe administrateur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordChange.current}
                      onChange={(e) => setPasswordChange({ ...passwordChange, current: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new_password">Nouveau mot de passe</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordChange.new}
                    onChange={(e) => setPasswordChange({ ...passwordChange, new: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwordChange.confirm}
                    onChange={(e) => setPasswordChange({ ...passwordChange, confirm: e.target.value })}
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full bg-[#00C896] hover:bg-[#00C896]/90">
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sécurité du compte
                </CardTitle>
                <CardDescription>Informations de sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <p className="text-sm font-medium">{currentAdmin.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{currentAdmin.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Badge className="bg-[#00C896]/10 text-[#00C896]">{currentAdmin.role}</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Dernière connexion</Label>
                  <p className="text-sm text-gray-600">{currentAdmin.last_login}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gestion des administrateurs</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un administrateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvel administrateur</DialogTitle>
                  <DialogDescription>Créez un nouveau compte administrateur</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin_name">Nom complet</Label>
                    <Input
                      id="admin_name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="Nom de l'administrateur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_email">Email</Label>
                    <Input
                      id="admin_email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin_role">Rôle</Label>
                    <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Modérateur">Modérateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="admin_password">Mot de passe temporaire</Label>
                    <Input
                      id="admin_password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="Mot de passe temporaire"
                    />
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
            <CardHeader>
              <CardTitle>Liste des administrateurs</CardTitle>
              <CardDescription>Gérez les comptes administrateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            admin.role === "Super Admin"
                              ? "bg-red-100 text-red-800"
                              : admin.role === "Admin"
                                ? "bg-[#00C896]/10 text-[#00C896]"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{admin.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{admin.last_login}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {admin.role !== "Super Admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Sauvegarde automatique
                </CardTitle>
                <CardDescription>Configuration des sauvegardes automatiques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backup_frequency">Fréquence de sauvegarde</Label>
                  <Select
                    value={systemSettings.backup_frequency}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, backup_frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dernière sauvegarde</Label>
                  <p className="text-sm text-gray-600">30 janvier 2024 à 12:00</p>
                </div>
                <div className="space-y-2">
                  <Label>Prochaine sauvegarde</Label>
                  <p className="text-sm text-gray-600">31 janvier 2024 à 12:00</p>
                </div>
                <Button onClick={createBackup} className="w-full bg-[#00C896] hover:bg-[#00C896]/90">
                  <Database className="w-4 h-4 mr-2" />
                  Créer une sauvegarde maintenant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export des données
                </CardTitle>
                <CardDescription>Exportez les données du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les utilisateurs
                  </Button>
                  <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les scans
                  </Button>
                  <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les maladies
                  </Button>
                  <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
              <CardDescription>État et performances du système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version de l'application</span>
                    <span className="font-medium">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base de données</span>
                    <span className="font-medium">PostgreSQL 15.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serveur</span>
                    <span className="font-medium">Node.js 18.17.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium">15 jours 4h 32min</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilisation CPU</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilisation RAM</span>
                    <span className="font-medium">1.2 GB / 4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Espace disque</span>
                    <span className="font-medium">45 GB / 100 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connexions actives</span>
                    <span className="font-medium">127</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
