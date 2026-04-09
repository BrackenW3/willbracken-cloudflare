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

**Storage Note:** To save space on the internal drive, configure Ollama to store its model weights (`.ollama/models`) on your fast external Thunderbolt/USB4 SSD. 

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

## The "Plug-and-Play" Cloud-to-Local Bridge

Because your n8n instance is already hosted in the cloud (`n8n.willbracken.com`), it handles all the lightweight orchestration, webhooks, API connections, and scheduling. It delegates the heavy compute (LLM inference, Vision processing) down to your local hardware.

**How it works seamlessly:**
1. Your cloud n8n is permanently configured to point its Ollama/AI nodes to your specific Cloudflare Tunnel URL.
2. The model weights live entirely on the local drives (Desktop NVMe or MacBook external SSD) avoiding massive cloud storage costs.
3. When you switch machines, you simply plug in your drive (if on Mac), ensure Ollama is running, and spin up the Cloudflare Tunnel daemon.
4. **Zero Configuration Change Required:** n8n sends a prompt down the tunnel, your local machine crunches the numbers on the GPU, and sends the payload back to the cloud. What can be run in the cloud stays in the cloud; what requires heavy local resources runs locally.
