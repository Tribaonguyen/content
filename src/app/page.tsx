'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Plus, Trash2, Edit3, Loader2, CheckCircle2, PlaySquare, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { buildPrompt1, buildPrompt2, buildPrompt3, buildPrompt4, buildPrompt5, getSystemPromptWeb, WEB_CONTENT_TYPES } from '../lib/prompts';
import { buildPrompt1FB, buildPrompt2FB, buildPrompt3FB, buildPrompt4FB, buildPrompt5FB, getSystemPromptFB, CONTENT_SPECS } from '../lib/promptsFacebook';
import { buildPrompt1PH, buildPrompt2PH, buildPrompt3PH, buildPrompt4PH, buildPrompt5PH, getSystemPromptPH, CONTENT_SPECS_PH } from '../lib/promptsPhanHoang';
import ArticleReviewModal from '../components/ArticleReviewModal';

interface VertexConfig {
  saJson: string;
  region: string;
  model: string;
}

export interface ArticleTask {
  id: string;
  topic: string;
  contentType?: string;
  platform: 'website' | 'facebook' | 'phanhoang';
  audience: string;
  knowledgeBase?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentStep: number;
  output1?: string;
  output2?: string;
  output3?: string;
  output4?: string;
  output5?: string;
  errorMsg?: string;
}

