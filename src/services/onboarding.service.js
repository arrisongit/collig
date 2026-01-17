// src\services\onboarding.service.js

const universitiesData = [
  // Public Universities
  { id: "uni_001", name: "University of Nairobi", type: "public" },
  { id: "uni_002", name: "Kenyatta University", type: "public" },
  { id: "uni_003", name: "Moi University", type: "public" },
  {
    id: "uni_004",
    name: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    type: "public",
  },
  { id: "uni_005", name: "Egerton University", type: "public" },
  { id: "uni_006", name: "Maseno University", type: "public" },
  {
    id: "uni_007",
    name: "Masinde Muliro University of Science and Technology",
    type: "public",
  },
  // Private Universities
  { id: "uni_008", name: "Strathmore University", type: "private" },
  {
    id: "uni_009",
    name: "United States International University (USIU)",
    type: "private",
  },
  { id: "uni_010", name: "Aga Khan University", type: "private" },
  {
    id: "uni_011",
    name: "Multimedia University of Kenya (MMU)",
    type: "private",
  },
  { id: "uni_012", name: "Karatina University", type: "private" },
  { id: "uni_013", name: "Kisii University", type: "private" },
  { id: "uni_014", name: "Mount Kenya University", type: "private" },
  { id: "uni_015", name: "Kabarak University", type: "private" },
  { id: "uni_016", name: "Laikipia University", type: "private" },
  { id: "uni_017", name: "Kca University", type: "private" },
  {
    id: "uni_018",
    name: "Nairobi Institute of Business Studies",
    type: "private",
  },
  { id: "uni_019", name: "Africana First University", type: "private" },
  { id: "uni_020", name: "Pan Africa Christian University", type: "private" },
  // Colleges
  {
    id: "col_001",
    name: "Kenya Institute of Banking and Insurance Studies (KIBIS)",
    type: "college",
  },
  { id: "col_002", name: "Kenya National Police College", type: "college" },
  { id: "col_003", name: "East Africa School of Aviation", type: "college" },
  {
    id: "col_004",
    name: "Kenya Tourism Board Training Institute",
    type: "college",
  },
  { id: "col_005", name: "Nairobi Aviation College", type: "college" },
  {
    id: "col_006",
    name: "Kenya National Conservatoire of Music",
    type: "college",
  },
  {
    id: "col_007",
    name: "Kenya Polytechnic University College",
    type: "college",
  },
  {
    id: "col_008",
    name: "Mombasa Technical Training Institute",
    type: "college",
  },
  { id: "col_009", name: "Kisumu Polytechnic", type: "college" },
  { id: "col_010", name: "Nakuru Medical Training College", type: "college" },
];

