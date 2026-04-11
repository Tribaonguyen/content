export const CONTENT_SPECS: Record<string, Record<string, string>> = {
  MEME_TREND:    { label:"Nuôi tương tác – Giải trí / Meme / Bắt trend",   img:"1",   img_size:"1200x1200", video:"optional", caption:"short",       cta:"optional" },
  POLL:          { label:"Nuôi tương tác – Hỏi ý kiến / Mini poll",         img:"1",   img_size:"1200x1200", video:"none",     caption:"short",       cta:"soft"     },
  TIPS:          { label:"Giáo dục – Tips / How-to / Checklist",            img:"1-3", img_size:"1200x1200", video:"optional", caption:"medium_long", cta:"soft"     },
  ANALYSIS:      { label:"Giáo dục – Phân tích / Góc nhìn cá nhân",        img:"1",   img_size:"1200x1200", video:"optional", caption:"long",        cta:"soft"     },
  SALE_PRODUCT:  { label:"Bán hàng – Giới thiệu sản phẩm / dịch vụ",       img:"1-3", img_size:"1080x1350", video:"optional", caption:"medium",      cta:"required" },
  SALE_PROMO:    { label:"Bán hàng – Khuyến mãi / Ưu đãi có deadline",     img:"1",   img_size:"1080x1350", video:"optional", caption:"medium",      cta:"required" },
  TESTIMONIAL:   { label:"Bán hàng – Case study / Testimonial / Feedback",  img:"2-5", img_size:"1200x1200", video:"optional", caption:"long",        cta:"required" },
  BRAND_STORY:   { label:"Thương hiệu – Câu chuyện / Hậu trường",          img:"2-4", img_size:"1200x1200", video:"optional", caption:"long",        cta:"soft"     },
  BRAND_CULTURE: { label:"Thương hiệu – Văn hóa / Tuyển dụng",             img:"1-3", img_size:"1200x1200", video:"optional", caption:"medium",      cta:"soft"     },
  REDIRECT:      { label:"Điều hướng – Dẫn về website / landing / blog",   img:"1",   img_size:"1200x630",  video:"none",     caption:"short",       cta:"required" },
  EVENT:         { label:"Điều hướng – Thông báo sự kiện / livestream",    img:"1",   img_size:"1080x1350", video:"optional", caption:"short",       cta:"required" }
};

const CAPTION_GUIDE: Record<string, string> = {
  short:       "rất ngắn: 1–3 câu, tối đa 80 ký tự",
  medium:      "vừa: 4–8 câu, khoảng 100–250 từ, đoạn đầu < 125 ký tự",
  medium_long: "trung bình dài: 5–12 câu, 150–300 từ, chia 3–5 đoạn",
  long:        "dài: 8–20 câu, 200–400 từ, chia đoạn 2–3 câu/đoạn"
};

const CTA_GUIDE: Record<string, string> = {
  required: "PHẢI có CTA rõ ràng, 1 hành động duy nhất (inbox / comment / gọi / link)",
  soft:     "CTA nhẹ, khuyến khích tương tác: lưu bài, tag bạn, comment ý kiến",
  optional: "Không cần CTA cứng, nếu có thì dạng câu hỏi tự nhiên"
};

