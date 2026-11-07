// Shared vocabularies and static reference content for ScholarMitra.

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const NORTH_EAST_STATES = [
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
];

export const LEVELS: { value: string; label: string }[] = [
  { value: "class-9-10", label: "Class 9–10" },
  { value: "class-11-12", label: "Class 11–12" },
  { value: "diploma", label: "Diploma / ITI" },
  { value: "ug", label: "Undergraduate" },
  { value: "pg", label: "Postgraduate" },
  { value: "phd", label: "Doctoral (PhD)" },
];

export const STREAMS: { value: string; label: string }[] = [
  { value: "all", label: "Any stream" },
  { value: "engineering", label: "Engineering & Technology" },
  { value: "medical", label: "Medical & Health Sciences" },
  { value: "science", label: "Pure & Applied Sciences" },
  { value: "arts", label: "Arts, Humanities & Social Sciences" },
  { value: "commerce", label: "Commerce & Finance" },
  { value: "law", label: "Law" },
  { value: "design", label: "Design & Fine Arts" },
  { value: "education", label: "Education (B.Ed. etc.)" },
  { value: "management", label: "Management & Business" },
];

export const GROUPS: { value: string; label: string }[] = [
  { value: "general", label: "General / Open to all" },
  { value: "sc", label: "Scheduled Caste (SC)" },
  { value: "st", label: "Scheduled Tribe (ST)" },
  { value: "obc", label: "OBC (Non-Creamy Layer)" },
  { value: "ebc", label: "EBC / Economically Weaker" },
  { value: "minority", label: "Minority Community" },
  { value: "pwd", label: "Persons with Disabilities" },
  { value: "defence", label: "Wards of Ex-Servicemen" },
];

export const KINDS: { value: string; label: string }[] = [
  { value: "merit", label: "Merit-Based" },
  { value: "need", label: "Need-Based" },
  { value: "mcm", label: "Merit-cum-Means" },
  { value: "special", label: "Special Category" },
];

export const INCOME_PRESETS = [
  { value: 100000, label: "Up to ₹1 lakh" },
  { value: 200000, label: "Up to ₹2 lakh" },
  { value: 250000, label: "Up to ₹2.5 lakh" },
  { value: 350000, label: "Up to ₹3.5 lakh" },
  { value: 450000, label: "Up to ₹4.5 lakh" },
  { value: 600000, label: "Up to ₹6 lakh" },
  { value: 800000, label: "Up to ₹8 lakh" },
  { value: 1500000, label: "Up to ₹15 lakh" },
];

export const DOCUMENT_CHECKLIST: {
  name: string;
  hint: string;
  note?: string;
}[] = [
  {
    name: "Aadhaar Card",
    hint: "Identity proof required by most portals. Ensure your name matches school records.",
    note: "Mandatory on most portals",
  },
  {
    name: "Income Certificate",
    hint: "Issued by Tehsildar / competent revenue authority. Check validity period accepted by the scheme.",
  },
  {
    name: "Caste / Category Certificate",
    hint: "SC / ST / OBC / EBC certificate issued by the designated state authority.",
    note: "Where applicable",
  },
  {
    name: "Domicile Certificate",
    hint: "Proof of state residence, needed for state government scholarships.",
    note: "State schemes",
  },
  {
    name: "Academic Marksheets",
    hint: "Latest qualifying exam marksheet (Class 10 / 12 / last semester), self-attested copy.",
  },
  {
    name: "Bank Account Passbook",
    hint: "First page of a bank account in the student's name, linked with Aadhaar for DBT.",
  },
  {
    name: "Passport-size Photograph",
    hint: "Recent photograph as per portal specifications (usually JPG, under 100 KB).",
  },
  {
    name: "Admission / Bonafide Proof",
    hint: "Bonafide certificate, admission receipt or institute verification letter for the current year.",
  },
];

