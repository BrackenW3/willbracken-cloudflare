export const PROJECTS_DATA = {
  'ms-teams-export': {
    id: 'ms-teams-export',
    title: 'MS Teams Export & Analysis',
    description: 'A powerful utility to extract, parse, and analyze Microsoft Teams chat histories. Built to handle massive JSON exports from Microsoft Compliance Center, transforming them into readable, searchable, and analytically valuable datasets.',
    tags: ['Python', 'Data Engineering', 'Pandas', 'CLI'],
    features: [
      'Parses complex nested JSON structures from Microsoft Teams exports',
      'Transforms unstructured chat data into structured relational tables',
      'Optimized for large-scale datasets (tested on 10GB+ exports)',
      'Generates interactive analytics reports of communication patterns'
    ],
    githubUrl: 'https://github.com/brackenw3/ms-teams-export',
    demoType: 'terminal', // Simulates a terminal execution
    primaryColor: '#10b981' // Emerald
  },
  'snowflake-streamlit': {
    id: 'snowflake-streamlit',
    title: 'Snowflake AI Data App',
    description: 'An interactive Streamlit application deployed directly within Snowflake. It leverages Snowpark for high-performance data processing and integrates Cortex AI for natural language querying over massive enterprise datasets.',
    tags: ['Python', 'Streamlit', 'Snowflake', 'Snowpark', 'AI/ML'],
    features: [
      'Native deployment within Snowflake using Streamlit in Snowflake (SiS)',
      'Zero data movement architecture - compute is brought to the data',
      'Natural Language to SQL utilizing Snowflake Cortex LLMs',
      'Interactive forecasting and anomaly detection visualizations'
    ],
    githubUrl: 'https://github.com/brackenw3/snowflake-streamlit',
    demoType: 'dashboard', // Simulates a dashboard UI
    primaryColor: '#3b82f6' // Cyber Blue
  },
  'ai-vision': {
    id: 'ai-vision',
    title: 'AI Vision Architecture',
    description: 'A cutting-edge computer vision pipeline utilizing local multi-modal LLMs (llama3.2-vision) to parse, understand, and extract structural data from complex visual inputs, user interfaces, and architectural diagrams.',
    tags: ['Python', 'PyTorch', 'Ollama', 'Multi-Modal', 'Computer Vision'],
    features: [
      'Real-time inference running completely locally on RTX 4080 (16GB VRAM)',
      'Translates raw UI screenshots into structural React component code',
      'Integrated via API for automated n8n workflow processing',
      'Agnostic vision-to-text pipeline with deterministic JSON outputs'
    ],
    githubUrl: 'https://github.com/brackenw3/ai-vision',
    demoType: 'vision', // Simulates vision processing
    primaryColor: '#ff6b00' // Cyber Orange
  }
};
