"use client";

import React, { useState, useEffect } from 'react';
import { Play, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface ModelResult {
    model: string;
    tps: number;
    totalTime: number;
    ttft: number;
    status: 'idle' | 'running' | 'done' | 'error';
    response: string;
}

const ComparisonGrid = () => {
    const [prompt, setPrompt] = useState("Explain why local LLMs are better for privacy in 3 bullet points.");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>(['', '', '']);
    const [results, setResults] = useState<ModelResult[]>([]);
    const [isComparing, setIsComparing] = useState(false);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            const data = await response.json();
            const models = data.models.map((m: any) => m.name);
            setAvailableModels(models);
            // Auto-select first 3 if available
            if (models.length >= 3) {
                setSelectedModels([models[0], models[1], models[2]]);
            } else if (models.length > 0) {
                const newSelected = ['', '', ''];
                models.forEach((m: string, i: number) => { if (i < 3) newSelected[i] = m; });
                setSelectedModels(newSelected);
            }
        } catch (err) {
            console.error("Failed to fetch models:", err);
        }
    };

    const runComparison = async () => {
        const validModels = selectedModels.filter(m => m !== '');
        if (validModels.length === 0) return;

        setIsComparing(true);
        const initialResults: ModelResult[] = validModels.map(m => ({
            model: m,
            tps: 0,
            totalTime: 0,
            ttft: 0,
            status: 'idle',
            response: ''
        }));
        setResults(initialResults);

        // Run sequentially to ensure hardware isn't split (more accurate benchmark)
        for (let i = 0; i < initialResults.length; i++) {
            const model = initialResults[i].model;

            // Update status to running
            setResults(prev => prev.map((res, idx) => idx === i ? { ...res, status: 'running' } : res));

            try {
                const startTime = performance.now();
                let firstTokenTime = 0;
                let tokenCount = 0;
                let fullResponse = "";

                const response = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model, prompt, stream: true }),
                });

                if (!response.body) throw new Error("No body");
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const json = JSON.parse(line);
                            if (json.response) {
                                if (tokenCount === 0) firstTokenTime = performance.now();
                                tokenCount++;
                                fullResponse += json.response;
                                // Periodic update to keep UI alive (but not too frequent for performance)
                                if (tokenCount % 5 === 0) {
                                    setResults(prev => prev.map((res, idx) => idx === i ? { ...res, response: fullResponse } : res));
                                }
                            }
                        } catch (e) { }
                    }
                }

                const endTime = performance.now();
                const totalLatency = (endTime - startTime) / 1000;
                const ttft = (firstTokenTime - startTime) / 1000;
                const tps = tokenCount / (totalLatency - ttft);

                setResults(prev => prev.map((res, idx) => idx === i ? {
                    ...res,
                    status: 'done',
                    tps: parseFloat(tps.toFixed(2)),
                    totalTime: parseFloat(totalLatency.toFixed(2)),
                    ttft: parseFloat(ttft.toFixed(2)),
                    response: fullResponse
                } : res));

            } catch (err) {
                console.error(`Failed to benchmark ${model}:`, err);
                setResults(prev => prev.map((res, idx) => idx === i ? { ...res, status: 'error' } : res));
            }
        }
        setIsComparing(false);
    };

    return (
        <div className="comparison-container animate-fade-in">
            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '20px' }}>Multi-Model Configuration</h3>
                <div className="grid-3" style={{ marginBottom: '24px' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600 }}>MODEL {i + 1}</label>
                            <select
                                className="glass"
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', color: 'white' }}
                                value={selectedModels[i]}
                                onChange={(e) => {
                                    const newModels = [...selectedModels];
                                    newModels[i] = e.target.value;
                                    setSelectedModels(newModels);
                                }}
                                disabled={isComparing}
                            >
                                <option value="">None</option>
                                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600 }}>SHARED PROMPT</label>
                    <textarea
                        className="glass"
                        style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '12px', color: 'white' }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isComparing}
                    />
                </div>

                <button className="btn btn-primary" onClick={runComparison} disabled={isComparing} style={{ width: '100%' }}>
                    {isComparing ? <Activity className="animate-pulse" /> : <Play />}
                    {isComparing ? "RUNNING SEQUENTIAL BENCHMARK..." : "COMPARE MODELS"}
                </button>
            </div>

            <div className="grid-3">
                {results.map((res, i) => (
                    <div key={i} className="card glass" style={{ borderColor: res.status === 'running' ? 'var(--primary)' : 'var(--card-border)' }}>
                        <div className="flex-between" style={{ marginBottom: '16px' }}>
                            <span style={{ fontWeight: 700 }}>{res.model}</span>
                            {res.status === 'running' && <Activity size={16} className="animate-pulse" color="var(--primary)" />}
                            {res.status === 'done' && <CheckCircle2 size={16} color="var(--success)" />}
                            {res.status === 'error' && <AlertCircle size={16} color="var(--error)" />}
                        </div>

                        {res.status === 'done' && (
                            <div className="stats" style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '0.875rem' }}>
                                <div style={{ flex: 1, padding: '8px', background: 'var(--glass-bg)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>TPS</div>
                                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{res.tps}</div>
                                </div>
                                <div style={{ flex: 1, padding: '8px', background: 'var(--glass-bg)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>TTFT</div>
                                    <div style={{ fontWeight: 700 }}>{res.ttft}s</div>
                                </div>
                            </div>
                        )}

                        <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap'
                        }}>
                            {res.response || (res.status === 'idle' ? 'Ready to test...' : res.status === 'running' ? 'Generating...' : '')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComparisonGrid;
