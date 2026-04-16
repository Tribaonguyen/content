'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { buildPrompt1, buildPrompt2, buildPrompt3, buildPrompt4, buildPrompt5, getSystemPromptWeb, WEB_CONTENT_TYPES } from '../lib/prompts';
import { buildPrompt1FB, buildPrompt2FB, buildPrompt3FB, buildPrompt4FB, buildPrompt5FB, getSystemPromptFB, CONTENT_SPECS } from '../lib/promptsFacebook';
import { buildPrompt1PH, buildPrompt2PH, buildPrompt3PH, buildPrompt4PH, buildPrompt5PH, getSystemPromptPH, CONTENT_SPECS_PH } from '../lib/promptsPhanHoang';
import ArticleReviewModal from '../components/ArticleReviewModal';

/* =====================================================
   TYPE DEFINITIONS
===================================================== */
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

/* =====================================================
   ICON COMPONENT  (using Material Symbols)
===================================================== */
function Icon({ name, className = '', filled = false, size = 24 }: {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

/* =====================================================
   BADGE — platform label
===================================================== */
function PlatformBadge({ platform }: { platform: ArticleTask['platform'] }) {
  const config = {
    website: { label: 'WEB', bg: 'rgba(48,98,119,0.12)', color: '#154c61' },
    facebook: { label: 'FB', bg: 'rgba(70,95,137,0.12)', color: '#2e4770' },
    phanhoang: { label: 'PH', bg: 'rgba(147,71,0,0.12)', color: '#733600' },
  }[platform];

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {config.label}
    </span>
  );
}

/* =====================================================
   STATUS CHIP
===================================================== */
function StatusChip({ task }: { task: ArticleTask }) {
  if (task.status === 'idle') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'var(--surface-container)', color: 'var(--on-surface-variant)',
        padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
      }}>
        <Icon name="radio_button_unchecked" size={14} /> Sẵn sàng
      </span>
    );
  }
  if (task.status === 'running') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(48,98,119,0.10)', color: 'var(--primary)',
        padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
      }}>
        <span className="animate-spin" style={{ display: 'inline-block' }}>
          <Icon name="progress_activity" size={14} />
        </span>
        Bước {task.currentStep}/5…
      </span>
    );
  }
  if (task.status === 'completed') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,120,80,0.10)', color: '#007850',
        padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
      }}>
        <Icon name="check_circle" size={14} filled /> Hoàn thành
      </span>
    );
  }
  // error
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(186,26,26,0.08)', color: 'var(--error)',
      padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    }} title={task.errorMsg}>
      <Icon name="error" size={14} /> {task.errorMsg || 'Lỗi'}
    </span>
  );
}

