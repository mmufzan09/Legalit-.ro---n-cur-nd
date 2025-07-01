import React from "react";
import { Shield, FileText, CarFront, AlertTriangle, Briefcase, Heart, Copyright, UserCheck } from "lucide-react";
import { Feature } from "@/components/FeatureCard";

export const features: Feature[] = [
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Declarație pe propria răspundere",
    description: "Pentru utilizatorii ocazionali care au nevoie de clarificări privind documentele juridice.",
    position: "top-8 left-4",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50/80"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Analiză Detaliată",
    description: "Primește o analiză juridică detaliată a documentelor tale, evidențiind drepturi, obligații și potențiale probleme.",
    position: "top-8 right-4",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50/80"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Contestație amendă",
    description: "Generează o contestație pentru o amendă primită.",
    position: "top-32 left-8",
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-50/80"
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Reclamație protecția consumatorului",
    description: "Creează o reclamație pentru protecția drepturilor consumatorului.",
    position: "top-32 right-8",
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-50/80"
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Contract de închiriere",
    description: "Creează un contract de închiriere personalizat pentru proprietatea ta.",
    position: "bottom-32 left-8",
    color: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-50/80"
  },
  {
    icon: <CarFront className="w-6 h-6" />,
    title: "Contract vânzare-cumpărare auto",
    description: "Creează un contract pentru vânzarea sau cumpărarea unui autovehicul.",
    position: "bottom-32 right-8",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50/80"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Cerere de divorț",
    description: "Pregătește documentele necesare pentru divorț.",
    position: "bottom-8 left-4",
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-50/80"
  },
  {
    icon: <Copyright className="w-6 h-6" />,
    title: "Înregistrare marcă",
    description: "Pregătește documentele pentru înregistrarea unei mărci.",
    position: "bottom-8 right-4",
    color: "from-teal-600 to-teal-800",
    bgColor: "bg-teal-50/80"
  }
];
