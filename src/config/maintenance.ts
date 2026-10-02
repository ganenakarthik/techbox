export const MAINTENANCE_CONFIG = {
  enabled: true,
  title: "Scheduled Infrastructure Optimization",
  headline: "We Will Be Right Back Soon!",
  description:
    "Partsly hardware platform is undergoing a major system optimization, component catalog re-indexing, and low-cost BOM engine upgrade. Storefront operations will resume shortly.",
  estimatedReturn: "6 Days",
  // Target End Timestamp for real-time persistent countdown across refreshes
  targetEndTimeMs: new Date("2026-10-08T18:00:00+05:30").getTime(),
  whatsappNumber: "917032635858",
  whatsappDisplay: "+91 70326 35858",
  whatsappUrl: "https://wa.me/917032635858?text=Hi%20Partsly%20Ops%2C%20I%20have%20an%20urgent%20hardware%20query%20during%20maintenance",
  instagram: "@partsly.in",
  instagramUrl: "https://instagram.com/partsly.in",
  adminBypassPath: "/admin",
  services: [
    {
      title: "Cost-Optimized Hardware Projects",
      desc: "Custom project development with optimized BOM sourcing to cut hardware production costs.",
      badge: "Cost Reduction",
    },
    {
      title: "PCB & 3D Printing Prototyping",
      desc: "Fast-turn precision PCB manufacturing, assembly, and industrial 3D enclosure printing.",
      badge: "Rapid Turnaround",
    },
    {
      title: "SEO & Hardware Visibility",
      desc: "SEO optimization & digital indexing for hardware projects, components, and technical products.",
      badge: "SEO Growth",
    },
    {
      title: "Direct Component Sourcing",
      desc: "Bulk component supply with direct factory rates for microcontrollers, sensors & ICs.",
      badge: "Direct Supply",
    },
  ],
} as const;
