import { Campus } from "../types";

/**
 * Initial Campus Network Partner Data (Development Fixture)
 * Represents active campus runner hubs for engineering colleges.
 */
export const CAMPUSES: Campus[] = [
  {
    id: "col-srm",
    name: "SRM Institute of Science and Technology",
    code: "SRM-KTR",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "603203",
    pickupLocations: [
      "Main Gate Security Post (Gate 1)",
      "Tech Park Entrance Porch",
      "Nelson Mandela Hostel Desk",
      "Mechanical 'A' Block Porch",
      "Biotech / Electrical Innovation Hub (Lab 204)"
    ],
    deliverySlots: ["Morning Run (10:30 AM - 1:00 PM)", "Evening Run (4:30 PM - 7:30 PM)"]
  },
  {
    id: "col-vit",
    name: "Vellore Institute of Technology",
    code: "VIT-VEL",
    city: "Vellore",
    state: "Tamil Nadu",
    pincode: "632014",
    pickupLocations: [
      "Main Gate Reception",
      "Technology Tower (TT) Portico",
      "SJT Entrance Porch",
      "Men's Hostel Block D Desk",
      "Ladies Hostel Main Gate"
    ],
    deliverySlots: ["Morning Run (10:30 AM - 1:00 PM)", "Evening Run (4:30 PM - 7:30 PM)"]
  },
  {
    id: "col-bits",
    name: "BITS Pilani, Hyderabad Campus",
    code: "BITS-HYD",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500078",
    pickupLocations: [
      "Main Security Gate Post",
      "Academic Block Main Foyer",
      "Student Activity Centre (SAC)",
      "Hostel Krishna Gate",
      "Hostel Gandhi Desk"
    ],
    deliverySlots: ["Morning Run (11:00 AM - 1:30 PM)", "Evening Run (5:00 PM - 8:00 PM)"]
  },
  {
    id: "col-iitm",
    name: "Indian Institute of Technology Madras",
    code: "IITM",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600036",
    pickupLocations: [
      "Main Gate (In Gate)",
      "Central Workshop Entrance",
      "Department of Electrical Engineering",
      "Hostel Zone Dining Facility 1",
      "Research Park Main Lobby"
    ],
    deliverySlots: ["Morning Run (10:30 AM - 1:00 PM)", "Evening Run (4:30 PM - 7:30 PM)"]
  },
  {
    id: "col-pes",
    name: "PES University, Ring Road Campus",
    code: "PES-BLR",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560085",
    pickupLocations: [
      "Main Gate 1 Security Desk",
      "Golden Jubilee Block Porch",
      "Tech Block Lab Foyer",
      "Boys Hostel Block A Desk"
    ],
    deliverySlots: ["Morning Run (10:30 AM - 1:00 PM)", "Evening Run (4:30 PM - 7:30 PM)"]
  },
  {
    id: "col-rvce",
    name: "R.V. College of Engineering",
    code: "RVCE-BLR",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560059",
    pickupLocations: [
      "Main Gate Security Checkpoint",
      "ECE / Telecommunication Block Foyer",
      "Mechanical Seminar Complex",
      "Hostel Mess Counter"
    ],
    deliverySlots: ["Morning Run (10:30 AM - 1:00 PM)", "Evening Run (4:30 PM - 7:30 PM)"]
  }
];

// Backward compatibility alias
export const COLLEGES = CAMPUSES;
