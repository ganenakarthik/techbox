export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  details: string;
  specs: Record<string, string>;
  pinoutUrl?: string;
  datasheetUrl?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
}

export interface ProjectKit {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  buildTime: string;
  price: number;
  mrp: number;
  description: string;
  circuitDiagramUrl?: string;
  sourceCodeUrl?: string;
  assemblyGuideUrl?: string;
  includes: string[];
  optionalAddons: {
    name: string;
    price: number;
    description: string;
  }[];
  images: string[];
  rating: number;
  reviewsCount: number;
}

export interface College {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  pincode: string;
  campuses: {
    id: string;
    name: string;
    pickupLocations: string[];
    deliverySlots: string[];
  }[];
}

export const CATEGORIES = [
  { id: "cat-mcu", name: "Development Boards", slug: "development-boards", icon: "Cpu", count: 18 },
  { id: "cat-esp", name: "ESP32 & IoT", slug: "esp32-iot", icon: "Wifi", count: 14 },
  { id: "cat-sensors", name: "Sensors & Modules", slug: "sensors-modules", icon: "Activity", count: 32 },
  { id: "cat-displays", name: "Displays & OLEDs", slug: "displays", icon: "Monitor", count: 12 },
  { id: "cat-motors", name: "Motors & Drivers", slug: "motors-drivers", icon: "Cog", count: 16 },
  { id: "cat-robotics", name: "Robotics Chassis & Parts", slug: "robotics", icon: "Bot", count: 15 },
  { id: "cat-power", name: "Power & Battery Shields", slug: "power-batteries", icon: "BatteryCharging", count: 20 },
  { id: "cat-proto", name: "Prototyping & Wires", slug: "prototyping-wires", icon: "Zap", count: 25 },
  { id: "cat-tools", name: "Lab Tools & Soldering", slug: "tools-soldering", icon: "Wrench", count: 10 },
  { id: "cat-kits", name: "Student Project Kits", slug: "project-kits", icon: "Box", count: 8 },
];

export const BRANDS = [
  { id: "b1", name: "Espressif", slug: "espressif" },
  { id: "b2", name: "Arduino Original", slug: "arduino" },
  { id: "b3", name: "Raspberry Pi Foundation", slug: "raspberry-pi" },
  { id: "b4", name: "TechBox Lab Grade", slug: "techbox-lab" },
  { id: "b5", name: "Waveshare", slug: "waveshare" },
  { id: "b6", name: "DFRobot", slug: "dfrobot" },
];

