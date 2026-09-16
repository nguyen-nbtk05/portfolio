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
  | "cisco"
  | "docker"
  | "wireshark"
  | "yara"
  | "shield"
  | "vlan"
  | "network-services";

export type SkillGroupTone =
  | "programming"
  | "linux"
  | "collaboration"
  | "networking";

export type SkillItem = {
  id: string;
  label: string;
  icon: SkillIconKey;
  secondIcon?: SkillIconKey;
  /** Overrides the group tone color for the primary icon only. */
  iconTone?: SkillTone;
  /** Overrides the group tone color for the secondary icon only. */
  secondIconTone?: SkillTone;
  tone: SkillTone;
  overview: LocalizedSkillText;
  description: LocalizedSkillText;
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
    id: "programming-scripting",
    category: { en: "Programming & Scripting", vi: "Lập trình & Kịch bản" },
    icon: "python",
    tone: "programming",
    items: [
      {
        id: "python",
        label: "Python",
        icon: "python",
        tone: "blue",
        overview: {
          en: "Python is a high-level, general-purpose programming language known for readable syntax and a broad ecosystem spanning automation, data, web development, and cybersecurity.",
          vi: "Python là ngôn ngữ lập trình đa mục đích bậc cao, nổi bật với cú pháp dễ đọc và hệ sinh thái rộng cho tự động hóa, dữ liệu, phát triển web và an ninh mạng.",
        },
        description: {
          en: "Applied to automation, security tooling, and networking experiments, including a YARA-based malware scanner and an SDN intrusion-detection project.",
          vi: "Được ứng dụng cho tự động hóa, công cụ bảo mật và thử nghiệm mạng, bao gồm trình quét mã độc dùng YARA và dự án phát hiện xâm nhập SDN.",
        },
      },
      {
        id: "bash",
        label: "Bash",
        icon: "bash",
        tone: "emerald",
        overview: {
          en: "Bash is a command-line shell and scripting language widely used on Unix-like systems to combine commands, automate workflows, and manage environments.",
          vi: "Bash là shell dòng lệnh kiêm ngôn ngữ kịch bản phổ biến trên các hệ thống Unix, dùng để kết hợp lệnh, tự động hóa quy trình và quản lý môi trường.",
        },
        description: {
          en: "Applied to automating repetitive terminal workflows, preparing lab environments, and operating efficiently across files, processes, and networking utilities.",
          vi: "Được ứng dụng để tự động hóa các quy trình terminal lặp lại, chuẩn bị môi trường lab và vận hành hiệu quả trên tệp, tiến trình cùng các tiện ích mạng.",
        },
      },
      {
        id: "javascript-typescript",
        label: "JavaScript & TypeScript",
        icon: "javascript",
        secondIcon: "typescript",
        iconTone: "amber",
        secondIconTone: "blue",
        tone: "blue",
        overview: {
          en: "JavaScript is the core scripting language of the web for dynamic browser interfaces and server-side runtimes such as Node.js, while TypeScript extends it with static types for improved tooling, clarity, and reliability.",
          vi: "JavaScript là ngôn ngữ kịch bản cốt lõi của web cho giao diện động và runtime phía máy chủ như Node.js, trong khi TypeScript mở rộng nó bằng kiểu tĩnh để cải thiện công cụ, độ rõ ràng và độ tin cậy.",
        },
        description: {
          en: "Applied with React and Next.js to develop interactive interfaces, manage asynchronous flows, and maintain structured front-end codebases with early error detection.",
          vi: "Được ứng dụng cùng React và Next.js để phát triển giao diện tương tác, quản lý luồng bất đồng bộ và duy trì mã nguồn front-end có cấu trúc với khả năng phát hiện lỗi sớm.",
        },
      },
      {
        id: "rust",
        label: "Rust",
        icon: "rust",
        tone: "orange",
        overview: {
          en: "Rust is a systems programming language focused on performance, memory safety, and concurrency through its ownership model without requiring a garbage collector.",
          vi: "Rust là ngôn ngữ lập trình hệ thống tập trung vào hiệu năng, an toàn bộ nhớ và xử lý đồng thời thông qua cơ chế ownership mà không cần garbage collector.",
        },
        description: {
          en: "Pursued through exercises and small prototypes to consolidate memory safety, ownership, and reliable systems programming.",
          vi: "Được rèn luyện qua các bài tập và nguyên mẫu nhỏ nhằm củng cố an toàn bộ nhớ, cơ chế ownership và lập trình hệ thống đáng tin cậy.",
        },
      },
    ],
  },
  {
    id: "linux-distributions",
    category: { en: "Linux & Distributions", vi: "Linux & Bản phân phối" },
    icon: "linux",
    tone: "linux",
    items: [
      {
        id: "linux",
        label: "Linux",
        icon: "linux",
        tone: "amber",
        overview: {
          en: "Linux is an open-source, Unix-like operating-system kernel that powers a wide range of servers, cloud platforms, embedded devices, and desktop distributions.",
          vi: "Linux là nhân hệ điều hành mã nguồn mở theo họ Unix, được sử dụng rộng rãi trên máy chủ, nền tảng đám mây, thiết bị nhúng và nhiều bản phân phối desktop.",
        },
        description: {
          en: "Utilized as the primary environment for command-line operations, system administration, security laboratories, and network experimentation.",
          vi: "Được sử dụng làm môi trường chính cho thao tác dòng lệnh, quản trị hệ thống, phòng lab bảo mật và thử nghiệm mạng.",
        },
      },
      {
        id: "debian-based",
        label: "Debian-based",
        icon: "debian",
        tone: "rose",
        overview: {
          en: "Debian-based distributions build on Debian's stable package ecosystem and typically use APT and DEB packages for dependable software management.",
          vi: "Các bản phân phối dựa trên Debian kế thừa hệ sinh thái gói ổn định của Debian và thường sử dụng APT cùng định dạng DEB để quản lý phần mềm đáng tin cậy.",
        },
        description: {
          en: "Deployed across development and infrastructure laboratories for package management, service configuration, and routine administration.",
          vi: "Được triển khai trong các phòng lab phát triển và hạ tầng cho quản lý gói, cấu hình dịch vụ và quản trị thường xuyên.",
        },
      },
      {
        id: "rhel-based",
        label: "RHEL-based",
        icon: "red-hat",
        tone: "red",
        overview: {
          en: "RHEL-based distributions emphasize enterprise stability, security, and long-term maintenance, using the RPM package format with tools such as DNF.",
          vi: "Các bản phân phối dựa trên RHEL chú trọng tính ổn định doanh nghiệp, bảo mật và bảo trì dài hạn, sử dụng định dạng gói RPM cùng các công cụ như DNF.",
        },
        description: {
          en: "Practiced for RPM/DNF workflows, systemd service management, permission models, and enterprise Linux conventions.",
          vi: "Được thực hành cho quy trình RPM/DNF, quản lý dịch vụ systemd, mô hình phân quyền và các quy ước Linux doanh nghiệp.",
        },
      },
      {
        id: "arch-based",
        label: "Arch-based",
        icon: "arch-linux",
        tone: "cyan",
        overview: {
          en: "Arch-based distributions follow a lightweight, rolling-release approach that gives users direct control over system components and configuration.",
          vi: "Các bản phân phối dựa trên Arch đi theo hướng tối giản và rolling release, mang lại quyền kiểm soát trực tiếp đối với thành phần và cấu hình hệ thống.",
        },
        description: {
          en: "Explored to develop a comprehensive understanding of minimal system installation, manual configuration, package management, and customization.",
          vi: "Được tìm hiểu nhằm phát triển hiểu biết toàn diện về cài đặt hệ thống tối giản, cấu hình thủ công, quản lý gói và tùy biến.",
        },
      },
    ],
  },
  {
    id: "networking-simulation",
    category: {
      en: "Networking & Simulation",
      vi: "Mạng & Mô phỏng",
    },
    icon: "network-engineering",
    tone: "networking",
    items: [
      {
        id: "ipv4-ipv6",
        label: "IPv4 & IPv6",
        icon: "ipv4",
        tone: "blue",
        overview: {
          en: "IPv4 uses 32-bit addresses to identify devices and route packets across networks, while IPv6 provides 128-bit addressing with a vastly larger space and improvements for modern networks.",
          vi: "IPv4 sử dụng địa chỉ 32 bit để định danh thiết bị và định tuyến gói tin qua các mạng, trong khi IPv6 cung cấp địa chỉ 128 bit với không gian lớn hơn rất nhiều cùng nhiều cải tiến cho mạng hiện đại.",
        },
        description: {
          en: "Applied to address planning and troubleshooting across laboratory topologies, covering neighbor discovery and coexistence of both protocols.",
          vi: "Được ứng dụng cho quy hoạch địa chỉ và xử lý sự cố trên các topology phòng lab, bao gồm Neighbor Discovery và vận hành song song hai giao thức.",
        },
      },
      {
        id: "vlan-stp",
        label: "VLAN & STP",
        icon: "vlan",
        tone: "indigo",
        overview: {
          en: "VLANs segment a switched network into isolated broadcast domains, while the Spanning Tree Protocol prevents Layer 2 loops by managing redundant paths between switches.",
          vi: "VLAN phân đoạn mạng chuyển mạch thành các miền broadcast độc lập, trong khi Spanning Tree Protocol ngăn loop Layer 2 bằng cách quản lý các đường dự phòng giữa các switch.",
        },
        description: {
          en: "Configured in laboratory topologies for segmentation, 802.1Q trunking, and loop-free redundant switching.",
          vi: "Được cấu hình trong các topology phòng lab cho phân đoạn mạng, trunking 802.1Q và chuyển mạch dự phòng không loop.",
        },
      },
      {
        id: "network-services",
        label: "DNS / DHCP / NAT",
        icon: "network-services",
        tone: "emerald",
        overview: {
          en: "DNS resolves domain names to IP addresses, DHCP automates address assignment, and NAT enables private networks to reach external networks through address translation.",
          vi: "DNS phân giải tên miền thành địa chỉ IP, DHCP tự động cấp phát địa chỉ, và NAT cho phép mạng nội bộ truy cập mạng ngoài thông qua chuyển đổi địa chỉ.",
        },
        description: {
          en: "Configured in laboratory environments to provide name resolution, automatic addressing, and external connectivity for segmented topologies.",
          vi: "Được cấu hình trong môi trường phòng lab để cung cấp phân giải tên, cấp địa chỉ tự động và kết nối ngoài cho các topology đã phân đoạn.",
        },
      },
      {
        id: "rip",
        label: "RIP",
        icon: "rip",
        tone: "blue",
        overview: {
          en: "RIP is a distance-vector interior routing protocol that selects routes by hop count and periodically shares routing information with neighboring routers.",
          vi: "RIP là giao thức định tuyến nội bộ kiểu distance-vector, lựa chọn tuyến theo số hop và định kỳ trao đổi thông tin định tuyến với các router láng giềng.",
        },
        description: {
          en: "Configured in compact laboratory topologies to examine distance-vector operation, route exchange, convergence, and practical limitations.",
          vi: "Được cấu hình trong các topology lab nhỏ để nghiên cứu vận hành distance-vector, trao đổi tuyến, hội tụ và các giới hạn thực tế.",
        },
      },
      {
        id: "ospf",
        label: "OSPF",
        icon: "ospf",
        tone: "cyan",
        overview: {
          en: "OSPF is a link-state interior routing protocol that builds a topology database and computes efficient paths using interface cost with Dijkstra's shortest-path-first algorithm.",
          vi: "OSPF là giao thức định tuyến nội bộ kiểu link-state, xây dựng cơ sở dữ liệu topology và tính toán đường đi hiệu quả dựa trên cost giao diện cùng thuật toán Dijkstra (SPF).",
        },
        description: {
          en: "Implemented in laboratory topologies to examine link-state operation, neighbor adjacency, cost-based path selection, and area design.",
          vi: "Được triển khai trong các topology phòng lab để nghiên cứu vận hành link-state, quan hệ kề neighbor, lựa chọn đường đi theo cost và thiết kế area.",
        },
      },
      {
        id: "eigrp",
        label: "EIGRP",
        icon: "eigrp",
        tone: "violet",
        overview: {
          en: "EIGRP is an advanced distance-vector routing protocol that uses multiple metrics and the DUAL algorithm to select loop-free paths and converge quickly.",
          vi: "EIGRP là giao thức định tuyến distance-vector nâng cao, sử dụng nhiều metric và thuật toán DUAL để chọn đường không lặp và hội tụ nhanh.",
        },
        description: {
          en: "Configured in Cisco-focused laboratories to practice neighbor formation, metric-based path selection, route propagation, and convergence behavior.",
          vi: "Được cấu hình trong các phòng lab Cisco để thực hành thiết lập quan hệ láng giềng, chọn đường theo metric, quảng bá tuyến và hành vi hội tụ.",
        },
      },
      {
        id: "packet-tracer",
        label: "Packet Tracer",
        icon: "cisco",
        tone: "cyan",
        overview: {
          en: "Cisco Packet Tracer is a visual network-simulation tool for building virtual topologies and practicing device configuration without dedicated physical hardware.",
          vi: "Cisco Packet Tracer là công cụ mô phỏng mạng trực quan, dùng để xây dựng topology ảo và thực hành cấu hình thiết bị mà không cần phần cứng chuyên dụng.",
        },
        description: {
          en: "Employed to design, configure, and validate simulated network topologies prior to application in advanced laboratory environments.",
          vi: "Được sử dụng để thiết kế, cấu hình và kiểm chứng các topology mạng mô phỏng trước khi áp dụng vào môi trường lab nâng cao.",
        },
      },
      {
        id: "mininet",
        label: "Mininet",
        icon: "network-engineering",
        tone: "blue",
        overview: {
          en: "Mininet is a network emulation platform that creates virtual hosts, switches, and controllers on a single machine for software-defined networking experiments with protocols such as OpenFlow.",
          vi: "Mininet là nền tảng giả lập mạng tạo host, switch và controller ảo trên một máy duy nhất cho các thử nghiệm mạng điều khiển bằng phần mềm với các giao thức như OpenFlow.",
        },
        description: {
          en: "Employed to construct SDN testbeds for analyzing controller behavior and validating intrusion-detection logic.",
          vi: "Được sử dụng để dựng testbed SDN nhằm phân tích hành vi controller và kiểm chứng logic phát hiện xâm nhập.",
        },
      },
    ],
  },
  {
    id: "security-tools",
    category: {
      en: "Security & Tools",
      vi: "Bảo mật & Công cụ",
    },
    icon: "shield",
    tone: "collaboration",
    items: [
      {
        id: "yara",
        label: "YARA",
        icon: "yara",
        tone: "rose",
        overview: {
          en: "YARA is a pattern-matching tool for identifying and classifying malware through rule-based signatures, commonly combined with hash matching for layered detection.",
          vi: "YARA là công cụ đối sánh mẫu để nhận diện và phân loại mã độc bằng luật chữ ký, thường kết hợp với đối chiếu mã băm để phát hiện nhiều lớp.",
        },
        description: {
          en: "Applied as the core detection layer of a cross-platform malware scanner, complemented by multi-algorithm hash matching and signature synchronization.",
          vi: "Được ứng dụng làm lớp phát hiện cốt lõi của trình quét mã độc đa nền tảng, kết hợp đối chiếu nhiều thuật toán băm và đồng bộ chữ ký.",
        },
      },
      {
        id: "docker",
        label: "Docker",
        icon: "docker",
        tone: "blue",
        overview: {
          en: "Docker is a containerization platform that packages applications with dependencies into isolated, portable containers for consistent deployment across environments.",
          vi: "Docker là nền tảng container hóa đóng gói ứng dụng cùng phụ thuộc thành các container độc lập, di động để triển khai nhất quán trên nhiều môi trường.",
        },
        description: {
          en: "Utilized to containerize scanning pipelines and laboratory services for reproducible, isolated execution.",
          vi: "Được sử dụng để container hóa pipeline quét và các dịch vụ phòng lab nhằm thực thi độc lập, nhất quán.",
        },
      },
      {
        id: "wireshark",
        label: "Wireshark",
        icon: "wireshark",
        tone: "cyan",
        overview: {
          en: "Wireshark is a widely used network packet analyzer that captures and dissects traffic in real time for troubleshooting, protocol analysis, and security investigation.",
          vi: "Wireshark là công cụ phân tích gói tin mạng phổ biến, thu và bóc tách lưu lượng theo thời gian thực để xử lý sự cố, phân tích giao thức và điều tra bảo mật.",
        },
        description: {
          en: "Employed to capture laboratory traffic and examine TCP/IP behavior alongside suspicious packet patterns during networking and security practice.",
          vi: "Được sử dụng để thu lưu lượng phòng lab và kiểm tra hành vi TCP/IP cùng các mẫu gói tin đáng ngờ khi thực hành mạng và bảo mật.",
        },
      },
      {
        id: "git",
        label: "Git",
        icon: "git",
        tone: "orange",
        overview: {
          en: "Git is a distributed version-control system that records source-code history and supports parallel development through branches, merges, and local repositories.",
          vi: "Git là hệ thống quản lý phiên bản phân tán, ghi lại lịch sử mã nguồn và hỗ trợ phát triển song song thông qua branch, merge cùng repository cục bộ.",
        },
        description: {
          en: "Applied to source-history management, branch-based organization, and traceable changes across coursework and personal projects.",
          vi: "Được ứng dụng cho quản lý lịch sử mã nguồn, tổ chức theo branch và theo dõi thay đổi trong bài tập lẫn dự án cá nhân.",
        },
      },
      {
        id: "github",
        label: "GitHub",
        icon: "github",
        tone: "slate",
        overview: {
          en: "GitHub is a cloud platform built around Git for hosting repositories, reviewing code, tracking work, publishing documentation, and collaborating on software.",
          vi: "GitHub là nền tảng đám mây xây dựng quanh Git để lưu trữ repository, review code, theo dõi công việc, xuất bản tài liệu và cộng tác phát triển phần mềm.",
        },
        description: {
          en: "Utilized to publish source code, document technical projects, review changes, and maintain accessible collaboration.",
          vi: "Được sử dụng để công khai mã nguồn, viết tài liệu dự án kỹ thuật, rà soát thay đổi và duy trì cộng tác thuận tiện.",
        },
      },
    ],
  },
];
