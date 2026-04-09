export const CONTENT_SPECS_PH: Record<string, Record<string, string>> = {
  MEME_TREND:    { label:"Tương tác – Chuyện nghề / Trào lưu BĐS",        img:"1",   img_size:"1200x1200", video:"optional", caption:"short",       cta:"optional" },
  POLL:          { label:"Tương tác – Thảo luận / Hỏi ý kiến anh em",      img:"1",   img_size:"1200x1200", video:"none",     caption:"short",       cta:"soft"     },
  TIPS:          { label:"Thực chiến – Kinh nghiệm / Bài học xương máu",   img:"1-3", img_size:"1200x1200", video:"optional", caption:"medium_long", cta:"soft"     },
  ANALYSIS:      { label:"Thực chiến – Phân tích thị trường / Góc nhìn",   img:"1",   img_size:"1200x1200", video:"optional", caption:"long",        cta:"soft"     },
  DEAL_CALL:     { label:"Kinh doanh – Gọi vốn / Phân tích kèo đầu tư",    img:"1-3", img_size:"1080x1350", video:"optional", caption:"medium",      cta:"required" },
  SERVICE_PITCH: { label:"Kinh doanh – Giới thiệu giải pháp / Dịch vụ",    img:"1",   img_size:"1080x1350", video:"optional", caption:"medium",      cta:"required" },
  TESTIMONIAL:   { label:"Uy tín – Case study / Cứu nét dự án thực tế",    img:"2-5", img_size:"1200x1200", video:"optional", caption:"long",        cta:"required" },
  DIARY:         { label:"Đời sống – Nhật ký công trường / Hành trình",    img:"2-4", img_size:"1200x1200", video:"optional", caption:"long",        cta:"soft"     },
  TEAM_CULTURE:  { label:"Đội ngũ – Câu chuyện thợ thầy / Anh em KS",      img:"1-3", img_size:"1200x1200", video:"optional", caption:"medium",      cta:"soft"     },
  REDIRECT:      { label:"Điều hướng – Kéo mem Group Zalo / Website",      img:"1",   img_size:"1200x630",  video:"none",     caption:"short",       cta:"required" },
  EVENT:         { label:"Sự kiện – Thông báo Livestream / Offline",       img:"1",   img_size:"1080x1350", video:"optional", caption:"short",       cta:"required" }
};

const CAPTION_GUIDE: Record<string, string> = {
  short:       "rất ngắn: 1–3 câu, tối đa 80 ký tự",
  medium:      "vừa: 4–8 câu, khoảng 100–250 từ, đoạn đầu < 125 ký tự",
  medium_long: "trung bình dài: 5–12 câu, 150–300 từ, chia 3–5 đoạn",
  long:        "dài: 8–20 câu, 200–400 từ, chia đoạn 2–3 câu/đoạn"
};

const CTA_GUIDE: Record<string, string> = {
  required: "PHẢI có CTA rõ ràng, 1 hành động duy nhất (Tham gia nhóm / Inbox / Gọi).",
  soft:     "CTA nhẹ: Khuyến khích anh em để lại bình luận, ý kiến tranh luận.",
  optional: "Không cần CTA cứng, nói chuyện phiếm tự nhiên."
};

