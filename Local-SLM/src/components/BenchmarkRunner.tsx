"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Clock, Activity, ShieldCheck } from 'lucide-react';
import MetricsCard from './MetricsCard';

interface BenchmarkResult {
    model: string;
    tokensPerSecond: number;
    totalLatency: number;
    ttft: number; // Time To First Token
    totalTokens: number;
    response: string;
}

const BenchmarkRunner = () => {
    const [prompt, setPrompt] = useState("Explain the concept of quantum entanglement in simple terms.");
    const [isBenchmarking, setIsBenchmarking] = useState(false);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [currentResult, setCurrentResult] = useState<BenchmarkResult | null>(null);
    const [liveResponse, setLiveResponse] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Stats refs for real-time tracking
    const startTimeRef = useRef<number>(0);
    const firstTokenTimeRef = useRef<number>(0);
    const tokenCountRef = useRef<number>(0);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            const data = await response.json();
            const models = data.models.map((m: any) => m.name);
            setAvailableModels(models);
            if (models.length > 0) setSelectedModel(models[0]);
        } catch (err) {
            console.error("Failed to fetch models:", err);
            setError("Ollama not detected. Please ensure Ollama is running locally on port 11434.");
        }
    };

    const runBenchmark = async () => {
        if (!selectedModel) return;

        setIsBenchmarking(true);
        setLiveResponse("");
        setCurrentResult(null);
        setError(null);

        startTimeRef.current = performance.now();
        firstTokenTimeRef.current = 0;
        tokenCountRef.current = 0;

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    prompt: prompt,
                    stream: true,
                }),
            });

            if (!response.body) throw new Error("No response body");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let fullResponse = "";

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
                            if (tokenCountRef.current === 0) {
                                firstTokenTimeRef.current = performance.now();
                            }
                            tokenCountRef.current += 1;
                            fullResponse += json.response;
                            setLiveResponse(fullResponse);
                        }
                        if (json.done) {
                            const endTime = performance.now();
                            const totalLatency = (endTime - startTimeRef.current) / 1000;
                            const ttft = (firstTokenTimeRef.current - startTimeRef.current) / 1000;
                            const tps = tokenCountRef.current / (totalLatency - ttft);

                            setCurrentResult({
                                model: selectedModel,
                                tokensPerSecond: parseFloat(tps.toFixed(2)),
                                totalLatency: parseFloat(totalLatency.toFixed(2)),
                                ttft: parseFloat(ttft.toFixed(2)),
                                totalTokens: tokenCountRef.current,
                                response: fullResponse
                            });
                        }
                    } catch (e) {
                        // Partial JSON chunk, wait for next
                    }
                }
            }
        } catch (err) {
            console.error("Benchmark failed:", err);
            setError("Failed to connect to Ollama. Make sure the model is pulled and running.");
        } finally {
            setIsBenchmarking(false);
        }
    };

    return (
        <div className="benchmark-container">
            <div className="card" style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                        SELECT LOCAL MODEL
                    </label>
                    <div className="flex-center" style={{ gap: '16px', justifyContent: 'flex-start' }}>
                        <select
                            className="glass"
                            style={{ padding: '12px', borderRadius: '12px', flex: 1, color: 'white', border: '1px solid var(--glass-border)' }}
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={isBenchmarking}
                        >
                            {availableModels.length > 0 ? (
                                availableModels.map(model => <option key={model} value={model}>{model}</option>)
                            ) : (
                                <option value="">No models found...</option>
                            )}
                        </select>
                        <button className="btn btn-outline" onClick={fetchModels} disabled={isBenchmarking}>
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                        BENCHMARK PROMPT
                    </label>
                    <textarea
                        className="glass"
                        style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '16px', color: 'white', border: '1px solid var(--glass-border)', resize: 'vertical' }}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isBenchmarking}
                    />
                </div>

                <div className="flex-between">
                    <div className="flex-center" style={{ gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <ShieldCheck size={16} color="var(--success)" />
                        <span>100% Private • Offline Execution</span>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={runBenchmark}
                        disabled={isBenchmarking || !selectedModel}
                        style={{ minWidth: '180px' }}
                    >
                        {isBenchmarking ? <Activity className="animate-pulse" size={18} /> : <Play size={18} />}
                        {isBenchmarking ? "BENCHMARKING..." : "RUN BENCHMARK"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="card" style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)', marginBottom: '32px' }}>
                    <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>
                </div>
            )}

            {(isBenchmarking || liveResponse) && (
                <div className="benchmark-results animate-fade-in">
                    <div className="flex-center" style={{ gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
                        <MetricsCard
                            label="TOKENS / SEC"
                            value={currentResult ? currentResult.tokensPerSecond : (tokenCountRef.current / (((performance.now() - startTimeRef.current) / 1000) || 1)).toFixed(2)}
                            unit="tokens"
                            icon={<Zap size={20} />}
                            description="Generation throughput"
                        />
                        <MetricsCard
                            label="TTFT"
                            value={currentResult ? currentResult.ttft : (firstTokenTimeRef.current > 0 ? (firstTokenTimeRef.current - startTimeRef.current) / 1000 : 0).toFixed(2)}
                            unit="sec"
                            icon={<Clock size={20} />}
                            description="Time to first token"
                        />
                        <MetricsCard
                            label="TOTAL LATENCY"
                            value={currentResult ? currentResult.totalLatency : ((performance.now() - startTimeRef.current) / 1000).toFixed(2)}
                            unit="sec"
                            icon={<Activity size={20} />}
                            description="Total execution time"
                        />
                    </div>

                    <div className="card">
                        <div className="flex-between" style={{ marginBottom: '16px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>MODEL RESPONSE</span>
                            <span className="badge badge-warning">{selectedModel}</span>
                        </div>
                        <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>
                            {liveResponse}
                            {isBenchmarking && <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '16px', background: 'var(--primary)', marginLeft: '4px' }}></span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BenchmarkRunner;