const departmentsData = [
  // Computing & Technology
  { id: "dept_001", name: "Computer Science", category: "computing" },
  { id: "dept_002", name: "Information Technology", category: "computing" },
  { id: "dept_003", name: "Software Engineering", category: "computing" },
  { id: "dept_004", name: "Data Science", category: "computing" },
  { id: "dept_005", name: "Cyber Security", category: "computing" },
  { id: "dept_006", name: "Information Systems", category: "computing" },

  // Engineering
  { id: "dept_010", name: "Civil Engineering", category: "engineering" },
  {
    id: "dept_011",
    name: "Electrical & Electronic Engineering",
    category: "engineering",
  },
  { id: "dept_012", name: "Mechanical Engineering", category: "engineering" },
  { id: "dept_013", name: "Mechatronics Engineering", category: "engineering" },
  { id: "dept_014", name: "Chemical Engineering", category: "engineering" },
  {
    id: "dept_015",
    name: "Telecommunication Engineering",
    category: "engineering",
  },
  { id: "dept_016", name: "Industrial Engineering", category: "engineering" },

  // Health & Medical Sciences
  { id: "dept_020", name: "Medicine & Surgery", category: "health" },
  { id: "dept_021", name: "Nursing", category: "health" },
  { id: "dept_022", name: "Clinical Medicine", category: "health" },
  { id: "dept_023", name: "Public Health", category: "health" },
  { id: "dept_024", name: "Pharmacy", category: "health" },
  { id: "dept_025", name: "Medical Laboratory Sciences", category: "health" },
  { id: "dept_026", name: "Radiography & Imaging", category: "health" },
  { id: "dept_027", name: "Dental Technology", category: "health" },

  // Business & Economics
  { id: "dept_030", name: "Business Administration", category: "business" },
  { id: "dept_031", name: "Commerce", category: "business" },
  { id: "dept_032", name: "Accounting", category: "business" },
  { id: "dept_033", name: "Finance", category: "business" },
  { id: "dept_034", name: "Economics", category: "business" },
  {
    id: "dept_035",
    name: "Procurement & Supply Chain Management",
    category: "business",
  },
  { id: "dept_036", name: "Human Resource Management", category: "business" },
  { id: "dept_037", name: "Entrepreneurship", category: "business" },

  // Law & Governance
  { id: "dept_040", name: "Law", category: "law" },
  { id: "dept_041", name: "Criminology & Security Studies", category: "law" },
  { id: "dept_042", name: "International Relations", category: "law" },
  { id: "dept_043", name: "Public Administration", category: "law" },
  { id: "dept_044", name: "Political Science", category: "law" },

  // Education
  { id: "dept_050", name: "Education (Arts)", category: "education" },
  { id: "dept_051", name: "Education (Science)", category: "education" },
  {
    id: "dept_052",
    name: "Early Childhood Development Education",
    category: "education",
  },
  { id: "dept_053", name: "Special Needs Education", category: "education" },
  { id: "dept_054", name: "Educational Management", category: "education" },

  // Agriculture & Environmental Studies
  { id: "dept_060", name: "Agriculture", category: "agriculture" },
  { id: "dept_061", name: "Agribusiness Management", category: "agriculture" },
  { id: "dept_062", name: "Animal Science", category: "agriculture" },
  { id: "dept_063", name: "Horticulture", category: "agriculture" },
  { id: "dept_064", name: "Environmental Science", category: "agriculture" },
  { id: "dept_065", name: "Forestry", category: "agriculture" },
  {
    id: "dept_066",
    name: "Food Science & Technology",
    category: "agriculture",
  },

  // Arts, Media & Humanities
  { id: "dept_070", name: "Journalism & Mass Communication", category: "arts" },
  { id: "dept_071", name: "Film & Theatre Arts", category: "arts" },
  { id: "dept_072", name: "Communication & Media Studies", category: "arts" },
  { id: "dept_073", name: "Fine Art & Design", category: "arts" },
  { id: "dept_074", name: "Music", category: "arts" },
  { id: "dept_075", name: "Linguistics", category: "arts" },

  // Social Sciences
  { id: "dept_080", name: "Sociology", category: "social" },
  { id: "dept_081", name: "Psychology", category: "social" },
  { id: "dept_082", name: "Social Work", category: "social" },
  { id: "dept_083", name: "Community Development", category: "social" },
  { id: "dept_084", name: "Development Studies", category: "social" },

  // Hospitality, Tourism & Sports
  { id: "dept_090", name: "Hospitality Management", category: "hospitality" },
  { id: "dept_091", name: "Tourism Management", category: "hospitality" },
  {
    id: "dept_092",
    name: "Hotel & Catering Management",
    category: "hospitality",
  },
  { id: "dept_093", name: "Sports Science", category: "hospitality" },

  // TVET & Technical
  { id: "dept_100", name: "Building Construction", category: "tvet" },
  { id: "dept_101", name: "Automotive Engineering", category: "tvet" },
  { id: "dept_102", name: "Electrical Installation", category: "tvet" },
  { id: "dept_103", name: "Plumbing & Pipe Fitting", category: "tvet" },
  { id: "dept_104", name: "Welding & Fabrication", category: "tvet" },
  { id: "dept_105", name: "Fashion Design", category: "tvet" },
];

const levelsData = [
  // TVET & College Levels
  { id: "level_cert", name: "Certificate", category: "tvet" },
  { id: "level_adv_cert", name: "Advanced Certificate", category: "tvet" },
  { id: "level_dip", name: "Diploma", category: "tvet" },
  { id: "level_high_dip", name: "Higher Diploma", category: "tvet" },

  // Undergraduate
  {
    id: "level_deg_yr1",
    name: "Bachelor's Degree – Year 1",
    category: "undergraduate",
  },
  {
    id: "level_deg_yr2",
    name: "Bachelor's Degree – Year 2",
    category: "undergraduate",
  },
  {
    id: "level_deg_yr3",
    name: "Bachelor's Degree – Year 3",
    category: "undergraduate",
  },
  {
    id: "level_deg_yr4",
    name: "Bachelor's Degree – Year 4",
    category: "undergraduate",
  },
  {
    id: "level_deg_yr5",
    name: "Bachelor's Degree – Year 5 (where applicable)",
    category: "undergraduate",
  },

  // Postgraduate
  {
    id: "level_pg_dip",
    name: "Postgraduate Diploma",
    category: "postgraduate",
  },
  { id: "level_masters", name: "Master's Degree", category: "postgraduate" },
  {
    id: "level_phd",
    name: "Doctor of Philosophy (PhD)",
    category: "postgraduate",
  },
];

