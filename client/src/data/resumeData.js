export const profile = {
  name: "Rakesh Achutha",
  roles: ["Quantum Researcher","Entrepreneur","Quantum and Math Consultant", "Oxbridge Tutor"],
  tagline:
    "PhD researcher at Cambridge working on quantum many-body systems, Quantum Algorithms and Quantum Machine Learning — and a Start up enthusiast, always eager to learn, loves to talk people and learn from them.",
  email: "rakeshachutha@gmail.com",
  website: "rakeshachutha.com",
};

export const proofPoints = [
  { value: "Cambridge", label: "PhD, DAMTP" },
  { value: "PRL", label: "Published, 2025" },
  { value: "IIT BHU", label: "Mathematics and Computer Science 2025" },
  { value: "4+ yrs", label: "Teaching and Research" },
];

export const about = {
  research: `I'm a PhD student in the Department of Applied Mathematics and Theoretical Physics at the University of Cambridge, supervised by Prof. Angela Capel Cauvas and supported by the Cambridge International Scholarship. My work sits at the intersection of quantum information, quantum complexity, and learning theory — most recently proving efficient classical simulation of 1D long-range interacting systems at any temperature, published in Physical Review Letters.`,
  teaching: `Alongside research, I've taught mathematics for over four years — from GCSE and A-level through to BMO olympiad preparation and Oxbridge admissions coaching. I graduated top of my department at IIT (BHU) with a 9.43 CPI, ranked 68th nationally in GATE 2024, and placed in the top 0.1% of 1.3 million candidates in JEE Advanced. I know these exams from the inside, and I teach by making hard ideas feel inevitable rather than intimidating.`,
};

export const experience = [
  {
    org: "RIKEN — Quantum Complexity Hakubi Research Team",
    location: "Tokyo, Japan",
    role: "Research Internship",
    supervisor: "Dr. Tomotaka Kuwahara",
    period: "May 2024 – July 2024",
    points: [
      "Proved efficient classical simulation of 1D long-range interacting systems at any temperature.",
      "Published in Physical Review Letters; selected for poster presentation at QIP 2025.",
    ],
  },
  {
    org: "Singapore Management University",
    location: "Singapore",
    role: "Research Project",
    supervisor: "Prof. Paul Griffin",
    period: "Jan 2024 – Aug 2024",
    points: [
      "Quantum-enhanced modelling and sampling of financial time-series data for rare event forecasting.",
    ],
  },
  {
    org: "Goodwill Computing Lab, Northeastern University",
    location: "Boston, USA",
    role: "Remote Research Internship",
    supervisor: "Prof. Devesh Tiwari",
    period: "June 2023 – Aug 2023",
    points: [
      "Quantum natural language processing on NISQ-era machines using variational quantum circuits.",
      "Accepted at SC24 (~20% acceptance rate).",
    ],
  },
  {
    org: "Indian Institute of Technology (BHU)",
    location: "Varanasi, India",
    role: "Research Project",
    supervisor: "Prof. Vignesh Sivaraman",
    period: "May 2022 – June 2022",
    points: [
      "Designed quantum generative adversarial networks for tabular data synthesis.",
    ],
  },
];

export const publications = [
  {
    title:
      "Provably Efficient Simulation of 1D Long-Range Interacting Systems at Any Temperature",
    authors:
      "Rakesh Achutha, Donghoon Kim, Yusuke Kimura, Tomotaka Kuwahara",
    venue: "Physical Review Letters",
    venueShort: "PRL",
    year: "2025",
    url: "https://link.aps.org/doi/10.1103/PhysRevLett.134.190404",
  },
  {
    title: "LexiQL: Quantum Natural Language Processing on NISQ-era Machines",
    authors:
      "Daniel Silver, Aditya Ranjan, Rakesh Achutha, Tirthak Patel, Devesh Tiwari",
    venue: "Proceedings of SC '24",
    venueShort: "SC24",
    year: "2024",
    url: "https://dl.acm.org/doi/10.1109/SC41406.2024.00073",
  },
  {
    title:
      "QTabGAN: A Hybrid Quantum-Classical GAN for Tabular Data Synthesis",
    authors: "Subhangi Kumari, Rakesh Achutha, Vignesh Sivaraman",
    venue: "arXiv preprint",
    venueShort: "arXiv",
    year: "2026",
    url: "https://arxiv.org/abs/2602.12704",
  },
];

export const skills = [
  {
    category: "Research Areas",
    items: [
      "Quantum Information",
      "Quantum Complexity",
      "Quantum Machine Learning",
      "Many-Body Systems",
      "Quantum Learning Theory",
      "Large Language Models",
    ],
  },
  {
    category: "Programming",
    items: ["Python", "C", "C++", "MATLAB", "LaTeX"],
  },
  {
    category: "Libraries & Tools",
    items: [
      "NumPy",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Pandas",
      "Matplotlib",
      "Qiskit",
      "PennyLane",
    ],
  },
  {
    category: "Teaching Subjects",
    items: [
      "Number Theory",
      "Geometry",
      "Real & Complex Analysis",
      "Discrete Mathematics",
      "Further Mathematics",
      "University Mathematics",
      "Olympiad Mathematics",
    ],
  },
];

export const teaching = {
  intro:
    "Over four years teaching mathematics across UK and international curricula — from foundations through to olympiad and Oxbridge admissions level.",
  roles: [
    {
      title: "Specialised Olympiad & Oxbridge Tutor",
      org: "Independent, United Kingdom",
      period: "Jan 2025 – present",
      description:
        "Coaching BMO candidates and Cambridge/Oxford applicants through admissions tests and interviews.",
    },
    {
      title: "Mathematics Tutor — A-level & Further Maths",
      org: "Superprof, Spires, Find Tutors",
      period: "June 2022 – present",
      description:
        "IB, IGCSE, and UK board students at A-level and Further Maths level.",
    },
    {
      title: "Mathematics Teacher — GCSE & A-level",
      org: "Unacademy",
      period: "Aug 2021 – April 2022",
      description:
        "Live online classes to large cohorts across GCSE and A-level syllabi.",
    },
    {
      title: "Mathematics Teacher",
      org: "Smart Academy, Varanasi",
      period: "Nov 2020 – Aug 2021",
      description:
        "High school mathematics. Recipient of the Best Teacher Award, 2021.",
    },
  ],
  offerings: [
    "Oxbridge admissions (MAT, STEP, interviews)",
    "BMO & olympiad preparation",
    "A-level & Further Maths",
    "IB, IGCSE & GCSE mathematics",
    "University-level maths & quantum computing",
    "Research guidance & PhD applications",
  ],
};

export const achievements = [
  { value: "AIR 68", label: "GATE 2024, Mathematics" },
  { value: "Top 0.1%", label: "JEE Advanced 2020, of 1.3M candidates" },
  { value: "Startup School", label: "2026" },
  { value: "QIP 2025", label: "Selected for poster presentation" },
  { value: "4th place", label: "Inter-IIT Quantum Challenge 2023" },
  { value: "Top 20", label: "Regional Mathematics Olympiad, state level" },
  { value: "Best Teacher", label: "Smart Academy, 2021" },
  { value: "Scholarship", label: "Cambridge International Scholarship" },
];