// ─── TỰ ĐỘNG CHỌN FRAMEWORK THEO LOẠI BÀI ────────────────────────────────────
function getFrameworkFB(code: string): string {
  const map: Record<string, string> = {

    MEME_TREND:
`CÔNG THỨC: 4U + APP (bài giải trí / bắt trend)
- 4U cho HOOK: Tiêu đề phải đủ Useful (hữu ích) + Urgent (cần xem ngay) + Unique (độc đáo) + Ultra-specific (cụ thể số liệu/đối tượng).
- APP cho thân bài:
  + Agree: Tỏ ra hiểu được cảm giác/tình huống của người đọc.
  + Promise: Giá trị/góc nhìn thú vị sẽ có.
  + Preview: Hé lộ nội dung để kéo người đọc tiếp.`,

    POLL:
`CÔNG THỨC: APP (bài hỏi ý kiến / mini poll)
- Agree: Mở bằng 1 tình huống/nhận định AI EM ĐỒNG CẢM ngay.
- Promise: Cam kết sẽ nhận được góc nhìn hoặc câu trả lời gì đó thú vị.
- Preview: Dẫn dắt vào câu hỏi thảo luận hoặc vote option.`,

    TIPS:
`CÔNG THỨC: FAB + 4C (bài tips / how-to / checklist)
- FAB cho từng điểm mấu chốt:
  + Feature (Phương pháp/Bước) → Advantage (Ưu điểm/Khác biệt) → Benefit (Lợi ích THỰC TẾR cho chủ đầu tư bằng tiền hoặc thời gian).
- 4C checklist (tự kiểm tra): Clear (dễ hiểu) | Concise (ngắn gọn) | Compelling (hấp dẫn) | Credible (có số liệu chứng minh).`,

    ANALYSIS:
`CÔNG THỨC: FAB + 4C (bài phân tích / góc nhìn)
- Mở bài: Nêu luận điểm chính (điều cần chứng minh) — 1 câu sắc bén.
- Thân bài: Phân tích theo FAB — mỗi lý do/dữ liệu đều kết bằng lợi ích cụ thể cho Anh/Chị.
- Kết bài: Đúc kết 1 câu súc tích + mời thảo luận.
- 4C checklist: Clear | Concise | Compelling | Credible.`,

    SALE_PRODUCT:
`CÔNG THỨC: AIDA (bài giới thiệu sản phẩm / dịch vụ)
- Attention: Hook đầu bài gây tò mò HOẶC nêu kết quả đầu ra ngay.
- Interest: Lý do Anh/Chị nên quan tâm — kèm số liệu, điểm khác biệt so với thị trường.
- Desire: Chứng minh bằng case thực tế, lợi ích cụ thể họ đạt được.
- Action: 1 CTA duy nhất, rõ ràng: Inbox / Gọi / Đặt lịch.`,

    SALE_PROMO:
`CÔNG THỨC: AIDA + Urgency (bài khuyến mãi / ưu đãi có deadline)
- Attention: Ưu đãi nổi bật + deadline rõ ràng ngay đầu bài.
- Interest: Vì sao ưu đãi này có giá trị thực sự với Anh/Chị.
- Desire: So sánh trước/sau, tiết kiệm bao nhiêu, nhận thêm gì.
- Action: CTA gấp gáp, đếm ngược thời gian hoặc số lượng có hạn.`,

    TESTIMONIAL:
`CÔNG THỨC: SSS – Star Story Solution (case study / feedback thực tế)
- Star: Giới thiệu khách hàng cụ thể (loại hình đầu tư, quy mô, bối cảnh).
- Story: Hành trình — họ gặp khó khăn gì trước khi hợp tác với Xây Nhà Tốc Độ.
- Solution: Xây Nhà Tốc Độ giải quyết như thế nào + kết quả đo được bằng số.`,

    BRAND_STORY:
`CÔNG THỨC: SSS + APP (câu chuyện thương hiệu / hậu trường)
- Agree: Mở bằng cảm xúc/tình huống gần gũi với người đọc.
- Star → Story → Solution: Kể hành trình có điểm đầu (thách thức) và điểm cuối (thành công).
- Preview: Ở cuối gợi mở thêm điều gì thú vị sẽ đến.`,

    BRAND_CULTURE:
`CÔNG THỨC: APP (văn hóa / tuyển dụng)
- Agree: Thấu hiểu nỗi trăn trở của người lao động nghề nghiệp.
- Promise: Cam kết môi trường / cơ hội họ sẽ được trải nghiệm.
- Preview: Hé lộ 1 góc hậu trường độc đáo của đội ngũ.`,

    REDIRECT:
`CÔNG THỨC: 4U + AIDA rút gọn (bài dẫn link)
- Hook 4U: Câu đầu đủ Useful + Urgent + Unique + Ultra-specific.
- Body: 1–2 câu Interest/Desire, lý do phải click ngay.
- CTA: 1 câu duy nhất, link rõ ràng.`,

    EVENT:
`CÔNG THỨC: 4U + AIDA (thông báo sự kiện / livestream)
- 4U cho tiêu đề: Cụ thể ngày giờ + đối tượng + điều gì họ sẽ NHẬN ĐƯỢC.
- AIDA rút gọn: Nêu lý do tham gia → Lợi ích cụ thể → Đăng ký/Đặt reminder ngay.`
  };

  return map[code] || `CÔNG THỨC: PAS→BAB CÂN BẰNG
- Problem (1 câu) → Agitate (1 câu) → Solution + After + Bridge (phần còn lại).`;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

export function getSystemPromptFB(audience: string, knowledgeBase?: string) {
  const kbContext = knowledgeBase ? `\n[NHẬN DIỆN THƯƠNG HIỆU / KNOWLEDGE BASE CỐT LÕI (BẮT BUỘC TUÂN THỦ TỪNG CHỮ)]\n${knowledgeBase}\n(Sử dụng y nguyên các thông tin, mức giá, con số thực tế do nội dung trên cung cấp mà không tóm tắt hay tự ý bịa đặt).` : '';

  return `Bạn là Giám đốc Marketing thực chiến của XÂY NHÀ TỐC ĐỘ – Đơn vị thầu thi công nhà ở, CHDV, phòng trọ chuyên nghiệp tại TP.HCM.

[BRAND VOICE - BỘ GEN THƯƠNG HIỆU]
- Hình mẫu: Người Chỉ Huy Đáng Tin Cậy (Kỷ luật, nói được làm được) + Chuyên Gia Cố Vấn (Bao quát rủi ro, tối ưu tài chính).
- Xưng hô: Công ty → "Xây Nhà Tốc Độ" / "chúng tôi" / "đội ngũ kỹ sư". Khách hàng → "Anh/Chị". TUYỆT ĐỐI KHÔNG xưng "em", "mình", "bạn".
- Đặc trưng ngôn từ: Đanh thép, trực diện. Dùng con số thực tế bám sát chủ đề (tiến độ thi công, chi phí, lợi nhuận...). KHÔNG nói đạo lý, KHÔNG hoa mỹ.
- Cam kết cốt lõi: Không phát sinh chi phí | Đúng tiến độ | Chuẩn pháp lý PCCC.
- TUYỆT ĐỐI KHÔNG lặp lại số liệu, ví dụ, hoặc case study đã dùng ở bài trước. Mỗi bài viết PHẢI có dữ liệu và góc nhìn độc lập bám sát chủ đề.

[GIỌNG ĐIỆU TÍCH CỰC & CÂN BẰNG – BẮT BUỘC]
- Tỷ lệ: 20% VẤN ĐỀ (chỉ 1 câu) → 80% GIẢI PHÁP + KẾT QUẢ + CƠ HỘI đầu tư rõ ràng.
- TRÁNH: liệt kê dài rủi ro, câu chữ đe dọa hay bi quan. Chuyển ngay sang hướng tích cực sau khi nêu vấn đề.

[CHỐNG ĐẠO VĂN & CHỐNG RƯỜM RÀ]
- KHI DÙNG DỮ LIỆU TỪ INTERNET: Chỉ sử dụng để lấy con số/thông tin thực tế, sau đó viết lại hoàn toàn theo Brand Voice. TUYỆT ĐỐI KHÔNG copy nguyên cụm từ hay câu từ nguồn gốc.
- KHÔNG dùng mẫu dẫn như "Theo", "Còn theo nhiều nguồn". Viết như người trong ngành tự đúc kết.
- KHÔNG viết dài dòng. Mỗi ý chỉ cần 1 câu súc tích. Cắt bỏ mọi phần giải thích thừa.
${kbContext}
[TỪ VỰNG CẤM DÙNG - ANTI-AI SMELL]
Tuyệt đối KHÔNG dùng: "Hành trình", "Tuyệt vời", "Hoàn hảo", "Khám phá ngay", "Cùng tìm hiểu", "Không thể phủ nhận", "Hứa hẹn", "Một bức tranh", "Nâng tầm". Dùng từ ngữ đời thường của giới đầu tư và kỹ sư xây dựng.
[TỆP KHÁCH HÀNG MỤC TIÊU CỦA BÀI NÀY]
${audience ? '- Định hướng giọng điệu: ' + audience + '.' : '- Định hướng giọng điệu: Tập trung vào bài toán kinh tế, rủi ro pháp lý và giải pháp thi công.'}

CHỈ TRẢ VỀ NỘI DUNG ĐƯỢC YÊU CẦU. KHÔNG DẠ THƯA, KHÔNG GIẢI THÍCH.`.trim();
}

// ─── BƯỚC 1: PHÁC THẢO THEO FRAMEWORK PHÙ HỢP ───────────────────────────────

export function buildPrompt1FB(topic: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS[contentTypeCode];
  if (!spec) return ``;
  return `NHIỆM VỤ BƯỚC 1: Phác thảo khung xương bài Facebook.
- Loại bài: ${spec.label}
- Chủ đề: "${topic}"
- Độ dài dự kiến: ${CAPTION_GUIDE[spec.caption]}

${getFrameworkFB(contentTypeCode)}

YÊU CẦU BỔ SUNG:
- Nội dung bám sát KẾT QUẢ TÍCH CỰC: lợi ích cụ thể, cơ hội, kết quả đo được.
- Chèn từ khóa ngành (CHDV, phòng trọ, PCCC, giấy phép, vật tư) tự nhiên.
- Kiểm tra 4C: Clear (dễ hiểu) | Concise (ngắn gọn) | Compelling (hấp dẫn) | Credible (số liệu cụ thể).

Chỉ trả về văn bản phác thảo, chia đoạn rõ ràng. KHÔNG sinh hình ảnh.`.trim();
}

// ─── BƯỚC 2: MỞ RỘNG & RÈN HOOK ─────────────────────────────────────────────

export function buildPrompt2FB(step1: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS[contentTypeCode];
  return `NHIỆM VỤ BƯỚC 2: Mở rộng và rèn "Hook" (Tiêu đề).
[BẢN NHÁP BƯỚC 1]:
"""
${step1}
"""

YÊU CẦU:
1. Viết lại bản nháp trên, đắp thêm "thịt" cho các ý. Độ dài theo chuẩn: ${CAPTION_GUIDE[spec.caption]}
2. 3 DÒNG ĐẦU TIÊN (HOOK) phải cực "bén". Đánh trúng tim đen hoặc sự tò mò của nhà đầu tư.
   (Gợi ý Hook: Dùng câu hỏi sắc bén, hoặc đưa ra một sự thật trần trụi trong ngành thầu xây dựng).
3. Tuyệt đối không dùng những câu mở bài sáo rỗng kiểu "Trong thời đại hiện nay...". Vào thẳng vấn đề!

Chỉ trả về văn bản nội dung.`.trim();
}

// ─── BƯỚC 3: HUMANIZE + 4C QUALITY CHECK ─────────────────────────────────────

export function buildPrompt3FB(step2: string) {
  return `NHIỆM VỤ BƯỚC 3: Humanize (Xóa bỏ sự máy móc - Thổi hồn chuyên gia) + Kiểm tra 4C.
[BÀI VIẾT BƯỚC 2]:
"""
${step2}
"""

YÊU CẦU ÉP KHUÔN:
1. Đóng vai một kỹ sư trưởng đang ngồi tư vấn trực tiếp với chủ đầu tư.
2. CẮT GỌN CÂU: Không để câu quá dài. Cứ 15-20 chữ phải ngắt nhịp hoặc chấm câu.
3. THÊM TÍNH THỰC CHIẾN: Bổ sung 1 ví dụ thực tế, 1 con số cụ thể, hoặc 1 bài học xương máu trên công trường (nếu chủ đề cho phép).
4. Kiểm tra và XÓA SẠCH các từ cấm: Hành trình, khám phá, tuyệt vời, nâng tầm... Thay bằng các động từ mạnh, dứt khoát.

KIỂM TRA CHẤT LƯỢNG 4C TRƯỚC KHI TRẢ VỀ:
✅ Clear – Mỗi câu đọc 1 lần là hiểu ngay, không mơ hồ.
✅ Concise – Không câu nào thừa. Cắt bỏ nếu xóa đi bài vẫn đủ nghĩa.
✅ Compelling – Có ít nhất 1 yếu tố kéo cảm xúc: con số bất ngờ, tình huống thực tế, hoặc câu hỏi nhức nhối.
✅ Credible – Có ít nhất 1 con số/dữ liệu cụ thể làm bằng chứng.

Chỉ trả về văn bản bài viết đã được thổi hồn.`.trim();
}

// ─── BƯỚC 4: FORMAT FACEBOOK + CTA ───────────────────────────────────────────

export function buildPrompt4FB(step3: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS[contentTypeCode];
  if (!spec) return '';
  return `NHIỆM VỤ BƯỚC 4: Chốt hạ, format hiển thị và Kêu gọi hành động.

THÔNG SỐ ĐỊNH DẠNG BẮT BUỘC TỪ HỆ THỐNG:
- Loại bài: ${spec.label}
- Giới hạn độ dài: ${CAPTION_GUIDE[spec.caption]}
- Mức độ CTA: ${CTA_GUIDE[spec.cta]}
- Định mức Media: ${spec.img} ảnh (Video: ${spec.video})

[BÀI VIẾT BƯỚC 3]:
"""
${step3}
"""

YÊU CẦU ĐÓNG GÓI CHUẨN FACEBOOK:
1. KỶ LUẬT ĐỘ DÀI: Tuân thủ tuyệt đối [Giới hạn độ dài] đã giao. Nếu bài ở Bước 3 đang dài hơn quy định, hãy biên tập, cắt tỉa lại cho gọn. Nếu quá ngắn, hãy làm rõ ý hơn nhưng tuyệt đối không lan man.
2. ÉP BỐ CỤC MOBILE:
   - Hook (3 dòng đầu) phải cực bén, kết thúc bằng việc xuống dòng để tạo khoảng nghỉ.
   - Thân bài phải chia đoạn cực ngắn (tối đa 2-3 câu/đoạn).
   - Sử dụng bullet point (-) hoặc emoji (chọn lọc, không lạm dụng) để bài viết trông thoáng mắt, dễ quét bằng mắt (scan) trên màn hình điện thoại.
3. PHỐI HỢP VỚI MEDIA (HÌNH ẢNH/VIDEO): Dựa vào Định mức Media (${spec.img} ảnh), trước khi Kêu gọi hành động (CTA), BẮT BUỘC chèn một câu chuyển tiếp tự nhiên để "điều hướng mắt" người đọc xuống hình ảnh:
   - Nếu định mức là nhiều ảnh (ví dụ 1-3, 2-5...): Viết câu kích thích người đọc lướt xem album.
   - Nếu định mức là 1 ảnh/video: "👉 Xem ngay hình ảnh/video thực tế bên dưới...".
   - Nếu là loại bài Điều hướng (Redirect): "👉 Click ngay vào hình ảnh/link bên dưới để đọc bài viết chi tiết...".
4. KỶ LUẬT CTA: Lồng ghép [Mức độ CTA] một cách tự nhiên vào phần kết bài, đúng với tinh thần của loại bài này.
5. THÔNG TIN LIÊN HỆ: LUÔN CHÈN chính xác khối thông tin sau ở cuối cùng (không sửa chữ nào):
---
Công ty Cổ Phần Xây Nhà Tốc Độ
Xây chất lượng - xây tận tâm
🌐 Website: www.xaynhatocdo.com
📍 Địa chỉ: 377 Nguyễn Oanh, Phường Gò Vấp, TP. HCM
☎ Hotline/Zalo: 0866186189
---
Thêm 5 hashtag phù hợp với nội dung, trong đó bắt buộc phải có: #xaynhatocdo
TRẢ VỀ DUY NHẤT BÀI VIẾT FACEBOOK HOÀN CHỈNH, SẴN SÀNG COPY/PASTE. KHÔNG DẠ THƯA, KHÔNG BÌNH LUẬN THÊM.`.trim();
}

// ─── BƯỚC 5: MEDIA BRIEF ─────────────────────────────────────────────────────

export function buildPrompt5FB(topic: string, step4: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS[contentTypeCode];

  const FB_IMAGE_RULES = `
[QUY TẮC HIỂN THỊ FACEBOOK - TRÁNH BỊ CẮT XÉN]
Dựa vào số lượng ảnh bạn quyết định sử dụng, BẮT BUỘC áp dụng kích thước sau cho Designer:
- Nếu dùng 1 Ảnh: 1440x1440 (Vuông) HOẶC 1440x1880 (Dọc).
- Nếu dùng 2 Ảnh: Cả 2 ảnh đều 1000x2000 (Bố cục 2 dọc chia đôi).
- Nếu dùng 3 Ảnh: Ảnh 1 (Ảnh chính) 1000x2000 (Dọc) | Ảnh 2 & 3: 1000x1000 (Vuông).
- Nếu dùng 4 Ảnh: Ảnh 1 (Ảnh chính) 1280x1920 (Dọc) | Ảnh 2, 3, 4: 1000x1000 (Vuông) HOẶC 4 ảnh đều vuông 1200x1200.
- Bài Share Link (Điều hướng Website): 1200x630.
- Cover Sự kiện: 1920x1080.
  `.trim();

  return `Yêu cầu chủ đề: "${topic}"
Loại bài: ${spec.label}
Định mức số lượng ảnh cho phép: ${spec.img}
Video: ${spec.video === 'none' ? 'Không cần' : spec.video === 'optional' ? 'Tùy chọn 15–60s dọc 9:16' : 'Bắt buộc 15–60s dọc 9:16'}

[BÀI VIẾT BƯỚC 4]:
"""
${step4}
"""

NHIỆM VỤ BƯỚC 5: Lên Media Brief (Kịch bản hình ảnh/Video) bám sát nội dung bài viết.
1. Xác định số lượng ảnh cụ thể sẽ dùng (nằm trong định mức cho phép).
2. Dựa vào số lượng ảnh đã chốt, đối chiếu với [QUY TẮC HIỂN THỊ FACEBOOK] để gán kích thước chuẩn cho TỪNG ẢNH.

${FB_IMAGE_RULES}

TRẢ VỀ ĐÚNG FORMAT SAU:
━━━━━━━━━━━━━━━━━━━━
[MEDIA BRIEF – ${spec.label}]
━━━━━━━━━━━━━━━━━━━━
📐 Layout chốt: Dùng [Số lượng ảnh] ảnh
🎬 Video (Nếu có): ${spec.video === 'none' ? 'Không' : 'Gợi ý kịch bản 3 giây đầu hút mắt'}

[Lặp lại cấu trúc này cho TỪNG ẢNH:]
━━━━━━━━━━━━━━━━━━━━
ẢNH [STT]: [Kích thước áp dụng theo Quy tắc, VD: 1000x2000px]
🎯 Vai trò: [VD: Ảnh chính tạo Hook / Ảnh chi tiết / Ảnh Feedback]
📸 Đề xuất chụp/thiết kế:
  - Bối cảnh: [Mô tả chi tiết tại công trường/VP]
  - Chủ thể: [Kỹ sư / Khách hàng / Kết cấu]
  - Ý đồ: [Minh họa cho ý nào trong bài]
🤖 Prompt tạo ảnh AI: [Viết bằng tiếng Việt cho Google Nano Banana 2. Phong cách mộc mạc, thực chiến].
━━━━━━━━━━━━━━━━━━━━
📝 GHI CHÚ DESIGNER (Text on photo):
  - Gợi ý câu Text ngắn (dưới 10 chữ) để chèn lên ảnh bìa nhằm kích thích click. Chú ý chèn Text vào vùng an toàn, không bị che bởi UI của Facebook.
━━━━━━━━━━━━━━━━━━━━`.trim();
}