const coursesData = [
  // Computing & Technology
  {
    id: "course_comp_sci_101",
    name: "Introduction to Computer Science",
    department_id: "dept_001",
  },
  { id: "course_web_dev", name: "Web Development", department_id: "dept_002" },
  {
    id: "course_data_structures",
    name: "Data Structures & Algorithms",
    department_id: "dept_001",
  },
  {
    id: "course_machine_learning",
    name: "Machine Learning",
    department_id: "dept_004",
  },
  {
    id: "course_cyber_security",
    name: "Cyber Security Fundamentals",
    department_id: "dept_005",
  },
  {
    id: "course_software_eng",
    name: "Software Engineering Principles",
    department_id: "dept_003",
  },
  {
    id: "course_database_systems",
    name: "Database Systems",
    department_id: "dept_006",
  },
  {
    id: "course_computer_networks",
    name: "Computer Networks",
    department_id: "dept_002",
  },
  {
    id: "course_artificial_intelligence",
    name: "Artificial Intelligence",
    department_id: "dept_004",
  },
  {
    id: "course_mobile_app_dev",
    name: "Mobile Application Development",
    department_id: "dept_003",
  },

  // Engineering
  {
    id: "course_civil_engineering",
    name: "Civil Engineering Principles",
    department_id: "dept_010",
  },
  {
    id: "course_electrical_basics",
    name: "Electrical Engineering Basics",
    department_id: "dept_011",
  },
  {
    id: "course_mechanics",
    name: "Engineering Mechanics",
    department_id: "dept_012",
  },
  {
    id: "course_thermodynamics",
    name: "Thermodynamics",
    department_id: "dept_012",
  },
  {
    id: "course_circuit_analysis",
    name: "Circuit Analysis",
    department_id: "dept_011",
  },
  {
    id: "course_structural_analysis",
    name: "Structural Analysis",
    department_id: "dept_010",
  },
  {
    id: "course_mechanical_design",
    name: "Mechanical Design",
    department_id: "dept_012",
  },
  {
    id: "course_control_systems",
    name: "Control Systems",
    department_id: "dept_013",
  },
  {
    id: "course_chemical_processes",
    name: "Chemical Processes",
    department_id: "dept_014",
  },
  {
    id: "course_telecom_networks",
    name: "Telecommunication Networks",
    department_id: "dept_015",
  },

  // Business
  {
    id: "course_business_admin",
    name: "Business Administration",
    department_id: "dept_030",
  },
  {
    id: "course_accounting_101",
    name: "Financial Accounting",
    department_id: "dept_032",
  },
  {
    id: "course_marketing",
    name: "Marketing Principles",
    department_id: "dept_030",
  },
  {
    id: "course_microeconomics",
    name: "Microeconomics",
    department_id: "dept_034",
  },
  {
    id: "course_management_principles",
    name: "Management Principles",
    department_id: "dept_030",
  },
  {
    id: "course_corporate_finance",
    name: "Corporate Finance",
    department_id: "dept_033",
  },
  {
    id: "course_supply_chain",
    name: "Supply Chain Management",
    department_id: "dept_035",
  },
  {
    id: "course_human_resources",
    name: "Human Resource Management",
    department_id: "dept_036",
  },
  {
    id: "course_business_law",
    name: "Business Law",
    department_id: "dept_040",
  },
  {
    id: "course_entrepreneurship",
    name: "Entrepreneurship",
    department_id: "dept_037",
  },

  // Health Sciences
  { id: "course_anatomy", name: "Human Anatomy", department_id: "dept_020" },
  {
    id: "course_nursing_fundamentals",
    name: "Nursing Fundamentals",
    department_id: "dept_021",
  },
  {
    id: "course_pharmacology",
    name: "Pharmacology",
    department_id: "dept_024",
  },
  { id: "course_pathology", name: "Pathology", department_id: "dept_020" },
  {
    id: "course_medical_ethics",
    name: "Medical Ethics",
    department_id: "dept_020",
  },
  {
    id: "course_clinical_practice",
    name: "Clinical Practice",
    department_id: "dept_022",
  },
  {
    id: "course_public_health",
    name: "Public Health",
    department_id: "dept_023",
  },
  {
    id: "course_medical_lab",
    name: "Medical Laboratory Techniques",
    department_id: "dept_025",
  },
  { id: "course_radiology", name: "Radiology", department_id: "dept_026" },
  {
    id: "course_dental_science",
    name: "Dental Science",
    department_id: "dept_027",
  },

  // Social Sciences
  {
    id: "course_psychology_101",
    name: "Introduction to Psychology",
    department_id: "dept_081",
  },
  { id: "course_sociology", name: "Sociology", department_id: "dept_080" },
  {
    id: "course_social_work",
    name: "Social Work Practice",
    department_id: "dept_082",
  },
  { id: "course_criminology", name: "Criminology", department_id: "dept_041" },
  {
    id: "course_political_science",
    name: "Political Science",
    department_id: "dept_044",
  },
  {
    id: "course_international_relations",
    name: "International Relations",
    department_id: "dept_042",
  },
  {
    id: "course_development_studies",
    name: "Development Studies",
    department_id: "dept_084",
  },
  {
    id: "course_community_dev",
    name: "Community Development",
    department_id: "dept_083",
  },
  { id: "course_linguistics", name: "Linguistics", department_id: "dept_075" },
  {
    id: "course_anthropology",
    name: "Cultural Anthropology",
    department_id: "dept_080",
  },

  // Arts & Humanities
  { id: "course_journalism", name: "Journalism", department_id: "dept_070" },
  {
    id: "course_communication",
    name: "Communication Studies",
    department_id: "dept_072",
  },
  {
    id: "course_film_studies",
    name: "Film Studies",
    department_id: "dept_071",
  },
  { id: "course_fine_art", name: "Fine Art", department_id: "dept_073" },
  {
    id: "course_music_theory",
    name: "Music Theory",
    department_id: "dept_074",
  },
  {
    id: "course_literature",
    name: "English Literature",
    department_id: "dept_075",
  },
  { id: "course_philosophy", name: "Philosophy", department_id: "dept_075" },
  { id: "course_history", name: "History", department_id: "dept_075" },
  {
    id: "course_theatre_arts",
    name: "Theatre Arts",
    department_id: "dept_071",
  },
  {
    id: "course_digital_media",
    name: "Digital Media",
    department_id: "dept_072",
  },

  // Education
  {
    id: "course_educational_psychology",
    name: "Educational Psychology",
    department_id: "dept_050",
  },
  {
    id: "course_curriculum_dev",
    name: "Curriculum Development",
    department_id: "dept_054",
  },
  {
    id: "course_teaching_methods",
    name: "Teaching Methods",
    department_id: "dept_050",
  },
  {
    id: "course_early_childhood",
    name: "Early Childhood Education",
    department_id: "dept_052",
  },
  {
    id: "course_special_education",
    name: "Special Education",
    department_id: "dept_053",
  },
  {
    id: "course_educational_admin",
    name: "Educational Administration",
    department_id: "dept_054",
  },
  {
    id: "course_science_education",
    name: "Science Education",
    department_id: "dept_051",
  },
  {
    id: "course_math_education",
    name: "Mathematics Education",
    department_id: "dept_051",
  },
  {
    id: "course_language_teaching",
    name: "Language Teaching",
    department_id: "dept_050",
  },
  {
    id: "course_educational_tech",
    name: "Educational Technology",
    department_id: "dept_054",
  },

  // Agriculture & Environmental
  { id: "course_agronomy", name: "Agronomy", department_id: "dept_060" },
  {
    id: "course_animal_husbandry",
    name: "Animal Husbandry",
    department_id: "dept_062",
  },
  {
    id: "course_horticulture",
    name: "Horticulture",
    department_id: "dept_063",
  },
  {
    id: "course_environmental_science",
    name: "Environmental Science",
    department_id: "dept_064",
  },
  { id: "course_forestry", name: "Forestry", department_id: "dept_065" },
  {
    id: "course_food_technology",
    name: "Food Technology",
    department_id: "dept_066",
  },
  {
    id: "course_agribusiness",
    name: "Agribusiness Management",
    department_id: "dept_061",
  },
  {
    id: "course_soil_science",
    name: "Soil Science",
    department_id: "dept_060",
  },
  {
    id: "course_water_resources",
    name: "Water Resources Management",
    department_id: "dept_064",
  },
  {
    id: "course_climate_change",
    name: "Climate Change Studies",
    department_id: "dept_064",
  },

  // Hospitality & Tourism
  {
    id: "course_hotel_management",
    name: "Hotel Management",
    department_id: "dept_090",
  },
  {
    id: "course_tourism_management",
    name: "Tourism Management",
    department_id: "dept_091",
  },
  {
    id: "course_catering",
    name: "Catering Management",
    department_id: "dept_092",
  },
  {
    id: "course_event_management",
    name: "Event Management",
    department_id: "dept_090",
  },
  {
    id: "course_sports_management",
    name: "Sports Management",
    department_id: "dept_093",
  },
  {
    id: "course_travel_agency",
    name: "Travel Agency Operations",
    department_id: "dept_091",
  },
  {
    id: "course_food_beverage",
    name: "Food & Beverage Management",
    department_id: "dept_092",
  },
  {
    id: "course_recreation",
    name: "Recreation Management",
    department_id: "dept_093",
  },
  {
    id: "course_hospitality_law",
    name: "Hospitality Law",
    department_id: "dept_090",
  },
  {
    id: "course_tourism_impact",
    name: "Tourism Impact Assessment",
    department_id: "dept_091",
  },

  // TVET & Technical
  {
    id: "course_building_construction",
    name: "Building Construction",
    department_id: "dept_100",
  },
  {
    id: "course_automotive_repair",
    name: "Automotive Repair",
    department_id: "dept_101",
  },
  {
    id: "course_electrical_installation",
    name: "Electrical Installation",
    department_id: "dept_102",
  },
  {
    id: "course_plumbing",
    name: "Plumbing & Pipe Fitting",
    department_id: "dept_103",
  },
  {
    id: "course_welding",
    name: "Welding & Fabrication",
    department_id: "dept_104",
  },
  {
    id: "course_fashion_design",
    name: "Fashion Design",
    department_id: "dept_105",
  },
  { id: "course_carpentry", name: "Carpentry", department_id: "dept_100" },
  { id: "course_masonry", name: "Masonry", department_id: "dept_100" },
  {
    id: "course_motorcycle_mechanics",
    name: "Motorcycle Mechanics",
    department_id: "dept_101",
  },
  {
    id: "course_refrigeration",
    name: "Refrigeration & Air Conditioning",
    department_id: "dept_102",
  },
];

