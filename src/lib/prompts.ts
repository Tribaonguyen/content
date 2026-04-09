export const WEB_CONTENT_TYPES = [
  "Bài Blog / Chia sẻ kiến thức",
  "Bài Dịch vụ / Cấu trúc Sale Page",
  "Bài Dự án / Case Study thi công",
  "Bài Phân tích / Pháp lý, Quy hoạch"
];

function getBrandVoiceBlock() {
  return `
HÃY TUÂN THỦ BRAND VOICE SAU TRONG TOÀN BỘ NỘI DUNG:
- Hình mẫu thương hiệu:
  + Người Chỉ Huy Đáng Tin Cậy: bao quát, kỷ luật, nói được làm được.
  + Chuyên Gia Cố Vấn: tận tâm, hướng dẫn khách rõ ràng, giúp tránh rủi ro và tối ưu tài chính.
- Quy tắc xưng hô:
  + Phía công ty: dùng "Xây Nhà Tốc Độ", "chúng tôi" hoặc "đội ngũ kỹ sư". Tuyệt đối không dùng "em".
  + Phía khách hàng: xưng "Anh/Chị" hoặc "Quý Anh/Chị".
- Quy tắc ngôn từ:
  + Ưu tiên ngôn ngữ đời thường, giải thích dễ hiểu, không lạm dụng thuật ngữ.
  + Nói chuyện bằng con số thực tế: lợi ích đo bằng thời gian và tiền.
  + Minh bạch, trực diện, nhấn mạnh cam kết: không phát sinh chi phí, đúng tiến độ, đúng chất lượng.
- Giọng điệu theo tệp khách hàng:
  + Tệp đầu tư CHDV/nhà trọ: thẳng thắn, sắc bén, tập trung vào bài toán kinh tế.
  + Tệp Việt Kiều/người ở xa: trấn an, bao quát, tỉ mỉ, minh bạch tuyệt đối.
  + Tệp F0 BĐS dòng tiền: đồng hành, chia sẻ, giải thích cặn kẽ.
`.trim();
}

export function getSystemPromptWeb(knowledgeBase?: string) {
  const kbContext = knowledgeBase ? `\n[KIẾN THỨC NỀN TẢNG (DNA) BẮT BUỘC SỬ DỤNG]\n${knowledgeBase}\n(Phải dùng y nguyên các thông tin, dịch vụ, báo giá tại đây, tuyệt đối không bịa đặt thêm nội dung ngoài).\n` : '';
  return `Bạn là AI Copywriter và Chuyên gia Website SEO thực chiến của Xây Nhà Tốc Độ. Hãy tuân thủ nghiêm ngặt các hướng dẫn và quy chuẩn được giao.${kbContext}`;
}

export const buildPrompt1 = (topic: string, contentType: string, audience: string) => {
  const audienceInstruction = audience ? `\n- Lưu ý riêng cho tệp khách hàng bài này: ${audience}` : '';
  const contentTypeInstruction = contentType ? `\n- Loại bài viết: ${contentType}` : '';
  
  return `
Bạn là chuyên gia content SEO cho website xaynhatocdo.com.
Viết một bài SEO chuẩn về chủ đề: "${topic}"

Yêu cầu:
- Bài viết phải tự nhiên, lôi cuốn, mang lại giá trị cho người đọc.
- Không sử dụng ngôn ngữ máy móc, rập khuôn, không nhồi nhét từ khóa.
- Giọng văn: thân thiện, gần gũi, dễ đọc nhưng vẫn chuyên nghiệp.
- Cấu trúc bài viết gồm:
  1. Mở bài hấp dẫn, đặt câu hỏi gợi mở.
  2. Nội dung chính chia thành các đề mục H2, H3 rõ ràng.
  3. Kết bài có CTA khuyến khích liên hệ.
- Có gợi ý hình minh họa ngắn gọn trong bài.
- Đối tượng chính: Người cần xây nhà để làm CHDV, phòng trọ, chủ đầu tư.${audienceInstruction}${contentTypeInstruction}

${getBrandVoiceBlock()}

[QUAN TRỌNG]: TUYỆT ĐỐI KHÔNG ghi lời chào, không giải thích. CHỈ TRẢ VỀ TOÀN BỘ NỘI DUNG BÀI VIẾT.
`.trim();
}

export const buildPrompt2 = (topic: string, step1: string) => {
  return `
Bạn là chuyên gia biên tập content SEO.
Dưới đây là bài gốc:
"""${step1}"""

Hãy viết lại bài trên theo chủ đề "${topic}" với yêu cầu:
- Viết lại hoàn toàn để không trùng lặp câu chữ với bài gốc. Dài hơn khoảng 30%.
- Tự nhiên, hấp dẫn hơn, hữu ích hơn. Bắt buộc có các đề mục H2 và H3.
- Viết lại kết luận sao cho thuyết phục hơn, có CTA mạnh hơn.
- Chèn gợi ý hình ảnh minh họa dưới dạng prompt ngắn.

${getBrandVoiceBlock()}

[QUAN TRỌNG] TRẢ VỀ ĐÚNG FORMAT DƯỚI ĐÂY (Không thêm lời chào):

[THÔNG TIN SEO]
- Đối tượng: (Ghi 1 nhóm phù hợp)
- Từ khóa chính: (Ghi từ khóa)
- Từ khóa phụ: (Ghi danh sách)

[BÀI VIẾT HOÀN CHỈNH]
(Viết toàn bộ nội dung bài viết vào phần này)
`.trim();
}

