import type {
  Campaign,
  CommunityEvent,
  Product,
  RentalLocation,
  SizeGuideRow,
} from "../types";

type ProductOverride = Partial<
  Pick<
    Product,
    | "name"
    | "description"
    | "longDescription"
    | "material"
    | "color"
    | "features"
    | "activities"
    | "careNote"
    | "sizeGuide"
  >
>;

type LocationOverride = Partial<
  Pick<RentalLocation, "name" | "address" | "openHours" | "partnerName">
>;

type EventOverride = Partial<
  Pick<
    CommunityEvent,
    | "title"
    | "shortDescription"
    | "description"
    | "venue"
    | "address"
    | "tags"
  >
>;

type CampaignOverride = Partial<
  Pick<
    Campaign,
    | "title"
    | "shortDescription"
    | "description"
    | "terms"
    | "rewardLabel"
    | "howToClaimSteps"
  >
>;

function cmGuide(rows: SizeGuideRow[]): SizeGuideRow[] {
  return rows.map((row) => ({
    size: row.size,
    chest: row.chest?.replace(/ซม\./g, "cm"),
    waist: row.waist?.replace(/ซม\./g, "cm"),
    footLength: row.footLength?.replace(/ซม\./g, "cm"),
  }));
}

export const catalogEn = {
  products: {
    "dri-fit-tee": {
      name: "Dri-Fit Sports Tee",
      description: "Relaxed fit, breathable — great for running and outdoor workouts",
      longDescription:
        "Dri-Fit sports tee with moisture-wicking, lightweight fabric that dries fast. Ideal for running, outdoor training, or group fitness. Relaxed fit for comfortable movement.",
      material: "100% recycled polyester",
      color: "Mint green",
      features: [
        "Breathable, quick-dry",
        "Recycled fabric, eco-friendly",
        "Flat seams reduce chafing",
        "Ozone-washed after every return",
      ],
      activities: ["Running", "Cardio", "Weight training", "Cycling"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "76–81 cm" },
        { size: "S", chest: "81–86 cm" },
        { size: "M", chest: "86–91 cm" },
        { size: "L", chest: "91–97 cm" },
        { size: "XL", chest: "97–102 cm" },
      ]),
      careNote:
        "Every piece is washed, ozone-sanitized, and packed in a biodegradable zip bag before handover.",
    },
    "running-shorts": {
      name: "Running Shorts",
      description: "Light, comfortable shorts with a hidden back pocket",
      longDescription:
        "Light running shorts with an elastic waistband and non-clingy fabric. Hidden back pocket for keys or cards. Great for hot weather or high-mobility workouts.",
      material: "88% polyester + 12% spandex",
      color: "Navy",
      features: [
        "Lightweight and breathable",
        "Elastic waistband",
        "Hidden back pocket",
        "Quick-dry after washing",
      ],
      activities: ["Running", "Sprints", "HIIT", "Power walking"],
      sizeGuide: cmGuide([
        { size: "XS", waist: "58–61 cm" },
        { size: "S", waist: "61–66 cm" },
        { size: "M", waist: "66–71 cm" },
        { size: "L", waist: "71–76 cm" },
        { size: "XL", waist: "76–81 cm" },
      ]),
      careNote:
        "Pockets and zips are checked before every handover. Washed to Tua Plew hygiene standards.",
    },
    leggings: {
      name: "Running Leggings",
      description: "Fitted, highly stretchy leggings for yoga and running",
      longDescription:
        "Mid-rise, high-waist fitted leggings with four-way stretch. Comfortable for yoga, pilates, running, or indoor training without feeling too tight.",
      material: "75% nylon + 25% spandex",
      color: "Purple",
      features: [
        "Four-way stretch",
        "High waist for support",
        "Seamless sides reduce chafing",
        "Not see-through",
      ],
      activities: ["Yoga", "Pilates", "Running", "Aerobics"],
      sizeGuide: cmGuide([
        { size: "XS", waist: "56–59 cm" },
        { size: "S", waist: "59–64 cm" },
        { size: "M", waist: "64–69 cm" },
        { size: "L", waist: "69–74 cm" },
        { size: "XL", waist: "74–79 cm" },
      ]),
      careNote:
        "Fabric stretch is checked after every wash for fit and comfort.",
    },
    "yoga-set": {
      name: "Yoga Set (Full)",
      description: "Top + leggings in one set — ready to move",
      longDescription:
        "Complete yoga set with a relaxed top and fitted leggings in soft organic cotton blend. Great for yoga, pilates, stretching, or light workouts — one set, no mixing needed.",
      material: "95% organic cotton + 5% spandex",
      color: "Coral",
      features: [
        "Full set: top + leggings",
        "Soft organic fabric",
        "Clean design for any class",
        "Cheaper than renting separately",
      ],
      activities: ["Yoga", "Pilates", "Stretching", "Aerobics"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "76–81 cm", waist: "56–59 cm" },
        { size: "S", chest: "81–86 cm", waist: "59–64 cm" },
        { size: "M", chest: "86–91 cm", waist: "64–69 cm" },
        { size: "L", chest: "91–97 cm", waist: "69–74 cm" },
        { size: "XL", chest: "97–102 cm", waist: "74–79 cm" },
      ]),
      careNote:
        "Set pieces are packed separately in paired zip bags for hygiene and inspection.",
    },
    "running-shoes": {
      name: "Running Shoes",
      description: "Lightweight running shoes with cushioning and ventilation",
      longDescription:
        "Running shoes for roads and indoor tracks. Medium cushioning, grippy outsole, breathable mesh upper. Slip-on style without laces. Great for 5–10 km runs or cardio classes.",
      material: "Mesh upper + EVA foam + rubber sole",
      color: "Grey-orange",
      features: [
        "Lightweight with impact cushioning",
        "Non-slip rubber sole",
        "Good ventilation",
        "Cleaned and sanitized every time",
      ],
      activities: ["Running", "Power walking", "Cardio", "Treadmill"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "training-shoes": {
      name: "Training Shoes",
      description: "Stable shoes for weights and functional training",
      longDescription:
        "Wide-toe training shoes with a flat sole for grip and heel cushioning. Ideal for weight training, functional fitness, aerobics, or indoor group classes. Comfortable, not tight.",
      material: "Synthetic leather + foam + rubber sole",
      color: "Black-green",
      features: [
        "Wide toe box, comfortable fit",
        "Flat sole for stability",
        "Great for weights and functional",
        "Cleaned and sanitized every time",
      ],
      activities: ["Weight training", "Functional", "HIIT", "Aerobics"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Soles and seams are inspected after every return. Cleaned and sanitized before the next customer.",
    },
    "nike-pegasus": {
      name: "Nike Air Zoom Pegasus",
      description: "Nike running shoes with React foam cushioning",
      longDescription:
        "Nike Air Zoom Pegasus from our partner brand program. Great for mid-distance runs with React foam cushioning, breathable mesh, and lightweight feel. Every pair is cleaned to Tua Plew standards before handover.",
      material: "Flymesh upper + React foam + rubber sole",
      color: "White-black",
      features: [
        "React foam impact cushioning",
        "Lightweight for mid-distance runs",
        "Breathable mesh upper",
        "Partner brand quality",
      ],
      activities: ["Running", "Power walking", "Cardio", "Treadmill"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every partner-brand pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "adidas-ultraboost": {
      name: "Adidas Ultraboost",
      description: "Adidas running shoes with responsive Boost foam",
      longDescription:
        "Adidas Ultraboost from our partner brand program. Responsive Boost foam and Primeknit upper for a snug fit. Great for running and long walks. Cleaned to Tua Plew standards before every rental.",
      material: "Primeknit + Boost foam + Continental rubber sole",
      color: "Black-white",
      features: [
        "Responsive Boost foam",
        "Snug Primeknit upper",
        "Continental rubber grip",
        "Partner brand quality",
      ],
      activities: ["Running", "Power walking", "Cardio", "Treadmill"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every partner-brand pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "nb-1080": {
      name: "New Balance Fresh Foam 1080",
      description: "New Balance running shoes with soft Fresh Foam X",
      longDescription:
        "New Balance Fresh Foam 1080 from our partner brand program. Plush Fresh Foam X cushioning for long runs and recovery days. Cleaned to Tua Plew standards before every rental.",
      material: "Engineered mesh + Fresh Foam X",
      color: "Grey-blue",
      features: [
        "Plush Fresh Foam X cushioning",
        "Great for long runs",
        "Breathable mesh upper",
        "Partner brand quality",
      ],
      activities: ["Running", "Power walking", "Cardio", "Treadmill"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every partner-brand pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "on-cloudrunner": {
      name: "On Cloudrunner",
      description: "Lightweight On running shoes with CloudTec cushioning",
      longDescription:
        "On Cloudrunner from our partner brand program. CloudTec impact cushioning in an ultra-light package. Great for city runs and walks. Cleaned to Tua Plew standards before every rental.",
      material: "Engineered mesh + CloudTec + Helion foam",
      color: "White-blue",
      features: [
        "CloudTec impact cushioning",
        "Ultra-lightweight",
        "Great for city runs and walks",
        "Partner brand quality",
      ],
      activities: ["Running", "Power walking", "Cardio", "Treadmill"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every partner-brand pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "sports-tank-top": {
      name: "Sports Tank Top",
      description: "Light, breathable tank for cardio and multi-sport use",
      longDescription:
        "Lightweight polyester sports tank with moisture-wicking fabric and a roomy fit. Great for running, badminton, aerobics, or outdoor workouts in warm weather.",
      material: "92% polyester + 8% spandex",
      color: "Blue",
      features: [
        "Ultra-lightweight",
        "Breathable",
        "Roomy armholes",
        "Quick-dry after washing",
      ],
      activities: ["Running", "Badminton", "Aerobics", "Cycling"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "74–79 cm" },
        { size: "S", chest: "79–84 cm" },
        { size: "M", chest: "84–89 cm" },
        { size: "L", chest: "89–95 cm" },
        { size: "XL", chest: "95–100 cm" },
      ]),
      careNote:
        "Every piece is washed, ozone-sanitized, and packed in a biodegradable zip bag before handover.",
    },
    "training-pants": {
      name: "Warm-Up Training Pants",
      description: "Light long pants — comfortable for warm-ups",
      longDescription:
        "Lightweight warm-up pants with stretch and an elastic waist. Comfortable before and after workouts, or for easy recovery walks.",
      material: "85% polyester + 15% spandex",
      color: "Grey",
      features: [
        "Lightweight and comfortable",
        "Elastic waistband",
        "Great for warm-ups",
        "Quick-dry",
      ],
      activities: ["Warm-up", "Walking", "Stretching", "Recovery"],
      sizeGuide: cmGuide([
        { size: "XS", waist: "58–61 cm" },
        { size: "S", waist: "61–66 cm" },
        { size: "M", waist: "66–71 cm" },
        { size: "L", waist: "71–76 cm" },
        { size: "XL", waist: "76–81 cm" },
      ]),
      careNote:
        "Elastic waistbands are checked before every handover. Washed to Tua Plew hygiene standards.",
    },
    "walk-shoes": {
      name: "Walking Shoes",
      description: "Light, comfortable shoes for walking and light cardio",
      longDescription:
        "Lightweight walking shoes with heel cushioning and a grippy outsole. Great for power walking, light cardio, or general gym use.",
      material: "Mesh upper + EVA foam + rubber sole",
      color: "Grey-white",
      features: [
        "Lightweight",
        "Comfortable fit",
        "Non-slip rubber sole",
        "Cleaned every time",
      ],
      activities: ["Power walking", "Cardio", "Treadmill", "Recovery"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Every pair is cleaned, UV- and ozone-sanitized, and packed in a separate zip bag.",
    },
    "yoga-bra": {
      name: "Sports Bra",
      description: "Supportive, comfortable bra for yoga and pilates",
      longDescription:
        "Stretch sports bra with medium support and secure straps that stay in place. Great for yoga, pilates, barre, and indoor classes.",
      material: "80% nylon + 20% spandex",
      color: "Purple",
      features: [
        "Medium support",
        "Highly stretchy fabric",
        "Secure straps",
        "Non-irritating",
      ],
      activities: ["Yoga", "Pilates", "Barre", "Stretching"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "74–79 cm" },
        { size: "S", chest: "79–84 cm" },
        { size: "M", chest: "84–89 cm" },
        { size: "L", chest: "89–95 cm" },
        { size: "XL", chest: "95–100 cm" },
      ]),
      careNote:
        "Washed to hygiene standards. Fabric stretch is checked after every wash.",
    },
    "pilates-shorts": {
      name: "Yoga Shorts",
      description: "Fitted four-way stretch shorts — not see-through",
      longDescription:
        "High-waist yoga shorts with four-way stretch and a snug fit. Not see-through when bending or stretching. Great for yoga, pilates, and barre.",
      material: "78% nylon + 22% spandex",
      color: "Hot pink",
      features: [
        "High waist for support",
        "Four-way stretch",
        "Not see-through",
        "Seamless sides",
      ],
      activities: ["Yoga", "Pilates", "Barre", "Stretching"],
      sizeGuide: cmGuide([
        { size: "XS", waist: "56–59 cm" },
        { size: "S", waist: "59–64 cm" },
        { size: "M", waist: "64–69 cm" },
        { size: "L", waist: "69–74 cm" },
        { size: "XL", waist: "74–79 cm" },
      ]),
      careNote:
        "Stretch and opacity are checked after every wash.",
    },
    "pilates-set": {
      name: "Pilates Set (Full)",
      description: "Bra + shorts in one set — ready for class",
      longDescription:
        "Complete pilates set with a sports bra and fitted shorts in soft, stretchy fabric. Flattering fit for pilates, yoga, and barre.",
      material: "75% nylon + 25% spandex",
      color: "Light purple",
      features: [
        "Full set: bra + shorts",
        "Flattering fit",
        "Soft, stretchy fabric",
        "Cheaper than renting separately",
      ],
      activities: ["Pilates", "Yoga", "Barre", "Stretching"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "74–79 cm", waist: "56–59 cm" },
        { size: "S", chest: "79–84 cm", waist: "59–64 cm" },
        { size: "M", chest: "84–89 cm", waist: "64–69 cm" },
        { size: "L", chest: "89–95 cm", waist: "69–74 cm" },
        { size: "XL", chest: "95–100 cm", waist: "74–79 cm" },
      ]),
      careNote:
        "Set pieces are packed separately in paired zip bags for hygiene and inspection.",
    },
    "compression-tee": {
      name: "Compression Tee",
      description: "Fitted top for muscle support — great for weights and CrossFit",
      longDescription:
        "Four-way stretch compression tee that supports muscles and reduces vibration. Ideal for weight training, CrossFit, and strength work.",
      material: "82% polyester + 18% spandex",
      color: "Black",
      features: [
        "Muscle support fit",
        "Four-way stretch",
        "Abrasion resistant",
        "Low odor retention",
      ],
      activities: ["Weight training", "CrossFit", "HIIT", "Functional"],
      sizeGuide: cmGuide([
        { size: "XS", chest: "76–81 cm" },
        { size: "S", chest: "81–86 cm" },
        { size: "M", chest: "86–91 cm" },
        { size: "L", chest: "91–97 cm" },
        { size: "XL", chest: "97–102 cm" },
      ]),
      careNote:
        "Fabric stretch is checked after every wash for proper support.",
    },
    "crossfit-shorts": {
      name: "CrossFit Shorts",
      description: "Durable, stretchy shorts with a hidden pocket",
      longDescription:
        "CrossFit shorts in abrasion-resistant stretch fabric with a side pocket. Built for weights, functional training, and WODs.",
      material: "90% polyester + 10% spandex",
      color: "Charcoal",
      features: [
        "Durable fabric",
        "High stretch",
        "Hidden side pocket",
        "WOD-ready",
      ],
      activities: ["CrossFit", "Weight training", "HIIT", "Functional"],
      sizeGuide: cmGuide([
        { size: "XS", waist: "58–61 cm" },
        { size: "S", waist: "61–66 cm" },
        { size: "M", waist: "66–71 cm" },
        { size: "L", waist: "71–76 cm" },
        { size: "XL", waist: "76–81 cm" },
      ]),
      careNote:
        "Pockets and seams are checked before every handover. Washed to hygiene standards.",
    },
    "crossfit-shoes": {
      name: "CrossFit Shoes",
      description: "Flat, stable shoes built for lifting and WODs",
      longDescription:
        "CrossFit shoes with a wide toe box, flat grippy sole, and heel cushioning. Built to handle stretching, abrasion, and high-intensity WODs.",
      material: "Synthetic leather + foam + rubber sole",
      color: "Black-green",
      features: [
        "Flat sole for stability",
        "Wide toe box",
        "Stretch and abrasion resistant",
        "Cleaned every time",
      ],
      activities: ["CrossFit", "Weight training", "HIIT", "Functional"],
      sizeGuide: cmGuide([
        { size: "38", footLength: "24.0 cm" },
        { size: "39", footLength: "24.5 cm" },
        { size: "40", footLength: "25.0 cm" },
        { size: "41", footLength: "25.5 cm" },
        { size: "42", footLength: "26.0 cm" },
        { size: "43", footLength: "26.5 cm" },
      ]),
      careNote:
        "Soles and seams are inspected after every return. Cleaned and sanitized before the next customer.",
    },
  } satisfies Record<string, ProductOverride>,

  locations: {
    lumpini: {
      name: "Lumpini Park",
      address: "Rama IV Rd, Lumphini, Pathum Wan, Bangkok",
      openHours: "06:00 – 20:00",
    },
    siam: {
      name: "Siam Square",
      address: "Rama I Rd, Pathum Wan, Pathum Wan, Bangkok",
      openHours: "24 hrs",
    },
    asoke: {
      name: "Asoke (BTS)",
      address: "Sukhumvit Rd, Khlong Toei, Khlong Toei, Bangkok",
      openHours: "05:30 – 22:00",
    },
    samyan: {
      name: "Samyan",
      address: "Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok",
      partnerName: "Fitness First Samyan",
      openHours: "06:00 – 21:00",
    },
    chatuchak: {
      name: "Chatuchak Park",
      address: "Phahonyothin Rd, Chatuchak, Chatuchak, Bangkok",
      openHours: "05:00 – 19:00",
    },
    thonglor: {
      name: "Thonglor",
      address: "Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok",
      partnerName: "Virgin Active Thonglor",
      openHours: "06:00 – 22:00",
    },
    benjakitti: {
      name: "Benjakitti Park",
      address: "Ratchadaphisek Rd, Khlong Toei, Khlong Toei, Bangkok",
      openHours: "05:30 – 20:00",
    },
    rotfai: {
      name: "Rot Fai Park",
      address: "Kamphaeng Phet Rd, Chatuchak, Chatuchak, Bangkok",
      openHours: "05:00 – 19:00",
    },
    silom: {
      name: "Silom (BTS Sala Daeng)",
      address: "Silom Rd, Silom, Bang Rak, Bangkok",
      openHours: "06:00 – 21:00",
    },
    rama9: {
      name: "King Rama IX Park",
      address: "Srinagarindra Rd, Nong Bon, Prawet, Bangkok",
      openHours: "05:00 – 20:00",
    },
    phromphong: {
      name: "Phrom Phong (BTS)",
      address: "Sukhumvit Rd, Khlong Toei, Khlong Toei, Bangkok",
      openHours: "05:30 – 22:00",
    },
  } satisfies Record<string, LocationOverride>,

  events: {
    "lumpini-run-club": {
      shortDescription: "Saturday morning runs around Lumpini Park — all levels welcome",
      description:
        "Bangkok's biggest downtown run club. 5–10 km loops around Lumpini with pace groups, post-run stretching, and runner networking. Rent running gear at the nearby Tua Plew Lumpini spot before you start.",
      venue: "Lumpini Park (Ratchadamri entrance)",
      address: "Rama IV Rd, Lumphini, Pathum Wan, Bangkok",
      tags: ["Morning run", "Free", "All levels"],
    },
    "hyrox-bkk-training": {
      shortDescription: "Full Hyrox station practice — run + functional fitness",
      description:
        "Hyrox training for newcomers and competitors. Covers SkiErg, sled push/pull, burpee broad jump, rowing, and wall balls with coaching on technique and pacing. Rent gear at Asoke before joining.",
      address: "Thonglor Soi, Khlong Tan Nuea, Watthana, Bangkok",
      tags: ["Hyrox", "Functional", "Competition"],
    },
    "sunrise-yoga-lumpini": {
      title: "Sunrise Yoga at Lumpini Park",
      shortDescription: "Morning yoga under the trees — ease into your day",
      description:
        "Outdoor Hatha–Vinyasa yoga for beginners and those who want to recover. Led by experienced instructors. Bring your own set or rent clean yoga wear from nearby Tua Plew.",
      venue: "Lumpini Park (lawn near the lake)",
      address: "Rama IV Rd, Lumphini, Pathum Wan, Bangkok",
      tags: ["Yoga", "Morning", "Outdoor"],
    },
    "chatuchak-cycling": {
      shortDescription: "Sunday ride around Chatuchak Park — 20–30 km",
      description:
        "Weekly cycling group starting from Chatuchak Park along green routes and outer roads. Water stops and basic tire repair. Rent a breathable sports top before heading out.",
      venue: "Chatuchak Park (Gate 3)",
      address: "Phahonyothin Rd, Chatuchak, Chatuchak, Bangkok",
      tags: ["Cycling", "Morning", "Group"],
    },
    "asoke-crossfit-wod": {
      shortDescription: "Open Workout of the Day — scaling for every level",
      description:
        "Asoke CrossFit community WOD every Wednesday evening. Coaches scale movements to your level. Great for trying CrossFit or finding workout buddies. Rent training shoes and gear near BTS Asoke.",
      venue: "Fitness Corner Asoke",
      address: "Sukhumvit Rd, Khlong Toei, Khlong Toei, Bangkok",
      tags: ["CrossFit", "WOD", "Evening"],
    },
    "samyan-swim-squad": {
      shortDescription: "Sunday morning swim — 50 m pool, pace groups",
      description:
        "Swim group for enthusiasts with lanes by speed. First 30 minutes are warm-up and technique drills. Freestyle swimmers should manage at least 25 m continuously.",
      venue: "Samyan Swimming Pool",
      address: "Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok",
      tags: ["Swimming", "Technique", "Morning"],
    },
    "siam-pilates": {
      shortDescription: "Small-group pilates focused on core and posture",
      description:
        "Pilates for beginners and intermediates with breath control and core work. Limited to 15 per class. Rent flexible clean wear from the nearby Siam rental spot.",
      venue: "Studio near Siam Square",
      address: "Rama I Rd, Pathum Wan, Pathum Wan, Bangkok",
      tags: ["Pilates", "Core", "Small group"],
    },
    "khao-khaew-hike": {
      shortDescription: "Morning hike with views and tropical forest",
      description:
        "One-day hike at Khao Yai–Khao Khieo, about 8 km with a local guide and water stops. Rent tops and bottoms at the Thonglor rental spot before the trip.",
      venue: "Khao Yai National Park",
      address: "Pak Chong District, Nakhon Ratchasima",
      tags: ["Hiking", "Nature", "Day trip"],
    },
  } satisfies Record<string, EventOverride>,

  campaigns: {
    "rent-10-get-5": {
      title: "Rent 10 times, get 5% off",
      shortDescription:
        "Complete 10 rentals at partner locations and get 5% off your next rental",
      description:
        "Loyalty program for Tua Plew members renting at participating partner locations. Each successful rent-and-return counts as one rental. After 10 within the campaign period, get 5% off automatically at the same partner.",
      terms: [
        "Counts only at participating partner locations",
        "Must return on time for a rental to count",
        "5% discount valid once within 30 days after unlocking",
        "Cannot be combined with other promotions",
        "Tua Plew reserves the right to change terms without notice",
      ],
    },
    "rent-10-gaming-reward": {
      title: "Rent 10 times, get an in-game code",
      shortDescription:
        "Complete 10 sportswear rentals and receive an in-game code for ROV or Roblox",
      description:
        "A Tua Plew member perk for regular sportswear renters. After 10 successful rent-and-return cycles during the campaign period, receive one in-game code — choose ROV (Realm of Valor) or Roblox. Codes are delivered via the app or your registered email.",
      rewardLabel: "In-game code",
      howToClaimSteps: [
        "Join the campaign and rent sportswear through Tua Plew",
        "Return on time — each completed rental counts as one",
        "After 10 rentals, choose an in-game code for ROV or Roblox",
      ],
      terms: [
        "Counts only successful sportswear returns during the campaign period",
        "One code per reward — choose ROV or Roblox",
        "In-game codes are sent via the app or email within 7 business days after qualifying",
        "Codes expire per each game's terms and cannot be exchanged for cash",
        "Claim within 30 days after completing 10 rentals",
        "Rewards and codes are non-transferable",
        "Tua Plew reserves the right to change terms without notice",
      ],
    },
    "first-partner-10": {
      title: "New customers: 10% off at partners",
      shortDescription:
        "First rental at a partner location — instant 10% off",
      description:
        "For members who have never rented at a Tua Plew partner before. First rental at Fitness First Samyan or Virgin Active Thonglor gets 10% off at checkout.",
      terms: [
        "One use per account",
        "First rental at a participating partner only",
        "Discount applies to rental fee only, not deposit (if any)",
        "Must log in with a Tua Plew account before renting",
      ],
    },
    "weekend-yoga-bundle": {
      title: "Weekend yoga rental — 15% off",
      shortDescription:
        "Rent a yoga set or running leggings on Sat–Sun and get 15% off",
      description:
        "Weekend promo for yoga and pilates fans. Rent a full yoga set or running leggings every Saturday and Sunday and get 15% off at any Tua Plew location.",
      terms: [
        "Valid Saturdays and Sundays only",
        "Yoga sets and running leggings only",
        "Valid at all Tua Plew locations",
        "One use per day per account",
      ],
    },
    "summer-run-club": {
      title: "Summer Run Club — 8% off",
      shortDescription:
        "Join a Tua Plew run club event, then rent running gear with 8% off",
      description:
        "Summer campaign: members who join a run club event on the Tua Plew community page and rent running gear (top, bottom, or shoes) within 7 days get 8% off.",
      terms: [
        "Must join a run club event via the Tua Plew community page",
        "Rent running gear within 7 days after the event",
        "Tops, bottoms, and running shoes only",
        "One use per event",
      ],
    },
  } satisfies Record<string, CampaignOverride>,
};

export type { ProductOverride, LocationOverride, EventOverride, CampaignOverride };
