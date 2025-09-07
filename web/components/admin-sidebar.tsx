"use client"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart3, Users, Camera, Brain, Bug, Smartphone, Sparkles, Settings, LogOut, Leaf, ChevronUp, User } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"

const menuItems = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Gestion des données",
    items: [
      {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Scans & Détections",
        url: "/admin/scans",
        icon: Camera,
      },
      {
        title: "Maladies & Conseils",
        url: "/admin/diseases",
        icon: Bug,
      },
    ],
  },
  {
    title: "Intelligence Artificielle",
    items: [
      {
        title: "Modèle IA",
        url: "/admin/ai-model",
        icon: Brain,
      },
      {
        title: "API Gemini",
        url: "/admin/gemini",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "App Mobile",
        url: "/admin/mobile-config",
        icon: Smartphone,
      },
      {
        title: "Paramètres",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">PhytoVigil</h2>
            <Badge className="bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20 text-xs">Admin Panel</Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'Admin User'}</span>
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