/**
 * FETCH UNIVERSITIES (HARDCODED)
 */
export const getUniversities = async () => {
  return universitiesData;
};

/**
 * FETCH DEPARTMENTS (HARDCODED)
 */
export const getDepartments = async () => {
  return departmentsData;
};

/**
 * FETCH LEVELS (HARDCODED)
 */
export const getLevels = async () => {
  return levelsData;
};

/**
 * FETCH COURSES (HARDCODED)
 */
export const getCourses = async () => {
  return coursesData;
};

// -------------------------
// Helpers & Dashboard Logic
// -------------------------

const toDate = (d) => {
  if (!d) return null;
  if (d instanceof Date) return d;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const calculateSemesterProgress = (
  semesterStart,
  semesterEnd,
  now = new Date(),
) => {
  const start = toDate(semesterStart);
  const end = toDate(semesterEnd);
  const current = toDate(now) || new Date();

  if (!start || !end || end.getTime() === start.getTime()) {
    return { percent: 0, fraction: 0, label: "0% Complete" };
  }

  if (current <= start)
    return { percent: 0, fraction: 0, label: "0% Complete" };
  if (current >= end)
    return { percent: 100, fraction: 1, label: "100% Complete" };

  const fraction =
    (current.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  const percent = Math.round(fraction * 100);
  return { percent, fraction, label: `${percent}% Complete` };
};

// Parse time strings like "14:30" or "2:30 PM" -> {hours, minutes}
const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const t = timeStr.trim();

  // 24h: HH:mm
  const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    return { hours: parseInt(m24[1], 10), minutes: parseInt(m24[2], 10) };
  }

  // 12h: H:MM AM/PM
  const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const m = parseInt(m12[2], 10);
    const ampm = m12[3].toLowerCase();
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return { hours: h, minutes: m };
  }

  return null;
};

