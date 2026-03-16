"use client";

import React, { useState } from 'react';
import { LayoutGrid, Timer, Info, BarChart3 } from 'lucide-react';
import BenchmarkRunner from '../components/BenchmarkRunner';
import ComparisonGrid from '../components/ComparisonGrid';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bench' | 'compare' | 'docs'>('bench');

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Local SLM Engine</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          Benchmark and compare Small Language Models running entirely on your local hardware.
          Privacy-centric, offline-first, and high-performance.
        </p>
      </div>

      <div className="tabs glass" style={{ display: 'flex', padding: '8px', borderRadius: '16px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <button
          className={`btn ${activeTab === 'bench' ? 'btn-primary' : ''}`}
          style={{ flex: 1, borderRadius: '10px' }}
          onClick={() => setActiveTab('bench')}
        >
          <Timer size={18} /> Single Test
        </button>
        <button
          className={`btn ${activeTab === 'compare' ? 'btn-primary' : ''}`}
          style={{ flex: 1, borderRadius: '10px' }}
          onClick={() => setActiveTab('compare')}
        >
          <LayoutGrid size={18} /> Compare 3
        </button>
        <button
          className={`btn ${activeTab === 'docs' ? 'btn-primary' : ''}`}
          style={{ flex: 1, borderRadius: '10px' }}
          onClick={() => setActiveTab('docs')}
        >
          <Info size={18} /> Analysis
        </button>
      </div>

      {activeTab === 'bench' && (
        <div className="tab-content">
          <BenchmarkRunner />
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="tab-content">
          <ComparisonGrid />
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="tab-content">
          <div className="card">
            <h2 style={{ marginBottom: '24px' }}>Quality vs. Speed Tradeoffs</h2>
            <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <section>
                <div className="card glass" style={{ height: '100%' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Small (Phi-3 Mini)</h3>
                  <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8, listStyle: 'none' }}>
                    <li>🚀 <strong>Speed:</strong> 40-70 TPS</li>
                    <li>🧠 <strong>Parameters:</strong> 3.8B</li>
                    <li>💾 <strong>VRAM:</strong> ~2.2GB</li>
                    <li>✅ <strong>Use Case:</strong> Summarization, chat, basic reasoning.</li>
                  </ul>
                </div>
              </section>
              <section>
                <div className="card glass" style={{ height: '100%' }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Medium (Llama-3 8B)</h3>
                  <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8, listStyle: 'none' }}>
                    <li>⚡ <strong>Speed:</strong> 15-30 TPS</li>
                    <li>🧠 <strong>Parameters:</strong> 8B</li>
                    <li>💾 <strong>VRAM:</strong> ~5.5GB</li>
                    <li>✅ <strong>Use Case:</strong> Coding, complex logic, creative writing.</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="card glass" style={{ marginTop: '24px' }}>
              <h3>Privacy & Security</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>
                All models run through this interface are processed entirely on your local CPU/GPU.
                No data ever leaves your network. This is the ultimate solution for processing sensitive
                personal or corporate data without third-party exposure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
