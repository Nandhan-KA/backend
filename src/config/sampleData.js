const events = [
  {
    title: "AI Ethics Hackathon",
    description: "Create AI solutions that address ethical concerns in technology. Topics include privacy, bias, transparency, and responsible AI development.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    eventType: "hackathon",
    capacity: 100,
    registrationFee: 500,
    prizes: ["₹50,000", "₹25,000", "₹10,000"],
    requirements: ["Laptop", "AI/ML knowledge", "Team of 2-4 members"],
    isTeamEvent: true,
    teamSize: {
      min: 2,
      max: 4
    }
  },
  {
    title: "Blockchain Workshop",
    description: "Learn the fundamentals of blockchain technology, smart contracts, and decentralized applications. Hands-on workshop with real-world applications.",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55",
    eventType: "workshop",
    capacity: 50,
    registrationFee: 300,
    requirements: ["Laptop", "Basic programming knowledge"],
    isTeamEvent: false
  },
  {
    title: "Competitive Coding Contest",
    description: "Test your programming skills against the best coders. Solve algorithmic challenges and optimize for speed and efficiency.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3",
    eventType: "competition",
    capacity: 200,
    registrationFee: 200,
    prizes: ["₹20,000", "₹10,000", "₹5,000"],
    requirements: ["Laptop", "Knowledge of any programming language"],
    isTeamEvent: false
  },
  {
    title: "Future of Technology Panel Discussion",
    description: "Industry experts discuss emerging technologies and their impact on society, business, and education.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    eventType: "panel",
    capacity: 300,
    registrationFee: 0,
    isTeamEvent: false
  }
];

const speakers = [
  {
    name: "Dr. Aisha Patel",
    title: "Chief AI Ethicist",
    company: "TechGlobe",
    bio: "Dr. Patel specializes in ethical AI development and has advised multiple Fortune 500 companies on responsible technology implementation.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/aishapatel",
      twitter: "https://twitter.com/drpatel",
      website: "https://aishapatel.com"
    },
    talkTitle: "The Future of Ethical AI",
    talkDescription: "Exploring the challenges and opportunities in developing ethical AI systems that respect human values and privacy.",
    featured: true
  },
  {
    name: "James Rodriguez",
    title: "Blockchain Architect",
    company: "DecentralTech",
    bio: "James has over 10 years of experience in blockchain technology and has contributed to several major cryptocurrency projects.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/jamesrodriguez",
      github: "https://github.com/jrodriguez",
      website: "https://jamesrodriguez.dev"
    },
    talkTitle: "Blockchain Beyond Crypto",
    talkDescription: "How blockchain technology is revolutionizing industries beyond cryptocurrency, from supply chain to healthcare.",
    featured: true
  },
  {
    name: "Mei Lin",
    title: "Quantum Computing Researcher",
    company: "QuantumLabs",
    bio: "Mei is a leading researcher in quantum computing algorithms with multiple patents in quantum error correction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/meilinquantum",
      twitter: "https://twitter.com/meilinquantum",
      github: "https://github.com/meilin"
    },
    talkTitle: "Quantum Computing: A New Paradigm",
    talkDescription: "Understanding the principles of quantum computing and how it will transform computational capabilities.",
    featured: false
  }
];

const sponsors = [
  {
    name: "TechNova",
    logo: "https://dummyimage.com/200x100/4287f5/ffffff&text=TechNova",
    website: "https://technova.example.com",
    description: "Global technology company specializing in AI and cloud computing solutions.",
    tier: "platinum"
  },
  {
    name: "InnovateX",
    logo: "https://dummyimage.com/200x100/f54242/ffffff&text=InnovateX",
    website: "https://innovatex.example.com",
    description: "Leading innovation hub and technology incubator.",
    tier: "gold"
  },
  {
    name: "DataFlow",
    logo: "https://dummyimage.com/200x100/42f56c/000000&text=DataFlow",
    website: "https://dataflow.example.com",
    description: "Big data analytics and visualization platform.",
    tier: "silver"
  },
  {
    name: "CodeCraft",
    logo: "https://dummyimage.com/200x100/f5d442/000000&text=CodeCraft",
    website: "https://codecraft.example.com",
    description: "Developer tools and software engineering resources.",
    tier: "bronze"
  }
];

const schedule = [
  {
    startTime: new Date("2025-05-09T09:00:00"),
    endTime: new Date("2025-05-09T10:00:00"),
    venue: "Main Auditorium",
    day: 1
  },
  {
    startTime: new Date("2025-05-09T10:30:00"),
    endTime: new Date("2025-05-09T12:30:00"),
    venue: "Workshop Hall A",
    day: 1
  },
  {
    startTime: new Date("2025-05-09T14:00:00"),
    endTime: new Date("2025-05-09T17:00:00"),
    venue: "Coding Arena",
    day: 1
  },
  {
    startTime: new Date("2025-05-10T09:30:00"),
    endTime: new Date("2025-05-10T11:30:00"),
    venue: "Panel Discussion Room",
    day: 2
  }
];

module.exports = { events, speakers, sponsors, schedule }; 