export const COLLEGES: College[] = [
  {
    id: "col-srm",
    name: "SRM Institute of Science and Technology",
    code: "SRM-KTR",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "603203",
    campuses: [
      {
        id: "camp-srm-main",
        name: "Kattankulathur Main Campus",
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
        id: "camp-srm-ram",
        name: "Ramapuram Campus",
        pickupLocations: ["Main Reception Desk", "Boys Hostel Block Gate"],
        deliverySlots: ["Afternoon Run (2:00 PM - 5:00 PM)"]
      }
    ]
  },
  {
    id: "col-vit",
    name: "Vellore Institute of Technology (VIT)",
    code: "VIT-VLR",
    city: "Vellore",
    state: "Tamil Nadu",
    pincode: "632014",
    campuses: [
      {
        id: "camp-vit-main",
        name: "Vellore Campus",
        pickupLocations: [
          "Main Gate (Gate 1)",
          "SJT (Silver Jubilee Tower) Ground Floor Lobby",
          "Men's Hostel Q-Block Reception",
          "Technology Tower Porch"
        ],
        deliverySlots: ["Morning Slot (11:00 AM - 1:30 PM)", "Evening Slot (5:00 PM - 8:00 PM)"]
      }
    ]
  },
  {
    id: "col-bits",
    name: "BITS Pilani",
    code: "BITS-PIL",
    city: "Pilani",
    state: "Rajasthan",
    pincode: "333031",
    campuses: [
      {
        id: "camp-bits-pil",
        name: "Pilani Campus",
        pickupLocations: ["Student Activity Centre (SAC)", "VK Bhavan Lobby", "FD-II Faculty Division Entrance"],
        deliverySlots: ["Daily Afternoon Run (3:00 PM - 6:30 PM)"]
      }
    ]
  },
  {
    id: "col-iitm",
    name: "Indian Institute of Technology Madras (IITM)",
    code: "IITM-CHN",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600036",
    campuses: [
      {
        id: "camp-iitm-main",
        name: "Guindy Main Campus",
        pickupLocations: ["Gajendra Circle (GC) Desk", "Brahmaputra Hostel Reception", "Centre for Innovation (CFI) Porch"],
        deliverySlots: ["Morning Run (10:00 AM - 1:00 PM)", "Evening Run (4:00 PM - 7:00 PM)"]
      }
    ]
  },
  {
    id: "col-dtu",
    name: "Delhi Technological University (DTU)",
    code: "DTU-DEL",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110042",
    campuses: [
      {
        id: "camp-dtu-main",
        name: "Rohini Main Campus",
        pickupLocations: ["Main Gate Security Post", "Mech Dept Workshop", "Sir CV Raman Hostel Block"],
        deliverySlots: ["Afternoon Run (1:00 PM - 4:30 PM)"]
      }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-esp32-devkit",
    name: "ESP32 DevKit V1 30-Pin NodeMCU WiFi + Bluetooth Board",
    slug: "esp32-devkit-v1-30pin",
    brand: "Espressif",
    category: "ESP32 & IoT",
    description: "The industry-standard dual-core microcontroller for college IoT, robotics, and automation projects. Features 2.4 GHz Wi-Fi and Bluetooth BLE 4.2.",
    details: "Built around the ESP-WROOM-32 module, this board combines dual-core Xtensa 32-bit LX6 microprocessors running up to 240 MHz. Perfectly suited for cloud-connected telemetry, smart farming, telemetry wearables, and robotics.",
    specs: {
      "Microcontroller": "ESP32-D0WDQ6 Dual Core 240MHz",
      "Wireless Connectivity": "Wi-Fi 802.11 b/g/n & Bluetooth v4.2 BR/EDR and BLE",
      "Operating Voltage": "3.3V Logic (5V via USB or Vin)",
      "Flash Memory": "4MB SPI Flash",
      "SRAM": "520 KB",
      "GPIO Pins": "25 exposed digital I/O pins",
      "USB Interface": "Silicon Labs CP2102 / CH340 with micro-USB",
      "Protocols": "I2C, SPI, UART, PWM, ADC (12-bit), DAC"
    },
    pinoutUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    datasheetUrl: "#datasheet-esp32",
    rating: 4.9,
    reviewCount: 248,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-esp32-soldered",
        name: "Pre-soldered Pin Headers (Breadboard Ready)",
        sku: "ESP32-DEV-V1-SOLD",
        price: 389,
        mrp: 599,
        discount: 35,
        stock: 142
      },
      {
        id: "var-esp32-unsoldered",
        name: "Unsoldered Headers (Compact/PCB Mounting)",
        sku: "ESP32-DEV-V1-UNSOLD",
        price: 349,
        mrp: 549,
        discount: 36,
        stock: 65
      }
    ],
    tags: ["esp32", "wifi", "bluetooth", "iot", "arduino-ide", "microcontroller"]
  },
  {
    id: "prod-arduino-uno-r3",
    name: "Arduino UNO R3 Compatible Development Board (ATmega328P)",
    slug: "arduino-uno-r3-atmega328p",
    brand: "TechBox Lab Grade",
    category: "Development Boards",
    description: "The gold standard for first-year engineering and introductory embedded systems. DIP ATmega328P with removable IC socket.",
    details: "100% compatible with official Arduino IDE and shields. Features 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz quartz crystal, and a USB connection.",
    specs: {
      "Microcontroller": "ATmega328P in DIP-28 socket",
      "Operating Voltage": "5V DC",
      "Input Voltage (recommended)": "7-12V DC via DC barrel jack",
      "Digital I/O Pins": "14 (6 PWM outputs)",
      "Analog Input Pins": "6 Channels (10-bit)",
      "Flash Memory": "32 KB (0.5 KB used by bootloader)",
      "SRAM": "2 KB",
      "Clock Speed": "16 MHz"
    },
    rating: 4.8,
    reviewCount: 310,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-uno-dip-cable",
        name: "DIP Version + High-Speed USB Cable A-to-B",
        sku: "UNO-R3-DIP-CABLE",
        price: 449,
        mrp: 699,
        discount: 36,
        stock: 98
      },
      {
        id: "var-uno-smd",
        name: "SMD Economy Version + USB Cable",
        sku: "UNO-R3-SMD-CABLE",
        price: 369,
        mrp: 549,
        discount: 33,
        stock: 54
      }
    ],
    tags: ["arduino", "uno", "atmega328p", "embedded", "diy"]
  },
  {
    id: "prod-rpi-pico-w",
    name: "Raspberry Pi Pico W with Built-in WiFi (RP2040 Dual ARM Cortex-M0+)",
    slug: "raspberry-pi-pico-w-wifi",
    brand: "Raspberry Pi Foundation",
    category: "Development Boards",
    description: "Official Raspberry Pi microcontroller board powered by RP2040 chip with Infineon CYW43439 2.4GHz wireless.",
    details: "High performance dual-core ARM Cortex-M0+ clocking at 133 MHz with 2MB on-board QSPI flash. Supports MicroPython, C/C++, and CircuitPython. Ideal for low-power IoT gateways.",
    specs: {
      "Silicon": "RP2040 dual-core ARM Cortex-M0+ up to 133 MHz",
      "Wireless": "2.4GHz 802.11n wireless LAN via onboard antenna",
      "Memory": "264 KB on-chip SRAM + 2MB QSPI Flash",
      "Programmable I/O (PIO)": "8 × Programmable I/O state machines for custom peripheral support",
      "Pins": "26 multi-function GPIO pins (3 analog inputs)"
    },
    rating: 4.9,
    reviewCount: 165,
    isFeatured: true,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-pico-w-soldered",
        name: "Pico W (With Color-Coded Header Pins)",
        sku: "RPI-PICO-W-HDR",
        price: 649,
        mrp: 850,
        discount: 24,
        stock: 78
      }
    ],
    tags: ["raspberrypi", "pico", "rp2040", "micropython", "python", "wifi"]
  },
  {
    id: "prod-hc-sr04",
    name: "HC-SR04 Ultrasonic Distance Sensor Module (2cm - 400cm)",
    slug: "hc-sr04-ultrasonic-sensor-module",
    brand: "TechBox Lab Grade",
    category: "Sensors & Modules",
    description: "Accurate non-contact ultrasonic sonar distance measuring module. Essential for obstacle-avoiding rovers and water tank level monitors.",
    details: "Provides 2cm to 400cm non-contact measurement range with accuracy up to 3mm. Module includes ultrasonic transmitter, receiver and control circuit.",
    specs: {
      "Operating Voltage": "5V DC",
      "Operating Current": "15mA",
      "Working Frequency": "40 KHz",
      "Max Range": "400 cm (4 meters)",
      "Min Range": "2 cm",
      "Measuring Angle": "15 degrees",
      "Trigger Input Signal": "10uS TTL pulse"
    },
    rating: 4.7,
    reviewCount: 420,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-hcsr04-standard",
        name: "Standard 5V HC-SR04",
        sku: "SEN-HCSR04-5V",
        price: 79,
        mrp: 149,
        discount: 47,
        stock: 320
      },
      {
        id: "var-hcsr04p-3v",
        name: "RCWL-9610 / HC-SR04P (3.3V & 5V Compatible for ESP32/Pico)",
        sku: "SEN-HCSR04P-WIDE",
        price: 119,
        mrp: 199,
        discount: 40,
        stock: 140
      }
    ],
    tags: ["ultrasonic", "sensor", "distance", "sonar", "rover", "robotics"]
  },
  {
    id: "prod-dht11-module",
    name: "DHT11 Digital Temperature & Humidity Sensor Module with PCB & Pull-up Resistor",
    slug: "dht11-digital-temperature-humidity-sensor",
    brand: "TechBox Lab Grade",
    category: "Sensors & Modules",
    description: "Reliable calibrated digital temperature and humidity sensor with pre-mounted resistor and 3-pin breakout for direct jumper connection.",
    details: "Utilizes capacitive humidity measurement and thermistor to measure surrounding air, spitting out digital signal on single data pin. Perfect for weather stations and greenhouse monitoring.",
    specs: {
      "Supply Voltage": "3.3V to 5.5V DC",
      "Temperature Range": "0°C to 50°C (±2°C accuracy)",
      "Humidity Range": "20% to 90% RH (±5% accuracy)",
      "Sampling Period": "1 second",
      "Output Interface": "Single-bus digital signal"
    },
    rating: 4.6,
    reviewCount: 280,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-dht11-breakout",
        name: "3-Pin Module with Jumper Cable",
        sku: "SEN-DHT11-MOD",
        price: 89,
        mrp: 160,
        discount: 44,
        stock: 210
      }
    ],
    tags: ["dht11", "temperature", "humidity", "weather", "iot", "sensor"]
  },
  {
    id: "prod-oled-096-i2c",
    name: "0.96 inch I2C OLED Display Module 128x64 (SSD1306) Blue/Yellow-Blue",
    slug: "0-96-oled-display-module-i2c-ssd1306",
    brand: "Waveshare",
    category: "Displays & OLEDs",
    description: "Crisp, ultra-bright high-contrast OLED display. Requires only 2 I2C wires (SDA/SCL) for complete graphical rendering.",
    details: "128x64 high resolution display powered by SSD1306 driver. Self-illuminating pixels eliminate the need for a backlight, ensuring negligible power consumption.",
    specs: {
      "Resolution": "128 × 64 pixels",
      "Controller": "SSD1306",
      "Communication": "I2C (Address 0x3C / 0x3D selectable)",
      "Operating Voltage": "3.3V - 5.0V DC",
      "Viewing Angle": "> 160 degrees",
      "Power Consumption": "0.04W in normal operation"
    },
    rating: 4.9,
    reviewCount: 195,
    isFeatured: true,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-oled-blue",
        name: "Solid High-Contrast Blue (128x64)",
        sku: "DISP-OLED-096-BLU",
        price: 219,
        mrp: 380,
        discount: 42,
        stock: 125
      },
      {
        id: "var-oled-yellowblue",
        name: "Dual Color (Top 16px Yellow, Bottom 48px Blue)",
        sku: "DISP-OLED-096-YELBLU",
        price: 229,
        mrp: 399,
        discount: 43,
        stock: 80
      }
    ],
    tags: ["oled", "display", "i2c", "ssd1306", "screen", "iot"]
  },
  {
    id: "prod-sg90-servo",
    name: "TowerPro SG90 9g Micro Servo Motor (180 Degree Rotation)",
    slug: "towerpro-sg90-micro-servo-motor-9g",
    brand: "TechBox Lab Grade",
    category: "Motors & Drivers",
    description: "Lightweight, reliable micro servo with horn arms and mounting screws for robotic arms, pan-tilt cameras, and RC mechanisms.",
    details: "Tiny and lightweight with high output power. Servo can rotate approximately 180 degrees (90 in each direction). Compatible with servo libraries on Arduino, ESP32, and Raspberry Pi.",
    specs: {
      "Weight": "9 grams",
      "Operating Voltage": "4.8V to 6.0V DC",
      "Stall Torque": "1.8 kg·cm (at 4.8V)",
      "Operating Speed": "0.1 sec/60 degrees",
      "Gear Type": "High impact nylon gear set",
      "Connector Wire Length": "250 mm"
    },
    rating: 4.8,
    reviewCount: 340,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-sg90-single",
        name: "1x SG90 Servo with 3 Arms & Screws",
        sku: "MOT-SG90-1X",
        price: 85,
        mrp: 150,
        discount: 43,
        stock: 450
      },
      {
        id: "var-sg90-pack4",
        name: "Quad Pack (4x SG90 Servos) - Best Value",
        sku: "MOT-SG90-4PK",
        price: 310,
        mrp: 600,
        discount: 48,
        stock: 110
      }
    ],
    tags: ["servo", "motor", "robotics", "sg90", "actuator"]
  },
  {
    id: "prod-l298n-motor-driver",
    name: "L298N Dual H-Bridge DC Stepper Motor Driver Controller Board",
    slug: "l298n-dual-h-bridge-motor-driver",
    brand: "TechBox Lab Grade",
    category: "Motors & Drivers",
    description: "High-power dual motor driver capable of driving 2 DC motors up to 2A per channel or 1 two-phase stepper motor.",
    details: "Incorporates an onboard 5V regulator. Can drive inductive loads such as relays, solenoids, DC and stepping motors. Heat-sinked for high thermal dissipation during prolonged lab rover tests.",
    specs: {
      "Driver Chip": "L298N Dual H-Bridge IC with Heat Sink",
      "Drive Voltage": "5V to 35V DC",
      "Peak Current": "2A per bridge",
      "Logic Voltage": "5V",
      "Max Power Consumption": "20W",
      "Protection": "Flyback protection diodes"
    },
    rating: 4.7,
    reviewCount: 215,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-l298n-standard",
        name: "L298N Module with Large Heat Sink",
        sku: "DRV-L298N-MOD",
        price: 139,
        mrp: 249,
        discount: 44,
        stock: 180
      }
    ],
    tags: ["motor-driver", "l298n", "h-bridge", "rover", "robotics", "stepper"]
  },
  {
    id: "prod-mpu6050-gyro",
    name: "MPU-6050 3-Axis Gyroscope & 3-Axis Accelerometer Sensor Module (6-DOF)",
    slug: "mpu-6050-6dof-gyro-accelerometer-module",
    brand: "TechBox Lab Grade",
    category: "Sensors & Modules",
    description: "Digital Motion Processor (DMP) 6-axis motion tracking module for drones, balancing robots, and gesture-controlled interfaces.",
    details: "Combines a 3-axis gyroscope and a 3-axis accelerometer on the same silicon die together with an onboard Digital Motion Processor capable of processing complex 9-axis MotionFusion algorithms.",
    specs: {
      "Sensor": "InvenSense MPU-6050",
      "Communication": "Standard I2C protocol",
      "Operating Voltage": "3V to 5V DC (onboard LDO regulator)",
      "Gyroscope Range": "± 250, 500, 1000, 2000 °/s",
      "Accelerometer Range": "± 2, ± 4, ± 8, ± 16g",
      "ADC Resolution": "16-bit analog-to-digital conversion"
    },
    rating: 4.8,
    reviewCount: 172,
    isFeatured: true,
    isBestseller: false,
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-mpu6050-soldered",
        name: "With Straight & Right-Angle Header Pins",
        sku: "SEN-MPU6050-HDR",
        price: 145,
        mrp: 260,
        discount: 44,
        stock: 95
      }
    ],
    tags: ["mpu6050", "gyro", "accelerometer", "imu", "drone", "motion"]
  },
  {
    id: "prod-relay-5v-dual",
    name: "2-Channel 5V Relay Module with Optocoupler Isolation (10A 250VAC)",
    slug: "2-channel-5v-relay-module-optocoupler",
    brand: "TechBox Lab Grade",
    category: "Sensors & Modules",
    description: "Control AC appliances (lights, pumps, fans) safely from low-voltage microcontrollers like Arduino and ESP32 with full optical isolation.",
    details: "Equipped with high-current relays (AC250V 10A / DC30V 10A), standard interface controllable directly by microcontroller, and LED status indicators for each channel.",
    specs: {
      "Trigger Voltage": "5V DC (Active LOW / HIGH selectable via jumper)",
      "Trigger Current": "5mA per channel",
      "Max Switching Voltage": "250V AC / 30V DC",
      "Max Switching Current": "10A",
      "Isolation": "Optical photocoupler isolation for EMI immunity"
    },
    rating: 4.8,
    reviewCount: 190,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-relay-2ch",
        name: "2-Channel Optocoupled 5V Relay",
        sku: "MOD-RELAY-2CH-5V",
        price: 115,
        mrp: 199,
        discount: 42,
        stock: 230
      },
      {
        id: "var-relay-4ch",
        name: "4-Channel Optocoupled 5V Relay",
        sku: "MOD-RELAY-4CH-5V",
        price: 189,
        mrp: 320,
        discount: 41,
        stock: 140
      }
    ],
    tags: ["relay", "home-automation", "ac-switching", "optocoupler", "iot"]
  },
  {
    id: "prod-breadboard-830",
    name: "MB-102 830-Point Solderless Transparent/White Breadboard with Power Rails",
    slug: "mb102-830-point-solderless-breadboard",
    brand: "TechBox Lab Grade",
    category: "Prototyping & Wires",
    description: "Heavy-duty lab breadboard with adhesive backing, interlocking tabs, and color-coded positive/negative distribution rails.",
    details: "Nickel-plated phosphor bronze spring clips ensure tight pin grip for over 50,000 insertions. Clean alphanumeric coordinate labeling.",
    specs: {
      "Tie Points": "830 tie points (630 distribution terminal + 200 power bus)",
      "Wire Size Compatibility": "21-26 AWG solid wire or DuPont jumpers",
      "Backing": "Heavy duty self-adhesive peelable tape",
      "Dimensions": "165 × 55 × 8.5 mm"
    },
    rating: 4.9,
    reviewCount: 512,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-bb-white",
        name: "Standard Matte White (830 Points)",
        sku: "PROTO-BB-830-WHT",
        price: 109,
        mrp: 180,
        discount: 39,
        stock: 310
      }
    ],
    tags: ["breadboard", "prototyping", "lab", "mb102", "diy"]
  },
  {
    id: "prod-jumper-wires-combo",
    name: "120-Piece Premium Multicolored DuPont Jumper Wires Combo (M-M, M-F, F-F)",
    slug: "120pcs-dupont-jumper-wires-combo-kit",
    brand: "TechBox Lab Grade",
    category: "Prototyping & Wires",
    description: "Complete set of 40x Male-to-Male, 40x Male-to-Female, and 40x Female-to-Female 20cm breadboard connecting wires.",
    details: "High-grade copper-clad aluminum core with molded Dupont terminal housing for zero loose contacts. Separable ribbon cables.",
    specs: {
      "Total Wire Count": "120 pieces (40 of each type)",
      "Length": "20 cm standard",
      "Pitch": "2.54 mm standard pin spacing",
      "Colors": "10 distinct rainbow colors for clean debugging"
    },
    rating: 4.9,
    reviewCount: 680,
    isFeatured: false,
    isBestseller: true,
    images: [
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      {
        id: "var-jumper-combo",
        name: "120-Piece Trio Pack (M-M + M-F + F-F)",
        sku: "WIRE-DUPONT-120PK",
        price: 169,
        mrp: 299,
        discount: 43,
        stock: 520
      }
    ],
    tags: ["jumper-wires", "dupont", "wires", "prototyping", "cables"]
  }
];

