"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Edit, Trash2, Mail, Phone, Calendar, Activity, Crown, User } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      role: "Premium",
      status: "Actif",
      scans: 145,
      joinDate: "2024-01-15",
      lastActive: "2024-01-30",
      location: "Paris, France",
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@email.com",
      phone: "+33 6 98 76 54 32",
      role: "Gratuit",
      status: "Actif",
      scans: 67,
      joinDate: "2023-11-20",
      lastActive: "2024-01-29",
      location: "Lyon, France",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      phone: "+33 6 55 44 33 22",
      role: "Premium",
      status: "Inactif",
      scans: 203,
      joinDate: "2023-08-10",
      lastActive: "2024-01-20",
      location: "Marseille, France",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = [
    { title: "Total utilisateurs", value: users.length.toString(), icon: <User className="w-5 h-5" /> },
    {
      title: "Utilisateurs Premium",
      value: users.filter((u) => u.role === "Premium").length.toString(),
      icon: <Crown className="w-5 h-5" />,
    },
    {
      title: "Actifs ce mois",
      value: users.filter((u) => u.status === "Actif").length.toString(),
      icon: <Activity className="w-5 h-5" />,
    },
    { title: "Nouveaux ce mois", value: "12", icon: <UserPlus className="w-5 h-5" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00C896] hover:bg-[#00C896]/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>Créez un nouveau compte utilisateur</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Jean Dupont" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jean@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gratuit">Gratuit</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
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
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Gratuit">Gratuit</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>Gérez les comptes et permissions utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "Premium"
                          ? "bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.role === "Premium" && <Crown className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={user.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-1 text-gray-400" />
                      {user.scans}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      {user.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">{user.lastActive}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
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