/* =====================================================
   SETTINGS MODAL
===================================================== */
function SettingsModal({
  config,
  onSave,
  onClose,
}: {
  config: VertexConfig;
  onSave: (c: VertexConfig) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<VertexConfig>(config);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(24,28,34,0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="animate-fade-in-up" style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 20,
        boxShadow: '0 24px 80px rgba(24,28,34,0.18)',
        padding: 36,
        width: '100%', maxWidth: 520,
        border: '1px solid var(--outline-variant)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            background: 'var(--primary)',
            borderRadius: 12,
            padding: 8,
            display: 'flex', alignItems: 'center',
          }}>
            <Icon name="key" className="" style={{ color: '#fff' }} size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--on-surface)' }}>
            Cấu Hình Vertex AI
          </h3>
        </div>

        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: 6 }}>
          Service Account JSON
        </label>
        <textarea
          value={local.saJson}
          onChange={e => setLocal({ ...local, saJson: e.target.value })}
          rows={5}
          style={{
            width: '100%', padding: '12px 14px',
            fontFamily: 'monospace', fontSize: 12,
            background: 'var(--surface-container-low)',
            border: '1.5px solid var(--outline-variant)',
            borderRadius: 10, color: 'var(--on-surface)',
            resize: 'vertical', outline: 'none', marginBottom: 18,
          }}
          placeholder='{"type":"service_account",...}'
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: 6 }}>
              Region
            </label>
            <input
              value={local.region}
              onChange={e => setLocal({ ...local, region: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--surface-container-low)',
                border: '1.5px solid var(--outline-variant)',
                borderRadius: 10, color: 'var(--on-surface)',
                outline: 'none', fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: 6 }}>
              Model
            </label>
            <select
              value={local.model}
              onChange={e => setLocal({ ...local, model: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--surface-container-low)',
                border: '1.5px solid var(--outline-variant)',
                borderRadius: 10, color: 'var(--on-surface)',
                outline: 'none', fontSize: 14, cursor: 'pointer',
              }}
            >
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Nhanh)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Mạnh nhất)</option>
              <option value="gemini-1.5-pro-002">Gemini 1.5 Pro 002</option>
              <option value="gemini-1.5-flash-002">Gemini 1.5 Flash 002</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              background: 'var(--surface-container)',
              border: 'none', borderRadius: 10,
              fontWeight: 700, fontSize: 14, color: 'var(--on-surface)',
              cursor: 'pointer',
            }}
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(local)}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              border: 'none', borderRadius: 10,
              fontWeight: 700, fontSize: 14, color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(48,98,119,0.3)',
            }}
          >
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TASK ROW CARD
===================================================== */
function TaskCard({
  task,
  onRun,
  onReview,
  onDelete,
}: {
  task: ArticleTask;
  onRun: () => void;
  onReview: () => void;
  onDelete: () => void;
}) {
  const contentLabel =
    task.platform === 'facebook'
      ? CONTENT_SPECS[task.contentType || '']?.label || task.contentType
      : task.platform === 'phanhoang'
      ? CONTENT_SPECS_PH[task.contentType || '']?.label || task.contentType
      : task.contentType;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 16,
        border: '1px solid var(--outline-variant)',
        padding: '18px 22px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 14,
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(48,98,119,0.10)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Title block */}
      <div style={{ flex: '1 1 220px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <PlatformBadge platform={task.platform} />
          <span style={{
            fontWeight: 700, fontSize: 15,
            color: 'var(--on-surface)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }} title={task.topic}>
            {task.topic}
          </span>
        </div>
        <p style={{
          margin: 0, fontSize: 12, color: 'var(--on-surface-variant)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {contentLabel}
          {task.audience && <> &bull; {task.audience}</>}
        </p>
      </div>

      {/* Status */}
      <div style={{ flex: '0 0 auto' }}>
        <StatusChip task={task} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Run */}
        <button
          onClick={onRun}
          disabled={task.status === 'running'}
          title="Chạy AI"
          style={{
            width: 38, height: 38, border: 'none', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,120,80,0.10)', color: '#007850',
            transition: 'all 0.15s',
            opacity: task.status === 'running' ? 0.4 : 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,120,80,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,120,80,0.10)')}
        >
          <Icon name="play_arrow" size={20} filled />
        </button>

        {/* Review */}
        <button
          onClick={onReview}
          disabled={task.status !== 'completed'}
          title="Xem & Xuất nội dung"
          style={{
            width: 38, height: 38, border: 'none', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(48,98,119,0.10)', color: 'var(--primary)',
            transition: 'all 0.15s',
            opacity: task.status !== 'completed' ? 0.4 : 1,
          }}
          onMouseEnter={e => task.status === 'completed' && (e.currentTarget.style.background = 'rgba(48,98,119,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(48,98,119,0.10)')}
        >
          <Icon name="edit_note" size={20} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          title="Xóa tác vụ"
          style={{
            width: 38, height: 38, border: 'none', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(186,26,26,0.08)', color: 'var(--error)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(186,26,26,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(186,26,26,0.08)')}
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */
function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 24, padding: '56px 24px',
      textAlign: 'center',
    }}>
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        <div style={{
          position: 'absolute', inset: -8,
          background: 'rgba(48,98,119,0.06)',
          borderRadius: '50%',
        }} className="animate-pulse-ring" />
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'var(--surface-container)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Icon name="biotech" size={44} className="" style={{ color: 'var(--primary)' }} />
        </div>
      </div>
      <div>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: 'var(--on-surface)' }}>
          Phòng Lab đang đợi bạn…
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--on-surface-variant)', maxWidth: 380 }}>
          Chưa có nội dung nào được tạo. Điền thông tin ở trên và nhấn{' '}
          <strong style={{ color: 'var(--primary)' }}>Tạo Tác Vụ</strong> để AI bắt đầu
          quá trình &ldquo;Luyện kim&rdquo; kỹ thuật số.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 40, height: 4, borderRadius: 999,
            background: 'var(--surface-container-high)',
          }} />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   MAIN DASHBOARD
===================================================== */
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
    if (newPlatform === 'website') setNewContentType(WEB_CONTENT_TYPES[0]);
    else if (newPlatform === 'facebook') setNewContentType(Object.keys(CONTENT_SPECS)[0]);
    else setNewContentType(Object.keys(CONTENT_SPECS_PH)[0]);
  }, [newPlatform]);

  const saveConfig = (c: VertexConfig) => {
    localStorage.setItem('vertex_config', JSON.stringify(c));
    setConfig(c);
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

  const callVertexAI = async (systemPrompt: string, userPrompt: string, retryCount = 0, enableGoogleSearch = false): Promise<string> => {
    try {
      if (!config.saJson) throw new Error("Chưa cấu hình SA JSON!");
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saJson: config.saJson, region: config.region, model: config.model, systemPrompt, userPrompt, enableGoogleSearch }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && retryCount < 3) {
          console.warn(`Lỗi 429. Thử lại lần ${retryCount + 1}...`);
          await delay((retryCount + 1) * 15000);
          return callVertexAI(systemPrompt, userPrompt, retryCount + 1, enableGoogleSearch);
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
    if (runningTasksRef.current.has(id)) return;
    runningTasksRef.current.add(id);

    const currentTasks = JSON.parse(localStorage.getItem('article_tasks') || '[]') as ArticleTask[];
    const task = currentTasks.find(t => t.id === id);
    if (!task) { runningTasksRef.current.delete(id); return; }
    if (task.status === 'running') { runningTasksRef.current.delete(id); return; }

    updateTaskState(id, { status: 'running', errorMsg: '' });

    try {
      if (task.platform === 'website') {
        const sysPrompt = getSystemPromptWeb(task.knowledgeBase);
        updateTaskState(id, { currentStep: 1 });
        const s1 = await callVertexAI(sysPrompt, buildPrompt1(task.topic, task.contentType || '', task.audience), 0, true);
        updateTaskState(id, { output1: s1 }); await delay(3000);
        updateTaskState(id, { currentStep: 2 });
        const s2 = await callVertexAI(sysPrompt, buildPrompt2(task.topic, s1));
        updateTaskState(id, { output2: s2 }); await delay(3000);
        updateTaskState(id, { currentStep: 3 });
        const s3 = await callVertexAI(sysPrompt, buildPrompt3(task.topic, s2));
        updateTaskState(id, { output3: s3 }); await delay(3000);
        updateTaskState(id, { currentStep: 4 });
        const s4 = await callVertexAI(sysPrompt, buildPrompt4(task.topic, s3));
        updateTaskState(id, { output4: s4 }); await delay(3000);
        updateTaskState(id, { currentStep: 5 });
        const s5 = await callVertexAI(sysPrompt, buildPrompt5(task.topic, s4));
        updateTaskState(id, { output5: s5, status: 'completed' });
      } else if (task.platform === 'facebook') {
        const sysPrompt = getSystemPromptFB(task.audience, task.knowledgeBase);
        updateTaskState(id, { currentStep: 1 });
        const s1 = await callVertexAI(sysPrompt, buildPrompt1FB(task.topic, task.contentType || ''), 0, true);
        updateTaskState(id, { output1: s1 }); await delay(3000);
        updateTaskState(id, { currentStep: 2 });
        const s2 = await callVertexAI(sysPrompt, buildPrompt2FB(s1, task.contentType || ''));
        updateTaskState(id, { output2: s2 }); await delay(3000);
        updateTaskState(id, { currentStep: 3 });
        const s3 = await callVertexAI(sysPrompt, buildPrompt3FB(s2));
        updateTaskState(id, { output3: s3 }); await delay(3000);
        updateTaskState(id, { currentStep: 4 });
        const s4 = await callVertexAI(sysPrompt, buildPrompt4FB(task.topic, s3, task.contentType || ''));
        updateTaskState(id, { output4: s4 }); await delay(3000);
        updateTaskState(id, { currentStep: 5 });
        const s5 = await callVertexAI(sysPrompt, buildPrompt5FB(task.topic, s4, task.contentType || ''));
        updateTaskState(id, { output5: s5, status: 'completed' });
      } else if (task.platform === 'phanhoang') {
        const sysPrompt = getSystemPromptPH(task.audience, task.knowledgeBase);
        updateTaskState(id, { currentStep: 1 });
        const s1 = await callVertexAI(sysPrompt, buildPrompt1PH(task.topic, task.contentType || ''), 0, true);
        updateTaskState(id, { output1: s1 }); await delay(3000);
        updateTaskState(id, { currentStep: 2 });
        const s2 = await callVertexAI(sysPrompt, buildPrompt2PH(s1, task.contentType || ''));
        updateTaskState(id, { output2: s2 }); await delay(3000);
        updateTaskState(id, { currentStep: 3 });
        const s3 = await callVertexAI(sysPrompt, buildPrompt3PH(s2));
        updateTaskState(id, { output3: s3 }); await delay(3000);
        updateTaskState(id, { currentStep: 4 });
        const s4 = await callVertexAI(sysPrompt, buildPrompt4PH(task.topic, s3, task.contentType || ''));
        updateTaskState(id, { output4: s4 }); await delay(3000);
        updateTaskState(id, { currentStep: 5 });
        const s5 = await callVertexAI(sysPrompt, buildPrompt5PH(task.topic, s4, task.contentType || ''));
        updateTaskState(id, { output5: s5, status: 'completed' });
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
      const pending = currentTasks.filter(t => (t.status === 'idle' || t.status === 'error') && t.platform === newPlatform);
      for (const task of pending) {
        if (!runningTasksRef.current.has(task.id)) {
          await runTask(task.id);
          await delay(8000);
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
    if (platformTasks.length === 0) { alert("Không có tác vụ nào để xuất!"); return; }
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
        "Bước 4: Định dạng / Bài hoàn chỉnh": task.output4 || '',
        "Bước 5: Media Brief": task.output5 || '',
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TasksData");
    XLSX.writeFile(workbook, `Danh_Sach_Bai_${newPlatform.toUpperCase()}.xlsx`);
  };

  const filteredTasks = tasks.filter(t => t.platform === newPlatform);
  const hasPending = filteredTasks.some(t => t.status === 'idle' || t.status === 'error');

  // Platform selector data
  const platforms = [
    {
      key: 'website' as const,
      label: 'Website Blog',
      icon: 'language',
      iconBg: 'rgba(48,98,119,0.12)',
      iconColor: 'var(--primary)',
    },
    {
      key: 'facebook' as const,
      label: 'Facebook Page',
      icon: 'social_leaderboard',
      iconBg: 'rgba(70,95,137,0.15)',
      iconColor: 'var(--secondary)',
    },
    {
      key: 'phanhoang' as const,
      label: 'Phan Hoàng Branding',
      icon: 'auto_awesome',
      iconBg: 'rgba(147,71,0,0.12)',
      iconColor: 'var(--tertiary)',
    },
  ];

  const getContentTypeOptions = () => {
    if (newPlatform === 'website') return WEB_CONTENT_TYPES.map(t => ({ key: t, label: t }));
    if (newPlatform === 'facebook') return Object.entries(CONTENT_SPECS).map(([k, v]) => ({ key: k, label: v.label }));
    return Object.entries(CONTENT_SPECS_PH).map(([k, v]) => ({ key: k, label: v.label }));
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--on-surface)' }}>

      {/* ── TOP NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(249,249,255,0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--outline-variant)',
        boxShadow: '0 4px 24px rgba(48,98,119,0.06)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 32px',
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="https://xaynhatocdo.com/wp-content/uploads/elementor/thumbs/logo-XNTD.ai_-1-rjwfiru0ietqeg1jjcnuscd7mlnns3n182n4uyr8xs.png"
              alt="Xây Nhà Tốc Độ"
              style={{ height: 48, width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--on-surface-variant)', marginLeft: 4, opacity: 0.7 }}>
              Neural Studio
            </span>
          </div>

          {/* Nav + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              id="btn-api-config"
              onClick={() => setShowSettings(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px',
                background: 'var(--surface-container)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 12,
                color: 'var(--on-surface)', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-container-high)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-container)')}
            >
              <Icon name="api" size={18} />
              Cấu hình API
            </button>

            {filteredTasks.length > 0 && (
              <button
                id="btn-export"
                onClick={exportToExcel}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 18px',
                  background: 'rgba(0,120,80,0.10)',
                  border: '1px solid rgba(0,120,80,0.2)',
                  borderRadius: 12,
                  color: '#007850', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,120,80,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,120,80,0.10)')}
              >
                <Icon name="download" size={18} />
                Tải Excel
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{
              margin: '0 0 12px',
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--on-surface)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              The Digital Alchemist<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Content Creation Lab
              </span>
            </h1>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              Biến dữ liệu thô thành nội dung sáng tạo đỉnh cao. Tốc độ, chính xác và mang đậm dấu ấn cá nhân.
            </p>
          </div>
          <div style={{
            width: 80, height: 80, minWidth: 80,
            background: 'rgba(70,95,137,0.10)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} className="animate-pulse-ring">
            <Icon name="biotech" size={40} style={{ color: 'var(--secondary)' }} />
          </div>
        </div>

        {/* ── INPUT COMMAND CENTER ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 28,
        }}>
          {/* Platform Picker */}
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 20, padding: 24,
            border: '1px solid var(--outline-variant)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.10em', color: 'var(--on-surface-variant)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="category" size={14} /> Nền tảng
            </span>
            {platforms.map(p => (
              <button
                key={p.key}
                id={`platform-${p.key}`}
                onClick={() => setNewPlatform(p.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 14,
                  border: `2px solid ${newPlatform === p.key ? 'var(--primary)' : 'transparent'}`,
                  background: newPlatform === p.key
                    ? 'rgba(48,98,119,0.07)'
                    : 'var(--surface-container-lowest)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  if (newPlatform !== p.key) (e.currentTarget.style.background = 'var(--surface-container)');
                }}
                onMouseLeave={e => {
                  if (newPlatform !== p.key) (e.currentTarget.style.background = 'var(--surface-container-lowest)');
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: p.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.15s',
                }}>
                  <Icon name={p.icon} size={20} style={{ color: p.iconColor }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--on-surface)' }}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Topic + Type + Audience inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Topic input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--on-surface-variant)' }}>
                Chủ đề / Keyword <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Icon name="search" size={20} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--outline)',
                }} />
                <input
                  id="input-topic"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder="Vd: Xây căn hộ dịch vụ 2026..."
                  style={{
                    width: '100%', padding: '13px 14px 13px 44px',
                    background: 'var(--surface-container-lowest)',
                    border: '1.5px solid var(--outline-variant)',
                    borderRadius: 12, fontSize: 14, color: 'var(--on-surface)',
                    outline: 'none', transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--outline-variant)')}
                />
              </div>
            </div>

            {/* Content type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--on-surface-variant)' }}>
                Loại hình bài viết
              </label>
              <select
                id="select-content-type"
                value={newContentType}
                onChange={e => setNewContentType(e.target.value)}
                style={{
                  width: '100%', padding: '13px 14px',
                  background: 'var(--surface-container-lowest)',
                  border: '1.5px solid var(--outline-variant)',
                  borderRadius: 12, fontSize: 14, color: 'var(--on-surface)',
                  outline: 'none', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--outline-variant)')}
              >
                {getContentTypeOptions().map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Audience chips */}
            <div style={{
              background: 'var(--surface-container-low)',
              borderRadius: 14, padding: '16px 18px',
              border: '1px solid var(--outline-variant)',
            }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 10 }}>
                Tệp khách hàng
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['CĐT căn hộ dịch vụ', 'Gia đình trẻ', 'Nhà đầu tư', 'Chủ SME', 'Tùy chỉnh'].map(seg => (
                  <button
                    key={seg}
                    onClick={() => setNewAudience(seg === 'Tùy chỉnh' ? '' : seg)}
                    style={{
                      padding: '6px 14px', borderRadius: 999,
                      border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 700,
                      background: newAudience === seg
                        ? 'var(--secondary)' : 'var(--surface-container-highest)',
                      color: newAudience === seg ? '#fff' : 'var(--on-surface)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (newAudience !== seg) (e.currentTarget.style.background = 'rgba(70,95,137,0.12)');
                    }}
                    onMouseLeave={e => {
                      if (newAudience !== seg) (e.currentTarget.style.background = 'var(--surface-container-highest)');
                    }}
                  >
                    {seg}
                  </button>
                ))}
              </div>
              <input
                id="input-audience"
                value={newAudience}
                onChange={e => setNewAudience(e.target.value)}
                placeholder="Hoặc nhập tệp khách riêng..."
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px dashed var(--outline-variant)',
                  marginTop: 10, paddingTop: 12,
                  fontSize: 13, color: 'var(--on-surface)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </section>

        {/* DNA Input */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 20, padding: 24,
          border: '1.5px solid rgba(48,98,119,0.18)',
          marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--on-surface-variant)' }}>
              🧬 Dữ liệu DNA Sáng tạo{' '}
              <span style={{ fontSize: 10, fontStyle: 'italic', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (Từ NotebookLM)
              </span>
            </label>
            <span style={{ fontSize: 11, color: 'var(--outline)', fontStyle: 'italic' }}>
              Tối thiểu 100 ký tự để AI hiểu rõ nhất
            </span>
          </div>
          <textarea
            id="input-dna"
            value={newKnowledgeBase}
            onChange={e => setNewKnowledgeBase(e.target.value)}
            placeholder="Dán toàn bộ bản tóm tắt tinh hoa từ NotebookLM vào đây... AI sẽ học thuộc lòng văn bản này để viết bài mà không tóm tắt lại."
            rows={5}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'var(--surface-container-low)',
              border: '1.5px solid var(--outline-variant)',
              borderRadius: 12, fontSize: 14, color: 'var(--on-surface)',
              resize: 'vertical', outline: 'none',
              transition: 'border-color 0.15s',
              lineHeight: 1.65,
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--outline-variant)')}
          />
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
          <button
            id="btn-add-task"
            onClick={addTask}
            disabled={!newTopic}
            style={{
              position: 'relative',
              padding: '16px 44px',
              borderRadius: 16,
              border: 'none',
              background: newTopic
                ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
                : 'var(--surface-container)',
              color: newTopic ? '#fff' : 'var(--on-surface-variant)',
              fontWeight: 800, fontSize: 18,
              cursor: newTopic ? 'pointer' : 'not-allowed',
              boxShadow: newTopic ? '0 8px 32px rgba(48,98,119,0.28)' : 'none',
              transition: 'all 0.22s',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseEnter={e => {
              if (newTopic) {
                (e.currentTarget.style.transform = 'translateY(-3px)');
                (e.currentTarget.style.boxShadow = '0 16px 48px rgba(48,98,119,0.36)');
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.transform = 'translateY(0)');
              (e.currentTarget.style.boxShadow = newTopic ? '0 8px 32px rgba(48,98,119,0.28)' : 'none');
            }}
          >
            <Icon name="bolt" size={28} filled />
            Tạo Tác Vụ
          </button>
        </div>

        {/* ── TASKS LIST SECTION ── */}
        <section>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{
                margin: 0, fontSize: 22, fontWeight: 800,
                color: 'var(--on-surface)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Danh sách bài viết
              </h2>
              {/* Platform tabs */}
              <div style={{
                display: 'flex', gap: 2,
                background: 'var(--surface-container)',
                borderRadius: 10, padding: 3,
              }}>
                {platforms.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setNewPlatform(p.key)}
                    style={{
                      padding: '5px 14px', borderRadius: 8, border: 'none',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: newPlatform === p.key ? 'var(--surface-container-lowest)' : 'transparent',
                      color: newPlatform === p.key ? 'var(--primary)' : 'var(--on-surface-variant)',
                      boxShadow: newPlatform === p.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.label.split(' ')[0]}
                  </button>
                ))}
              </div>
              {filteredTasks.length > 0 && (
                <span style={{
                  background: 'var(--primary)', color: '#fff',
                  borderRadius: 999, width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                }}>
                  {filteredTasks.length}
                </span>
              )}
            </div>

            {filteredTasks.length > 0 && (
              <button
                id="btn-run-all"
                onClick={runAllPending}
                disabled={isProcessingAll || !hasPending}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 12,
                  border: 'none',
                  background: isProcessingAll || !hasPending
                    ? 'var(--surface-container)'
                    : 'linear-gradient(135deg, #465f89, #306277)',
                  color: isProcessingAll || !hasPending ? 'var(--on-surface-variant)' : '#fff',
                  fontWeight: 700, fontSize: 14, cursor: hasPending && !isProcessingAll ? 'pointer' : 'not-allowed',
                  boxShadow: !isProcessingAll && hasPending ? '0 4px 16px rgba(70,95,137,0.28)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {isProcessingAll
                  ? <><span className="animate-spin" style={{ display: 'inline-block' }}><Icon name="progress_activity" size={18} /></span> Đang chạy tự động…</>
                  : <><Icon name="play_circle" size={18} filled /> Chạy Tất Cả</>
                }
              </button>
            )}
          </div>

          {/* Task cards */}
          <div style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 24, padding: 24,
            border: '1px solid var(--outline-variant)',
            minHeight: 320,
            boxShadow: '0 4px 24px rgba(48,98,119,0.04)',
          }}>
            {filteredTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRun={() => runTask(task.id)}
                    onReview={() => setReviewTask(task)}
                    onDelete={() => removeTask(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--outline-variant)',
        padding: '20px 32px',
        marginTop: 24,
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>
            © 2024{' '}
            <strong style={{ color: 'var(--primary)' }}>Neural Studio</strong>
            {' '}· Sáng tạo không giới hạn bởi AI.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Điều khoản', 'Bảo mật', 'Hỗ trợ'].map(link => (
              <a key={link} href="#" style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--on-surface-variant)',
                textDecoration: 'none', transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface-variant)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {showSettings && (
        <SettingsModal
          config={config}
          onSave={saveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
      {reviewTask && (
        <ArticleReviewModal task={reviewTask} onClose={() => setReviewTask(null)} />
      )}
    </div>
  );
}
