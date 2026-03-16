# Local SLM Benchmark Dashboard

A premium, offline-first dashboard for benchmarking and comparing Small Language Models (SLMs) via Ollama.

## Features
- **Real-time Performance Monitoring**: Track Tokens Per Second (TPS), Time To First Token (TTFT), and Latency as the model generates text.
- **Model Comparison Suite**: Compare up to 3 models side-by-side using the same prompt to analyze quality-vs-speed tradeoffs.
- **Privacy-First**: Run everything locally. No API keys, no cloud data transmission.
- **Offline Mode**: Works entirely without an internet connection once models are pulled.

## Prerequisites
1. **Ollama**: Install from [ollama.com](https://ollama.com).
2. **Local Models**: Pull the models you want to benchmark.
   ```bash
   ollama pull phi3
   ollama pull llama3
   ollama pull mistral
   ```

## Getting Started
1. Ensure Ollama is running.
2. Navigate to the project directory:
   ```bash
   cd local-slm
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Benchmark Metrics
- **TPS (Tokens Per Second)**: The speed of word generation after the first token appears.
- **TTFT (Time To First Token)**: The responsiveness of the model (how long you wait before it starts writing).
- **Total Latency**: The complete time from "submit" to "finished".

## Hardware Optimization Tips
- For **Apple Silicon (M1/M2/M3)**: Ensure you have enough Unified Memory for the models you're running.
- For **NVIDIA GPUs**: Models will automatically leverage CUDA if available via Ollama.
- For **CPU only**: Expect lower TPS, especially on larger models like Llama-3 8B.
