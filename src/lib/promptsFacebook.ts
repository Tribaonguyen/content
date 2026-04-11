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
  + Feature (Phương pháp/Bước) → Advantage (Ưu điểm/Khác biệt) → Benefit (Lợi ích THỰC TẾ cho chủ đầu tư bằng tiền hoặc thời gian).
- TUYỆT ĐỐI không viết theo hướng than vãn hay đổ lỗi. Hãy viết dưới góc độ "Giải pháp thông minh, tiết kiệm".
- 4C checklist (t tự kiểm tra): Clear (dễ hiểu) | Concise (ngắn gọn) | Compelling (hấp dẫn) | Credible (có số liệu chứng minh).`,

    ANALYSIS:
`CÔNG THỨC: FAB + 4C (bài phân tích / góc nhìn)
- Mở bài: Nêu luận điểm chính (điều cần chứng minh) — 1 câu sắc bén.
- Thân bài FAB: Mỗi lý do/dữ liệu đều kết bằng lợi ích cụ thể cho Anh chị.
- Kết bài: Đúc kết 1 câu súc tích + mời thảo luận.
- 4C checklist: Clear | Concise | Compelling | Credible.`,

    SALE_PRODUCT:
`CÔNG THỨC: AIDA (bài giới thiệu sản phẩm / dịch vụ)
- Attention: Hook đầu bài gây tò mò HOẶC nêu kết quả đầu ra ngay.
- Interest: Lý do Anh chị nên quan tâm — kèm số liệu, điểm khác biệt so với thị trường.
- Desire: Chứng minh bằng case thực tế, lợi ích cụ thể họ đạt được.
- Action: 1 CTA duy nhất, rõ ràng: Inbox / Gọi / Đặt lịch.`,

    SALE_PROMO:
`CÔNG THỨC: AIDA + Urgency (bài khuyến mãi / ưu đãi có deadline)
- Attention: Ưu đãi nổi bật + deadline rõ ràng ngay đầu bài.
- Interest: Vì sao ưu đãi này có giá trị thực sự với Anh chị.
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
- Xưng hô: Công ty → "Xây Nhà Tốc Độ" / "chúng tôi" / "đội ngũ kỹ sư". Khách hàng → xưng hô là "Anh chị". TUYỆT ĐỐI CẤM gõ cụm dấu gạch chéo giữa Anh và Chị. TUYỆT ĐỐI KHÔNG xưng "em", "mình", "bạn".
- Giọng văn: Thân thiện, gần gũi, vui vẻ — như người bạn chuyên môn đang tư vấn thật lòng. Trực diện nhưng không quá gắt. Dùng con số thực tế bám sát chủ đề. KHÔNG nói đạo lý, KHÔNG hoa mỹ, KHÔNG cảnh báo đe dọa.
- Cam kết cốt lõi: Không phát sinh chi phí | Đúng tiến độ | Chuẩn pháp lý PCCC.
- TUYỆT ĐỐI KHÔNG lặp lại số liệu, ví dụ, hoặc case study đã dùng ở bài trước. Mỗi bài viết PHẢI có dữ liệu và góc nhìn độc lập bám sát chủ đề.

[GIỌNG ĐIỆU TÍCH CỰC & CÂN BẰNG – BẮT BUỘC]
- Tỷ lệ: 20% VẤN ĐỀ (chỉ 1 câu) → 80% GIẢI PHÁP + KẾT QUẢ + CƠ HỘI đầu tư rõ ràng.
- TRÁNH: liệt kê dài rủi ro, câu chữ đe dọa hay bi quan. Chuyển ngay sang hướng tích cực sau khi nêu vấn đề.

[GIỚI HẠN NỘI DUNG – BẮT BUỘC]
- TUYỆT ĐỐI KHÔNG viết theo hướng công kích, chỉ trích cá nhân hoặc nhóm đối tượng cụ thể (nhà thầu khác, thợ, môi giới...). Nếu đề cập rủi ro: nói về TÌNH HUỐNG, QUY TRÌNH hoặc HỆ THỐNG, không phải về Con Người.
- Mở rộng nguồn rủi ro: ngoài yếu tố con người, hãy đề cập cả rủi ro từ pháp lý (giấy phép, PCCC), tài chính (trượt giá vật tư, dòng tiền), kỹ thuật (kết cấu, vật liệu).

