export type ProjectPresentation =
  | {
      type: "diagram";
      variant: "datacenter" | "multicloud";
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
      en: "Network Architecture",
      vi: "Kiến Trúc Mạng",
    },
    status: {
      en: "Completed",
      vi: "Hoàn Thành",
    },
    title: {
      en: "Enterprise Datacenter Migration",
      vi: "Di Dời Trung Tâm Dữ Liệu Doanh Nghiệp",
    },
    description: {
      en: "Migrated legacy datacenter infrastructure into a high-throughput, resilient spine-leaf fabric.",
      vi: "Di dời hạ tầng mạng trung tâm dữ liệu cũ sang kiến trúc spine-leaf hiện đại, hiệu năng và độ tin cậy cao.",
    },
    techStack: ["Cisco Nexus", "BGP", "VXLAN", "Python"],
    metric: {
      value: "+40%",
      label: {
        en: "Throughput",
        vi: "Thông lượng",
      },
    },
    presentation: {
      type: "diagram",
      variant: "datacenter",
    },
    links: {
      caseStudy: "#",
    },
  },
  {
    id: 2,
    category: {
      en: "Network Automation",
      vi: "Tự Động Hóa Mạng",
    },
    status: {
      en: "Completed",
      vi: "Hoàn Thành",
    },
    title: {
      en: "Automated Device Provisioning",
      vi: "Cấp Phát Thiết Bị Tự Động",
    },
    description: {
      en: "Automating branch router configuration and deployment workflows using Python scripts and Ansible.",
      vi: "Tự động hóa quy trình cấu hình và triển khai router chi nhánh bằng mã Python và Ansible.",
    },
    techStack: ["Python", "Netmiko", "Ansible", "Jinja2"],
    metric: {
      value: "HOURS → MINS",
      label: {
        en: "Deployment Time",
        vi: "Thời gian triển khai",
      },
    },
    presentation: {
      type: "terminal",
      command: "$ provision branch-hcm-01",
      lines: [
        "Loading device inventory...",
        "✓ ROUTER-01 configured",
        "✓ ROUTER-02 configured",
        "✓ ROUTER-03 configured",
        "Deployment complete (3/3).",
      ],
    },
    links: {
      source: "https://github.com",
    },
  },
  {
    id: 3,
    category: {
      en: "Cloud Security",
      vi: "Bảo Mật Đám Mây",
    },
    status: {
      en: "Maintained",
      vi: "Duy Trì",
    },
    title: {
      en: "Multi-Cloud Secure Connect",
      vi: "Kết Nối Đa Đám Mây An Toàn",
    },
    description: {
      en: "High-availability site-to-site IPsec VPN connecting on-premise infrastructure to AWS and Azure datacenters.",
      vi: "Hệ thống IPsec VPN sẵn sàng cao kết nối hạ tầng on-premise với trung tâm dữ liệu AWS và Azure.",
    },
    techStack: ["AWS VPC", "IPsec", "Palo Alto", "Terraform"],
    metric: {
      value: "99.99%",
      label: {
        en: "Availability",
        vi: "Độ sẵn sàng",
      },
    },
    presentation: {
      type: "diagram",
      variant: "multicloud",
    },
    links: {
      caseStudy: "#",
    },
  },
];
