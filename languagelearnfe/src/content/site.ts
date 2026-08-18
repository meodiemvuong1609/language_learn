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
    city: { vi: 'Thanh Hóa · dạy online toàn quốc', en: 'Thanh Hoa · online nationwide' },
    hours: { vi: 'T2–T7 · 9:00–21:00', en: 'Mon–Sat · 9:00–21:00' },
  },
  seo: {
    vi: {
      title: 'Ngọc Thảo IELTS — Giáo viên IELTS 8.0, dạy online từ Thanh Hóa',
      description:
        'Cô Ngọc Thảo, IELTS 8.0. Luyện 1-1 và nhóm nhỏ cho học sinh THPT và sinh viên. Speaking cue card, Writing Task 2. Nhắn Zalo 0866 062 701.',
      ogLocale: 'vi_VN',
    },
    en: {
      title: 'Ngoc Thao IELTS — Band 8.0 trainer, online from Thanh Hoa',
      description:
        'Ngoc Thao, IELTS 8.0. 1:1 and small-group coaching for high-school and university students. Cue cards and Writing Task 2. Zalo 0866 062 701.',
      ogLocale: 'en_US',
    },
  } satisfies I18n<{ title: string; description: string; ogLocale: string }>,
  nav: {
    vi: { about: 'Về cô', programs: 'Chương trình', method: 'Cách học', faq: 'FAQ', contact: 'Liên hệ', login: 'Vào học' },
    en: { about: 'About', programs: 'Programs', method: 'Method', faq: 'FAQ', contact: 'Contact', login: 'Study app' },
  },
  persona: {
    vi: {
      name: 'Cô Ngọc Thảo',
      role: 'Giáo viên IELTS · Band 8.0',
      location: 'Thanh Hóa',
      headline: 'Bạn không cần thêm một giáo trình. Bạn cần người nghe Speaking của bạn — rồi chỉnh đúng chỗ.',
      lead:
        'Kèm học sinh THPT và sinh viên, dạy online từ Thanh Hóa. Lớp nhỏ, sửa bài trong buổi — không để luyện sai cả tháng rồi mới biết.',
      bio:
        'Mình dạy IELTS như coi Speaking Part 2: một thẻ, một ý, nói đủ hai phút — không lan man. Học viên được map lỗi (phát âm, độ trôi chảy, task response), rồi khoan đúng chỗ đó. Writing chấm theo band descriptor, không chấm “cảm tính”.',
      credentials: [
        'IELTS Academic 8.0',
        'Đối tượng: học sinh THPT và sinh viên',
        'Dạy online từ Thanh Hóa · 1-1 và nhóm nhỏ',
      ],
      stats: [
        { value: '8.0', label: 'Overall' },
        { value: 'Online', label: 'toàn quốc' },
        { value: 'THPT', label: '+ sinh viên' },
        { value: 'TH', label: 'Thanh Hóa' },
      ],
    },
    en: {
      name: 'Ngoc Thao',
      role: 'IELTS trainer · Band 8.0',
      location: 'Thanh Hoa',
      headline: 'You don’t need another coursebook. You need someone who hears your Speaking — then fixes the exact gap.',
      lead:
        'High-school and university students, taught online from Thanh Hoa. Small groups, in-session correction — no month of silent practice on the wrong habit.',
      bio:
        'I teach IELTS the way Part 2 works: one card, one idea, two full minutes. Learners get an error map (pronunciation, fluency, task response), then we drill that map. Writing is marked to the public band descriptors, not a vibe.',
      credentials: [
        'IELTS Academic 8.0',
        'For high-school and university students',
        'Online from Thanh Hoa · 1:1 and small groups',
      ],
      stats: [
        { value: '8.0', label: 'Overall' },
        { value: 'Online', label: 'nationwide' },
        { value: 'High school', label: '+ uni' },
        { value: 'TH', label: 'Thanh Hoa' },
      ],
    },
  },
  hero: {
    vi: {
      eyebrow: 'Luyện thi IELTS · online · THPT & sinh viên',
      primaryCta: 'Nhắn Zalo tư vấn',
      secondaryCta: 'Xem chương trình',
      caption: 'Thẻ Part 2 đúng format thi — học viên luyện trên cue card, không trên slide.',
      flipHint: 'Chạm để lật thẻ',
    },
    en: {
      eyebrow: 'IELTS prep · online · high school & uni',
      primaryCta: 'Message on Zalo',
      secondaryCta: 'See programs',
      caption: 'A real Part 2 card — learners drill the exam object, not a slide deck.',
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
        title: 'Lộ trình cá nhân',
        duration: 'THPT & sinh viên · online',
        blurb: 'Diagnostic mock, gap map, rồi khoan Speaking + Writing đúng band mục tiêu của em.',
        points: ['Lịch linh hoạt sau giờ học', 'Chấm bài Writing theo descriptor', 'Mock dưới thời gian thi'],
      },
      {
        band: 'Part 2',
        title: 'Speaking Clinic',
        duration: 'Cue card · ghi âm',
        blurb: 'Mỗi buổi một thẻ. Sửa phát âm và độ trôi chảy, nói lại đến khi kín hai phút.',
        points: ['Ngân hàng cue card cập nhật', 'Sửa chunk, không sửa từng chữ', 'Part 3 follow-up sau mỗi thẻ'],
      },
      {
        band: 'Nhóm nhỏ',
        title: 'Lớp THPT / sinh viên',
        duration: 'Online · nhóm ≤ 6',
        blurb: 'Cùng nhịp học kỳ: từ vựng học thuật, Task 2, deadline thật. Phụ huynh THPT có thể nhận báo tiến độ.',
        points: ['Không lớp nhồi 20 người', 'Bài tập có hạn nộp', 'Phù hợp ôn thi đại học / IELTS song song'],
      },
    ],
    en: [
      {
        band: '1:1',
        title: 'Personal pathway',
        duration: 'High school & uni · online',
        blurb: 'Diagnostic mock, a gap map, then Speaking + Writing drills aimed at the student’s target band.',
        points: ['Hours after school or lectures', 'Writing marked to descriptors', 'Timed mocks'],
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
        title: 'High-school / uni cohort',
        duration: 'Online · groups of ≤ 6',
        blurb: 'Term rhythm: academic vocabulary, Task 2, real deadlines. Parents of high-schoolers can get a progress note.',
        points: ['Not a hall of twenty', 'Homework with due dates', 'Fits school + IELTS in parallel'],
      },
    ],
  } satisfies I18n<Program[]>,
  method: {
    vi: {
      title: 'Bốn bước, đúng thứ tự thi',
      lead: 'Không học “cả cuốn”. Học đúng lỗ hổng sau một mock thật.',
      steps: [
        { title: 'Mock chẩn đoán', body: 'Speaking ghi âm + Writing Task 2. Chấm theo descriptor công khai.' },
        { title: 'Gap map', body: '3–5 lỗi kéo band xuống. Đó là giáo án — không phải mục lục sách.' },
        { title: 'Khoan cue / task', body: 'Part 2 bấm giờ. Task 2 viết 40 phút. Sửa, nói/viết lại.' },
        { title: 'Full mock', body: 'Làm đủ 4 kỹ năng dưới áp lực. So với mock đầu. Chỉnh nốt.' },
      ],
    },
    en: {
      title: 'Four steps, in exam order',
      lead: 'Not “the whole book”. The gaps that showed up on a real mock.',
      steps: [
        { title: 'Diagnostic mock', body: 'Recorded Speaking plus Writing Task 2. Marked to public descriptors.' },
        { title: 'Gap map', body: 'Three to five band-killers. That list is the syllabus — not a table of contents.' },
        { title: 'Cue / task drills', body: 'Timed Part 2. 40-minute Task 2. Fix, then do it again.' },
        { title: 'Full mock', body: 'All four skills under pressure. Compare with day one. Close what’s left.' },
      ],
    },
  },
  proof: {
    vi: {
      title: 'Học viên nói gì sau mock',
      items: [
        { name: 'Hà, lớp 12', quote: 'Trước em đọc cue rồi đứng hình. Cô bắt em kể một chuyện cụ thể — hai phút hết mà không cần nhìn thẻ.' },
        { name: 'Nam, năm 2 ĐH', quote: 'Writing không còn “viết cho dài”. Task response được gạch ra từng câu. Học online mà vẫn bị bắt nói, không trốn được.' },
        { name: 'Phương, năm nhất', quote: 'Nhóm sáu người, ai cũng phải nói. Không trốn sau bạn giỏi nhất lớp.' },
      ],
    },
    en: {
      title: 'After the mock, not after the brochure',
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
        a: 'Không cam kết số band. Sau mock đầu, cô nói thẳng khoảng thời gian thực tế nếu em nộp bài đúng hạn.',
      },
      {
        q: 'Tài liệu dùng gì?',
        a: 'Cambridge authentic tests, cue card bank cập nhật, và bài Writing của chính học viên. Không bán “bộ đề bí mật”.',
      },
      {
        q: 'Đặt lịch tư vấn thế nào?',
        a: 'Nhắn Zalo 0866 062 701. Tư vấn khoảng 20 phút: mục tiêu band, lịch học, và nghe một đoạn Speaking nếu em đã có.',
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
        a: 'Message Zalo 0866 062 701. About twenty minutes: target band, schedule, and a Speaking sample if you have one.',
      },
      {
        q: 'Cancellations?',
        a: 'Move a session with 12 hours’ notice. A no-show counts as a used session.',
      },
    ],
  } satisfies I18n<FaqItem[]>,
  contactCopy: {
    vi: {
      title: 'Mang một cue card. Mang mục tiêu band. Cô lắng nghe 20 phút.',
      lead: 'Tư vấn trên Zalo, không phải buổi bán khóa. Nếu không fit, cô nói không.',
      nameLabel: 'Tên',
      goalLabel: 'Band mục tiêu',
      messageLabel: 'Lớp / trường · lịch rảnh',
      submit: 'Gọi điện',
      zalo: 'Nhắn Zalo',
      note: 'Zalo / SĐT: 0866 062 701 · học phí trao đổi trực tiếp, chưa niêm yết trên web.',
    },
    en: {
      title: 'Bring a cue card. Bring a target band. She’ll listen for 20 minutes.',
      lead: 'The consult is on Zalo, not a sales pitch. If it’s not a fit, she’ll say so.',
      nameLabel: 'Name',
      goalLabel: 'Target band',
      messageLabel: 'School / year · availability',
      submit: 'Call',
      zalo: 'Message on Zalo',
      note: 'Zalo / phone: 0866 062 701 · fees are discussed directly, not listed here yet.',
    },
  },
  footer: {
    vi: 'Ngọc Thảo IELTS · Thanh Hóa · dạy online',
    en: 'Ngoc Thao IELTS · Thanh Hoa · taught online',
  },
} as const;

export function pick<T>(block: I18n<T>, locale: Locale): T {
  return block[locale];
}
