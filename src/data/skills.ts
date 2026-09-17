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
  | "postman"
  | "sql"
  | "selenium"
  | "virtualization"
  | "nmap"
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
    id: "programming",
    category: { en: "Programming", vi: "Ngôn ngữ lập trình" },
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
        id: "sql",
        label: "SQL",
        icon: "sql",
        tone: "indigo",
        overview: {
          en: "SQL is a declarative language for storing, querying, and managing data in relational databases such as PostgreSQL, MySQL, and SQLite.",
          vi: "SQL là ngôn ngữ truy vấn và quản lý dữ liệu trong các cơ sở dữ liệu quan hệ như PostgreSQL, MySQL và SQLite.",
        },
        description: {
          en: "Practiced through coursework and exercises for schema design, CRUD queries, filtering, and joins.",
          vi: "Được rèn luyện qua bài tập cho thiết kế schema, truy vấn CRUD, lọc dữ liệu và joins.",
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
      {
        id: "javascript",
        label: "JavaScript",
        icon: "javascript",
        tone: "amber",
        overview: {
          en: "JavaScript is the core scripting language of the web for dynamic browser interfaces and server-side runtimes such as Node.js.",
          vi: "JavaScript là ngôn ngữ kịch bản cốt lõi của web cho giao diện động và runtime phía máy chủ như Node.js.",
        },
        description: {
          en: "Applied with React and Next.js to build interactive interfaces and handle asynchronous flows.",
          vi: "Được ứng dụng cùng React và Next.js để xây dựng giao diện tương tác và xử lý luồng bất đồng bộ.",
        },
      },
      {
        id: "typescript",
        label: "TypeScript",
        icon: "typescript",
        tone: "blue",
        overview: {
          en: "TypeScript extends JavaScript with static types for improved tooling, clarity, and reliability.",
          vi: "TypeScript mở rộng JavaScript bằng kiểu tĩnh để cải thiện công cụ, độ rõ ràng và độ tin cậy.",
        },
        description: {
          en: "Applied with React and Next.js to maintain structured front-end codebases with early error detection.",
          vi: "Được ứng dụng cùng React và Next.js để duy trì mã nguồn front-end có cấu trúc với khả năng phát hiện lỗi sớm.",
        },
      },
    ],
  },
  {
    id: "linux",
    category: { en: "Linux", vi: "Linux" },
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
        id: "virtualization",
        label: "Virtualization",
        icon: "virtualization",
        tone: "violet",
        overview: {
          en: "Virtualization runs multiple isolated virtual machines on a single physical host through hypervisors such as VMware, VirtualBox, and Proxmox.",
          vi: "Ảo hóa cho phép chạy nhiều máy ảo độc lập trên một máy vật lý thông qua các hypervisor như VMware, VirtualBox và Proxmox.",
        },
        description: {
          en: "Utilized to build isolated lab environments for Linux practice, network topologies, and security experiments.",
          vi: "Được sử dụng để dựng môi trường lab độc lập cho thực hành Linux, topology mạng và thử nghiệm bảo mật.",
        },
      },
    ],
  },
  {
    id: "networking-analysis",
    category: {
      en: "Networking & Analysis",
      vi: "Mạng & Phân tích",
    },
    icon: "network-engineering",
    tone: "networking",
    items: [
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
      {
        id: "nmap",
        label: "Nmap",
        icon: "nmap",
        tone: "slate",
        overview: {
          en: "Nmap is a network scanning tool for discovering hosts, services, and open ports, widely used for inventory, auditing, and security assessment.",
          vi: "Nmap là công cụ quét mạng để phát hiện host, dịch vụ và cổng mở, dùng phổ biến cho kiểm kê, kiểm toán và đánh giá bảo mật.",
        },
        description: {
          en: "Practiced in lab environments for host discovery, port scanning, service detection, and OS fingerprinting.",
          vi: "Được thực hành trong lab cho phát hiện host, quét cổng, nhận diện dịch vụ và OS fingerprinting.",
        },
      },
    ],
  },
  {
    id: "tools",
    category: {
      en: "Dev Tools",
      vi: "Công cụ",
    },
    icon: "docker",
    tone: "collaboration",
    items: [
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
        id: "postman",
        label: "Postman",
        icon: "postman",
        tone: "orange",
        overview: {
          en: "Postman is a collaboration platform for designing, testing, and documenting APIs through requests, collections, and automated test scripts.",
          vi: "Postman là nền tảng để thiết kế, kiểm thử và viết tài liệu API thông qua request, collection và script kiểm thử tự động.",
        },
        description: {
          en: "Employed to test and debug REST API endpoints during development of FastAPI-based scanning services.",
          vi: "Được sử dụng để kiểm thử và gỡ lỗi các endpoint REST API khi phát triển dịch vụ quét dùng FastAPI.",
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
      {
        id: "selenium",
        label: "Selenium",
        icon: "selenium",
        tone: "emerald",
        overview: {
          en: "Selenium is a browser-automation framework for controlling web browsers programmatically, widely used for testing and dynamic web crawling.",
          vi: "Selenium là framework tự động hóa trình duyệt, điều khiển trình duyệt bằng code, dùng phổ biến cho kiểm thử và crawler web động.",
        },
        description: {
          en: "Applied as the dynamic crawling engine of the automated web vulnerability scanner alongside static analysis.",
          vi: "Được ứng dụng làm engine crawler động của trình quét lỗ hổng web tự động, kết hợp cùng phân tích tĩnh.",
        },
      },
    ],
  },
];
