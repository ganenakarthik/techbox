export interface VolumeTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: "ICs & Semiconductors" | "Microcontrollers" | "Sensors" | "Motors" | "Development Boards" | "3D Printing" | "Laptop Parts" | "Power Supplies" | "Display Modules" | "Passives & Connectors";
  manufacturer: string;
  sku: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  stock: string;
  inStockCount: number;
  specs: string;
  rating: number;
  reviewCount: number;
  image: string;
  datasheetUrl?: string;
  volumeTiers?: VolumeTier[];
  techSpecs: Record<string, string>;
  whatsIncluded: string[];
  compatibleWith: string[];
  description: string;
}

export const COMPONENTS_CATALOG: ComponentItem[] = [
  {
    id: "esp32-wroom-32d",
    name: "ESP32-WROOM-32D Wi-Fi + BT / BLE Module (4MB Flash)",
    category: "Microcontrollers",
    manufacturer: "Espressif Systems",
    sku: "ESP32-WROOM-32D-4MB",
    price: 249,
    originalPrice: 320,
    badge: "Bestseller",
    stock: "In Stock",
    inStockCount: 450,
    specs: "Dual-core Xtensa LX6, 240MHz, 520KB SRAM, Wi-Fi 802.11 b/g/n, BLE 4.2",
    rating: 4.9,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32d_esp32-wroom-32u_datasheet_en.pdf",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 249 },
      { minQty: 10, maxQty: 49, pricePerUnit: 225 },
      { minQty: 50, maxQty: null, pricePerUnit: 199 },
    ],
    techSpecs: {
      coreProcessor: "Xtensa 32-bit LX6 Dual-Core @ 240 MHz",
      flashMemory: "4 MB SPI Flash",
      sram: "520 KB SRAM",
      wireless: "Wi-Fi 802.11 b/g/n (up to 150 Mbps), Bluetooth v4.2 BR/EDR and BLE",
      operatingVoltage: "3.0V to 3.6V DC",
      interfaces: "GPIO, ADC, DAC, SPI, I2C, UART, PWM, Capacitive Touch",
      operatingTemp: "-40°C to +85°C",
    },
    whatsIncluded: ["1x ESP32-WROOM-32D Module (Tape & Reel packaging available)"],
    compatibleWith: ["ESP-IDF Framework", "Arduino IDE", "MicroPython", "FreeRTOS"],
    description: "Powerful generic Wi-Fi+BT+BLE MCU module targeted for IoT sensor hubs, voice encoding, music streaming, and smart home automation."
  },
  {
    id: "raspberry-pi-pico-w",
    name: "Raspberry Pi Pico W Board with Header Pins (RP2040)",
    category: "Development Boards",
    manufacturer: "Raspberry Pi Foundation",
    sku: "RPI-PICO-W-H",
    price: 499,
    originalPrice: 599,
    badge: "Wireless MCU",
    stock: "In Stock",
    inStockCount: 180,
    specs: "Dual ARM Cortex-M0+, 264KB SRAM, 2MB Flash, 2.4GHz Wi-Fi",
    rating: 4.8,
    reviewCount: 320,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    datasheetUrl: "https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 499 },
      { minQty: 10, maxQty: 49, pricePerUnit: 469 },
      { minQty: 50, maxQty: null, pricePerUnit: 429 },
    ],
    techSpecs: {
      mcu: "RP2040 Dual-core ARM Cortex M0+ @ 133MHz",
      memory: "264KB SRAM, 2MB onboard QSPI Flash",
      wireless: "Infineon CYW43439 2.4GHz 802.11n Wi-Fi",
      pins: "26 multi-function GPIO pins (2x SPI, 2x I2C, 2x UART, 3x 12-bit ADC, 16x PWM)",
    },
    whatsIncluded: ["1x Raspberry Pi Pico W Board (Pre-soldered headers)"],
    compatibleWith: ["C/C++ SDK", "MicroPython", "CircuitPython"],
    description: "Low-cost high-performance microcontroller board with flexible digital interfaces built on Raspberry Pi's custom RP2040 silicon."
  },
  {
    id: "stm32f103c8t6-bluepill",
    name: "STM32F103C8T6 Minimum System Development Board (Blue Pill)",
    category: "Microcontrollers",
    manufacturer: "STMicroelectronics",
    sku: "STM32F103C8T6-BP",
    price: 189,
    originalPrice: 249,
    badge: "ARM 32-bit",
    stock: "In Stock",
    inStockCount: 290,
    specs: "ARM Cortex-M3 72MHz, 64KB Flash, 20KB SRAM, USB micro connector",
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 189 },
      { minQty: 10, maxQty: 49, pricePerUnit: 169 },
      { minQty: 50, maxQty: null, pricePerUnit: 149 },
    ],
    techSpecs: {
      core: "ARM Cortex-M3 32-Bit",
      clockSpeed: "72 MHz",
      memory: "64 KB Flash, 20 KB SRAM",
      voltage: "2.0V to 3.6V DC",
    },
    whatsIncluded: ["1x STM32F103C8T6 Board", "2x 20-pin Header Strips"],
    compatibleWith: ["STM32CubeIDE", "Keil MDK", "Arduino STM32 Core"],
    description: "Industry standard 32-bit ARM Cortex-M3 board featuring high computing speed and rich I/O peripherals at budget prototyping prices."
  },
  {
    id: "l298n-motor-driver-module",
    name: "L298N Dual H-Bridge Motor Driver Module (2A Peak)",
    category: "Motors",
    manufacturer: "STMicroelectronics / Generic",
    sku: "MOD-L298N-DUAL",
    price: 149,
    originalPrice: 199,
    stock: "In Stock",
    inStockCount: 155,
    specs: "Drive 2 DC Motors or 1 Stepper Motor, 5V-35V Operating Range",
    rating: 4.6,
    reviewCount: 204,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 149 },
      { minQty: 10, maxQty: 49, pricePerUnit: 135 },
      { minQty: 50, maxQty: null, pricePerUnit: 119 },
    ],
    techSpecs: {
      driverChip: "L298N Dual H-Bridge",
      motorVoltage: "5V - 35V DC",
      peakCurrent: "2A per bridge channel",
      maxPower: "25W",
    },
    whatsIncluded: ["1x L298N Motor Driver Module with Heat Sink"],
    compatibleWith: ["Arduino", "Raspberry Pi", "ESP32", "DC Motors", "Stepper Motors"],
    description: "Heavy duty motor controller module for robotics, automated rovers, smart cars, and high current solenoid control."
  },
  {
    id: "mpu6050-gyro-accelerometer",
    name: "MPU-6050 6-DOF Gyroscope and Accelerometer Module",
    category: "Sensors",
    manufacturer: "InvenSense",
    sku: "MPU6050-GY521",
    price: 129,
    originalPrice: 179,
    stock: "In Stock",
    inStockCount: 210,
    specs: "3-Axis Gyroscope + 3-Axis Accelerometer, I2C Interface, DMP Onboard",
    rating: 4.8,
    reviewCount: 315,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 129 },
      { minQty: 10, maxQty: 49, pricePerUnit: 115 },
      { minQty: 50, maxQty: null, pricePerUnit: 99 },
    ],
    techSpecs: {
      gyroRange: "±250 500 1000 2000 °/s",
      accelRange: "±2 ±4 ±8 ±16 g",
      communication: "Standard I2C Protocol (16-bit ADC per channel)",
      voltage: "3.3V - 5V DC (onboard LDO)",
    },
    whatsIncluded: ["1x MPU6050 GY-521 Module", "1x Straight Pin Header", "1x Right Angle Pin Header"],
    compatibleWith: ["Drone Flight Controllers", "Arduino", "ESP32", "Robotics Motion Tracking"],
    description: "Precise 6-axis motion tracking device combining a 3-axis gyroscope and a 3-axis accelerometer with on-chip Digital Motion Processor (DMP)."
  },
  {
    id: "sg90-micro-servo-motor",
    name: "TowerPro SG90 9g Micro Servo Motor 180 Degree",
    category: "Motors",
    manufacturer: "TowerPro",
    sku: "SERVO-SG90-9G",
    price: 99,
    originalPrice: 149,
    stock: "In Stock",
    inStockCount: 380,
    specs: "Torque 1.8kg/cm, 180 Degree Rotation, 9 Grams Ultra Light",
    rating: 4.5,
    reviewCount: 520,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 99 },
      { minQty: 10, maxQty: 49, pricePerUnit: 89 },
      { minQty: 50, maxQty: null, pricePerUnit: 75 },
    ],
    techSpecs: {
      motorType: "Micro Analog Servo",
      torque: "1.8 kg/cm (4.8V)",
      operatingVoltage: "4.8V to 6.0V DC",
      dimensions: "23 × 12.2 × 29 mm",
      weight: "9 grams",
    },
    whatsIncluded: ["1x SG90 Servo Motor", "3x Plastic Horns", "3x Mounting Screws"],
    compatibleWith: ["Arduino Servo Library", "ESP32 PWM", "Raspberry Pi GPIO"],
    description: "Lightweight micro servo for robotics, pan-tilt camera mounts, RC planes, and custom mechanical actuators."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 79 },
      { minQty: 10, maxQty: 49, pricePerUnit: 69 },
      { minQty: 50, maxQty: null, pricePerUnit: 59 },
    ],
    techSpecs: {
      sensorType: "Capacitive Humidity & NTC Temperature",
      range: "0 to 50°C / 20 to 90% RH",
      operatingVoltage: "3.3V to 5.5V DC",
      interface: "1-Wire Digital Signal",
    },
    whatsIncluded: ["1x DHT11 Module", "1x 3-Pin Female-to-Female Jumper Cable"],
    compatibleWith: ["Arduino", "ESP32", "Raspberry Pi"],
    description: "Basic, ultra-low-cost digital temperature and humidity sensor calibrated digital signal output."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 499 },
      { minQty: 10, maxQty: 49, pricePerUnit: 449 },
      { minQty: 50, maxQty: null, pricePerUnit: 399 },
    ],
    techSpecs: {
      dimensions: "Up to 100mm x 100mm",
      layers: "2-Layer Double Sided",
      thickness: "1.6mm FR-4 TG130",
      surfaceFinish: "HASL Lead-Free",
    },
    whatsIncluded: ["5x Fabricated PCB Boards", "Full Flying Probe Electrical Test"],
    compatibleWith: ["Gerber RS-274X", "KiCad", "EasyEDA", "Altium Designer"],
    description: "Industrial grade 2-layer custom PCB prototyping service with green, black, or blue silkscreen options."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 649 },
      { minQty: 10, maxQty: 49, pricePerUnit: 599 },
      { minQty: 50, maxQty: null, pricePerUnit: 549 },
    ],
    techSpecs: {
      motorType: "Bipolar 2-Phase Stepper",
      torque: "45 Ncm (63.7 oz-in)",
      current: "1.7A per phase",
      dimensions: "42 × 42 × 40 mm",
    },
    whatsIncluded: ["1x NEMA 17 Motor", "1x 1-Meter 4-Pin Jumper Connector Cable"],
    compatibleWith: ["A4988 Driver", "DRV8825", "TMC2209", "3D Printers", "CNC Routers"],
    description: "High torque NEMA 17 stepper motor suitable for 3D printers (Ender, Prusa), CNC laser engravers, and robotic arms."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 549 },
      { minQty: 10, maxQty: 49, pricePerUnit: 499 },
      { minQty: 50, maxQty: null, pricePerUnit: 449 },
    ],
    techSpecs: {
      mcu: "ESP32-S",
      camera: "OV2640 2-Megapixel Sensor",
      ram: "4MB External PSRAM",
      wifi: "802.11 b/g/n",
      operatingVoltage: "5V DC",
    },
    whatsIncluded: ["1x ESP32-CAM Development Board", "1x OV2640 Camera Module Cable"],
    compatibleWith: ["Arduino IDE", "ESP-WHO Face Recognition Framework"],
    description: "Low-cost AI vision board capable of streaming JPEG video, face recognition, and microSD video recording over Wi-Fi."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 1199 },
      { minQty: 10, maxQty: 49, pricePerUnit: 1099 },
      { minQty: 50, maxQty: null, pricePerUnit: 999 },
    ],
    techSpecs: {
      diameter: "1.75 mm ± 0.02 mm",
      printTemp: "230°C - 250°C",
      bedTemp: "70°C - 90°C",
      weight: "1.0 kg (2.2 lbs)",
    },
    whatsIncluded: ["1x 1kg Vacuum Sealed PETG Spool with Desiccant"],
    compatibleWith: ["FDM 3D Printers (Creality, Bambu Lab, Prusa, Voron)"],
    description: "Tough, chemical-resistant PETG filament engineered for outdoor enclosures, mechanical drone arms, and functional prototypes."
  },
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
    volumeTiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 2199 },
      { minQty: 10, maxQty: 49, pricePerUnit: 2049 },
      { minQty: 50, maxQty: null, pricePerUnit: 1899 },
    ],
    techSpecs: {
      capacity: "42 Wh (3505 mAh)",
      outputVoltage: "11.4 V",
      cellType: "A+ Grade Lithium-Polymer",
    },
    whatsIncluded: ["1x WDX0R Dell Compatible Battery", "1x Screwdriver Kit"],
    compatibleWith: ["Dell Inspiron 5368 5378 5565 5567 5568 7368 7560"],
    description: "High-density replacement laptop battery tested for 500+ charge cycles with overcharge and thermal circuit protection."
  }
];

export function getProductById(id: string): ComponentItem | undefined {
  return COMPONENTS_CATALOG.find((item) => item.id === id);
}

export function calculateTierPrice(product: ComponentItem, quantity: number): number {
  if (!product.volumeTiers || product.volumeTiers.length === 0) return product.price;
  const tier = product.volumeTiers.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );
  return tier ? tier.pricePerUnit : product.price;
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
