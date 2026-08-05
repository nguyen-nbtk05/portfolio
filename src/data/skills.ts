export type LocalizedSkillText = {
  en: string;
  vi: string;
};

export type SkillTone =
  | "cyan"
  | "blue"
  | "indigo"
  | "violet"
  | "emerald"
  | "amber"
  | "orange"
  | "rose"
  | "red"
  | "slate";

export type SkillIconKey =
  | "python"
  | "javascript"
  | "typescript"
  | "rust"
  | "bash"
  | "linux"
  | "debian"
  | "red-hat"
  | "arch-linux"
  | "git"
  | "github"
  | "network-engineering"
  | "ipv4"
  | "ipv6"
  | "subnetting"
  | "rip"
  | "ospf"
  | "eigrp"
  | "cisco";

export type SkillGroupTone =
  | "programming"
  | "linux"
  | "collaboration"
  | "networking";

export type SkillItem = {
  id: string;
  label: string;
  icon: SkillIconKey;
  tone: SkillTone;
};

export type SkillGroup = {
  id: string;
  category: LocalizedSkillText;
  icon: SkillIconKey;
  tone: SkillGroupTone;
  items: SkillItem[];
};

export const skills: SkillGroup[] = [
  {
    id: "programming-languages",
    category: { en: "Programming Languages", vi: "Ngôn ngữ lập trình" },
    icon: "python",
    tone: "programming",
    items: [
      { id: "python", label: "Python", icon: "python", tone: "blue" },
      { id: "rust", label: "Rust", icon: "rust", tone: "orange" },
      { id: "javascript", label: "JavaScript", icon: "javascript", tone: "amber" },
      { id: "typescript", label: "TypeScript", icon: "typescript", tone: "blue" },
    ],
  },
  {
    id: "linux-distributions",
    category: { en: "Linux & Distributions", vi: "Linux & Bản phân phối" },
    icon: "linux",
    tone: "linux",
    items: [
      { id: "linux", label: "Linux", icon: "linux", tone: "amber" },
      { id: "bash", label: "Bash", icon: "bash", tone: "emerald" },
      { id: "debian-based", label: "Debian-based", icon: "debian", tone: "rose" },
      { id: "rhel-based", label: "RHEL-based", icon: "red-hat", tone: "red" },
      { id: "arch-based", label: "Arch-based", icon: "arch-linux", tone: "cyan" },
    ],
  },
  {
    id: "version-control-collaboration",
    category: {
      en: "Version Control & Collaboration",
      vi: "Quản lý phiên bản & Cộng tác",
    },
    icon: "git",
    tone: "collaboration",
    items: [
      { id: "git", label: "Git", icon: "git", tone: "orange" },
      { id: "github", label: "GitHub", icon: "github", tone: "slate" },
    ],
  },
  {
    id: "network-engineering-simulation",
    category: {
      en: "Networking Fundamentals & Routing",
      vi: "Kỹ thuật mạng & Định tuyến",
    },
    icon: "network-engineering",
    tone: "networking",
    items: [
      { id: "ipv4", label: "IPv4", icon: "ipv4", tone: "blue" },
      { id: "ipv6", label: "IPv6", icon: "ipv6", tone: "cyan" },
      { id: "subnetting", label: "Subnetting", icon: "subnetting", tone: "indigo" },
      { id: "rip", label: "RIP", icon: "rip", tone: "blue" },
      { id: "ospf", label: "OSPF", icon: "ospf", tone: "cyan" },
      { id: "eigrp", label: "EIGRP", icon: "eigrp", tone: "violet" },
      {
        id: "cisco-packet-tracer",
        label: "Cisco Packet Tracer",
        icon: "cisco",
        tone: "cyan",
      },
    ],
  },
];