export default function Dashboard() {
  const [config, setConfig] = useState<VertexConfig>({ saJson: '', region: 'us-central1', model: 'gemini-2.0-flash-exp' });
  const [showSettings, setShowSettings] = useState(false);
  const [tasks, setTasks] = useState<ArticleTask[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [newPlatform, setNewPlatform] = useState<'website' | 'facebook' | 'phanhoang'>('website');
  const [newContentType, setNewContentType] = useState(WEB_CONTENT_TYPES[0] || '');
  const [newAudience, setNewAudience] = useState('');
  const [newKnowledgeBase, setNewKnowledgeBase] = useState('');
  const [reviewTask, setReviewTask] = useState<ArticleTask | null>(null);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const runningTasksRef = useRef<Set<string>>(new Set());
  const isProcessAllRef = useRef<boolean>(false);
  useEffect(() => {
    const savedConfig = localStorage.getItem('vertex_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    const savedTasks = localStorage.getItem('article_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    if (newPlatform === 'website') {
      setNewContentType(WEB_CONTENT_TYPES[0]);
    } else if (newPlatform === 'facebook') {
      setNewContentType(Object.keys(CONTENT_SPECS)[0]);
    } else {
      setNewContentType(Object.keys(CONTENT_SPECS_PH)[0]);
    }
  }, [newPlatform]);

  const saveConfig = () => {
    localStorage.setItem('vertex_config', JSON.stringify(config));
    setShowSettings(false);
  };

  const addTask = () => {
    if (!newTopic) return;
    const newTask: ArticleTask = {
      id: Date.now().toString(),
      topic: newTopic,
      contentType: newContentType,
      platform: newPlatform,
      audience: newAudience,
      knowledgeBase: newKnowledgeBase,
      status: 'idle',
      currentStep: 0,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem('article_tasks', JSON.stringify(updated));
    setNewTopic('');
    setNewAudience('');
    setNewKnowledgeBase('');
  };

  const removeTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('article_tasks', JSON.stringify(updated));
  };

  const callVertexAI = async (systemPrompt: string, userPrompt: string, retryCount = 0): Promise<string> => {
    try {
      if (!config.saJson) throw new Error("Chưa cấu hình SA JSON!");
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saJson: config.saJson,
          region: config.region,
          model: config.model,
          systemPrompt,
          userPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && retryCount < 3) {
           console.warn(`Lỗi 429 - Rate Limit. Tự động thử lại lần ${retryCount + 1}...`);
           await delay((retryCount + 1) * 15000);
           return callVertexAI(systemPrompt, userPrompt, retryCount + 1);
        }
        throw new Error(data.error);
      }
      return data.text;
    } catch (e: unknown) {
      throw new Error((e as Error).message || "Lỗi khi gọi API");
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateTaskState = (id: string, updates: Partial<ArticleTask>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('article_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const runTask = async (id: string) => {
    if (runningTasksRef.current.has(id)) return; // Prevent double trigger race-condition
    runningTasksRef.current.add(id);

    const currentTasks = JSON.parse(localStorage.getItem('article_tasks') || '[]') as ArticleTask[];
    const task = currentTasks.find(t => t.id === id);
    if (!task) {
      runningTasksRef.current.delete(id);
      return;
    }
    
    // Check localstorage state rigidly directly upon invocation
    if (task.status === 'running') {
      runningTasksRef.current.delete(id);
      return; 
    }

    updateTaskState(id, { status: 'running', errorMsg: '' });

    try {
      if (task.platform === 'website') {
        // --- WEB FLOW ---
        const sysPrompt = getSystemPromptWeb(task.knowledgeBase);

        updateTaskState(id, { currentStep: 1 });
        const step1Text = await callVertexAI(sysPrompt, buildPrompt1(task.topic, task.contentType || '', task.audience));
        updateTaskState(id, { output1: step1Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 2 });
        const step2Text = await callVertexAI(sysPrompt, buildPrompt2(task.topic, step1Text));
        updateTaskState(id, { output2: step2Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 3 });
        const step3Text = await callVertexAI(sysPrompt, buildPrompt3(task.topic, step2Text));
        updateTaskState(id, { output3: step3Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 4 });
        const step4Text = await callVertexAI(sysPrompt, buildPrompt4(task.topic, step3Text));
        updateTaskState(id, { output4: step4Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 5 });
        const step5Text = await callVertexAI(sysPrompt, buildPrompt5(task.topic, step4Text));
        updateTaskState(id, { output5: step5Text, status: 'completed' });
      } else if (task.platform === 'facebook') {
        // --- FACEBOOK FLOW ---
        const sysPrompt = getSystemPromptFB(task.audience, task.knowledgeBase);
        
        updateTaskState(id, { currentStep: 1 });
        const step1Text = await callVertexAI(sysPrompt, buildPrompt1FB(task.topic, task.contentType || ''));
        updateTaskState(id, { output1: step1Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 2 });
        const step2Text = await callVertexAI(sysPrompt, buildPrompt2FB(step1Text, task.contentType || ''));
        updateTaskState(id, { output2: step2Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 3 });
        const step3Text = await callVertexAI(sysPrompt, buildPrompt3FB(step2Text));
        updateTaskState(id, { output3: step3Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 4 });
        const step4Text = await callVertexAI(sysPrompt, buildPrompt4FB(step3Text, task.contentType || ''));
        updateTaskState(id, { output4: step4Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 5 });
        const step5Text = await callVertexAI(sysPrompt, buildPrompt5FB(task.topic, step4Text, task.contentType || ''));
        updateTaskState(id, { output5: step5Text, status: 'completed' });
      } else if (task.platform === 'phanhoang') {
        // --- PHAN HOANG FLOW ---
        const sysPrompt = getSystemPromptPH(task.audience, task.knowledgeBase);
        
        updateTaskState(id, { currentStep: 1 });
        const step1Text = await callVertexAI(sysPrompt, buildPrompt1PH(task.topic, task.contentType || ''));
        updateTaskState(id, { output1: step1Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 2 });
        const step2Text = await callVertexAI(sysPrompt, buildPrompt2PH(step1Text, task.contentType || ''));
        updateTaskState(id, { output2: step2Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 3 });
        const step3Text = await callVertexAI(sysPrompt, buildPrompt3PH(step2Text));
        updateTaskState(id, { output3: step3Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 4 });
        const step4Text = await callVertexAI(sysPrompt, buildPrompt4PH(step3Text, task.contentType || ''));
        updateTaskState(id, { output4: step4Text });
        await delay(3000);

        updateTaskState(id, { currentStep: 5 });
        const step5Text = await callVertexAI(sysPrompt, buildPrompt5PH(task.topic, step4Text, task.contentType || ''));
        updateTaskState(id, { output5: step5Text, status: 'completed' });
      }

    } catch (error: unknown) {
      updateTaskState(id, { status: 'error', errorMsg: (error as Error).message });
    } finally {
      runningTasksRef.current.delete(id);
    }
  };

  const runAllPending = async () => {
    if (isProcessAllRef.current) return;
    isProcessAllRef.current = true;
    setIsProcessingAll(true);
    try {
      const currentTasks = JSON.parse(localStorage.getItem('article_tasks') || '[]') as ArticleTask[];
    const pendingTasks = currentTasks.filter(t => (t.status === 'idle' || t.status === 'error') && t.platform === newPlatform);
    
    for (const task of pendingTasks) {
      if (!runningTasksRef.current.has(task.id)) {
        await runTask(task.id);
        await delay(8000); // Wait a bit before starting next task to cool down APIs
      }
    }
    } finally {
      setIsProcessingAll(false);
      isProcessAllRef.current = false;
    }
  };

  const exportToExcel = () => {
    const rawTasks = JSON.parse(localStorage.getItem('article_tasks') || '[]') as ArticleTask[];
    const platformTasks = rawTasks.filter(t => t.platform === newPlatform);
    
    if (platformTasks.length === 0) {
      alert("Không có tác vụ nào để xuất Excel cho nền tảng này!");
      return;
    }

    const data = platformTasks.map(task => {
      let dmLabel = task.contentType;
      if (task.platform === 'facebook') dmLabel = CONTENT_SPECS[task.contentType || '']?.label || task.contentType;
      else if (task.platform === 'phanhoang') dmLabel = CONTENT_SPECS_PH[task.contentType || '']?.label || task.contentType;

      return {
        "Danh mục bài": dmLabel,
        "Chủ đề / Keyword": task.topic,
        "Tệp khách hàng": task.audience,
        "Bước 1: Phác thảo": task.output1 || '',
        "Bước 2: Mở rộng": task.output2 || '',
        "Bước 3: Tối ưu SEO / Humanize": task.output3 || '',
        "Bước 4: Định dạng Ảnh / Bài hoàn chỉnh": task.output4 || '',
        "Bước 5: Media Brief": task.output5 || ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TasksData");
    XLSX.writeFile(workbook, `Danh_Sach_Bai_${newPlatform.toUpperCase()}.xlsx`);
  };

  const filteredTasks = tasks.filter(t => t.platform === newPlatform);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-700 flex items-center gap-2">
            🚀 Xây Nhà Tốc Độ <span className="text-gray-400 font-light hidden sm:inline">- AI Content Studio</span>
          </h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <Settings className="w-5 h-5" />
            <span className="font-semibold text-sm">Cấu Hình API</span>
          </button>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-[1.5] w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nền tảng</label>
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 w-full mb-1 max-w-sm">
              <button 
                onClick={() => setNewPlatform('website')} 
                className={`flex-[1] text-xs sm:text-sm font-medium py-1 rounded transition-colors ${newPlatform === 'website' ? 'bg-white shadow text-blue-600 border border-gray-200' : 'text-gray-600'}`}>Website</button>
              <button 
                onClick={() => setNewPlatform('facebook')} 
                className={`flex-[1] text-xs sm:text-sm font-medium py-1 rounded transition-colors ${newPlatform === 'facebook' ? 'bg-white shadow text-blue-600 border border-gray-200' : 'text-gray-600'}`}>Facebook</button>
              <button 
                onClick={() => setNewPlatform('phanhoang')} 
                className={`flex-[1] text-xs sm:text-sm font-medium py-1 rounded transition-colors ${newPlatform === 'phanhoang' ? 'bg-white shadow text-rose-600 border border-gray-200' : 'text-gray-600'}`}>Phan Hoàng</button>
            </div>
          </div>
          <div className="flex-[1.2] w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ đề / Keyword (Bắt buộc)</label>
            <input 
              value={newTopic} onChange={e => setNewTopic(e.target.value)}
              placeholder="Vd: Xây nhà trọ trọn gói tphcm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-[1.5] w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Loại bài viết</label>
            <select
              value={newContentType} onChange={e => setNewContentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {newPlatform === 'website' && WEB_CONTENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
              {newPlatform === 'facebook' && Object.entries(CONTENT_SPECS).map(([key, spec]) => (
                <option key={key} value={key}>{spec.label}</option>
              ))}
              {newPlatform === 'phanhoang' && Object.entries(CONTENT_SPECS_PH).map(([key, spec]) => (
                <option key={key} value={key}>{spec.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tệp khách (Tùy chọn)</label>
            <input 
              value={newAudience} onChange={e => setNewAudience(e.target.value)}
              placeholder="Vd: CĐT căn hộ dịch vụ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="bg-white p-6 pt-0 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end -mt-4">
          <div className="flex-[4] w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dữ liệu Kiến thức nền / DNA (Từ Notebook LM)</label>
            <textarea 
              value={newKnowledgeBase} onChange={e => setNewKnowledgeBase(e.target.value)}
              placeholder="Dán toàn bộ bản tóm tắt tinh hoa từ NotebookLM vào đây... AI sẽ học thuộc lòng văn bản này để viết bài mà không tóm tắt lại."
              rows={2}
              className="w-full px-4 py-2 border border-blue-200 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          <button 
            onClick={addTask} disabled={!newTopic}
            className="flex-1 w-full md:w-auto h-full min-h-[42px] px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mb-1"
          >
            <Plus className="w-5 h-5" /> Tạo
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Danh sách bài viết {newPlatform.toUpperCase()}</h2>
            <div className="flex gap-2">
              {filteredTasks.length > 0 && (
                <button 
                  onClick={exportToExcel} 
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700"
                >
                   <Download className="w-5 h-5" /> Tải Excel
                </button>
              )}
              {filteredTasks.length > 0 && (
                <button 
                  onClick={runAllPending} disabled={isProcessingAll || !filteredTasks.some(t => t.status === 'idle' || t.status === 'error')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
                >
                   {isProcessingAll ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlaySquare className="w-5 h-5" />}
                   {isProcessingAll ? 'Đang chạy tự động...' : 'Chạy Tất Cả Bảng Này'}
                </button>
              )}
            </div>
          </div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
              Bạn chưa tạo task nào cho Nền tảng này. Hãy thêm bài mới ở trên.
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate" title={task.topic}>
                     <span className={`px-2 py-0.5 text-xs font-bold mr-2 rounded ${task.platform === 'facebook' ? 'bg-blue-100 text-blue-700' : task.platform === 'phanhoang' ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'}`}>{task.platform === 'facebook' ? 'FB' : task.platform === 'phanhoang' ? 'PH' : 'WEB'}</span>
                     {task.topic}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">{task.platform === 'facebook' ? CONTENT_SPECS[task.contentType || '']?.label : task.platform === 'phanhoang' ? CONTENT_SPECS_PH[task.contentType || '']?.label : task.contentType} &bull; {task.audience || 'Mặc định'}</p>
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {task.status === 'idle' && <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Sẵn sàng</span>}
                    {task.status === 'running' && (
                      <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý Bước {task.currentStep}/5
                      </span>
                    )}
                    {task.status === 'completed' && <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Hoàn thành</span>}
                    {task.status === 'error' && <span className="text-red-600 bg-red-50 text-xs px-3 py-1 rounded-full">{task.errorMsg}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => runTask(task.id)} disabled={task.status === 'running'}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                    title="Chạy AI"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button 
                    disabled={task.status !== 'completed'}
                    onClick={() => setReviewTask(task)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border-none disabled:opacity-50"
                    title="Chỉnh sửa nội dung"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 border-none disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Cấu Hình Vertex AI</h3>
              
              <label className="block text-sm font-semibold mb-1">Service Account JSON</label>
              <textarea 
                value={config.saJson} onChange={e => setConfig({...config, saJson: e.target.value})}
                rows={5}
                className="w-full text-xs font-mono p-3 border border-gray-300 rounded mb-4"
                placeholder='{"type":"service_account",...}'
              />

              <label className="block text-sm font-semibold mb-1">Region</label>
              <input 
                value={config.region} onChange={e => setConfig({...config, region: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              />

              <label className="block text-sm font-semibold mb-1">Model (Gemini)</label>
              <select 
                value={config.model} onChange={e => setConfig({...config, model: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-6"
              >
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Nhanh - Tiết kiệm)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Mạnh nhất)</option>
                <option value="gemini-1.5-pro-002">Gemini 1.5 Pro 002</option>
                <option value="gemini-1.5-flash-002">Gemini 1.5 Flash 002</option>
              </select>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 border border-gray-300 rounded bg-white font-semibold">Hủy</button>
                <button onClick={saveConfig} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Lưu Cấu Hình</button>
              </div>
            </div>
          </div>
        )}

        {/* Review & Export Modal */}
        {reviewTask && (
          <ArticleReviewModal task={reviewTask} onClose={() => setReviewTask(null)} />
        )}
      </div>
    </div>
  );
}
