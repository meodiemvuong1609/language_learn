/**
 * Personal PR copy for Cô Ngọc Thảo.
 * Prices and photo are intentionally omitted until provided.
 */

export type Locale = 'vi' | 'en';

export type I18n<T> = { vi: T; en: T };

export type Program = {
  band: string;
  title: string;
  duration: string;
  blurb: string;
  points: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export const locales: Locale[] = ['vi', 'en'];

export const site = {
  brand: 'Ngọc Thảo IELTS',
  band: '8.0',
  contact: {
    phone: '0866 062 701',
    phoneHref: 'tel:+84866062701',
    zalo: 'https://zalo.me/0866062701',
    facebook: 'https://www.facebook.com/ngoc.thao.39108',
    city: { vi: 'Thanh Hóa · dạy online toàn quốc', en: 'Thanh Hoa · online nationwide' },
    hours: { vi: 'T2–T7 · 9:00–21:00', en: 'Mon–Sat · 9:00–21:00' },
  },
  proofImage: {
    src: '/ielts-8.0-trf.png',
    alt: {
      vi: 'Phiếu điểm IELTS Academic: Overall Band Score 8.0, CEFR C1, dấu xác thực Cambridge / British Council / IDP',
      en: 'IELTS Academic Test Report: Overall Band Score 8.0, CEFR C1, Cambridge / British Council / IDP validation stamp',
    },
    caption: {
      vi: 'TRF thật · Overall 8.0 · CEFR C1',
      en: 'Official TRF · Overall 8.0 · CEFR C1',
    },
  },
  seo: {
    vi: {
      title: 'Ngọc Thảo IELTS — Giáo viên IELTS Academic 8.0, dạy online',
      description:
        'Cô Ngọc Thảo, IELTS Academic 8.0 (CEFR C1). Luyện 1-1 và nhóm nhỏ cho học sinh THPT và sinh viên, dạy online từ Thanh Hóa. Liên hệ Facebook hoặc Zalo 0866 062 701.',
      ogLocale: 'vi_VN',
    },
    en: {
      title: 'Ngoc Thao IELTS — IELTS Academic 8.0 trainer, taught online',
      description:
        'Ngoc Thao, IELTS Academic 8.0 (CEFR C1). 1:1 and small-group coaching for high-school and university students, online from Thanh Hoa. Facebook or Zalo 0866 062 701.',
      ogLocale: 'en_US',
    },
  } satisfies I18n<{ title: string; description: string; ogLocale: string }>,
  nav: {
    vi: { about: 'Về cô', programs: 'Chương trình', method: 'Phương pháp', faq: 'Câu hỏi', contact: 'Liên hệ', login: 'Đăng nhập' },
    en: { about: 'About', programs: 'Programs', method: 'Method', faq: 'FAQ', contact: 'Contact', login: 'Sign in' },
  },
  persona: {
    vi: {
      name: 'Cô Ngọc Thảo',
      role: 'Giáo viên IELTS · Academic 8.0',
      location: 'Thanh Hóa',
      headline: 'Luyện IELTS điềm tĩnh, đúng format thi — Speaking đủ hai phút, Writing đúng task.',
      lead:
        'Cô Ngọc Thảo, IELTS Academic 8.0, dạy online từ Thanh Hóa. Đồng hành cùng học sinh THPT và sinh viên: lớp nhỏ, góp ý ngay trong buổi, chấm bài theo band descriptor.',
      bio:
        'Cô dạy IELTS theo đúng yêu cầu kỳ thi: Speaking Part 2 một cue card, một ý chính, nói đủ thời gian; Writing được nhận xét theo descriptor công khai, không chấm cảm tính. Học viên được xác định lỗi cụ thể (phát âm, độ trôi chảy, task response) rồi luyện đúng phần đó. Phiếu điểm 8.0 / C1 được đăng kèm để học viên và phụ huynh đối chiếu.',
      credentials: [
        'IELTS Academic 8.0 · CEFR C1',
        'Dạy online từ Thanh Hóa, học viên toàn quốc',
        'Đối tượng: học sinh THPT và sinh viên · 1-1 và nhóm nhỏ',
      ],
      stats: [
        { value: '8.0', label: 'Overall' },
        { value: 'C1', label: 'CEFR' },
        { value: 'THPT', label: 'và sinh viên' },
        { value: 'Online', label: 'toàn quốc' },
      ],
    },
    en: {
      name: 'Ngoc Thao',
      role: 'IELTS trainer · Academic 8.0',
      location: 'Thanh Hoa',
      headline: 'Calm, exam-faithful IELTS coaching — two minutes on Speaking, Writing on task.',
      lead:
        'Ngoc Thao, IELTS Academic 8.0, teaches online from Thanh Hoa. High-school and university students: small groups, in-session feedback, marking to the public band descriptors.',
      bio:
        'Lessons follow the exam: Speaking Part 2 is one cue card, one clear idea, spoken in full time; Writing is marked to published descriptors, not impression. Learners receive a specific error map (pronunciation, fluency, task response) and practise that map. The 8.0 / C1 Test Report is shown so students and parents can verify the score.',
      credentials: [
        'IELTS Academic 8.0 · CEFR C1',
        'Online from Thanh Hoa, learners nationwide',
        'High-school and university students · 1:1 and small groups',
      ],
      stats: [
        { value: '8.0', label: 'Overall' },
        { value: 'C1', label: 'CEFR' },
        { value: 'School', label: '& university' },
        { value: 'Online', label: 'nationwide' },
      ],
    },
  },
  hero: {
    vi: {
      eyebrow: 'IELTS Academic 8.0 · dạy online · THPT và sinh viên',
      primaryCta: 'Nhắn Facebook',
      secondaryCta: 'Nhắn Zalo',
      caption: 'Cue card Part 2 đúng format kỳ thi — luyện trên thẻ, không trên slide.',
      flipHint: 'Chạm để lật thẻ',
    },
    en: {
      eyebrow: 'IELTS Academic 8.0 · online · high school and university',
      primaryCta: 'Message on Facebook',
      secondaryCta: 'Message on Zalo',
      caption: 'A Part 2 cue card in exam format — practice on the card, not a slide.',
      flipHint: 'Tap to flip',
    },
  },
  cueCard: {
    part: 'SPEAKING PART 2',
    time: '1–2 minutes',
    prompt: 'Describe a teacher who helped you learn English.',
    youShouldSay: 'You should say:',
    bullets: [
      'who they are',
      'how you first met them',
      'what they taught you',
    ],
    explain: 'and explain why this teacher made a difference.',
    backTitle: 'Examiner note',
    backBody:
      'Band 7+ answers stay on the prompt, use one clear story, and finish the two minutes without restarting. We time this. We record this. Then we mark the tape — not the script you wished you said.',
  },
  programs: {
    vi: [
      {
        band: '1-1',
        title: 'Luyện kèm cá nhân',
        duration: 'THPT và sinh viên · online',
        blurb: 'Buổi đầu làm mock chẩn đoán, xác định lỗ hổng, sau đó luyện Speaking và Writing theo band mục tiêu.',
        points: ['Lịch buổi tối và cuối tuần', 'Chấm Writing theo descriptor', 'Mock đúng thời gian thi'],
      },
      {
        band: 'Part 2',
        title: 'Speaking Part 2',
        duration: 'Cue card · ghi âm',
        blurb: 'Mỗi buổi một thẻ. Điều chỉnh phát âm và độ trôi chảy, luyện lại đến khi nói đủ hai phút.',
        points: ['Ngân hàng cue card cập nhật', 'Sửa theo cụm ý, không sửa từng chữ', 'Câu hỏi Part 3 sau mỗi thẻ'],
      },
      {
        band: 'Nhóm nhỏ',
        title: 'Nhóm tối đa 6 học viên',
        duration: 'Online · THPT và sinh viên',
        blurb: 'Theo nhịp học kỳ: từ vựng học thuật, Writing Task 2, hạn nộp rõ ràng. Phụ huynh học sinh THPT có thể nhận báo tiến độ.',
        points: ['Không lớp đông', 'Bài tập có hạn nộp', 'Phù hợp ôn thi tốt nghiệp / đại học song song IELTS'],
      },
    ],
    en: [
      {
        band: '1:1',
        title: 'Private tuition',
        duration: 'High school and university · online',
        blurb: 'A diagnostic mock, a gap map, then Speaking and Writing practice aimed at the student’s target band.',
        points: ['Evening and weekend hours', 'Writing marked to descriptors', 'Timed mocks'],
      },
      {
        band: 'Part 2',
        title: 'Speaking clinic',
        duration: 'Cue cards · recorded',
        blurb: 'One card per session. Fix pronunciation and fluency, retell until the two minutes are full.',
        points: ['Current cue-card bank', 'Chunks, not word-by-word', 'Part 3 follow-ups after each card'],
      },
      {
        band: 'Small group',
        title: 'Groups of up to six',
        duration: 'Online · high school and university',
        blurb: 'Term rhythm: academic vocabulary, Task 2, clear deadlines. Parents of high-school students may receive a progress note.',
        points: ['Not a large lecture class', 'Homework with due dates', 'Fits school exams alongside IELTS'],
      },
    ],
  } satisfies I18n<Program[]>,
  method: {
    vi: {
      title: 'Luyện theo đúng trình tự kỳ thi',
      lead: 'Không học dàn trải cả giáo trình. Tập trung vào lỗ hổng sau một bài mock.',
      steps: [
        { title: 'Mock chẩn đoán', body: 'Speaking ghi âm + Writing Task 2. Chấm theo descriptor công khai.' },
        { title: 'Gap map', body: '3–5 lỗi kéo band xuống. Đó là giáo án — không phải mục lục sách.' },
        { title: 'Luyện cue / task', body: 'Part 2 bấm giờ. Task 2 viết 40 phút. Sửa, nói/viết lại.' },
        { title: 'Full mock', body: 'Làm đủ 4 kỹ năng dưới áp lực. So với mock đầu. Chỉnh nốt.' },
      ],
    },
    en: {
      title: 'Practice in exam order',
      lead: 'Not the entire coursebook. The gaps that appear on a real mock.',
      steps: [
        { title: 'Diagnostic mock', body: 'Recorded Speaking plus Writing Task 2. Marked to public descriptors.' },
        { title: 'Gap map', body: 'Three to five issues that hold the band down. That list is the syllabus.' },
        { title: 'Cue / task drills', body: 'Timed Part 2. 40-minute Task 2. Fix, then do it again.' },
        { title: 'Full mock', body: 'All four skills under pressure. Compare with day one. Close what’s left.' },
      ],
    },
  },
  proof: {
    vi: {
      title: 'Học viên chia sẻ sau buổi học',
      items: [
        { name: 'Hà, lớp 12', quote: 'Trước em đọc cue rồi đứng hình. Cô bắt em kể một chuyện cụ thể — hai phút hết mà không cần nhìn thẻ.' },
        { name: 'Nam, năm 2 ĐH', quote: 'Writing không còn “viết cho dài”. Task response được gạch ra từng câu. Học online mà vẫn bị bắt nói, không trốn được.' },
        { name: 'Phương, năm nhất', quote: 'Nhóm sáu người, ai cũng phải nói. Không trốn sau bạn giỏi nhất lớp.' },
      ],
    },
    en: {
      title: 'After lessons, in their words',
      items: [
        { name: 'Ha, grade 12', quote: 'I used to freeze on the cue. She made me tell one concrete story — two minutes, no staring at the card.' },
        { name: 'Nam, 2nd year', quote: 'Writing stopped being “make it longer”. Task response was marked line by line. Online, and I still had to speak.' },
        { name: 'Phuong, 1st year', quote: 'Six people. Everyone speaks. You cannot hide behind the strongest student.' },
      ],
    },
  },
  faq: {
    vi: [
      {
        q: 'Học online hay tại lớp?',
        a: 'Online. Cô dạy từ Thanh Hóa, học viên ở đâu cũng vào được. Camera bật khi Speaking.',
      },
      {
        q: 'Đối tượng nào phù hợp?',
        a: 'Chủ yếu học sinh THPT và sinh viên. Lịch buổi tối và cuối tuần cho người đang đi học.',
      },
      {
        q: 'Bao lâu thì lên band?',
        a: 'Không cam kết số band. Sau mock đầu, cô trao đổi thời gian thực tế nếu học viên nộp bài đúng hạn.',
      },
      {
        q: 'Tài liệu dùng gì?',
        a: 'Cambridge authentic tests, cue card bank cập nhật, và bài Writing của chính học viên. Không bán “bộ đề bí mật”.',
      },
      {
        q: 'Đặt lịch tư vấn thế nào?',
        a: 'Nhắn Facebook hoặc Zalo 0866 062 701. Tư vấn khoảng 20 phút: mục tiêu band, lịch học, và nghe một đoạn Speaking nếu học viên đã có.',
      },
      {
        q: 'Hủy buổi thì sao?',
        a: 'Báo trước 12 giờ để dời. Vắng không báo tính là đã dùng buổi.',
      },
    ],
    en: [
      {
        q: 'Online or in person?',
        a: 'Online only. Thao teaches from Thanh Hoa; learners join from anywhere. Camera on for Speaking.',
      },
      {
        q: 'Who is it for?',
        a: 'Mainly high-school and university students. Evening and weekend slots around school timetables.',
      },
      {
        q: 'How long to raise a band?',
        a: 'No band guarantee. After the first mock she gives an honest timeline if homework lands on time.',
      },
      {
        q: 'What materials?',
        a: 'Cambridge authentic tests, a living cue-card bank, and your own Writing. No “secret paper pack”.',
      },
      {
        q: 'How do I book a consult?',
        a: 'Message Facebook or Zalo 0866 062 701. About twenty minutes: target band, schedule, and a Speaking sample if available.',
      },
      {
        q: 'Cancellations?',
        a: 'Move a session with 12 hours’ notice. A no-show counts as a used session.',
      },
    ],
  } satisfies I18n<FaqItem[]>,
  contactCopy: {
    vi: {
      title: 'Liên hệ Facebook hoặc Zalo để được tư vấn',
      lead: 'Buổi trao đổi khoảng 20 phút: mục tiêu band và lịch học. Học phí được thông báo trực tiếp, chưa niêm yết trên website.',
      nameLabel: 'Họ và tên',
      goalLabel: 'Band mục tiêu',
      messageLabel: 'Lớp / trường · thời gian rảnh',
      submit: 'Gọi điện',
      zalo: 'Nhắn Zalo',
      facebook: 'Nhắn Facebook',
      note: 'Facebook · Zalo / điện thoại 0866 062 701',
    },
    en: {
      title: 'Contact us on Facebook or Zalo',
      lead: 'A twenty-minute conversation: target band and schedule. Fees are confirmed directly and are not listed on this site yet.',
      nameLabel: 'Full name',
      goalLabel: 'Target band',
      messageLabel: 'School / year · availability',
      submit: 'Call',
      zalo: 'Message on Zalo',
      facebook: 'Message on Facebook',
      note: 'Facebook · Zalo / phone 0866 062 701',
    },
  },
  programsHead: {
    vi: 'Chương trình học',
    en: 'Programs',
  },
  faqHead: {
    vi: 'Câu hỏi thường gặp',
    en: 'Frequently asked questions',
  },
  footer: {
    vi: 'Ngọc Thảo IELTS · Thanh Hóa · dạy online',
    en: 'Ngoc Thao IELTS · Thanh Hoa · taught online',
  },
} as const;

export function pick<T>(block: I18n<T>, locale: Locale): T {
  return block[locale];
}
