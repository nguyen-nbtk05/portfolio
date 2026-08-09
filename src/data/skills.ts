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
    id: "programming-languages",
    category: { en: "Programming Languages", vi: "Ngôn ngữ lập trình" },
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
          en: "I use Python for automation, security tooling, and networking experiments. It is the primary language behind my YARA malware scanner and SDN intrusion-detection project.",
          vi: "Tôi sử dụng Python cho tự động hóa, công cụ bảo mật và các thử nghiệm mạng. Đây là ngôn ngữ chính trong dự án quét mã độc YARA và hệ thống phát hiện xâm nhập SDN của tôi.",
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
          en: "I am learning Rust through exercises and small prototypes to strengthen my understanding of memory safety, ownership, and reliable systems programming.",
          vi: "Tôi đang học Rust qua các bài tập và nguyên mẫu nhỏ để củng cố kiến thức về an toàn bộ nhớ, cơ chế ownership và lập trình hệ thống đáng tin cậy.",
        },
      },
      {
        id: "javascript",
        label: "JavaScript",
        icon: "javascript",
        tone: "amber",
        overview: {
          en: "JavaScript is the core scripting language of the web, enabling dynamic interfaces in browsers and supporting server-side applications through runtimes such as Node.js.",
          vi: "JavaScript là ngôn ngữ kịch bản cốt lõi của web, tạo nên giao diện động trên trình duyệt và hỗ trợ ứng dụng phía máy chủ qua các runtime như Node.js.",
        },
        description: {
          en: "I use modern JavaScript to build interactive browser experiences, handle client-side behavior, and work with asynchronous application flows.",
          vi: "Tôi sử dụng JavaScript hiện đại để xây dựng trải nghiệm web tương tác, xử lý hành vi phía trình duyệt và các luồng ứng dụng bất đồng bộ.",
        },
      },
      {
        id: "typescript",
        label: "TypeScript",
        icon: "typescript",
        tone: "blue",
        overview: {
          en: "TypeScript extends JavaScript with static types, improving editor tooling, code clarity, and reliability while compiling to standard JavaScript.",
          vi: "TypeScript mở rộng JavaScript bằng hệ thống kiểu tĩnh, giúp công cụ lập trình tốt hơn, mã nguồn rõ ràng và đáng tin cậy hơn trước khi biên dịch thành JavaScript tiêu chuẩn.",
        },
        description: {
          en: "I use TypeScript with React and Next.js to model data clearly, catch mistakes early, and keep growing front-end codebases easier to maintain.",
          vi: "Tôi sử dụng TypeScript cùng React và Next.js để mô hình hóa dữ liệu rõ ràng, phát hiện lỗi sớm và giúp mã nguồn front-end dễ bảo trì khi phát triển.",
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
          en: "Linux is my main environment for command-line work, system administration practice, security labs, and network experimentation.",
          vi: "Linux là môi trường chính tôi dùng cho công việc dòng lệnh, thực hành quản trị hệ thống, phòng lab bảo mật và thử nghiệm mạng.",
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
          en: "I use Bash to automate repetitive terminal tasks, prepare lab environments, and work efficiently with files, processes, and networking commands.",
          vi: "Tôi sử dụng Bash để tự động hóa tác vụ terminal lặp lại, chuẩn bị môi trường lab và làm việc hiệu quả với tệp, tiến trình cùng các lệnh mạng.",
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
          en: "I use Debian-based systems for development and infrastructure labs, including package management, service configuration, and everyday administration.",
          vi: "Tôi sử dụng các hệ điều hành dựa trên Debian cho phát triển và phòng lab hạ tầng, gồm quản lý gói, cấu hình dịch vụ và quản trị hằng ngày.",
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
          en: "I practice with RHEL-based systems to become familiar with RPM/DNF workflows, systemd services, permissions, and enterprise Linux conventions.",
          vi: "Tôi thực hành trên các hệ điều hành dựa trên RHEL để làm quen với quy trình RPM/DNF, dịch vụ systemd, phân quyền và các quy ước Linux doanh nghiệp.",
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
          en: "I explore Arch-based systems to better understand a minimal Linux setup, hands-on configuration, package management, and system customization.",
          vi: "Tôi tìm hiểu các hệ điều hành dựa trên Arch để hiểu rõ hơn cách thiết lập Linux tối giản, cấu hình thủ công, quản lý gói và tùy biến hệ thống.",
        },
      },
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
          en: "I use Git to manage source history, organize work with branches, and make changes traceable across coursework and personal projects.",
          vi: "Tôi sử dụng Git để quản lý lịch sử mã nguồn, tổ chức công việc bằng branch và theo dõi thay đổi trong các bài tập lẫn dự án cá nhân.",
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
          en: "I use GitHub to publish source code, document technical projects, review changes, and keep my development work accessible for collaboration.",
          vi: "Tôi sử dụng GitHub để công khai mã nguồn, viết tài liệu dự án kỹ thuật, rà soát thay đổi và giúp công việc phát triển dễ dàng cộng tác.",
        },
      },
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
      {
        id: "ipv4",
        label: "IPv4",
        icon: "ipv4",
        tone: "blue",
        overview: {
          en: "IPv4 is the fourth version of the Internet Protocol, using 32-bit addresses to identify devices and route packets across interconnected networks.",
          vi: "IPv4 là phiên bản thứ tư của Internet Protocol, sử dụng địa chỉ 32 bit để định danh thiết bị và định tuyến gói tin qua các mạng kết nối với nhau.",
        },
        description: {
          en: "I work with IPv4 addressing, subnet design, routing, and troubleshooting while building and analyzing network lab topologies.",
          vi: "Tôi thực hành địa chỉ IPv4, thiết kế subnet, định tuyến và xử lý sự cố khi xây dựng và phân tích các mô hình mạng trong phòng lab.",
        },
      },
      {
        id: "ipv6",
        label: "IPv6",
        icon: "ipv6",
        tone: "cyan",
        overview: {
          en: "IPv6 is the successor to IPv4, providing 128-bit addressing, a vastly larger address space, and protocol improvements for modern networks.",
          vi: "IPv6 là giao thức kế nhiệm IPv4, cung cấp địa chỉ 128 bit, không gian địa chỉ lớn hơn rất nhiều và nhiều cải tiến dành cho mạng hiện đại.",
        },
        description: {
          en: "I practice IPv6 addressing and routing to understand its address structure, neighbor discovery, and operation alongside IPv4 networks.",
          vi: "Tôi thực hành địa chỉ và định tuyến IPv6 để hiểu cấu trúc địa chỉ, cơ chế Neighbor Discovery và cách vận hành song song với mạng IPv4.",
        },
      },
      {
        id: "subnetting",
        label: "Subnetting",
        icon: "subnetting",
        tone: "indigo",
        overview: {
          en: "Subnetting divides an IP network into smaller logical networks, improving address allocation, traffic organization, security boundaries, and routing efficiency.",
          vi: "Subnetting chia một mạng IP thành các mạng logic nhỏ hơn, giúp phân bổ địa chỉ, tổ chức lưu lượng, thiết lập ranh giới bảo mật và định tuyến hiệu quả hơn.",
        },
        description: {
          en: "I use subnetting to calculate efficient address ranges, plan network segments, and translate topology requirements into clear IP schemes.",
          vi: "Tôi sử dụng kỹ thuật chia subnet để tính toán dải địa chỉ hiệu quả, quy hoạch phân đoạn mạng và chuyển yêu cầu topology thành sơ đồ IP rõ ràng.",
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
          en: "I configure RIP in small lab topologies to study distance-vector routing, route exchange, convergence, and the protocol's practical limitations.",
          vi: "Tôi cấu hình RIP trong các topology lab nhỏ để tìm hiểu định tuyến distance-vector, trao đổi tuyến, hội tụ và những giới hạn thực tế của giao thức.",
        },
      },
      {
        id: "ospf",
        label: "OSPF",
        icon: "ospf",
        tone: "cyan",
        overview: {
          en: "OSPF is a link-state interior routing protocol that builds a network topology and calculates efficient paths using cost and the shortest-path algorithm.",
          vi: "OSPF là giao thức định tuyến nội bộ kiểu link-state, xây dựng topology mạng và tính toán đường đi hiệu quả dựa trên cost cùng thuật toán đường đi ngắn nhất.",
        },
        description: {
          en: "I build and troubleshoot OSPF labs to understand link-state routing, neighbor relationships, cost-based path selection, and area design.",
          vi: "Tôi xây dựng và xử lý sự cố các mô hình OSPF để hiểu định tuyến link-state, quan hệ láng giềng, lựa chọn đường đi theo cost và thiết kế area.",
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
          en: "I use EIGRP in Cisco-focused labs to practice neighbor formation, metric-based path selection, route propagation, and convergence behavior.",
          vi: "Tôi sử dụng EIGRP trong các phòng lab Cisco để thực hành thiết lập quan hệ láng giềng, chọn đường theo metric, quảng bá tuyến và hành vi hội tụ.",
        },
      },
      {
        id: "cisco-packet-tracer",
        label: "Cisco Packet Tracer",
        icon: "cisco",
        tone: "cyan",
        overview: {
          en: "Cisco Packet Tracer is a visual network-simulation tool for building virtual topologies and practicing device configuration without dedicated physical hardware.",
          vi: "Cisco Packet Tracer là công cụ mô phỏng mạng trực quan, dùng để xây dựng topology ảo và thực hành cấu hình thiết bị mà không cần phần cứng chuyên dụng.",
        },
        description: {
          en: "I use Cisco Packet Tracer to design, configure, and validate simulated network topologies before applying the same concepts in more advanced labs.",
          vi: "Tôi sử dụng Cisco Packet Tracer để thiết kế, cấu hình và kiểm tra các topology mạng mô phỏng trước khi áp dụng những khái niệm đó vào phòng lab nâng cao hơn.",
        },
      },
    ],
  },
];