export const OFFICIAL_PORTALS: {
  name: string;
  description: string;
  url: string;
  state?: string;
}[] = [
  {
    name: "National Scholarship Portal",
    description: "One-stop portal for Central Government, UGC and AICTE schemes.",
    url: "https://scholarships.gov.in",
  },
  {
    name: "UP Scholarship Portal",
    description: "Uttar Pradesh pre-matric and post-matric scholarships.",
    url: "https://scholarship.up.gov.in",
    state: "Uttar Pradesh",
  },
  {
    name: "MahaDBT",
    description: "Maharashtra Direct Benefit Transfer scholarship portal.",
    url: "https://mahadbt.maharashtra.gov.in",
    state: "Maharashtra",
  },
  {
    name: "Digital Gujarat",
    description: "Gujarat scholarship schemes — pre-matric and post-matric.",
    url: "https://www.digitalgujarat.gov.in",
    state: "Gujarat",
  },
  {
    name: "SSP Karnataka",
    description: "Karnataka State Scholarship Portal for post-matric schemes.",
    url: "https://ssp.postmatric.karnataka.gov.in",
    state: "Karnataka",
  },
  {
    name: "Jnanabhumi",
    description: "Andhra Pradesh scholarship and fee reimbursement portal.",
    url: "https://jnanabhumi.ap.gov.in",
    state: "Andhra Pradesh",
  },
  {
    name: "ePASS Telangana",
    description: "Telangana electronic payment & application system of scholarships.",
    url: "https://telanganaepass.cgg.gov.in",
    state: "Telangana",
  },
  {
    name: "Odisha State Scholarship Portal",
    description: "Post-matric and merit scholarships of Government of Odisha.",
    url: "https://scholarship.odisha.gov.in",
    state: "Odisha",
  },
  {
    name: "e-Kalyan Jharkhand",
    description: "Jharkhand post-matric scholarships for SC, ST and OBC students.",
    url: "https://ekalyan.cgg.gov.in",
    state: "Jharkhand",
  },
  {
    name: "e-Kalyan Bihar",
    description: "Bihar post-matric scholarships for SC, ST, BC and EBC students.",
    url: "https://www.ekalyan.bih.nic.in",
    state: "Bihar",
  },
  {
    name: "MP Scholarship Portal",
    description: "Madhya Pradesh state scholarship schemes.",
    url: "https://scholarshipportal.mp.nic.in",
    state: "Madhya Pradesh",
  },
  {
    name: "Kerala DCE Scholarships",
    description: "Department of Collegiate Education, Kerala scholarships.",
    url: "https://www.dcescholarship.kerala.gov.in",
    state: "Kerala",
  },
  {
    name: "Aikyashree — West Bengal",
    description: "Minority scholarships by WBMDFC, Government of West Bengal.",
    url: "https://wbmdfcscholarship.in",
    state: "West Bengal",
  },
  {
    name: "SVMCM — West Bengal",
    description: "Swami Vivekananda Merit-cum-Means Scholarship portal.",
    url: "https://svmcm.wb.gov.in",
    state: "West Bengal",
  },
  {
    name: "AICTE Schemes",
    description: "Pragati, Saksham and other AICTE student development schemes.",
    url: "https://www.aicte-india.org/schemes/students-development-schemes",
  },
  {
    name: "INSPIRE (DST)",
    description: "Scholarship for Higher Education in science programmes.",
    url: "https://online-inspire.gov.in",
  },
  {
    name: "Kendriya Sainik Board (PMSS)",
    description: "Prime Minister's Scholarship Scheme for ex-servicemen wards.",
    url: "https://ksb.gov.in",
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How can I apply for scholarships?",
    a: "Every legitimate government scholarship is applied for online, through its official portal — such as the National Scholarship Portal (scholarships.gov.in) or your state scholarship portal. On ScholarMitra, open a scholarship and use the 'Apply on Official Portal' button, which always takes you to the authentic government website. Never pay agents or unofficial websites to apply on your behalf.",
  },
  {
    q: "Who is eligible for scholarships?",
    a: "Eligibility varies by scheme. Most schemes look at your education level, domicile state, annual family income, academic marks, social category and sometimes gender. Use our Eligibility Checker to see schemes matched to your profile — but always read the official scheme guidelines before applying, because the final decision rests with the scholarship authority.",
  },
  {
    q: "What documents are usually required?",
    a: "Commonly required documents include: Aadhaar card, income certificate, caste/category certificate (where applicable), domicile certificate, latest academic marksheet, bank passbook (account in the student's name), passport-size photograph and admission/bonafide proof from your institution. Our Document Checklist helps you track which ones you have prepared.",
  },
  {
    q: "Can I apply for multiple scholarships?",
    a: "Yes, you can apply for multiple schemes. However, as a general government rule a student can usually avail only ONE scholarship benefit at a time from a government source; many portals verify this automatically. Private and CSR scholarships may have different rules, so always read the scheme guidelines carefully.",
  },
  {
    q: "How can I check my application status?",
    a: "Application status is tracked on the same portal where you applied. On the National Scholarship Portal, log in and use 'Check Your Status' with your application ID and date of birth. State portals such as UP Scholarship, MahaDBT or e-Kalyan have similar status-tracking options. ScholarMitra's dashboard helps you keep personal notes and reminders about each application.",
  },
  {
    q: "Where can I find official application forms?",
    a: "All applications are online — there are no offline forms for major schemes. We list official portals such as NSP, MahaDBT, UP Scholarship, Digital Gujarat, SSP Karnataka, Jnanabhumi, ePASS Telangana, e-Kalyan and others in our Official Links section. ScholarMitra never hosts application forms and never asks for payment.",
  },
  {
    q: "Is ScholarMitra a government website?",
    a: "No. ScholarMitra is an independent discovery and information platform for students. Every scholarship listing includes a link to the authentic official portal, and every application happens on the official government or trust website only.",
  },
  {
    q: "Do I have to pay any fee to apply?",
    a: "No. Government scholarship applications are completely free. If any website or person asks for money to 'guarantee' a scholarship, it is a scam — report it and apply only through official portals.",
  },
];