[CHỐNG ĐẠO VĂN & CHỐNG RƯỜM RÀ]
- KHI DÙNG DỮ LIỆU TỪ INTERNET: Chỉ sử dụng để lấy con số/thông tin thực tế, sau đó viết lại hoàn toàn theo Brand Voice. TUYỆT ĐỐI KHÔNG copy nguyên cụm từ hay câu từ nguồn gốc.
- KHÔNG dùng mẫu dẫn như "Theo", "Còn theo nhiều nguồn". Viết như người trong ngành tự đúc kết.
- KHÔNG viết dài dòng. Mỗi ý chỉ cần 1 câu súc tích. Cắt bỏ mọi phần giải thích thừa.
${kbContext}
[BLACKLIST TỪ VỰNG & ANTI-AI SMELL - ÉP TUYỆT ĐỐI]
- TỪ VỰNG & CỤM TỪ BỊ CẤM TUYỆT ĐỐI KHÔNG DÙNG DÙ ĐỂ TRONG NGOẶC KÉP: "bọn nó", "tụi nó", "thằng", "vẽ vời", "vẽ", "múa", "tiền ngu", "bài học xương máu".
- CÁCH ĐỔI TỪ: Thay "bọn nó/tụi nó" -> "bên thứ ba/các đơn vị". Thay "tiền ngu" -> "chi phí cơ hội/khoản lỗ". Thay "vẽ/múa" -> "phát sinh chi phí/hạn chế rủi ro". Thay "bài học xương máu" -> "kinh nghiệm đắt giá/đúc kết".
- Tuyệt đối KHÔNG dùng: "Hành trình", "Tuyệt vời", "Hoàn hảo", "Khám phá ngay", "Cùng tìm hiểu", "Không thể phủ nhận", "Hứa hẹn", "Một bức tranh", "Nâng tầm". Dùng từ ngữ đời thường của giới đầu tư và kỹ sư xây dựng.
[TỆP KHÁCH HÀNG MỤC TIÊU CỦA BÀI NÀY]
${audience ? '- Định hướng giọng điệu: ' + audience + '.' : '- Định hướng giọng điệu: Thân thiện, gần gũi, tập trung vào lợi ích và giải pháp thực tế cho Anh chị.'}

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

QUY TẮC CỐT LÕI CHỐNG LẠC ĐỀ (BẮT BUỘC TUÂN THỦ 100%):
1. Phân tích cực kỳ cẩn thận chủ đề "${topic}".
2. NẾU chủ đề yêu cầu liệt kê danh sách có số lượng cụ thể (Ví dụ: "5 mẫu...", "3 cách...", "4 lý do..."), BẠN BẮT BUỘC PHẢI chia thân bài thành ĐÚNG số lượng đó (Mục 1, Mục 2... Mục X). CẤM viết chung chung gộp lại. CẤM phớt lờ số lượng.
3. Góc nhìn thương hiệu (dòng tiền, PCCC, tiến độ, v.v.) chỉ là "lớp gia vị" để giải thích, phân tích cho các hạng mục đó, TUYỆT ĐỐI KHÔNG lấy "gia vị" làm nhân vật chính thay cho chủ đề gốc.

Khi trả kết quả, BẠN PHẢI BẮT ĐẦU BẰNG PHẦN PHÂN TÍCH ĐỀ BÀI như sau:
[PHÂN TÍCH ĐỀ BÀI]
- Yêu cầu cốt lõi của chủ đề: ...
- Số lượng hạng mục cần liệt kê (nếu có): ...

[BẢN NHÁP BÀI VIẾT]
(Bắt đầu viết nháp tại đây...)

${getFrameworkFB(contentTypeCode)}

YÊU CẦU BỔ SUNG:
- Nội dung bám sát KẾT QUẢ TÍCH CỰC: lợi ích cụ thể, cơ hội, kết quả đo được.
- Nếu đề cập rủi ro: gắn với quy trình, pháp lý, hoặc hệ thống — không công kích cá nhân/nhóm đối tượng nào.
- Chèn từ khóa ngành (CHDV, phòng trọ, PCCC, giấy phép, vật tư) tự nhiên.
- Kiểm tra 4C: Clear (dễ hiểu) | Concise (ngắn gọn) | Compelling (hấp dẫn) | Credible (số liệu cụ thể).

GÓC NHÌN GỢI Ý (chọn 1 góc nhìn phù hợp nhất với chủ đề):
- GÓC NHÌN CHUYÊN GIA THI CÔNG: Tiêu chuẩn kỹ thuật, vật liệu, quy trình nghiệm thu.
- GÓC NHÌN QUẢN LÝ DỰ ÁN: Tiến độ, quản lý chi phí, điều phối nhân lực.
- GÓC NHÌN CỦA CHỦ ĐẦU TƯ: Bài toán dòng tiền, an toàn pháp lý PCCC, tỷ suất lợi nhuận.
- GÓC NHÌN TỪ CÔNG TRƯỜNG: Xử lý tình huống phát sinh, câu chuyện thực tế chuẩn bị vật tư.

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

