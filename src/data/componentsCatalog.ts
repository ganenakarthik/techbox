export interface TechnicalSpecs {
  mcu?: string;
  cpu?: string;
  clockSpeed?: string;
  flash?: string;
  ram?: string;
  wifi?: string;
  bluetooth?: string;
  gpio?: number;
  operatingVoltage?: string;
  inputVoltage?: string;
  usbInterface?: string;
  dimensions?: string;
  sensorType?: string;
  range?: string;
  accuracy?: string;
  interface?: string;
  motorType?: string;
  torque?: string;
  current?: string;
  capacity?: string;
  outputVoltage?: string;
  [key: string]: string | number | undefined;
}

export interface ComponentItem {
  id: string;
  name: string;
  category:
    | "Electronics"
    | "Microcontrollers"
    | "Development Boards"
    | "Sensors"
    | "Modules"
    | "ICs"
    | "Connectors"
    | "Power"
    | "Motors"
    | "Tools"
    | "Laptop Parts"
    | "Bike Parts"
    | "Industrial Parts"
    | "3D Printing";
  manufacturer: string;
  sku: string;
  price: number;
  originalPrice: number;
  badge?: string;
  stock: string;
  inStockCount: number;
  specs: string;
  rating: number;
  reviewCount: number;
  image: string;
  techSpecs: TechnicalSpecs;
  whatsIncluded: string[];
  compatibleWith: string[];
  datasheetUrl?: string;
  description: string;
}

export const CATEGORIES = [
  { id: "Electronics", name: "Electronics", count: 128, icon: "cpu" },
  { id: "Microcontrollers", name: "Microcontrollers", count: 42, icon: "cpu" },
  { id: "Development Boards", name: "Development Boards", count: 35, icon: "layers" },
  { id: "Sensors", name: "Sensors", count: 86, icon: "zap" },
  { id: "Modules", name: "Modules", count: 64, icon: "box" },
  { id: "ICs", name: "ICs & Passives", count: 140, icon: "shield" },
  { id: "Connectors", name: "Connectors & Cables", count: 95, icon: "link" },
  { id: "Power", name: "Power & Batteries", count: 52, icon: "battery" },
  { id: "Motors", name: "Motors & Actuators", count: 48, icon: "settings" },
  { id: "Tools", name: "Tools & Equipment", count: 30, icon: "wrench" },
  { id: "Laptop Parts", name: "Laptop Parts", count: 26, icon: "laptop" },
  { id: "Bike Parts", name: "Bike & EV Parts", count: 18, icon: "bike" },
  { id: "Industrial Parts", name: "Industrial Hardware", count: 22, icon: "factory" },
  { id: "3D Printing", name: "3D Printing & Filament", count: 40, icon: "printer" },
] as const;