const weekdayIndex = (d) => {
  if (typeof d === "number") return ((d % 7) + 7) % 7; // ensure 0-6
  if (!d) return null;
  const map = {
    sunday: 0,
    sun: 0,
    monday: 1,
    mon: 1,
    tuesday: 2,
    tue: 2,
    tues: 2,
    wednesday: 3,
    wed: 3,
    thursday: 4,
    thu: 4,
    thur: 4,
    friday: 5,
    fri: 5,
    saturday: 6,
    sat: 6,
  };
  const key = String(d).toLowerCase();
  return map[key] ?? null;
};

// Accepts entries with fields:
// - course_name
// - day_of_week (number 0-6 or name) OR date (ISO)
// - start_time ("HH:mm" or "h:mm AM/PM")
// - end_time (optional)
// - location (optional)
export const getNextClass = (timetable = [], now = new Date()) => {
  if (!Array.isArray(timetable) || timetable.length === 0) return null;
  const current = toDate(now) || new Date();

  const candidates = timetable
    .map((entry) => {
      // If entry has full ISO datetime for start
      if (entry.datetime) {
        const start = toDate(entry.datetime);
        const end = entry.end_datetime ? toDate(entry.end_datetime) : null;
        return start && start >= current ? { entry, start, end } : null;
      }

      // If entry has a specific date and time fields
      if (entry.date && entry.start_time) {
        const date = toDate(entry.date);
        const time = parseTime(entry.start_time);
        if (date && time) {
          const start = new Date(date);
          start.setHours(time.hours, time.minutes, 0, 0);
          const end = entry.end_time
            ? (function () {
                const et = parseTime(entry.end_time);
                if (et) {
                  const e = new Date(start);
                  e.setHours(et.hours, et.minutes, 0, 0);
                  return e;
                }
                return null;
              })()
            : null;
          return start >= current ? { entry, start, end } : null;
        }
      }

      // Recurring weekly with day_of_week and start_time
      if (entry.day_of_week != null && entry.start_time) {
        const targetDay = weekdayIndex(entry.day_of_week);
        const time = parseTime(entry.start_time);
        if (targetDay == null || !time) return null;

        const today = new Date(current);
        const delta = (targetDay - today.getDay() + 7) % 7;
        let candidate = new Date(today);
        candidate.setDate(today.getDate() + delta);
        candidate.setHours(time.hours, time.minutes, 0, 0);

        if (candidate < current) candidate.setDate(candidate.getDate() + 7);

        const end = entry.end_time
          ? (function () {
              const et = parseTime(entry.end_time);
              if (et) {
                const e = new Date(candidate);
                e.setHours(et.hours, et.minutes, 0, 0);
                return e;
              }
              return null;
            })()
          : null;
        return { entry, start: candidate, end };
      }

      return null;
    })
    .filter(Boolean);

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.start - b.start);
  const nearest = candidates[0];
  return {
    course_name: nearest.entry.course_name || nearest.entry.name || null,
    start: nearest.start,
    end: nearest.end || null,
    location: nearest.entry.location || null,
    raw: nearest.entry,
  };
};