YÊU CẦU ĐỐI VỚI BẢN NHÁP MỚI:
1. BỎ QUA hoàn toàn phần [PHÂN TÍCH ĐỀ BÀI] (nếu có). Chỉ lấy nội dung từ [BẢN NHÁP BÀI VIẾT] để đắp thêm "thịt" cho các ý. Độ dài theo chuẩn: ${CAPTION_GUIDE[spec.caption]}
2. Nếu bài nháp có số lượng mục cụ thể (vd: Mục 1, Mục 2, Mục 3), BẮT BUỘC GIỮ NGUYÊN SỐ LƯỢNG ĐÓ. Không được gộp chung.
3. 3 DÒNG ĐẦU TIÊN (HOOK) phải thu hút ngay. Chọn 1 trong các kiểu hook sau:
   a) Kết quả đầu ra: "Biến mảnh đất [X] thành tòa CHDV mang về [Y triệu/tháng]..."
   b) Câu hỏi khơi gợi: "Anh chị đã tính toán kỹ bài toán chống trượt giá vật tư khi xây CHDV chưa?"
   c) Sự thật ngược chiều (bất ngờ tích cực): "Nhiều người nghĩ xin phép PCCC rất phức tạp — nhưng thực ra chỉ cần đi đúng quy trình tiêu chuẩn."
   d) Câu chuyện ngắn: "Hôm qua tư vấn cho anh khách ở Gò Vấp, anh hỏi Xây Nhà Tốc Độ 1 câu..."
   KHÔNG dùng hook đe dọa nỗi sợ hay công kích cá nhân/nhóm nghề.
4. Tuyệt đối không dùng những câu mở bài sáo rỗng kiểu "Trong thời đại hiện nay...". Vào thẳng giá trị!
5. KIỂM TRA XƯNG NGÔ: Thay TOÀN BỘ "Anh/Chị" (có gạch chéo) bằng "Anh chị" (không gạch chéo).
6. CHIA ĐOẠN ĐỂ ĐỌC TRÊN MOBILE: Mỗi đoạn văn tối đa 2-3 câu. Tách đoạn thường xuyên.

Chỉ trả về văn bản nội dung. KHÔNG BAO GỒM phần KHUNG PHÂN TÍCH.`.trim();
}

// ─── BƯỚC 3: HUMANIZE + 4C QUALITY CHECK ─────────────────────────────────────

export function buildPrompt3FB(step2: string) {
  return `NHIỆM VỤ BƯỚC 3: Humanize (Xóa bỏ sự máy móc - Thổi hồn chuyên gia) + Kiểm tra 4C.
[BÀI VIẾT BƯỚC 2]:
"""
${step2}
"""

YÊU CẦU ÉP KHUÔN:
1. Đóng vai một kỹ sư trưởng đang ngồi tư vấn thân thiện với chủ đầu tư — vui vẻ, gần gũi, không gắt.
2. CẮT GỌN CÂU: Không để câu quá dài. Cứ 15-20 chữ phải ngắt nhịp hoặc chấm câu.
3. THÊM TÍNH THỰC CHIẾN: Bổ sung 1 ví dụ thực tế hoặc 1 con số cụ thể làm minh chứng (nếu chủ đề cho phép).
4. Kiểm tra và XÓA SẠCH các từ cấm: Hành trình, khám phá, tuyệt vời, nâng tầm... Thay bằng ngôn ngữ đời thường, cụ thể.
5. KIỂM TRA XƯNG HÔ: Đảm bảo khách hàng được gọi là "Anh chị". Giữ nguyên "chúng tôi". TUYỆT ĐỐI CẤM ký tự gạch chéo.

KIỂM TRA GIỌNG ĐIỆU VÀ ĐỊNH DẠNG HÌNH ẢNH:
🚫 Xóa hoặc làm nhẹ bất kỳ câu nào mang tính đe dọa, cảnh báo ép sợ hãi ("có đang bị...", "coi chừng...", "nguy hiểm...").
✅ Thay bằng giọng tích cực: lợi ích đạt được, cơ hội, kết quả thực tế.
🚫 TUYỆT ĐỐI KHÔNG tự bịa ra những câu như "Anh chị xem hình ảnh bên dưới", "Dưới đây là hình ảnh thực tế", "👉 Chi tiết xem ảnh". Hệ thống sẽ tự động ghép ảnh sau, KHÔNG ĐƯỢC CHÈN VĂN BẢN ĐIỀU HƯỚNG MẮT.