export const COMPONENTS_CATALOG: ComponentItem[] = [
  // 1. ESP32 DevKit V1
  {
    id: "esp32-devkit-v1",
    name: "ESP32 DevKit V1 30-Pin NodeMCU Wi-Fi + Bluetooth Board",
    category: "Development Boards",
    manufacturer: "Espressif",
    sku: "ESP32-DEVKIT-V1",
    price: 389,
    originalPrice: 489,
    badge: "Bestseller",
    stock: "In Stock",
    inStockCount: 42,
    specs: "Dual-Core 240MHz, 520KB SRAM, Integrated Antenna",
    rating: 4.9,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      mcu: "ESP32-D0WDQ6",
      cpu: "Dual-core Xtensa 32-bit LX6, 240 MHz",
      flash: "4 MB SPI Flash",
      ram: "520 KB SRAM",
      wifi: "802.11 b/g/n (up to 150 Mbps)",
      bluetooth: "v4.2 BR/EDR and BLE",
      gpio: 30,
      operatingVoltage: "3.3 V",
      inputVoltage: "5 V via Micro USB or VIN (5-9V)",
      usbInterface: "CP2102 / CH340 USB-to-UART",
      dimensions: "51 × 28 × 13 mm",
    },
    whatsIncluded: ["1x ESP32 DevKit V1 30-Pin Board", "1x Anti-Static Protective Pouch"],
    compatibleWith: ["Arduino IDE", "PlatformIO", "ESP-IDF", "MicroPython"],
    datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf",
    description:
      "The ESP32 DevKit V1 is a versatile development board featuring the powerful dual-core ESP32 microcontroller with built-in Wi-Fi and Bluetooth connectivity. Ideal for IoT, home automation, and embedded wireless engineering.",
  },

  // 2. Arduino UNO R3
  {
    id: "arduino-uno-r3",
    name: "Arduino UNO R3 ATmega328P Development Board",
    category: "Microcontrollers",
    manufacturer: "Arduino",
    sku: "ARD-UNO-R3",
    price: 449,
    originalPrice: 549,
    badge: "Lab Essential",
    stock: "In Stock",
    inStockCount: 60,
    specs: "ATmega328P 16MHz, 14 Digital I/O, 6 Analog Inputs",
    rating: 4.8,
    reviewCount: 320,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      mcu: "ATmega328P",
      cpu: "8-bit AVR, 16 MHz",
      flash: "32 KB (0.5 KB used by bootloader)",
      ram: "2 KB SRAM",
      gpio: 14,
      operatingVoltage: "5 V",
      inputVoltage: "7 - 12 V DC Recommended",
      usbInterface: "ATmega16U2 USB Controller",
      dimensions: "68.6 × 53.4 mm",
    },
    whatsIncluded: ["1x Arduino UNO R3 Board", "1x USB Type-A to Type-B Cable"],
    compatibleWith: ["Arduino IDE", "PlatformIO", "Scratched Robotics"],
    description:
      "Industry standard microcontroller board for teaching, prototyping, and robotics. Built around the ATmega328P with removable DIP IC socket.",
  },

  // 3. MPU6050 6-Axis Gyro & Accelerometer
  {
    id: "mpu6050-sensor",
    name: "MPU6050 6-DOF Gyroscope & Accelerometer Module",
    category: "Sensors",
    manufacturer: "InvenSense",
    sku: "MPU-6050-GY521",
    price: 149,
    originalPrice: 199,
    badge: "Popular",
    stock: "In Stock",
    inStockCount: 85,
    specs: "3-Axis Gyro + 3-Axis Accelerometer, I2C Interface",
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      sensorType: "6-Axis Motion Tracking (IMU)",
      range: "Gyro ±250/500/1000/2000 °/s, Accel ±2g/4g/8g/16g",
      interface: "I2C Protocol (400kHz)",
      operatingVoltage: "3.3V - 5.0V (Built-in LDO Regulator)",
      dimensions: "20 × 16 mm",
    },
    whatsIncluded: ["1x MPU6050 Module", "1x Straight Header Pin", "1x Right-Angle Header Pin"],
    compatibleWith: ["Arduino", "ESP32", "Raspberry Pi", "STM32"],
    description:
      "High precision motion processing unit containing 3-axis gyroscope and 3-axis accelerometer on a single chip with digital motion processor (DMP).",
  },

  // 4. Raspberry Pi 4 Model B
  {
    id: "raspberry-pi-4b-4gb",
    name: "Raspberry Pi 4 Model B (4GB RAM) Single Board Computer",
    category: "Development Boards",
    manufacturer: "Raspberry Pi",
    sku: "RPI4-MOD-4GB",
    price: 4499,
    originalPrice: 5299,
    badge: "Flagship",
    stock: "Limited Stock",
    inStockCount: 12,
    specs: "Broadcom BCM2711 1.5GHz Quad-Core, 4GB LPDDR4, Dual 4K HDMI",
    rating: 4.9,
    reviewCount: 520,
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      cpu: "Quad-Core ARM Cortex-A72 64-bit @ 1.5GHz",
      ram: "4GB LPDDR4-2400 SDRAM",
      wifi: "2.4GHz & 5.0GHz IEEE 802.11ac Wireless",
      bluetooth: "Bluetooth 5.0, BLE",
      usbInterface: "2x USB 3.0, 2x USB 2.0",
      operatingVoltage: "5V 3A via USB Type-C",
      dimensions: "88 × 58 × 19 mm",
    },
    whatsIncluded: ["1x Raspberry Pi 4 Model B (4GB RAM)"],
    compatibleWith: ["Raspberry Pi OS", "Ubuntu", "Debian", "Docker", "ROS"],
    description:
      "High-performance single board computer featuring desktop-grade ARM CPU performance, dual 4K display output, Gigabit Ethernet, and hardware H.265 decoding.",
  },

  // 5. LM2596 DC-DC Buck Converter
  {
    id: "lm2596-buck-stepdown",
    name: "LM2596 DC-DC Adjustable Step-Down Buck Converter Module",
    category: "Power",
    manufacturer: "Texas Instruments",
    sku: "LM2596-MOD-HW411",
    price: 129,
    originalPrice: 179,
    badge: "Essential",
    stock: "In Stock",
    inStockCount: 95,
    specs: "Input 4V-35V, Output 1.25V-30V, 3A Max Output Current",
    rating: 4.6,
    reviewCount: 243,
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      inputVoltage: "4.0V to 35V DC",
      outputVoltage: "1.23V to 30V DC (Adjustable Potentiometer)",
      current: "3A Continuous (Heat Sink Recommended > 2A)",
      efficiency: "Up to 92%",
      dimensions: "43 × 21 × 14 mm",
    },
    whatsIncluded: ["1x LM2596 Buck Regulator Board"],
    compatibleWith: ["All DC Power Supplies", "LiPo Batteries", "Solar Panels"],
    description:
      "High-efficiency switching voltage regulator capable of driving 3A load with excellent line and load regulation.",
  },

  // 6. SG90 Micro Servo Motor
  {
    id: "sg90-micro-servo",
    name: "TowerPro SG90 9g Micro Servo Motor (180 Degree Rotation)",
    category: "Motors",
    manufacturer: "TowerPro",
    sku: "SG90-SERVO-9G",
    price: 119,
    originalPrice: 159,
    badge: "Bestseller",
    stock: "In Stock",
    inStockCount: 110,
    specs: "Torque 1.8 kg-cm @ 4.8V, Speed 0.1 sec/60 deg",
    rating: 4.8,
    reviewCount: 290,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      motorType: "Micro Analog Servo",
      torque: "1.8 kg/cm (4.8V)",
      operatingVoltage: "4.8V to 6.0V DC",
      dimensions: "23 × 12.2 × 29 mm",
      weight: "9 grams",
    },
    whatsIncluded: ["1x SG90 Servo Motor", "3x Plastic Horns", "3x Mounting Screws"],
    compatibleWith: ["Arduino Servo Library", "ESP32 PWM", "Raspberry Pi GPIO"],
    description:
      "Lightweight micro servo for robotics, pan-tilt camera mounts, RC planes, and custom mechanical actuators.",
  },

  // 7. DHT11 Temperature & Humidity Sensor
  {
    id: "dht11-sensor-module",
    name: "DHT11 Digital Temperature & Humidity Sensor Module",
    category: "Sensors",
    manufacturer: "Aosong",
    sku: "DHT11-MOD-3PIN",
    price: 79,
    originalPrice: 119,
    stock: "In Stock",
    inStockCount: 120,
    specs: "Temp 0-50°C (±2°C), Humidity 20-90% RH (±5%)",
    rating: 4.6,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      sensorType: "Capacitive Humidity & NTC Temperature",
      range: "0 to 50°C / 20 to 90% RH",
      operatingVoltage: "3.3V to 5.5V DC",
      interface: "1-Wire Digital Signal",
    },
    whatsIncluded: ["1x DHT11 Module", "1x 3-Pin Female-to-Female Jumper Cable"],
    compatibleWith: ["Arduino", "ESP32", "Raspberry Pi"],
    description:
      "Basic, ultra-low-cost digital temperature and humidity sensor calibrated digital signal output.",
  },

  // 8. Custom 2-Layer PCB Fabrication Service
  {
    id: "pcb-2layer-custom-fab",
    name: "Custom 2-Layer FR-4 PCB Fabrication (Up to 100x100mm)",
    category: "3D Printing",
    manufacturer: "Partsly Fab",
    sku: "PCB-FAB-2L-100",
    price: 499,
    originalPrice: 699,
    badge: "Custom Service",
    stock: "In Stock (Custom Fab)",
    inStockCount: 999,
    specs: "FR-4 Standard 1.6mm, 1oz Copper, Green/Black Solder Mask",
    rating: 4.9,
    reviewCount: 154,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      dimensions: "Up to 100mm x 100mm",
      layers: "2-Layer Double Sided",
      thickness: "1.6mm FR-4 TG130",
      surfaceFinish: "HASL Lead-Free",
    },
    whatsIncluded: ["5x Fabricated PCB Boards", "Full Flying Probe Electrical Test"],
    compatibleWith: ["Gerber RS-274X", "KiCad", "EasyEDA", "Altium Designer"],
    description:
      "Industrial grade 2-layer custom PCB prototyping service with green, black, or blue silkscreen options.",
  },

  // 9. NEMA 17 Stepper Motor
  {
    id: "nema17-stepper-motor",
    name: "NEMA 17 Bipolar Stepper Motor 42BYGH (1.7A 45Ncm)",
    category: "Motors",
    manufacturer: "Usongshine",
    sku: "NEMA17-42BYGH-40",
    price: 649,
    originalPrice: 849,
    stock: "In Stock",
    inStockCount: 40,
    specs: "1.8° Step Angle, 45Ncm Holding Torque, 1.7A/phase",
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      motorType: "Bipolar 2-Phase Stepper",
      torque: "45 Ncm (63.7 oz-in)",
      current: "1.7A per phase",
      dimensions: "42 × 42 × 40 mm",
    },
    whatsIncluded: ["1x NEMA 17 Motor", "1x 1-Meter 4-Pin Jumper Connector Cable"],
    compatibleWith: ["A4988 Driver", "DRV8825", "TMC2209", "3D Printers", "CNC Routers"],
    description:
      "High torque NEMA 17 stepper motor suitable for 3D printers (Ender, Prusa), CNC laser engravers, and robotic arms.",
  },

  // 10. ESP32-CAM WiFi + Bluetooth Camera Module
  {
    id: "esp32-cam-ov2640",
    name: "ESP32-CAM WiFi + Bluetooth Board with OV2640 Camera",
    category: "Development Boards",
    manufacturer: "Ai-Thinker",
    sku: "ESP32-CAM-OV2640",
    price: 549,
    originalPrice: 699,
    badge: "Vision AI",
    stock: "In Stock",
    inStockCount: 35,
    specs: "2MP Camera Module, MicroSD Slot, Built-in Flash LED",
    rating: 4.7,
    reviewCount: 276,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      mcu: "ESP32-S",
      camera: "OV2640 2-Megapixel Sensor",
      ram: "4MB External PSRAM",
      wifi: "802.11 b/g/n",
      operatingVoltage: "5V DC",
    },
    whatsIncluded: ["1x ESP32-CAM Development Board", "1x OV2640 Camera Module Cable"],
    compatibleWith: ["Arduino IDE", "ESP-WHO Face Recognition Framework"],
    description:
      "Low-cost AI vision board capable of streaming JPEG video, face recognition, and microSD video recording over Wi-Fi.",
  },
  
  // 11. 3D Printer PETG Filament 1kg
  {
    id: "petg-filament-1kg",
    name: "Partsly Pro 1.75mm PETG 3D Printer Filament (1kg Spool)",
    category: "3D Printing",
    manufacturer: "Partsly Materials",
    sku: "FIL-PETG-175-BLK",
    price: 1199,
    originalPrice: 1499,
    badge: "High Strength",
    stock: "In Stock",
    inStockCount: 28,
    specs: "1.75mm Diameter (±0.02mm Tolerance), High Toughness & Thermal Resistance",
    rating: 4.8,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      diameter: "1.75 mm ± 0.02 mm",
      printTemp: "230°C - 250°C",
      bedTemp: "70°C - 90°C",
      weight: "1.0 kg (2.2 lbs)",
    },
    whatsIncluded: ["1x 1kg Vacuum Sealed PETG Spool with Desiccant"],
    compatibleWith: ["FDM 3D Printers (Creality, Bambu Lab, Prusa, Voron)"],
    description:
      "Tough, chemical-resistant PETG filament engineered for outdoor enclosures, mechanical drone arms, and functional prototypes.",
  },

  // 12. Laptop Replacement Battery (Dell Inspiron / Vostro)
  {
    id: "laptop-battery-dell-wdx0r",
    name: "Replacement Laptop Battery WDX0R for Dell Inspiron 13 15 5000 7000",
    category: "Laptop Parts",
    manufacturer: "Partsly Power",
    sku: "BAT-DELL-WDX0R",
    price: 2199,
    originalPrice: 2899,
    badge: "A+ Grade",
    stock: "In Stock",
    inStockCount: 15,
    specs: "11.4V 42Wh 3505mAh Li-ion 3-Cell Battery",
    rating: 4.9,
    reviewCount: 64,
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80",
    techSpecs: {
      capacity: "42 Wh (3505 mAh)",
      outputVoltage: "11.4 V",
      cellType: "A+ Grade Lithium-Polymer",
    },
    whatsIncluded: ["1x WDX0R Dell Compatible Battery", "1x Screwdriver Kit"],
    compatibleWith: ["Dell Inspiron 5368 5378 5565 5567 5568 7368 7560"],
    description:
      "High-density replacement laptop battery tested for 500+ charge cycles with overcharge and thermal circuit protection.",
  }
];

export function getProductById(id: string): ComponentItem | undefined {
  return COMPONENTS_CATALOG.find((item) => item.id === id);
}

export function filterProducts(
  catalog: ComponentItem[],
  query: string,
  category: string,
  minPrice: number,
  maxPrice: number,
  inStockOnly: boolean,
  minRating: number,
  sortBy: string
): ComponentItem[] {
  let result = catalog.filter((item) => {
    const matchesCategory = category === "All Categories" || item.category === category;
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase()) ||
      item.specs.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
    const matchesStock = !inStockOnly || item.inStockCount > 0;
    const matchesRating = item.rating >= minRating;

    return matchesCategory && matchesQuery && matchesPrice && matchesStock && matchesRating;
  });

  if (sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    result.sort((a, b) => b.inStockCount - a.inStockCount);
  }

  return result;
}