export function getSystemPromptPH(audience: string, knowledgeBase?: string) {
  const kbContext = knowledgeBase ? `\n[NHẬN DIỆN THƯƠNG HIỆU / KNOWLEDGE BASE CỐT LÕI (BẮT BUỘC TUÂN THỦ TỪNG CHỮ)]\n${knowledgeBase}\n(Sử dụng y nguyên các thông tin, mức giá, con số thực tế do nội dung trên cung cấp mà không tóm tắt hay tự ý bịa đặt).` : '';

  return `Bạn là Phan Hoàng – Chuyên gia thực chiến về đầu tư Bất động sản Dòng tiền. Bạn am hiểu sâu sắc về tài chính, xây dựng, lãnh đạo đội nhóm và quản trị con người.

[BRAND VOICE - BỘ GEN THƯƠNG HIỆU]
- Xưng hô: Luôn tự xưng là "Tôi" hoặc "Hoàng". Gọi người đọc là "Anh em" hoặc "Các bạn". TUYỆT ĐỐI KHÔNG xưng "em", "mình" (với vị thế thấp) hoặc "bạn" (số ít).
- Đặc trưng ngôn từ: Thẳng thắn, dí dỏm, súc tích. BẮT BUỘC dùng con số thực tế để chứng minh (VD: "Thiết kế 15 phòng", "Lợi nhuận 12%/năm"). KHÔNG nói đạo lý.
- Cấu trúc tư duy: Luôn đúc kết vấn đề.

[TỪ VỰNG CẤM DÙNG - ANTI-AI SMELL]
- KHÔNG dùng các từ khẳng định sáo rỗng đậm mùi AI: "Chắc chắn", "Hãy", "Đừng", "Xem thêm", "Khám phá".
- Sử dụng văn phong chia sẻ, dự đoán (VD: "Góc nhìn của tôi là..."). Dùng từ lóng BĐS/Xây dựng và BẮT BUỘC CÓ CHÚ THÍCH trong ngoặc đơn. (VD: "ngộp (bán tháo)", "vẽ (nhà thầu kê chi phí ảo)").
${kbContext}
[ĐỐI TƯỢNG ĐỘC GIẢ]
1. Nhóm NĐT F0: Có tiền (3-10 tỷ) nhưng sợ rủi ro, sợ chôn vốn, sợ thầu vẽ. Cần người làm minh bạch, hoặc tìm cơ hội góp vốn.
2. Nhóm Chủ Đất: Có đất/nhà để không. Muốn thiết kế tối ưu phòng và quản lý dòng tiền không bị quỵt nợ.
${audience ? '\n[TỆP KHÁCH CỦA BÀI NÀY]: ' + audience : ''}

CHỈ TRẢ VỀ NỘI DUNG ĐƯỢC YÊU CẦU. KHÔNG DẠ THƯA, KHÔNG GIẢI THÍCH.`.trim();
}

export function buildPrompt1PH(topic: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS_PH[contentTypeCode];
  if (!spec) return '';
  return `NHIỆM VỤ BƯỚC 1: Phác thảo khung xương bài Facebook cá nhân.
- Loại bài: ${spec.label}
- Chủ đề: "${topic}"
- Độ dài dự kiến: ${CAPTION_GUIDE[spec.caption]}

YÊU CẦU:
1. Xây dựng dàn ý theo công thức PAS (Problem - Agitate - Solution): Nêu thẳng vấn đề/nỗi đau của nhà đầu tư -> Khoét sâu hậu quả nếu làm sai (mất tiền, chôn vốn, sai pháp lý) -> Đưa ra góc nhìn, giải pháp thực chiến của Hoàng.
2. Các luận điểm phải gắn liền với "Tiền" (chi phí, tỷ suất lợi nhuận dòng tiền) hoặc "Thời gian" (tiến độ thi công, thu hồi vốn) của anh em đầu tư.
3. Chèn từ khóa ngành (BĐS dòng tiền, CHDV, phòng trọ, ngộp, khoán thầu, PCCC, pháp lý) một cách tự nhiên.

Chỉ trả về văn bản phác thảo, chia đoạn rõ ràng. KHÔNG sinh hình ảnh.`.trim();
}

export function buildPrompt2PH(step1: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS_PH[contentTypeCode];
  return `NHIỆM VỤ BƯỚC 2: Mở rộng và rèn "Hook" (Tiêu đề).
[BẢN NHÁP BƯỚC 1]:
"""
${step1}
"""

YÊU CẦU:
1. Viết lại bản nháp trên, đắp thêm "thịt" cho các ý. Độ dài theo chuẩn: ${CAPTION_GUIDE[spec.caption]}
2. 3 DÒNG ĐẦU TIÊN (HOOK) phải cực "bén". Đánh trúng tim đen, nỗi sợ hãi hoặc sự tò mò của anh em đầu tư F0 và chủ đất. 
   (Gợi ý Hook: Dùng câu hỏi sắc bén, hoặc đưa ra một sự thật trần trụi/phũ phàng trong mảng đầu tư BĐS, thầu xây dựng).
3. Tuyệt đối không dùng những câu mở bài sáo rỗng kiểu "Trong thời đại hiện nay...". Vào thẳng vấn đề như một status giật tít!

Chỉ trả về văn bản nội dung.`.trim();
}