KIỂM TRA CHẤT LƯỢNG 4C TRƯỚC KHI TRẢ VỀ:
✅ Clear – Mỗi câu đọc 1 lần là hiểu ngay, không mơ hồ.
✅ Concise – Không câu nào thừa. Cắt bỏ nếu xóa đi bài vẫn đủ nghĩa.
✅ Compelling – Có ít nhất 1 yếu tố tạo cảm xúc tích cực: con số ấn tượng, kết quả thực tế, câu hỏi gợi mở.
✅ Credible – Có ít nhất 1 con số/dữ liệu cụ thể làm bằng chứng.
🚫 TUYỆT ĐỐI KHÔNG CHÈN HASHTAG (#) vào cuối bài ở bước này.

Chỉ trả về văn bản bài viết đã được thổi hồn.`.trim();
}

// ─── BƯỚC 4: FORMAT FACEBOOK + CTA ───────────────────────────────────────────

export function buildPrompt4FB(topic: string, step3: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS[contentTypeCode];
  if (!spec) return '';
  return `NHIỆM VỤ BƯỚC 4: Chốt hạ, format hiển thị và Kêu gọi hành động.

THÔNG SỐ BẮT BUỘC TỪ HỆ THỐNG:
- Chủ đề gốc: "${topic}"
- Loại bài: ${spec.label}
- Giới hạn độ dài: ${CAPTION_GUIDE[spec.caption]}
- Mức độ CTA: ${CTA_GUIDE[spec.cta]}
- Định mức Media: ${spec.img} ảnh (Video: ${spec.video})

KIỂM TRA NEO CHỦ ĐỀ (LÀM TRƯỚC KHI FORMAT):
Đọc lại toàn bộ bài viết Bước 3 bên dưới. Đặt câu hỏi: "Bài này có đang đúng chủ đề '${topic}' không?"
- Nếu có đoạn Nào đang lạc sang chủ đề khác: Sửa lại đoạn đó trước, rồi mới tiến hành format.
- KHÔNG được phép biên tập làm thay đổi chủ đề sang hướng khác. Nếu bài vẫn đúng chủ đề: tiếp tục format bình thường.

[BÀI VIẾT BƯỚC 3]:
"""
${step3}
"""

YÊU CẦU ĐÓNG GÓI CHUẨN FACEBOOK:
1. KỶ LUẬT ĐỘ DÀI: Tuân thủ tuyệt đối [Giới hạn độ dài] đã giao. Nếu bài ở Bước 3 đang dài hơn quy định, hãy biên tập, cắt tỉa lại cho gọn. Nếu quá ngắn, hãy làm rõ ý hơn nhưng tuyệt đối không lan man.
2. ÉP BỐ CỤC MOBILE VÀ ĐỊNH DẠNG:
   - Hook (3 dòng đầu) phải cực bén, kết thúc bằng việc xuống dòng để tạo khoảng nghỉ.
   - Thân bài phải chia đoạn cực ngắn (tối đa 2-3 câu/đoạn).
   - Sử dụng bullet point (-) hoặc emoji (chọn lọc, không lạm dụng) để bài viết trông thoáng mắt.
   - BẮT BUỘC KHÔNG DÙNG Markdown in đậm (**text**). Facebook không hỗ trợ tính năng này. Thay vào đó, hãy VIẾT HOA NHỮNG TỪ CẦN NHẤN MẠNH.
3. KIỂM TRA LẠI GIỌNG ĐIỆU (QC CHECK LẦN CUỐI):
   - Mở bài VÀ thân bài BẮT BUỘC hướng tới Giải pháp & Lợi ích. Tự động kiểm tra và XÓA SẠCH mọi từ ngữ đe dọa, tiêu cực (VD: mất tiền oan, bạc tóc, lừa đảo).
   - Xóa bỏ mọi từ ngữ có tính miệt thị, xách mé, công kích (ví dụ: "bọn nó", "tụi nó", "thằng", "vẽ vời"). Phải gọi là "đơn vị vận hành", "bên thứ ba", "nhà thầu".
4. PHỐI HỢP VỚI MEDIA (HÌNH ẢNH/VIDEO): MẶC ĐỊNH KHÔNG ĐƯỢC chèn bất kỳ câu điều hướng nào (VD: 👉 Lướt xem hình bên dưới) để tránh gượng ép. NẾU TRONG BÀI Ở BƯỚC 3 ĐANG CÓ SẴN CÂU NÀY, BẠN PHẢI TỰ ĐỘNG XÓA NÓ ĐI. CHỈ được phép giữ lại/chèn thêm nếu bài thuộc loại TESTIMONIAL/EVENT hoặc người dùng chủ động yêu cầu đánh giá ảnh.
5. KỶ LUẬT CTA: Lồng ghép [Mức độ CTA] một cách tự nhiên vào phần kết bài, đúng với tinh thần của loại bài này.
6. THÔNG TIN LIÊN HỆ: LUÔN CHÈN chính xác khối thông tin sau ở cuối cùng (không sửa chữ nào):
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
