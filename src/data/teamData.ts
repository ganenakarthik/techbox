export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tag: string;
  domain: string;
  bio: string;
  focus: string;
  background: string;
  image: string;
  stat: string;
  statLabel: string;
  skills: string[];
}

export const TECHBOX_TEAM: TeamMember[] = [
  {
    id: "vara-prasad",
    name: "Vara Prasad",
    role: "Founder & Chief Executive Officer",
    tag: "Founder & CEO",
    domain: "Executive Leadership",
    bio: "Hardware innovator and visionary. Founded TechBox to eliminate the hurdles college students face with counterfeit sensors, delayed PCB fab, and chaotic project vivas.",
    focus: "Overall Platform Vision, Strategic Industry Partnerships & University Ecosystem Infrastructure.",
    background: "Electronics & Embedded Systems Visionary • Infrastructure Architect",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    stat: "500+ Projects",
    statLabel: "Enabled Nationwide",
    skills: ["System Architecture", "Hardware Strategy", "Campus Network", "Product Vision"],
  },
  {
    id: "mallikarjun",
    name: "Mallikarjun",
    role: "Co-Founder & Head of Hardware",
    tag: "Co-Founder & Hardware",
    domain: "Hardware & Prototyping",
    bio: "Leads rapid hardware fabrication, double-layer PCB manufacturing, precision 3D-printed enclosure tolerances, and bench-tested prototype assembly.",
    focus: "Rapid PCB DFM Checks, Precision 3D Enclosure Tooling & Soldered Prototype Testing.",
    background: "Co-Founder • Hardware Architect & Prototyping Lead",
    image: "/team/mallikarjun-portrait.png",
    stat: "100%",
    statLabel: "Bench Tested Prototypes",
    skills: ["PCB Manufacturing", "Additive 3D CAD", "Hardware Assembly", "DFM Review"],
  },
  {
    id: "nageswara-rao",
    name: "Nageshwara Rao",
    role: "Chief Operating Officer",
    tag: "Chief Operating Officer",
    domain: "Operations & Logistics",
    bio: "Directs end-to-end platform operations, university courier networks, express distributor sourcing, and 24–48h hostel gate delivery fulfillment across engineering institutes.",
    focus: "Logistics Velocity, Express Campus Dispatch Runners & Supply Chain Quality Control.",
    background: "Chief Operating Officer • Logistics & Supply Chain Strategist",
    image: "/team/nageswara-rao.png",
    stat: "24–48h",
    statLabel: "Campus Delivery Standard",
    skills: ["Logistics Automation", "Distributor Sourcing", "Campus Runners", "Fulfillment QA"],
  },
  {
    id: "karthik",
    name: "Karthik",
    role: "Tech Lead & System Architecture",
    tag: "Tech Lead",
    domain: "Systems Architecture",
    bio: "Architect of the core TechBox platform, algorithmic BOM analyzer engine, and automated firmware validation testbenches.",
    focus: "Automated BOM Identification, Firmware Kernels & Embedded Tooling Pipelines.",
    background: "Systems Architect • Firmware & Embedded Core Lead",
    image: "/team/karthik-suit.png",
    stat: "5-Stage",
    statLabel: "BOM Analysis Pipeline",
    skills: ["Firmware Dev", "BOM Parsing", "Embedded C/C++", "System Testing"],
  },
  {
    id: "bhanu",
    name: "Bhanu",
    role: "Software Engineering Lead",
    tag: "Software Lead",
    domain: "Full-Stack Software",
    bio: "Full-stack engineer crafting the interactive 4-tier build configurator, real-time order tracking, and high-performance web platform.",
    focus: "Interactive 4-Tier Configurator Engine, Real-time WebSockets & Glassmorphic UI Architecture.",
    background: "Full-Stack Engineer • Frontend Architecture & React Systems",
    image: "/team/bhanu.png",
    stat: "Sub-100ms",
    statLabel: "Configurator Interaction",
    skills: ["Next.js & React 19", "Framer Motion", "Tailwind CSS", "State Architecture"],
  },
  {
    id: "kundhan",
    name: "Kundhan",
    role: "Software Engineer",
    tag: "Core Software",
    domain: "Backend & Systems",
    bio: "Builds backend inventory microservices, dynamic quotation pipelines, and high-speed catalog search algorithms.",
    focus: "Prisma ORM Ledger, Database Scalability & Instant Catalog Search Indexing.",
    background: "Distributed Systems & Cloud Microservices Engineer",
    image: "/team/kundhan.png",
    stat: "50+ SKUs",
    statLabel: "Live Synchronized Inventory",
    skills: ["PostgreSQL & Prisma", "API Microservices", "Search Indexing", "Quote Calculation"],
  },
  {
    id: "lokesh",
    name: "Lokesh",
    role: "Hardware & Prototyping Engineer",
    tag: "Hardware Engineer",
    domain: "Hardware QA & Lab",
    bio: "Conducts PCB fabrication QA, sensor bench calibration, oscilloscope testing, and custom 3D enclosure tolerances.",
    focus: "Bench Oscilloscope Pin Testing, Sensor Calibration & Mechanical Tolerance Checks.",
    background: "Hardware QA Specialist • Mechatronics & Rapid Prototyping",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    stat: "0%",
    statLabel: "Counterfeit Tolerance",
    skills: ["Oscilloscope QA", "Sensor Calibration", "Soldering Inspection", "Tolerance Testing"],
  },
  {
    id: "nikrosh",
    name: "Nikrosh",
    role: "Marketing & Growth Lead",
    tag: "Marketing Lead",
    domain: "Growth & Community",
    bio: "Drives campus ambassador programs, student hardware community building, hackathon sponsorships, and social outreach.",
    focus: "Campus Ambassador Network, Hardware Hackathons & Student Community Engagement.",
    background: "Growth Strategist • Engineering Community Builder",
    image: "/team/nikrosh-portrait.png",
    stat: "10,000+",
    statLabel: "Student Community Reach",
    skills: ["Campus Growth", "Hackathons", "Ambassador Program", "Community Building"],
  },
];
