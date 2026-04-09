import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { ArticleTask } from '../app/page';

interface ArticleReviewModalProps {
  task: ArticleTask;
  onClose: () => void;
}

export default function ArticleReviewModal({ task, onClose }: ArticleReviewModalProps) {
  const [copied4, setCopied4] = useState(false);
  const [copied5, setCopied5] = useState(false);

  if (!task) return null;

  const handleCopy = (text: string, step: number) => {
    navigator.clipboard.writeText(text || '');
    if (step === 4) {
      setCopied4(true); setTimeout(() => setCopied4(false), 2000);
    } else {
      setCopied5(true); setTimeout(() => setCopied5(false), 2000);
    }
  };

  const handleExport = () => {
    const zip = new JSZip();
    
    // Create Markdown Content
    const mdContent = `# ${task.topic}\n\n${task.output4 || 'Chưa nội dung bài viết'}\n\n## Media Brief (Tham khảo)\n\n${task.output5 || ''}`;
    
    // Add text files
    zip.file("bai-viet.md", mdContent);
    zip.file("media-brief.txt", task.output5 || '');
    zip.file("raw-step1.txt", task.output1 || '');
    zip.file("raw-step2.txt", task.output2 || '');

    // Note: We could fetch image URLs or generate them here and add to ZIP
    // zip.folder("images");

    zip.generateAsync({ type: "blob" })
    .then(function(content) {
      // Loại bỏ tiếng việt có dấu và ký tự đặc biệt để Windows không bị lỗi cấm lưu file
      const safeTopic = task.topic ? task.topic.toString() : 'baiviet';
      const safeName = safeTopic
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 \-]/g, "") // Cho phép dấu cách và gạch ngang
        .trim()
        .replace(/\s+/g, "-") // Đổi dấu cách thành gạch ngang
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
        
      const fileName = `SEO-${safeName || 'baiviet'}.zip`;
      
      // Tạo Object URL cho Blob zip content
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Dùng property .download
      
      // Append vào body để đảm bảo click event được browser ghi nhận đúng
      document.body.appendChild(link);
      link.click();
      
      // Quan trọng: Delay việc remove element và revoke URL 
      // để trình duyệt kịp gắn tên file (tránh lỗi file tải về bị đổi tên thành mã UUID của Blob URL)
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi Tiết: {task.topic}</h2>
            <p className="text-sm text-gray-500">Đối tượng: {task.audience || 'Mặc định'}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              <Download className="w-4 h-4" /> Export ZIP
            </button>
            <button onClick={onClose} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded inline-block">Bước 4: Bài Viết Hoàn Chỉnh ({task.platform === 'facebook' ? 'Facebook Format' : 'Kèm Vị Trí Ảnh'})</h3>
              <button onClick={() => handleCopy(task.output4 || '', 4)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 font-semibold border border-gray-300 transition-all">
                {copied4 ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied4 ? 'Đã Copy' : 'Copy Nội Dung'}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-wrap font-serif text-gray-800 leading-relaxed max-h-96 overflow-y-auto shadow-inner">
              {task.output4 || <span className="text-gray-400 italic">Đang chờ xử lý...</span>}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded inline-block">Bước 5: Media Brief (Prompt Ảnh)</h3>
              <button onClick={() => handleCopy(task.output5 || '', 5)} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 font-semibold border border-gray-300 transition-all">
                {copied5 ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} {copied5 ? 'Đã Copy' : 'Copy Prompt'}
              </button>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 whitespace-pre-wrap font-mono text-sm text-indigo-900 leading-relaxed shadow-inner">
              {task.output5 || <span className="text-gray-400 italic">Đang chờ xử lý...</span>}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section>
              <h3 className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block mb-2">Bản nháp (Bước 1 & 2)</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-600 max-h-48 overflow-y-auto">
                {task.output2 || task.output1 || '...'}
              </div>
            </section>
            <section>
               <h3 className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block mb-2">Tối ưu Readability (Bước 3)</h3>
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-600 max-h-48 overflow-y-auto">
                 {task.output3 || '...'}
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
