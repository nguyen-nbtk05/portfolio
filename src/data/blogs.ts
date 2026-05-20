export type BlogPost = {
  id: number;
  title: {
    en: string;
    vi: string;
  };
  excerpt: {
    en: string;
    vi: string;
  };
  publishedAt: string;
  readTime: {
    en: string;
    vi: string;
  };
  tags: string[];
  link: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: {
      en: "Designing a Resilient Branch Network with SD-WAN",
      vi: "Thiet Ke Mang Chi Nhanh Ben Vung Voi SD-WAN",
    },
    excerpt: {
      en: "How I segment branch traffic, optimize failover, and keep policy controls consistent across sites.",
      vi: "Cach toi phan doan luong branch, toi uu failover va giu policy bao mat dong nhat giua nhieu dia diem.",
    },
    publishedAt: "2026-05-12",
    readTime: {
      en: "7 min read",
      vi: "7 phut doc",
    },
    tags: ["SD-WAN", "Routing", "Security"],
    link: "#",
  },
  {
    id: 2,
    title: {
      en: "Automating Config Backups with Python + Netmiko",
      vi: "Tu Dong Sao Luu Cau Hinh Bang Python va Netmiko",
    },
    excerpt: {
      en: "A practical workflow to schedule backup jobs, detect drift, and reduce recovery time during incidents.",
      vi: "Quy trinh thuc te de lap lich backup, phat hien sai lech cau hinh va rut ngan thoi gian phuc hoi su co.",
    },
    publishedAt: "2026-04-27",
    readTime: {
      en: "5 min read",
      vi: "5 phut doc",
    },
    tags: ["Python", "Netmiko", "Automation"],
    link: "#",
  },
  {
    id: 3,
    title: {
      en: "Zero-Trust Basics for Hybrid Infrastructure",
      vi: "Nen Tang Zero-Trust Cho Ha Tang Hybrid",
    },
    excerpt: {
      en: "A starter model for identity-aware access, east-west controls, and observability in hybrid environments.",
      vi: "Mot mo hinh khoi dau cho truy cap theo danh tinh, kiem soat east-west va quan sat he thong hybrid.",
    },
    publishedAt: "2026-04-09",
    readTime: {
      en: "6 min read",
      vi: "6 phut doc",
    },
    tags: ["Zero Trust", "IAM", "Hybrid Cloud"],
    link: "#",
  },
];
