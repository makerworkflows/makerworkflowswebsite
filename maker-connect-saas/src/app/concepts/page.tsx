
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, FileText, Factory, TrendingUp, FlaskConical, ClipboardCheck, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

const modules = [
  {
    category: 'Admin & Operations',
    items: [
      {
        title: 'ProcureTrack AI',
        description: 'Automated purchasing and receiving optimization.',
        icon: ShoppingCart,
        href: '/concepts/procure-track',
        status: 'Coming Soon'
      },
      {
        title: 'InvoiceFlow Optimizer',
        description: 'AP automation with intelligent financial reporting.',
        icon: FileText,
        href: '/concepts/invoice-flow',
        status: 'Coming Soon'
      }
    ]
  },
  {
    category: 'Engineering & Production',
    items: [
      {
        title: 'MRP Smart Planner',
        description: 'AI-driven material resource planning.',
        icon: Factory,
        href: '/concepts/mrp-planner',
        status: 'Alpha'
      },
      {
        title: 'ImproveDrive',
        description: 'Continuous improvement & root-cause analysis.',
        icon: TrendingUp,
        href: '/concepts/improve-drive',
        status: 'Coming Soon'
      },
      {
        title: 'ProdSched Pro',
        description: 'Real-time production scheduling.',
        icon: Calendar,
        href: '/concepts/prod-sched',
        status: 'Planned'
      }
    ]
  },
  {
    category: 'R&D & Product Development',
    items: [
      {
        title: 'R&D Innovate Hub',
        description: 'Collaborative platform for formulation.',
        icon: FlaskConical,
        href: '/concepts/rnd-hub',
        status: 'Alpha'
      },
      {
        title: 'ProdAnalysis Pro',
        description: 'Hazard analysis & risk assessment.',
        icon: ClipboardCheck,
        href: '/concepts/prod-analysis',
        status: 'Planned'
      }
    ]
  }
];

export default function ConceptLaunchpad() {
  return (
    <div className="container mx-auto p-8 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
          Product Expansion Concepts
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the next generation of Maker Workflows tools. These modules are currently in development or concept phase.
        </p>
      </div>

      {modules.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2 text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            {section.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {item.status}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between hover:text-blue-600 p-0" asChild>
                    <Link href={item.href}>
                      Explore Concept <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