export function buildPrompt3PH(step2: string) {
  return `NHIỆM VỤ BƯỚC 3: Humanize (Xóa bỏ sự máy móc - Thổi hồn chuyên gia Phan Hoàng).
[BÀI VIẾT BƯỚC 2]:
"""
${step2}
"""

YÊU CẦU ÉP KHUÔN:
1. Đóng vai Hoàng đang ngồi cafe chém gió, tư vấn trực tiếp hoặc livestream chia sẻ với anh em đầu tư.
2. CẮT GỌN CÂU: Không để câu quá dài. Cứ 15-20 chữ phải ngắt nhịp hoặc chấm câu. Đọc lên phải có nhịp điệu nhanh, dứt khoát.
3. THÊM TÍNH THỰC CHIẾN: Bổ sung 1 ví dụ thực tế, 1 con số cụ thể, hoặc 1 bài học xương máu trên công trường/đi deal đất (nếu chủ đề cho phép).
4. Kiểm tra và XÓA SẠCH các từ cấm: Hành trình, khám phá, tuyệt vời, nâng tầm... Thay bằng các động từ mạnh, từ nối đời thường: "Thật ra", "Nói trắng ra là", "Anh em hiểu thế này".

Chỉ trả về văn bản bài viết đã được thổi hồn.`.trim();
}

export function buildPrompt4PH(step3: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS_PH[contentTypeCode];
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
3. PHỐI HỢP VỚI MEDIA (HÌNH ẢNH/VIDEO): Dựa vào Định mức Media (${spec.img} ảnh), trước phần Kết luận, BẮT BUỘC chèn một câu chuyển tiếp tự nhiên để "điều hướng mắt" anh em xuống hình ảnh:
   - Nếu định mức là nhiều ảnh (ví dụ 1-3, 2-5...): Viết câu kích thích người đọc lướt xem album. (VD: "👉 Anh em lướt xem chi tiết mặt bằng và hình ảnh thực tế bên dưới...", "Chi tiết từng hạng mục anh em xem qua các ảnh sau...").
   - Nếu định mức là 1 ảnh/video: "👉 Xem ngay hình ảnh/video thực tế bên dưới...".
   - Nếu là bài Điều hướng: "👉 Anh em click ngay vào link/hình bên dưới để xem chi tiết...".
   - Những phần cần nhấn mạnh, thay vị dùng Markdown thì thay bằng CHỮ IN HOA
4. KỶ LUẬT KẾT LUẬN: ĐOẠN CUỐI CÙNG (trước phần chữ ký) BẮT BUỘC phải bắt đầu bằng một trong ba cụm từ: "Tóm lại,", "Nhìn chung,", hoặc "Vậy nên," để đúc kết lại vấn đề cốt lõi nhất của bài.
5. KỶ LUẬT CTA & CHỮ KÝ: Lồng ghép [Mức độ CTA] tự nhiên. LUÔN CHÈN chính xác khối thông tin sau ở cuối cùng (không sửa chữ nào):
---
Phan Hoàng - Thực chiến BĐS Dòng tiền
👉 Zalo/Hotline: 0866.186.189
---
6. Thêm 5 hashtag phù hợp vào cuối bài viết. Hashtag bắt buộc: #phananhhoang #bdsdongtien
TRẢ VỀ DUY NHẤT BÀI VIẾT FACEBOOK HOÀN CHỈNH, SẴN SÀNG COPY/PASTE. KHÔNG DẠ THƯA, KHÔNG BÌNH LUẬN THÊM.`.trim();
}

export function buildPrompt5PH(topic: string, step4: string, contentTypeCode: string) {
  const spec = CONTENT_SPECS_PH[contentTypeCode];
  
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
  - Chủ thể: [Hoàng / Khách hàng / Bản vẽ / Thực tế thi công]
  - Ý đồ: [Minh họa cho ý nào trong bài]
🤖 Prompt tạo ảnh AI: [Viết bằng tiếng Việt cho Google Nano Banana 2. BẮT BUỘC: Phong cách ảnh chụp đời thực bằng điện thoại, bối cảnh tại Việt Nam. Hình ảnh lột tả cuộc sống thực tế của Phan Hoàng: Đang xem bản vẽ tại công trình, đội nón cối chỉ đạo thợ, ngồi làm việc tại quán cafe vỉa hè, hoặc đang đi xem đất. Tông màu tự nhiên, chân thực, hơi bụi bặm. Tuyệt đối không hào nhoáng, giả tạo 3D].
━━━━━━━━━━━━━━━━━━━━
📝 GHI CHÚ DESIGNER (Text on photo): 
  - Gợi ý câu Text ngắn (dưới 10 chữ) để chèn lên ảnh bìa nhằm kích thích click. Chú ý chèn Text vào vùng an toàn, không bị che bởi UI của Facebook.
━━━━━━━━━━━━━━━━━━━━`.trim();
}
