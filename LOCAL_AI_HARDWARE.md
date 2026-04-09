# Local AI Hardware Optimization Guide

This document outlines the specific Ollama model recommendations, Modelfile parameters, and deployment strategies for your distinct local hardware profiles. This ensures a "plug and play" experience when shifting development between your high-end desktop and your MacBook Pro, while your cloud n8n instance (`n8n.willbracken.com`) handles the orchestration.

## 1. High-End Desktop (i9 CPU, RTX 4080 16GB VRAM, 64GB System RAM)

This is your primary powerhouse. The goal here is to run large, highly capable models (32B+) by offloading as much as possible to the 16GB VRAM, and letting the massive 64GB of system RAM handle the remaining layers and a huge context window.

### Recommended Models
* **Expert Coder:** `qwen2.5-coder:32b`
  * *Why:* It's the current state-of-the-art for open-weight coding. At 32B parameters (Q4_K_M quantization), it requires ~20GB of total memory. It will offload ~12-14GB to your RTX 4080 and use ~6-8GB of your 64GB system RAM. It will be incredibly fast and near GPT-4 level.
* **Multi-Modal / Vision:** `llama3.2-vision:11b`
  * *Why:* Fits entirely inside the 16GB VRAM of the RTX 4080. Blistering fast inference for analyzing screenshots and architectures.

### Optimal Modelfile Parameters (RTX 4080)
```dockerfile
# Offload maximum layers to GPU
PARAMETER num_gpu 99
# Leverage the 64GB system RAM for massive context
PARAMETER num_ctx 32768
# Strict precision for coding
PARAMETER temperature 0.1
```

---

## 2. Apple Silicon (MacBook Pro M3 Pro, 18GB Unified Memory)

Apple's Unified Memory architecture is incredible because the GPU and CPU share the same pool. However, with 18GB total, we must leave ~4-6GB for macOS and background apps. Our absolute hard limit for LLM memory footprint is ~12GB.

### Recommended Models
* **Expert Coder:** `qwen2.5-coder:14b` (or `deepseek-coder-v2:16b-lite`)
  * *Why:* A 14B model at Q4_K_M quantization takes about 8.5GB of RAM. This leaves plenty of headroom for an 8k context window and OS operations without paging to swap (which kills performance). It is still exceptionally smart for agentic tasks.
* **Multi-Modal / Vision:** `llava:8b` (or keep `llama3.2-vision:11b` but with small context)
  * *Why:* `llava:8b` only requires ~5GB of RAM, leaving ample room on the M3 Pro.

### Optimal Modelfile Parameters (M3 Pro)
```dockerfile
# Metal API utilizes unified memory, setting to 99 offloads fully to Apple Silicon GPU
PARAMETER num_gpu 99
# Constrain context to prevent out-of-memory (OOM) swapping to the SSD
PARAMETER num_ctx 8192
# Strict precision for coding
PARAMETER temperature 0.1
```

---

## 3. Mid-Range Windows Laptop (i7 CPU, RTX 3050 4GB VRAM)

This is the least priority machine. With only 4GB of VRAM, we must use heavily quantized, smaller parameter models, relying mostly on CPU for generation.

### Recommended Models
* **Expert Coder:** `qwen2.5-coder:7b`
  * *Why:* Fits entirely in ~4.5GB. Some layers will go to the 3050, the rest to system RAM.
* **General Tasking:** `llama3.1:8b`

### Optimal Modelfile Parameters (RTX 3050)
```dockerfile
# Only partially offload to prevent VRAM overflow
PARAMETER num_gpu 20
PARAMETER num_ctx 4096
PARAMETER temperature 0.1
```

---

## Connecting Railway n8n to Local AI

Since your n8n instance is hosted in the cloud (`n8n.willbracken.com`), it cannot reach `localhost:11434` directly. 

**The Solution: Cloudflare Tunnels**
1. Install `cloudflared` on whichever local machine you are currently using.
2. Run a tunnel exposing port `11434`:
   ```bash
   cloudflared tunnel --url http://localhost:11434
   ```
3. Update your n8n Ollama Node credentials to point to the secure Cloudflare Tunnel URL (e.g., `https://ai-node.willbracken.com`). 

When you switch from your Desktop to your MacBook, simply spin up the Docker container (`docker-compose up -d`) and start the tunnel. Your cloud n8n instance will instantly connect to whichever local machine you are actively using!
