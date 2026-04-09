# Will Bracken - Cloudflare Portfolio & Agent Environment

Welcome to the central repository for the reconstruction of **willbracken.com** (formerly brackenw3.github.io) and the environment configuration for our local AI agent infrastructure.

## 🌌 Project Vision: Code Galaxy Portfolio

This project is a complete reconstruction of the jaw-dropping, highly interactive portfolio site showcasing my work across the `VSCode_Folders` monorepo and other repositories. 

**Core Aesthetic:**
- **Theme:** Dark / Cyberpunk
- **Palette:** Deep, rich blue tones as the primary backdrop, accented with subtle, striking orange highlights.
- **Experience:** Studio-grade graphics, animations, and cutting-edge 3D visualizers.

**Key Features:**
- **The Code Galaxy:** An interactive 3D WebGL (Three.js) experience allowing users to visualize code updates by volume, language type, and complexity. 
- **Interactive Project Previews:** Graphical, interactive representations of deployed applications, highlighting the skills and scale of work involved.
- **Full-Stack & Dynamic:** Leveraging Cloudflare Pages, Workers, D2, Railway.app, Supabase, and GitHub Actions to keep the visualizer data fresh and cost-optimized.
- **n8n Automations:** Integration with custom n8n deployments for backend data processing and workflow coordination.

---

## 🤖 Local AI Agent Configuration (RTX 4080 + 64GB RAM)

We have engineered custom local LLM setups optimized for an i9 desktop with an RTX 4080 (16GB VRAM) and 64GB of system RAM. These models empower the terminal-based CLI agent with exceptional coding, automation, and multi-modal capabilities.

### 1. Expert Coding Agent (`qwen2.5-coder:32b`)

Hyper-optimized for complex agentic workflows, strict tool-calling, n8n automations, React/Three.js generation, and secure Docker orchestration. 
- **Hardware Profile:** Offloads heavily to the RTX 4080 GPU while utilizing the 64GB system RAM for a massive 32k context window.
- **Enhancements:** Includes custom chat templates, stop tokens (e.g., `Observation:`), and strict temperature settings (0.1) for deterministic, precision tool-calling in the CLI.

**To build and run:**
```bash
ollama create expert-coder -f Modelfile.expert-coder
ollama run expert-coder
```

### 2. Multi-Modal Vision Agent (`llama3.2-vision:11b`)

Fits entirely within the 16GB VRAM of the RTX 4080. Acts as the "eyes" of the environment, parsing static images, UI mockups, and diagrams into structural code and feedback.

**To build and run:**
```bash
ollama create vision-agent -f Modelfile.vision-agent
ollama run vision-agent
```

---

## 🚀 Getting Started

1. **Frontend Development:**
   Navigate to `apps/portfolio` to begin development on the Vite + React TypeScript application.
   ```bash
   cd apps/portfolio
   npm install
   npm run dev
   ```

2. **Security & Best Practices:**
   - **DO NOT** commit API keys, `.env` files, or sensitive credentials. The `.gitignore` is heavily fortified.
   - We utilize Cloudflare Workers, GitHub Models, and local Ollama to balance cloud capabilities with local privacy/cost.

Let's get to work reconstructing the masterpiece!