export const makeStudentPass = (userData = {}) => {
  // Present only human-readable fields
  return {
    full_name: userData.full_name || "",
    role: userData.role || "",
    university: userData.university?.name || userData.universityName || "",
    department: userData.department?.name || userData.departmentName || "",
    level: userData.level?.name || userData.levelName || "",
  };
};

// Denormalize: given ids (or partial profile) produce display-ready profile

// -------------------------
// Denormalization (CORE)
// -------------------------
const findById = (list, id) => list.find((item) => item.id === id) || null;

export const denormalizeUserProfile = ({
  full_name,
  role,
  university_id,
  department_id,
  level_id,
  universityName,
  departmentName,
  levelName,
} = {}) => {
  const university = university_id
    ? findById(universitiesData, university_id)
    : null;

  const department = department_id
    ? findById(departmentsData, department_id)
    : null;

  const level = level_id ? findById(levelsData, level_id) : null;

  return {
    full_name: full_name || "",
    role: role || "",

    university: {
      id: university?.id || university_id || null,
      name: university?.name || universityName || "",
    },

    department: {
      id: department?.id || department_id || null,
      name: department?.name || departmentName || "",
    },

    level: {
      id: level?.id || level_id || null,
      name: level?.name || levelName || "",
    },
  };
};

// -------------------------
// Navigation Helper
// -------------------------

export const navigateToExplore = (navigate, profile) => {
  if (!navigate || !profile?.university?.id) return;

  navigate("/explore", {
    state: {
      university_id: profile.university.id,
      universityName: profile.university.name,
    },
  });
};
