export type ProjectPresentation =
  | {
      type: "diagram";
      variant: "portfolio" | "malware-scanner" | "sdn-ids";
    }
  | {
      type: "terminal";
      command: string;
      lines: string[];
    }
  | {
      type: "code";
      language?: string;
      lines: string[];
    }
  | {
      type: "image";
      src: string;
      alt: { en: string; vi: string };
    }
  | {
      type: "stats";
      items: { value: string; label: { en: string; vi: string } }[];
    }
  | {
      type: "none";
    };

export interface ProjectLinks {
  demo?: string;
  source?: string;
  caseStudy?: string;
}

export interface Project {
  id: number;
  category: {
    en: string;
    vi: string;
  };
  status: {
    en: string;
    vi: string;
  };
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  techStack: string[];
  metric: {
    value: string;
    label: {
      en: string;
      vi: string;
    };
  };
  presentation: ProjectPresentation;
  links: ProjectLinks;
}

export const projects: Project[] = [
  {
    id: 1,
    category: {
      en: "Web Security",
      vi: "Bảo Mật Web",
    },
    status: {
      en: "Active",
      vi: "Đang Phát Triển",
    },
    title: {
      en: "Automated Web Vulnerability Scanner",
      vi: "Trình Quét Lỗ Hổng Web Tự Động",
    },
    description: {
      en: "An automated web vulnerability scanner with static and dynamic crawling, modular detection engines, verification with CVSS scoring, and HTML/PDF/SARIF reports via CLI and FastAPI.",
      vi: "Trình quét lỗ hổng web tự động với crawler tĩnh và động, engine phát hiện dạng module, xác minh kèm chấm điểm CVSS, xuất báo cáo HTML/PDF/SARIF qua CLI và FastAPI.",
    },
    techStack: ["Python", "FastAPI", "Selenium", "Docker", "WeasyPrint"],
    metric: {
      value: "E2E PIPELINE",
      label: {
        en: "Scan to Report",
        vi: "Quét Đến Báo Cáo",
      },
    },
    presentation: {
      type: "terminal",
      command: "$ web-scanner scan https://target.local",
      lines: [
        "✓ Crawled 48 endpoints",
        "✓ 3 findings verified",
        "Report complete: scan.html / scan.pdf",
      ],
    },
    links: {
      source: "https://github.com/Tsuru-chan/Automated-Web-Vulnerability",
    },
  },
  {
    id: 2,
    category: {
      en: "Malware Analysis",
      vi: "Phân Tích Mã Độc",
    },
    status: {
      en: "Completed",
      vi: "Hoàn Thành",
    },
    title: {
      en: "YARA Malware Scanner",
      vi: "Trình Quét Mã Độc YARA",
    },
    description: {
      en: "A cross-platform desktop scanner combining YARA rules and multi-algorithm hash matching, with scan history, reports, and MalwareBazaar signature sync.",
      vi: "Ứng dụng desktop đa nền tảng kết hợp luật YARA và đối chiếu nhiều loại mã băm, có lịch sử quét, xuất báo cáo và đồng bộ chữ ký MalwareBazaar.",
    },
    techStack: ["Python", "YARA"],
    metric: {
      value: "2 LAYERS",
      label: {
        en: "Detection Engine",
        vi: "Lớp Phát Hiện",
      },
    },
    presentation: {
      type: "diagram",
      variant: "malware-scanner",
    },
    links: {
      source: "https://github.com/nguyen-nbtk05/YARA-Malware_Scanner",
    },
  },
  {
    id: 3,
    category: {
      en: "Network Security",
      vi: "An Ninh Mạng",
    },
    status: {
      en: "Completed",
      vi: "Hoàn Thành",
    },
    title: {
      en: "SDN Intrusion Detection System",
      vi: "Hệ Thống Phát Hiện Xâm Nhập SDN",
    },
    description: {
      en: "A Mininet security lab where Ryu analyzes OpenFlow statistics with an entropy window, detects DDoS, port scans, and ARP spoofing, then blocks attackers using timed Flow-Mod rules.",
      vi: "Mô hình an ninh Mininet, trong đó Ryu phân tích thống kê OpenFlow bằng cửa sổ Entropy, phát hiện DDoS, quét cổng và giả mạo ARP, rồi chặn nguồn tấn công bằng luật Flow-Mod có thời hạn.",
    },
    techStack: ["Ryu", "Mininet", "OpenFlow", "Python", "Shannon Entropy"],
    metric: {
      value: "16 HOSTS",
      label: {
        en: "Mininet Testbed",
        vi: "Mô Hình Mininet",
      },
    },
    presentation: {
      type: "diagram",
      variant: "sdn-ids",
    },
    links: {
      source: "https://github.com/nguyen-nbtk05/SDN-Intrusion-Detection-System",
    },
  },
];
