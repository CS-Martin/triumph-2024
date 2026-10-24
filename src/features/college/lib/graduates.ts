export type Graduate = {
  id: string;
  name: string;
  title: string;
  image: string;
  description?: string;
  achievements?: string[];
};

export type CollegeGraduates = {
  collegeName: string;
  graduates: Graduate[];
};

const CS_TITLE = 'Bachelor of Science in Computer Science';
const PLACEHOLDER_TITLE = 'Vice President for Higher Education';

const toga = (file: string) => `/api/r2/files/triumph-2024/toga/TOGA_${file}.webp`;

const placeholder = (id: string): Graduate => ({
  id,
  name: 'FABAY, ALFREDO C.',
  title: PLACEHOLDER_TITLE,
  image: `/graduates/graduate-${id}.png`,
});

const computerStudiesGraduates: Graduate[] = [
  {
    id: '1',
    name: 'ABAWAG, JAMES MARCEL A.',
    title: CS_TITLE,
    image: toga('Abawag, James Marcel A.'),
    description:
      'A dedicated Computer Science graduate with strong analytical skills and a passion for software development.',
    achievements: [CS_TITLE, 'Specialized in Software Engineering', "Dean's Lister"],
  },
  {
    id: '2',
    name: 'AGRAVANTE, MARL VINCENT C.',
    title: CS_TITLE,
    image: toga('Agravante, Marl Vincent C.'),
    description: 'An innovative Computer Science graduate with expertise in web development and database management.',
    achievements: [CS_TITLE, 'Web Development Specialist', 'Academic Excellence Award'],
  },
  {
    id: '3',
    name: 'ALFONSO, ARIEL DOMINIC A.',
    title: CS_TITLE,
    image: toga('Alfonso, Ariel Dominic A.'),
    description: 'A motivated Computer Science graduate with strong problem-solving abilities and technical expertise.',
    achievements: [CS_TITLE, 'Programming Competition Finalist', 'Research Assistant'],
  },
  {
    id: '4',
    name: 'BARTOLOME, EL JON JOSHUA G.',
    title: CS_TITLE,
    image: toga('Bartolome, El Jon Joshua G.'),
    description: 'A skilled Computer Science graduate with proficiency in mobile app development and cloud computing.',
    achievements: [CS_TITLE, 'Mobile App Developer', 'Cloud Computing Certificate'],
  },
  {
    id: '5',
    name: 'BETITO, JOSEPH RAPHAEL L.',
    title: CS_TITLE,
    image: toga('Betito, Joseph Raphael L.'),
    description: 'A driven Computer Science graduate with expertise in data science and machine learning.',
    achievements: [CS_TITLE, 'Data Science Specialist', 'Machine Learning Project Lead'],
  },
  {
    id: '6',
    name: 'CATORCE, HENRY JR. D.',
    title: CS_TITLE,
    image: toga('Catorce, Henry Jr. D.'),
    description: 'A talented Computer Science graduate with strong skills in cybersecurity and network administration.',
    achievements: [CS_TITLE, 'Cybersecurity Specialist', 'Network Administrator Certification'],
  },
  {
    id: '7',
    name: 'CHUA, WILLIAN B.',
    title: CS_TITLE,
    image: toga('Chua, Willian B.'),
    description: 'An accomplished Computer Science graduate with expertise in artificial intelligence and robotics.',
    achievements: [CS_TITLE, 'AI Researcher', 'Robotics Competition Winner'],
  },
  {
    id: '8',
    name: 'FERNANDEZ, JERU KIAN C.',
    title: CS_TITLE,
    image: toga('Fernandez, Jeru Kian C.'),
    description: 'A creative Computer Science graduate with skills in game development and interactive media.',
    achievements: [CS_TITLE, 'Game Developer', 'Interactive Media Designer'],
  },
  {
    id: '9',
    name: 'GUERRERO, MARK JOSEPH R.',
    title: CS_TITLE,
    image: toga('Guerrero, Mark Joseph R.'),
    description: 'A dedicated Computer Science graduate with expertise in full-stack development.',
    achievements: [CS_TITLE, 'Full-Stack Developer', 'Software Architecture Specialist'],
  },
  {
    id: '10',
    name: 'LAGTO, SEAN REVON F.',
    title: CS_TITLE,
    image: toga('Lagto, Sean Revon F.'),
    description: 'An innovative Computer Science graduate with skills in blockchain and distributed systems.',
    achievements: [CS_TITLE, 'Blockchain Developer', 'Distributed Systems Expert'],
  },
  {
    id: '11',
    name: 'MANGUNAY, XIER GABRIEL M.',
    title: CS_TITLE,
    image: toga('Mangunay, Xier Gabriel M.'),
    description: 'A skilled Computer Science graduate with expertise in UI/UX design and front-end development.',
    achievements: [CS_TITLE, 'UI/UX Designer', 'Front-End Development Specialist'],
  },
  {
    id: '12',
    name: 'MARIANO, MARC THOMAS F.',
    title: CS_TITLE,
    image: toga('Mariano, Marc Thomas F.'),
    description: 'A motivated Computer Science graduate with expertise in DevOps and cloud infrastructure.',
    achievements: [CS_TITLE, 'DevOps Engineer', 'Cloud Infrastructure Specialist'],
  },
  {
    id: '13',
    name: 'NABUS, KENRICK JOHN HARVELL B.',
    title: CS_TITLE,
    image: toga('Nabus, Kenrick John Harvell B.'),
    description: 'A talented Computer Science graduate with skills in database design and data analytics.',
    achievements: [CS_TITLE, 'Database Administrator', 'Data Analytics Specialist'],
  },
  {
    id: '14',
    name: 'PALMA, KYLE JAMES G.',
    title: CS_TITLE,
    image: toga('Palma, Kyle James G.'),
    description: 'A driven Computer Science graduate with expertise in embedded systems and IoT.',
    achievements: [CS_TITLE, 'Embedded Systems Engineer', 'IoT Developer'],
  },
  {
    id: '15',
    name: 'PEREZ, MA. LOUISA A.',
    title: CS_TITLE,
    image: toga('Perez, Ma. Louisa A.'),
    description: 'An accomplished Computer Science graduate with expertise in software testing and quality assurance.',
    achievements: [CS_TITLE, 'QA Engineer', 'Software Testing Specialist'],
  },
  {
    id: '16',
    name: 'REMOS, MARY ANGELETTE M.',
    title: CS_TITLE,
    image: toga('Remos, Mary Angelette M.'),
    description: 'A creative Computer Science graduate with skills in digital media and content management.',
    achievements: [CS_TITLE, 'Digital Media Specialist', 'Content Management Expert'],
  },
  {
    id: '17',
    name: 'TORDILLA, ALECZIA S.',
    title: CS_TITLE,
    image: toga('Tordilla, Aleczia S.'),
    description: 'A dedicated Computer Science graduate with expertise in systems analysis and business intelligence.',
    achievements: [CS_TITLE, 'Systems Analyst', 'Business Intelligence Specialist'],
  },
  {
    id: '18',
    name: 'VIDOLA, JAMES EDWARD Q.',
    title: CS_TITLE,
    image: toga('Vidola, James Edward Q.'),
    description: 'An innovative Computer Science graduate with skills in computer graphics and visualization.',
    achievements: [CS_TITLE, 'Graphics Programmer', 'Visualization Specialist'],
  },
  {
    id: '19',
    name: 'VILLASANTA, RAMONCITO D.',
    title: CS_TITLE,
    image: toga('Villasanta, Ramoncito D'),
    description: 'A skilled Computer Science graduate with expertise in network security and penetration testing.',
    achievements: [CS_TITLE, 'Security Analyst', 'Penetration Testing Specialist'],
  },
  {
    id: '20',
    name: 'VIOLA, PAUL ENRICO N.',
    title: CS_TITLE,
    image: toga('Viola, Paul Enrico N.'),
    description: 'A motivated Computer Science graduate with expertise in mobile development and cross-platform apps.',
    achievements: [CS_TITLE, 'Mobile App Developer', 'Cross-Platform Development Specialist'],
  },
  {
    id: '21',
    name: 'WOOD, MATTHEW ETHAN G.',
    title: CS_TITLE,
    image: toga('Wood, Matthew Ethan G.'),
    description: 'A talented Computer Science graduate with expertise in software engineering and system architecture.',
    achievements: [CS_TITLE, 'Software Engineer', 'System Architecture Specialist'],
  },
];

export const COLLEGE_GRADUATES: Record<string, CollegeGraduates> = {
  'computer-studies': {
    collegeName: 'College Of Computer Studies',
    graduates: computerStudiesGraduates,
  },
  'business-and-accountancy': {
    collegeName: 'College Of Business And Accountancy',
    graduates: [placeholder('3'), placeholder('4')],
  },
  education: {
    collegeName: 'College Of Education',
    graduates: [placeholder('5'), placeholder('6')],
  },
  'graduate-school': {
    collegeName: 'Graduate School',
    graduates: [placeholder('7')],
  },
  'humanities-and-social-science': {
    collegeName: 'College Of Humanities And Social Science',
    graduates: [placeholder('8')],
  },
  law: {
    collegeName: 'College Of Law',
    graduates: [placeholder('1')],
  },
  nursing: {
    collegeName: 'College Of Nursing',
    graduates: [placeholder('2')],
  },
  'science-engineering-architecture': {
    collegeName: 'College Of Science, Engineering, And Architecture',
    graduates: [placeholder('3')],
  },
};

export const getGraduate = (collegeKey: string, graduateId: string) =>
  COLLEGE_GRADUATES[collegeKey]?.graduates.find((graduate) => graduate.id === graduateId);