export const PROJECT_KITS: ProjectKit[] = [
  {
    id: "kit-smart-agri",
    title: "Smart Agriculture & Automated Irrigation IoT System",
    slug: "smart-agriculture-irrigation-iot-system",
    category: "IoT & Embedded",
    difficulty: "Intermediate",
    buildTime: "2-3 Days",
    price: 1999,
    mrp: 2899,
    description: "Complete hardware, firmware, and cloud telemetry kit. Automatically measures soil moisture, ambient humidity & temperature, and controls a 5V/12V irrigation pump with real-time phone alerts.",
    includes: [
      "ESP32 DevKit V1 30-Pin Microcontroller",
      "Capacitive Corrosion-Resistant Soil Moisture Sensor v1.2",
      "DHT11 Calibrated Temperature & Humidity Sensor",
      "0.96 inch I2C OLED Display (128x64)",
      "2-Channel 5V Optocoupled Relay Module",
      "5V DC Submersible Water Pump + 1m Silicone Hose",
      "MB-102 830-Point Solderless Breadboard",
      "40x Male-to-Female + 20x Male-to-Male DuPont Jumpers",
      "Complete Arduino/PlatformIO Source Code (Blynk & MQTT Ready)",
      "High-Resolution PDF Circuit Schematic & Wiring Diagram",
      "Step-by-Step 24-Page Project Assembly & Testing Guide"
    ],
    optionalAddons: [
      { name: "Custom Manufactured Dual-Layer PCB", price: 349, description: "Compact pre-routed circuit board replacing messy breadboard wiring" },
      { name: "3D-Printed Weatherproof Sensor & Controller Enclosure", price: 499, description: "Custom matte-black PLA case with mounting brackets" },
      { name: "Complete College Project Report + Viva PPT Deck", price: 699, description: "Fully formatted IEEE report with flowcharts, circuit block diagrams, and viva-voce prep pack" },
      { name: "Fully Assembled & Bench-Tested Working Prototype", price: 999, description: "Our engineering lab solders, flashes firmware, and QA tests the complete build before campus delivery" }
    ],
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 88
  },
  {
    id: "kit-obstacle-rover",
    title: "Autonomous Obstacle-Avoiding & Bluetooth Dual-Mode Rover",
    slug: "autonomous-obstacle-avoiding-bluetooth-rover",
    category: "Robotics & Automation",
    difficulty: "Beginner",
    buildTime: "1-2 Days",
    price: 1799,
    mrp: 2499,
    description: "2WD/4WD robotic vehicle that navigates unknown environments autonomously using ultrasonic sonar mapping, switchable to smartphone Bluetooth control via Android app.",
    includes: [
      "Arduino UNO R3 ATmega328P Board + USB Cable",
      "L298N Heavy Duty Dual H-Bridge Motor Driver Module",
      "HC-SR04 Ultrasonic Sonar Distance Sensor Module",
      "SG90 Micro Servo 9g with Pan-Tilt Sonar Bracket",
      "HC-05 Bluetooth Serial Transceiver Module",
      "Transparent Acrylic Dual-Motor Robotic Chassis Kit with Wheels & Castor",
      "2x High-Torque BO Gear Motors with Rubber Grip Tires",
      "Dual 18650 Battery Holder with On/Off Switch",
      "Full Source Code with Ultrasonic Scanning Algorithms",
      "Interactive Step-by-Step Assembly Guide & Pin Mapping"
    ],
    optionalAddons: [
      { name: "Heavy Duty 3D-Printed Bumper & Sensor Mount", price: 299, description: "Reinforced chassis bumper to protect ultrasonic sensor during collisions" },
      { name: "Custom PCB Shield for Arduino UNO", price: 320, description: "Stackable shield with direct plug-and-play motor and sensor headers" },
      { name: "College Presentation PPT + Viva Q&A Guide", price: 499, description: "Professional 20-slide technical presentation deck + circuit breakdown" }
    ],
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 114
  },
  {
    id: "kit-health-telemetry",
    title: "IoT Real-Time Patient Vitals & Remote Health Telemetry Gateway",
    slug: "iot-patient-vitals-health-telemetry-gateway",
    category: "Biomedical & IoT",
    difficulty: "Advanced",
    buildTime: "3-4 Days",
    price: 2499,
    mrp: 3599,
    description: "Hospital ward telemetry monitor that continuously streams SpO2 blood oxygen, heart rate pulse, and body temperature to a cloud dashboard with emergency buzzer alerts.",
    includes: [
      "ESP32-WROOM-32 Dev Board",
      "MAX30102 High-Sensitivity Pulse Oximeter & Heart-Rate Sensor",
      "MLX90614 Contactless Infrared Body Temperature Sensor",
      "0.96 inch Blue I2C OLED Display",
      "Piezo Buzzer & Red Alert Strobe LED Module",
      "MB-102 Breadboard + 40-Piece Precision Wires",
      "Cloud Dashboard Setup Guide (ThingSpeak / Adafruit IO)",
      "Validated Signal Processing Algorithms & Moving Average Filters"
    ],
    optionalAddons: [
      { name: "Custom Medical-Style 3D-Printed Finger Clip", price: 350, description: "Ergonomic enclosure for MAX30102 sensor" },
      { name: "Complete Capstone Report & Architecture Poster", price: 799, description: "Standard university final-year capstone documentation" },
      { name: "Pre-Tested Working Prototype Build", price: 1100, description: "Pre-assembled and calibrated in clean lab environment" }
    ],
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 62
  },
  {
    id: "kit-smart-bin",
    title: "AI & Ultrasonic Smart Campus Waste Classification Bin",
    slug: "ai-ultrasonic-smart-campus-waste-bin",
    category: "AI/ML & Embedded",
    difficulty: "Intermediate",
    buildTime: "2 Days",
    price: 2199,
    mrp: 3100,
    description: "Contactless automatic trash bin with servo-driven dual-compartment lid, ultrasonic fill-level detection, and campus waste telemetry notification system.",
    includes: [
      "Arduino UNO R3 + Sensor Shield v5.0",
      "2x HC-SR04 Ultrasonic Sensors (Lid Proximity + Bin Level)",
      "2x MG996R Metal Gear High-Torque Servos",
      "Inductive Proximity Sensor for Metal Can Detection",
      "Active 5V Alarm Buzzer",
      "Acrylic Mechanism Linkage Arm Set",
      "Complete Firmware & Schematics"
    ],
    optionalAddons: [
      { name: "3D-Printed Dual Lid Flap Mechanism", price: 449, description: "Custom mechanical flaps designed for standard 10L lab bins" },
      { name: "Project Report + PPT Deck", price: 599, description: "Comprehensive mini-project documentation" }
    ],
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviewsCount: 45
  }
];
