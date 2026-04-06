import {
  ShieldCheckIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
  ChartPieIcon,
  WalletIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const enterpriseFeatures = [
  {
    title: "Automated Expense Tracking",
    heading: "Say goodbye to manual data entry",
    text: "Employees can easily snap and upload receipts from anywhere. Our intelligent system extracts data, categorizes expenses, and submits them for approval in seconds, saving your team hours of administrative work.",
    icon: BanknotesIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/20",
    image:
      "https://placehold.co/800x600/1e1b4b/818cf8?text=Smart+Receipt+Scanning",
  },
  {
    title: "Custom Approval Workflows",
    heading: "Accelerate your team's reimbursements",
    text: "Design multi-tier approval pipelines perfectly tailored to your organization. Managers and Finance teams get clear, centralized dashboards to review, approve, or reject expenses with a single click.",
    icon: ShieldCheckIcon,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    glow: "shadow-pink-500/20",
    image:
      "https://placehold.co/800x600/4c1d95/c084fc?text=Multi-Level+Approvals",
  },
  {
    title: "Real-Time Analytics",
    heading: "Turn spending data into strategic insights",
    text: "Visualize your company's financial health in real-time. Interactive charts and customized reports help you identify spending trends, enforce budget compliance, and optimize your cash flow effortlessly.",
    icon: PresentationChartLineIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    glow: "shadow-purple-500/20",
    image:
      "https://placehold.co/800x600/0f172a/38bdf8?text=Financial+Analytics",
  },
];

export const standardFeatures = [
  {
    title: "Personal Expense Tracking",
    heading: "Track every penny effortlessly",
    text: "Keep a close eye on your daily spending. Easily log expenses, categorize them, and see exactly where your money goes each month without any hassle.",
    icon: WalletIcon,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    glow: "shadow-teal-500/20",
    image: "https://placehold.co/800x600/064e3b/34d399?text=Personal+Tracking",
  },
  {
    title: "Smart Budgeting",
    heading: "Stay within your limits",
    text: "Set monthly budgets for different categories like groceries, entertainment, and utilities. Get notified when you're close to exceeding your limits so you can adjust your spending.",
    icon: ChartPieIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
    image: "https://placehold.co/800x600/78350f/fbbf24?text=Smart+Budgeting",
  },
  {
    title: "Monthly Reports",
    heading: "Understand your financial habits",
    text: "Generate clean, easy-to-read reports summarizing your monthly activity. Identify areas where you can save more and spend less with intuitive visual breakdowns.",
    icon: DocumentTextIcon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    glow: "shadow-indigo-500/20",
    image: "https://placehold.co/800x600/312e81/818cf8?text=Monthly+Reports",
  },
];
