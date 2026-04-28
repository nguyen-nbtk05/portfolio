export const projects = [
  {
    id: 1,
    title: { en: "Enterprise Datacenter Migration", vi: "Di Dời Trung Tâm Dữ Liệu Doanh Nghiệp" },
    description: { 
      en: "Successfully migrated legacy datacenter network to a modern spine-leaf architecture using Cisco Nexus switches, improving throughput by 40%.",
      vi: "Di dời thành công hệ thống mạng trung tâm dữ liệu cũ sang cấu trúc spine-leaf hiện đại bằng switch Cisco Nexus, cải thiện độ trễ 40%."
    },
    techStack: ["Cisco Nexus", "BGP", "VXLAN"],
    link: "#",
  },
  {
    id: 2,
    title: { en: "Automated Device Provisioning", vi: "Cấp Phát Thiết Bị Tự Động" },
    description: {
      en: "Developed Python scripts to automate the provisioning of branch office routers, reducing deployment time from hours to minutes.",
      vi: "Phát triển mã Python để tự động hóa việc cấp phát thiết bị router ở các chi nhánh, giảm thiểu thời gian cài đặt từ nhiều giờ xuống vài phút."
    },
    techStack: ["Python", "Netmiko", "Ansible"],
    link: "https://github.com",
  },
  {
    id: 3,
    title: { en: "Multi-Cloud Secure Connect", vi: "Kết Nối Đa Đám Mây An Toàn" },
    description: {
      en: "Designed and implemented highly available site-to-site IPsec VPNs connecting on-premise infrastructure to AWS and Azure datacenters.",
      vi: "Thiết kế và thực thi hệ thống kết nối site-to-site IPsec VPNs với tính sẵn sàng cao giữa hệ thống on-premise với AWS và Azure."
    },
    techStack: ["AWS VPC", "IPsec", "Palo Alto Firewalls"],
    link: "#",
  }
];
