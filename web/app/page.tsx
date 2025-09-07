"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Brain,
  Shield,
  Cloud,
  History,
  Lightbulb,
  CloudSun,
  Download,
  Mail,
  Star,
  CheckCircle,
  Leaf,
  Play,
  ArrowRight,
  Smartphone,
  Zap,
  Users,
  Award,
  Globe,
  ChevronDown,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const screenshots = [
    {
      title: "Scan Intelligent",
      description: "Prenez une photo et obtenez un diagnostic instantané",
      image: "/placeholder.svg?height=600&width=300&text=Scan+Screen",
    },
    {
      title: "Résultats Détaillés",
      description: "Analyse complète avec niveau de confiance",
      image: "/placeholder.svg?height=600&width=300&text=Results+Screen",
    },
    {
      title: "Conseils Personnalisés",
      description: "Solutions naturelles générées par IA",
      image: "/placeholder.svg?height=600&width=300&text=Advice+Screen",
    },
    {
      title: "Historique & Suivi",
      description: "Suivez l'évolution de vos plantes",
      image: "/placeholder.svg?height=600&width=300&text=History+Screen",
    },
  ]

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Scan IA Ultra-Rapide",
      description: "Diagnostic en moins de 3 secondes avec 94.2% de précision",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0ms",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Intelligence Artificielle Avancée",
      description: "CNN entraîné sur 50,000+ images de maladies végétales",
      gradient: "from-purple-500 to-pink-500",
      delay: "100ms",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Solutions Écologiques",
      description: "Traitements naturels générés par Gemini AI",
      gradient: "from-green-500 to-emerald-500",
      delay: "200ms",
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Synchronisation Cloud",
      description: "Vos données sauvegardées et synchronisées partout",
      gradient: "from-orange-500 to-red-500",
      delay: "300ms",
    },
    {
      icon: <History className="w-8 h-8" />,
      title: "Historique Intelligent",
      description: "Suivez l'évolution et les progrès de vos plantes",
      gradient: "from-indigo-500 to-purple-500",
      delay: "400ms",
    },
    {
      icon: <CloudSun className="w-8 h-8" />,
      title: "Météo Intégrée",
      description: "Conseils adaptés aux conditions météorologiques",
      gradient: "from-yellow-500 to-orange-500",
      delay: "500ms",
    },
  ]

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Jardinière Passionnée",
      avatar: "/placeholder.svg?height=60&width=60&text=MD",
      content:
        "PhytoVigil a révolutionné ma façon de jardiner ! En quelques secondes, je sais exactement ce qui ne va pas avec mes plantes. L'IA est impressionnante de précision.",
      rating: 5,
      verified: true,
    },
    {
      name: "Jean-Pierre Martin",
      role: "Agriculteur Bio",
      avatar: "/placeholder.svg?height=60&width=60&text=JPM",
      content:
        "Un outil indispensable pour l'agriculture moderne. Les solutions naturelles proposées sont parfaites pour mon exploitation bio. Je recommande vivement !",
      rating: 5,
      verified: true,
    },
    {
      name: "Sophie Laurent",
      role: "Paysagiste Professionnelle",
      avatar: "/placeholder.svg?height=60&width=60&text=SL",
      content:
        "Mes clients sont bluffés par la rapidité et la précision des diagnostics. PhytoVigil est devenu mon assistant personnel pour tous mes projets.",
      rating: 5,
      verified: true,
    },
  ]

  const stats = [
    { value: "200+", label: "Espèces Supportées", icon: <Leaf className="w-6 h-6" /> },
    { value: "94.2%", label: "Précision IA", icon: <Target className="w-6 h-6" /> },
    { value: "50K+", label: "Utilisateurs Actifs", icon: <Users className="w-6 h-6" /> },
    { value: "1M+", label: "Scans Effectués", icon: <BarChart3 className="w-6 h-6" /> },
  ]

  const pricingPlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour débuter",
      features: ["10 scans par jour", "Base de données de 50 maladies", "Conseils de base", "Support communautaire"],
      popular: false,
      gradient: "from-gray-500 to-gray-600",
    },
    {
      name: "Premium",
      price: "9.99€",
      period: "/mois",
      description: "Pour les passionnés",
      features: [
        "Scans illimités",
        "200+ maladies répertoriées",
        "Conseils IA personnalisés",
        "Historique complet",
        "Support prioritaire",
        "Météo intégrée",
      ],
      popular: true,
      gradient: "from-[#00C896] to-emerald-600",
    },
    {
      name: "Pro",
      price: "29.99€",
      period: "/mois",
      description: "Pour les professionnels",
      features: [
        "Tout Premium inclus",
        "API d'intégration",
        "Rapports détaillés",
        "Support 24/7",
        "Formation personnalisée",
        "Licence commerciale",
      ],
      popular: false,
      gradient: "from-purple-500 to-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      {/* Header avec animation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00C896] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  PhytoVigil
                </h1>
                <p className="text-xs text-gray-500">Powered by AI</p>
              </div>
            </div>

            <nav
              className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-200 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
              }`}
            >
              <Link href="#features" className="text-gray-600 hover:text-[#00C896] transition-colors relative group">
                Fonctionnalités
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00C896] transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-[#00C896] transition-colors relative group">
                Tarifs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00C896] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-[#00C896] transition-colors relative group"
              >
                Témoignages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00C896] transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gradient-to-r from-[#00C896] to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section Ultra-Moderne */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#00C896]/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu textuel */}
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-[#00C896]/10 to-emerald-500/10 text-[#00C896] border-[#00C896]/20 px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  IA de Nouvelle Génération
                </Badge>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                    La santé de vos plantes
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00C896] to-emerald-600 bg-clip-text text-transparent animate-pulse">
                    par Intelligence
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Artificielle
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Révolutionnez vos soins végétaux avec notre IA ultra-précise. Diagnostic instantané, solutions
                  naturelles personnalisées, et suivi intelligent de vos plantes.
                </p>
              </div>

              {/* Statistiques en temps réel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105 ${
                      isVisible ? "animate-in slide-in-from-bottom-5" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-[#00C896] mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00C896] to-emerald-600 hover:from-[#00C896]/90 hover:to-emerald-600/90 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Télécharger Gratuitement
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#00C896]/30 text-[#00C896] hover:bg-[#00C896]/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm bg-white/50 hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Voir la Démo
                </Button>
              </div>

              {/* Indicateurs de confiance */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C896] to-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">+50K utilisateurs satisfaits</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Screenshots d'app avec carousel animé */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              }`}
            >
              <div className="relative max-w-sm mx-auto">
                {/* Effets de fond */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00C896] to-emerald-600 rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[3rem] blur-3xl opacity-10 animate-pulse delay-1000"></div>

                {/* Mockup de téléphone */}
                <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Barre de statut */}
                    <div className="bg-black h-8 rounded-t-[2.5rem] flex items-center justify-center">
                      <div className="w-20 h-1 bg-white rounded-full"></div>
                    </div>

                    {/* Contenu de l'écran */}
                    <div className="relative h-[600px] overflow-hidden">
                      {screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-700 ${
                            index === currentScreenshot
                              ? "translate-x-0 opacity-100"
                              : index < currentScreenshot
                                ? "-translate-x-full opacity-0"
                                : "translate-x-full opacity-0"
                          }`}
                        >
                          <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex flex-col">
                            <div className="text-center mb-6">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{screenshot.title}</h3>
                              <p className="text-sm text-gray-600">{screenshot.description}</p>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              <Image
                                src={screenshot.image || "/placeholder.svg"}
                                alt={screenshot.title}
                                width={200}
                                height={300}
                                className="rounded-2xl shadow-lg"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indicateurs de carousel */}
                <div className="flex justify-center mt-6 gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreenshot(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentScreenshot ? "bg-[#00C896] scale-125" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Section Fonctionnalités avec animations au scroll */}
      <section id="features" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#00C896]/10 to-emerald-500/10 text-[#00C896] border-[#00C896]/20 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Fonctionnalités Avancées
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Tout ce dont vous avez besoin
              <br />
              <span className="bg-gradient-to-r from-[#00C896] to-emerald-600 bg-clip-text text-transparent">
                pour des plantes parfaites
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une suite complète d'outils alimentés par l'IA pour diagnostiquer, traiter et prévenir les maladies
              végétales avec une précision inégalée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 hover:scale-105 animate-in slide-in-from-bottom-8`}
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#00C896] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-[#00C896] group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-sm font-medium">En savoir plus</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Démo Interactive */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Voyez PhytoVigil
              <span className="bg-gradient-to-r from-[#00C896] to-emerald-600 bg-clip-text text-transparent">
                {" "}
                en action
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment notre IA révolutionne le diagnostic des maladies végétales
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-black rounded-3xl p-8 shadow-2xl">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm ml-4">PhytoVigil AI Demo</span>
                </div>

                <div className="bg-white rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#00C896] to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Démo Interactive</h3>
                    <p className="text-gray-600 mb-6">
                      Cliquez pour voir comment PhytoVigil analyse une feuille malade en temps réel
                    </p>
                    <Button className="bg-gradient-to-r from-[#00C896] to-emerald-600 hover:from-[#00C896]/90 hover:to-emerald-600/90 text-white px-8 py-3 rounded-xl">
                      Lancer la Démo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tarifs Moderne */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#00C896]/10 to-emerald-500/10 text-[#00C896] border-[#00C896]/20 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Tarifs Transparents
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Choisissez votre
              <span className="bg-gradient-to-r from-[#00C896] to-emerald-600 bg-clip-text text-transparent">
                {" "}
                formule
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des plans adaptés à tous les besoins, du jardinier amateur au professionnel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  plan.popular
                    ? "scale-105 bg-gradient-to-br from-white to-green-50 ring-2 ring-[#00C896]/20"
                    : "bg-white hover:scale-105"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-[#00C896] to-emerald-600 text-white px-4 py-1 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Plus Populaire
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#00C896] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#00C896] to-emerald-600 hover:from-[#00C896]/90 hover:to-emerald-600/90 text-white shadow-lg hover:shadow-xl"
                        : "border-2 border-gray-200 text-gray-700 hover:border-[#00C896] hover:text-[#00C896] bg-white"
                    }`}
                  >
                    {plan.name === "Gratuit" ? "Commencer Gratuitement" : "Choisir ce Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Toutes les formules incluent :</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00C896]" />
                Sécurité garantie
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00C896]" />
                Disponible partout
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00C896]" />
                Mises à jour gratuites
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages avec animations */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#00C896]/10 to-emerald-500/10 text-[#00C896] border-[#00C896]/20 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Témoignages
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Ce que disent nos
              <span className="bg-gradient-to-r from-[#00C896] to-emerald-600 bg-clip-text text-transparent">
                {" "}
                utilisateurs
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 hover:scale-105 animate-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00C896] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final avec animation */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#00C896] to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à révolutionner
            <br />
            vos soins végétaux ?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à PhytoVigil pour maintenir leurs plantes en
            parfaite santé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-white text-[#00C896] hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Télécharger Maintenant
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm bg-white/10 hover:scale-105 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contacter l'Équipe
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm text-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Gratuit à télécharger
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Aucune carte requise
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Support 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Footer Moderne */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00C896] to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PhytoVigil</h3>
                  <p className="text-sm text-gray-400">Powered by AI</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                L'intelligence artificielle au service de la santé végétale. Révolutionnez vos soins avec notre
                technologie de pointe.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#00C896] transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#00C896] transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#00C896] transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Produit</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Intégrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Tutoriels
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Entreprise</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                &copy; {new Date().getFullYear()} PhytoVigil. Tous droits réservés.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <Link href="#" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Conditions
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