export const buildPrompt3 = (topic: string, step2: string) => {
  return `
Bạn là chuyên gia tối ưu nội dung SEO tự nhiên, cải thiện độ dễ đọc (Readability).
Dưới đây là kết quả của bước trước:
"""${step2}"""

HÃY CHỈ LẤY PHẦN "[BÀI VIẾT HOÀN CHỈNH]" BÊN TRÊN ĐỂ TỐI ƯU THEO CÁC TIÊU CHÍ SAU:

✅ Thêm yếu tố con người: Bổ sung câu chuyện, ví dụ thực tế, câu hỏi tương tác.
✅ Viết câu ngắn gọn, tự nhiên: Hạn chế câu dài trên 20 từ. Tách câu nếu cần. Không để quá 25% số câu dài hơn 20 từ.
✅ Không nhồi nhét từ khóa làm câu gượng gạo.
✅ Cấu trúc SEO BẮT BUỘC:
  - H1: Chứa từ khóa chính xác.
  - Tối đa 2 thẻ H2 chứa từ khóa chính, các H2 còn lại và H3 dùng từ khóa biến thể (LSI).
  - Rải từ khóa chính tự nhiên 3 lần (Mở bài, Thân bài, Kết bài).

${getBrandVoiceBlock()}

[QUAN TRỌNG]: TRẢ VỀ DUY NHẤT BÀI VIẾT ĐĐƯỢC TỐI ƯU (Bao gồm H1, H2, H3). TUYỆT ĐỐI KHÔNG XUẤT LẠI PHẦN "THÔNG TIN SEO", KHÔNG GHI LỜI CHÀO HAY GIẢI THÍCH.
`.trim();
}

export const buildPrompt4 = (topic: string, step3: string) => {
  return `
Bạn là chuyên gia SEO on-page.
Dưới đây là bài viết cần kiểm tra:
"""${step3}"""

Hãy rà soát nội dung trên cho chủ đề "${topic}". Đóng gói bộ Meta SEO và TÍCH HỢP TRỰC TIẾP CÁC VỊ TRÍ ẢNH VÀO BÀI VIẾT.

YÊU CẦU:
1. ĐỊNH DẠNG HEADING: Trình bày bài viết rõ ràng bằng các thẻ HTML cơ bản (như <h1>, <h2>, <h3>, <p>, <strong>) để copy dán trực tiếp lên Website.
2. CHÈN VỊ TRÍ ẢNH: Chọn ra 4-6 vị trí phù hợp dưới các thẻ H2, H3 để chèn ảnh. Tại mỗi vị trí, chèn khối thông tin chuẩn SEO sau:
   [VỊ TRÍ ẢNH {Số thứ tự}]
   - Tên ảnh: (ví dụ: xay-nha-tro-trong-goi.jpg)
   - Alt text: (Mô tả nội dung bức ảnh, bắt buộc chứa từ khóa)
   - Chú thích (Caption): (Câu chú thích sẽ hiển thị ngay dưới ảnh trên web)
   - Mô tả (Description): (Mô tả chi tiết để phục vụ SEO hình ảnh)

${getBrandVoiceBlock()}

[QUAN TRỌNG] Trả về chính xác theo format sau (Không thêm lời chào):

[BỘ THẺ SEO META]
1. SEO Title: (Dưới 60 ký tự, chứa từ khóa)
2. Meta Description: (Dưới 160 ký tự, cuốn hút)
3. URL đề xuất: (url-ngan-gon-chua-tu-khoa)
4. Internal link đề xuất: (Gợi ý anchor text)
5. Từ khóa SAO chính: 
6. CTA cuối bài đề xuất: (Câu CTA mạnh) 

[BÀI VIẾT HOÀN CHỈNH KÈM ĐỊNH DẠNG & VỊ TRÍ ẢNH]
(Dán toàn bộ bài viết vào đây, có phân cấp rõ # H1, ## H2 và các khối [VỊ TRÍ ẢNH X] chèn đúng chỗ)
`.trim();
}

export const buildPrompt5 = (topic: string, step4: string) => {
  return `
Bạn là chuyên gia sáng tạo hình ảnh cho bài blog ngành xây dựng.
Dưới đây là bài viết đã được định dạng và ĐÁNH DẤU CÁC VỊ TRÍ ẢNH:
"""${step4}"""

YÊU CẦU:
Đọc toàn bộ bài viết trên, tìm các thẻ [VỊ TRÍ ẢNH X]. Với mỗi thẻ tìm được, hãy lên kịch bản chụp và tạo ảnh AI ĐỒNG NHẤT 100% với thông tin Alt text và Chú thích đã được cung cấp ở bước trước.

${getBrandVoiceBlock()}

[QUAN TRỌNG] Trả về theo format sau cho TỪNG bức ảnh (Không thêm lời chào):

[VỊ TRÍ ẢNH 1]
- Đề xuất chụp: (Mô tả bối cảnh, công trình, góc chụp, chủ thể, cảm xúc cần có để minh họa chính xác cho đoạn văn bản tương ứng)
- Prompt AI: (Viết prompt tiếng Việt chi tiết cho Google Nano Banana 2, phong cách chân thực, chuyên nghiệp, ánh sáng tự nhiên)

[VỊ TRÍ ẢNH 2]
...
(Tiếp tục đến hết các ảnh đã đánh dấu)
`.trim();
}
