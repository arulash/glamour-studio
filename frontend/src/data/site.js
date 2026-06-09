import {
  Scissors, BadgeCheck, Hand, Palette, Sparkles, Droplets,
  Calendar, Clock, Gem, ShieldCheck, Award, Lock, Users, Truck
} from "lucide-react";

export const HERO_VIDEO = "https://customer-assets.emergentagent.com/job_8211172e-2c05-4691-9f50-0ecae81cba2e/artifacts/qzkizqhe_13135030_1920_1080_30fps.mp4";

export const BEFORE_AFTER = [
  "https://customer-assets.emergentagent.com/job_8211172e-2c05-4691-9f50-0ecae81cba2e/artifacts/ewfc1utp_images%20%281%29.jpg",
  "https://customer-assets.emergentagent.com/job_8211172e-2c05-4691-9f50-0ecae81cba2e/artifacts/x8jp2v3h_images.jpg",
  "https://customer-assets.emergentagent.com/job_8211172e-2c05-4691-9f50-0ecae81cba2e/artifacts/cf7fludi_WhatsApp%20Image%202026-05-11%20at%2011.12.24.jpeg"
];

export const TEAM = [
  {
    name: "Rahul",
    title: "SENIOR STYLIST",
    exp: "8 years experience",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80&auto=format&fit=crop"
  },
  {
    name: "Arjun",
    title: "BEARD SPECIALIST",
    exp: "5 years experience",
    photo: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=800&q=80&auto=format&fit=crop"
  },
  {
    name: "Kiran",
    title: "COLOR EXPERT",
    exp: "6 years experience",
    photo: "https://images.unsplash.com/photo-1639747280929-e84e673b1cd6?w=800&q=80&auto=format&fit=crop"
  }
];

export const SERVICES = [
  { id: "haircut",   name: "Signature Haircut",     short: "Haircut",       price: 300, duration: 45, icon: Scissors,
    desc: "Precision cut tailored to your face, lifestyle and the way you like to wear it." },
  { id: "beard",     name: "Beard Trim & Shape",    short: "Beard Trim",    price: 200, duration: 30, icon: BadgeCheck,
    desc: "Architectural beard work — trimmed, edged and finished with warm oil." },
  { id: "facial",    name: "Men's Facial",          short: "Facial",        price: 500, duration: 60, icon: Sparkles,
    desc: "Deep cleanse, exfoliation and steam — built for Bangalore weather and Indian skin." },
  { id: "color",     name: "Hair Color",            short: "Hair Color",    price: 800, duration: 90, icon: Palette,
    desc: "From natural cover-ups to bold statements — ammonia-free imports only." },
  { id: "massage",   name: "Premium Head Massage",  short: "Head Massage",  price: 250, duration: 30, icon: Hand,
    desc: "Twenty minutes of pressure-point work with warm almond and rosemary oil." },
  { id: "shave",     name: "Luxury Hot Towel Shave",short: "Luxury Shave",  price: 350, duration: 45, icon: Droplets,
    desc: "Single-use blade, three towels, four oils. The closest, calmest shave in the city." }
];

export const RITUALS = [
  {
    id: "sharp",
    label: "THE RITUAL",
    name: "The Sharp Exit",
    tag: "For the man who means business.",
    items: ["haircut", "beard"],
    price: 400,
    save: 100,
    popular: false
  },
  {
    id: "reset",
    label: "THE RITUAL",
    name: "The Glamour Reset",
    tag: "The full reset. Walk in one man, walk out another.",
    items: ["haircut", "shave", "massage"],
    price: 700,
    save: 200,
    popular: true
  },
  {
    id: "royal",
    label: "THE RITUAL",
    name: "The Royal Treatment",
    tag: "For those who refuse to compromise on anything.",
    items: ["haircut", "facial", "massage", "color"],
    price: 1500,
    save: 350,
    popular: false
  }
];

export const WHY_HOME = [
  { icon: Calendar, title: "Online Booking 24/7", body: "Reserve your slot at any hour, instant confirmation, no callbacks." },
  { icon: Clock,    title: "Zero Wait Time",      body: "Punctual to the minute. Your appointment starts the moment you arrive." },
  { icon: Gem,      title: "Premium Products",    body: "Curated grooming tools, oils and balms from world class brands only." }
];

export const WHY_ABOUT = [
  { icon: Award,       title: "Master Craftsmen",   body: "Every stylist has at least 5 years dedicated grooming experience." },
  { icon: Clock,       title: "On-Time Promise",    body: "Walk in at your slot, walk out on time. Always." },
  { icon: Gem,         title: "Premium Imports",    body: "Italian shears, German clippers, French oils only." },
  { icon: ShieldCheck, title: "Hygiene First",      body: "Sterilised tools, fresh linens, single-use blades. Every single time." },
  { icon: Users,       title: "Built For Men",      body: "Designed for the modern Bangalore man who values discretion." },
  { icon: Lock,        title: "Private Experience", body: "No crowded waiting. No noise. Just you and the craft." }
];

export const TESTIMONIALS = [
  { name: "ROHAN MEHTA",     body: "Walked in for a quick trim, walked out feeling brand new. The hot towel finish is unreal. Best grooming spot in Koramangala." },
  { name: "ADITYA KRISHNAN", body: "These guys actually listen. My beard has never looked sharper. The ambience is moody, dim and premium — feels like a lounge, not a salon." },
  { name: "KARAN BHATIA",    body: "Online booking is a breeze and they always start on time. Quality is consistent every single visit. Worth every rupee." }
];

export const SALON = {
  name: "Glamour Studio",
  address: "5th Block Koramangala, Bangalore 560095",
  phone: "+91 98765 43210",
  hours: "Monday — Sunday · 9 AM — 8 PM",
  closed: "Closed Tuesdays",
  instagram: "@glamourstudio.blr",
  mapsEmbed: "https://www.google.com/maps?q=5th+Block+Koramangala+Bangalore+560095&output=embed"
};
