export const profile = {
  name: 'Akinwunmi Akinrimisi',
  shortName: 'Akinwunmi',
  monogram: 'AA',
  role: 'Cloud DevOps Engineer · AI Automation Architect',
  location: 'Lagos, Nigeria — working across WAT, GMT and EST',
  availability: 'Available for automation engagements',
  email: 'akinolaakinrimisi@gmail.com',
  linkedin: 'https://www.linkedin.com/in/akinwunmi-akinrimisi-1397a4139/',
  github: 'https://github.com/akinwunmi-akinrimisi?tab=repositories',
  cv: '/Akinwunmi-Akinrimisi-CV.pdf',
  photo: {
    webp640: '/akin-640.webp',
    webp960: '/akin-960.webp',
    webp1280: '/akin-1280.webp',
    jpg: '/akin-960.jpg',
  },
  // The two labels floating beside the hero portrait. Kept short — they sit
  // over the photo edge on narrow screens and wrap badly past ~18 characters.
  photoChips: [
    { icon: 'bolt', label: 'Shipped', value: '40+ workflows' },
    { icon: 'cloud', label: 'AWS', value: 'Certified ×3' },
  ],
  headline: ['I build systems that', 'run the business', 'while you sleep.'],
  headlineAccentLine: 1,
  subline:
    'Five years of AWS infrastructure and CI/CD underneath, AI automation on top. I design the pipelines, agents and workflows that take repetitive work off a team permanently — then hand them over documented, instrumented and running without me.',
} as const

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Cloud', href: '#cloud' },
  { label: 'Process', href: '#process' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const

export const metrics = [
  { value: 4, suffix: '+', label: 'Years engineering on AWS', sub: 'Cloud DevOps since Oct 2021' },
  { value: 40, suffix: '+', label: 'Production automation workflows', sub: 'Running unattended across five systems' },
  { value: 16000, suffix: '+', label: 'Records piped into Supabase', sub: 'Through migration, intact' },
  { value: 121, suffix: '', label: 'Emails in one automated sequence', sub: 'Cohort-gated, self-scheduling' },
] as const

export const flowNodes = ['Trigger', 'Enrich', 'Decide', 'Act', 'Observe'] as const

export type Project = {
  id: string
  index: string
  name: string
  tagline: string
  domain: string
  year: string
  problem: string
  build: string[]
  result: string[]
  stack: string[]
  flow: string[]
}

export const projects: Project[] = [
  {
    id: 'operscale-dossier',
    index: '01',
    name: 'Operscale Dossier',
    tagline: 'A digital product funnel that sells and fulfils itself',
    domain: 'Revenue automation',
    year: '2026',
    problem:
      'A digital product launch needs the entire chain — capture, nurture, sell, deliver, follow up — to run without a person in the loop. Every manual handoff between those steps is a place the launch quietly stops working at 2am.',
    build: [
      'Lead-magnet, sales and post-purchase pages with dynamic price-stepped variants driven off a single query parameter',
      'A 121-email Brevo sequence with a cohort-gated daily sender, so each subscriber advances on their own clock rather than a global one',
      'Paystack checkout → n8n webhook → fulfilment email carrying an unguessable download link, with the order row flipped to paid in the same transaction',
      'Supabase for segment capture and asset storage; GA4 and TikTok click attribution wired through to conversion',
      'Traefik + Docker on a self-managed VPS, sharing infrastructure with three other production stacks',
    ],
    result: [
      'Payment to delivery completes unattended in seconds — no founder involvement in any purchase',
      'A seven-email post-purchase track continues automatically after fulfilment',
      'Price changes propagate from one config to sales page, checkout amount and email templates at once',
    ],
    stack: ['n8n', 'Brevo', 'Paystack', 'Supabase', 'Next.js', 'Docker', 'Traefik', 'GA4'],
    flow: ['Lead magnet', 'Segment capture', '121-email sequence', 'Paystack', 'n8n fulfilment', 'Post-purchase track'],
  },
  {
    id: 'cloudboosta-learning-ops',
    index: '02',
    name: 'Cloudboosta Learning Ops',
    tagline: 'Two training cohorts running on autopilot',
    domain: 'Education operations',
    year: '2025–2026',
    problem:
      'Running a cohort by hand — daily lessons, quizzes, scoring, nudges, progress reports — is survivable once. It does not survive a second concurrent cohort, and it never survives a third.',
    build: [
      'An n8n workflow suite sending daily micro-learning at 07:00 WAT, Monday to Friday, that auto-stops when a syllabus completes',
      'A quiz platform with email-link auto-authentication and a two-track UI, so a student clicks once from their inbox and is already signed in',
      'A Command Center admin dashboard managing four programmes, plus students, quizzes, curriculum and cohorts from one place',
      'Weekly Slack score reports replacing per-event notifications, with every trailing notify node gated behind a single switch',
      'Per-cohort pause and resume controls, used to freeze all student email during a curriculum rewrite without losing sequence position',
    ],
    result: [
      'Cloud Computing and Advanced DevOps tracks run concurrently on the same engine',
      '158 curriculum rows rewritten basics-first and redelivered without a break in cadence',
      'Student Slack noise cut from per-event to one report per cohort per week',
    ],
    stack: ['n8n', 'Supabase', 'React', 'Netlify', 'Resend', 'Slack API', 'PostgreSQL'],
    flow: ['Cohort schedule', 'Daily sender', 'Quiz platform', 'Scoring', 'Slack report', 'Command Center'],
  },
  {
    id: 'ai-voice-sales-agent',
    index: '03',
    name: 'AI Voice Sales Agent',
    tagline: 'A voice agent that qualifies, books and follows up',
    domain: 'Conversational AI',
    year: '2026',
    problem:
      'Discovery and qualification calls consume the most founder hours and the least founder judgement. The conversation is structured, the outcomes are finite, and the follow-up is always the same five emails.',
    build: [
      'A real-time voice agent on Retell with a FastAPI tool layer exposing six live tools, including Cal.com booking and advisory scheduling',
      'Nine n8n workflows behind the agent handling routing, enrichment and post-call orchestration',
      'Supabase holding conversation state so a call can be resumed and audited rather than merely logged',
      'Five Claude-generated email types selected by call outcome, so follow-up matches what was actually said',
      'A React operator console for reviewing calls and intervening when the agent defers',
    ],
    result: [
      'Completed an unassisted eight-minute live sales call with both tools firing correctly mid-conversation',
      'Follow-up email dispatches within the same minute the call ends',
      'Built and entered for the Gemini Live Agent Challenge in the Live Agents category',
    ],
    stack: ['Retell', 'Gemini Live', 'FastAPI', 'Python', 'n8n', 'Supabase', 'Claude', 'React', 'Cal.com'],
    flow: ['Inbound call', 'Live agent', 'Tool calls', 'Cal.com booking', 'Outcome routing', 'AI follow-up'],
  },
  {
    id: 'vision-gridai',
    index: '04',
    name: 'Vision GridAI',
    tagline: 'Content intelligence, from niche discovery to finished script',
    domain: 'Data & AI pipeline',
    year: '2026',
    problem:
      'Deciding what content to make is guesswork dressed as strategy. The research behind one good decision takes hours, and it is the same research every time.',
    build: [
      'Twenty-plus chained n8n workflows spanning niche discovery, topic generation, outlier and SEO scoring, viability reporting and script generation',
      'A Supabase/PostgreSQL schema of 21 tables with a PL/pgSQL render layer that assembles project intelligence at the database, making the handoff between stages structural instead of best-effort',
      'CI-enforced coverage checks so a new stage cannot ship without declaring the intelligence it consumes',
      'Webhook authentication standardised across sixteen-plus workflows after an audit found credential mismatches silently dropping payloads',
    ],
    result: [
      'Seventeen of eighteen planned features shipped across eight sprints',
      'A recurring intelligence-drop bug fixed permanently at the data layer, after four earlier surface fixes had each decayed',
      'Twenty-two structural fixes landed across sixteen workflows from a single systematic audit',
    ],
    stack: ['n8n', 'Supabase', 'PostgreSQL', 'PL/pgSQL', 'Claude', 'Python', 'YouTube Data API'],
    flow: ['Niche discovery', 'Topic generation', 'Outlier + SEO scoring', 'Viability report', 'Script generation'],
  },
  {
    id: 'bridge',
    index: '05',
    name: 'Bridge',
    tagline: 'A sponsor and job intelligence pipeline built to survive its own schema',
    domain: 'Data engineering',
    year: '2026',
    problem:
      'Visa-sponsoring employers and the roles they post live in scattered sources that disagree with each other and change shape without warning. The hard part is not collecting the data — it is migrating it without losing it.',
    build: [
      'A multi-source scraping pipeline landing into Supabase under source-constrained schema checks',
      'A five-register sponsor schema with natural-key indexing, and foreign keys relaxed to ON DELETE SET NULL so a delisted sponsor prunes cleanly instead of cascading',
      'Thirty-two migrations applied against a database with no migration ledger — every change probed for on the live schema first rather than trusted from a filename',
      'Row-level security policies across the table set, with a documented backup and restore drill',
    ],
    result: [
      '16,071 job postings carried intact through schema migration',
      'Snapshot pruning made safe against sponsor delisting',
      'Restore procedure verified against a fresh project, asserting policy count rather than row count — the check that actually catches a broken restore',
    ],
    stack: ['Supabase', 'PostgreSQL', 'Python', 'n8n', 'RLS', 'Management API'],
    flow: ['Multi-source scrape', 'Normalise', 'Supabase load', 'Sponsor register', 'Snapshot prune'],
  },
]

export type Capability = {
  title: string
  summary: string
  evidence: string[]
  tools: string[]
}

export const capabilities: Capability[] = [
  {
    title: 'Infrastructure as Code',
    summary: 'Environments defined in version control, reproducible from nothing.',
    evidence: [
      'Authored a dynamic CloudFormation template that stands up a highly available WordPress environment from scratch — reused across several organisational use cases',
      'Orchestrated a containerised application deployment onto AWS ECS through Terraform Cloud with CI/CD integrated end to end',
    ],
    tools: ['Terraform', 'Terraform Cloud', 'CloudFormation'],
  },
  {
    title: 'CI/CD Pipelines',
    summary: 'Commit to production without a human running a command.',
    evidence: [
      'Built an automated pipeline on Jenkins, ArgoCD, Kubernetes (EKS), Docker and GitHub that redeploys on every code change',
      'Designed a CI/CD pipeline with Terraform, Jenkins and AWS automating provisioning, deployment and networking for a REST API',
      'Delivered AWS CodePipeline, CodeBuild and CodeDeploy workflows for ECS and Fargate services',
    ],
    tools: ['Jenkins', 'ArgoCD', 'CodePipeline', 'CodeBuild', 'CodeDeploy', 'GitHub Actions'],
  },
  {
    title: 'Containers & Orchestration',
    summary: 'Workloads that scale sideways and heal themselves.',
    evidence: [
      'Streamlined a Jenkins pipeline for Dockerised web application deployment with GitHub integration and Terraform-managed infrastructure',
      'Automated build, test, deployment and update on AWS EKS, triggered by repository changes',
    ],
    tools: ['Docker', 'Kubernetes', 'EKS', 'ECS', 'Fargate'],
  },
  {
    title: 'Serverless & Event-Driven',
    summary: 'Decoupled architecture that costs nothing when idle.',
    evidence: [
      'Designed a serverless architecture on SNS, SQS and Lambda to improve system efficiency and scalability under variable load',
      'Automated a deployment pipeline combining AWS CodePipeline with Lambda for release-time orchestration',
    ],
    tools: ['Lambda', 'SNS', 'SQS', 'API Gateway'],
  },
  {
    title: 'Observability',
    summary: 'Silent failure is the enemy. Everything reports.',
    evidence: [
      'Integrated Prometheus and Grafana for real-time monitoring of a Kubernetes cluster, giving reliability and performance insight the pipeline previously lacked',
      'Instrumented production automation so a failed run alerts rather than disappears',
    ],
    tools: ['Prometheus', 'Grafana', 'CloudWatch'],
  },
  {
    title: 'Cost & Delivery',
    summary: 'Architecture decisions defended with numbers.',
    evidence: [
      'Implemented AWS Budgets to track cost and resource consumption precisely across an account',
      'Evaluated and selected infrastructure for a telehealth video conferencing platform, including a full comparative cost study',
      'Served a static site globally through CloudFront for low-latency delivery to overseas users',
    ],
    tools: ['AWS Budgets', 'CloudFront', 'Cost Explorer'],
  },
]

export const process = [
  {
    step: '01',
    title: 'Map',
    body: 'Trace the process as it actually runs, not as the org chart describes it. Where do the hours go, where does it break, and which step is a person doing something a machine should never have asked them to do?',
  },
  {
    step: '02',
    title: 'Model',
    body: 'Design the data and the flow before touching a tool. The decision that matters most: what must be deterministic, and what may an LLM be trusted to judge. Getting that line wrong is what makes AI automation flaky.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'Smallest working path end to end first — one real record, all the way through — then widen. A narrow pipeline that completes beats a broad one that stalls at step four.',
  },
  {
    step: '04',
    title: 'Instrument',
    body: 'Logging, alerting and verification before launch. Every system I have inherited failed silently somewhere; every system I hand over reports its own failures loudly.',
  },
  {
    step: '05',
    title: 'Hand over',
    body: 'Runbooks, dashboards and documentation, so the system belongs to the business rather than to me. If it needs me to keep running, it is not finished.',
  },
] as const

export const toolbelt = [
  {
    group: 'Automation & AI',
    items: ['n8n', 'Claude', 'OpenAI', 'Gemini Live', 'Retell', 'LangChain-style tool routing', 'Webhooks'],
  },
  {
    group: 'Cloud & Infrastructure',
    items: ['AWS', 'Terraform', 'CloudFormation', 'Docker', 'Kubernetes', 'EKS', 'ECS', 'Fargate', 'Lambda', 'Traefik'],
  },
  {
    group: 'CI/CD & Observability',
    items: ['Jenkins', 'ArgoCD', 'GitHub Actions', 'CodePipeline', 'Prometheus', 'Grafana', 'CloudWatch'],
  },
  {
    group: 'Data & Application',
    items: ['Supabase', 'PostgreSQL', 'PL/pgSQL', 'Python', 'FastAPI', 'React', 'TypeScript', 'Next.js', 'Power BI'],
  },
] as const

export const experience = [
  {
    period: 'Oct 2021 — Present',
    role: 'Cloud DevOps Engineer',
    org: 'Cloudboosta Technology Solution',
    points: [
      'Designed and delivered optimised CI/CD pipelines automating build, test and deployment across the organisation',
      'Integrated AWS CodePipeline with Lambda, ECS and Terraform for hands-off release workflows',
      'Built Jenkins and GitHub Actions pipelines deploying Dockerised applications to ECS with Terraform-managed infrastructure',
      'Implemented AWS Budgets for precise cost and resource consumption tracking',
      'Deployed a reusable CloudFormation template provisioning highly available WordPress environments on demand',
      'Delivered the company static site globally via CloudFront for minimal latency to overseas users',
    ],
  },
  {
    period: 'Jun 2021 — Sep 2021',
    role: 'Power BI Developer',
    org: 'Coven Works',
    points: [
      'Analysed a 13-year HR dataset to identify the primary driver of attrition and recommend the strongest recruitment source',
      'Identified the most profitable sales channel, product and stores across a 35-country retail dataset',
      'Surfaced products carrying an unsustainable cost of production from ten years of company data, raising overall profit',
      'Pinpointed the city with the highest year-over-year sales growth across four cities and advised on replicating it',
    ],
  },
  {
    period: 'Sep 2015 — Oct 2019',
    role: 'Technical Operator',
    org: 'Nigeria Bottling Company (Coca-Cola Hellenic Group)',
    points: [
      'Maintained production lines for optimum daily output across the Asejire, Benin and Lagos plants',
      'Implemented and standardised Lean Manufacturing tools on the production lines',
      'Planned and executed production flow sustaining a minimum 85% system line efficiency',
    ],
  },
] as const

export const education = [
  {
    qualification: 'MBA, Fintech & Blockchain',
    org: 'Nexford University',
  },
  {
    qualification: 'B.Sc. Mechanical Engineering — Second Class (Upper)',
    org: 'University of Ibadan, Nigeria',
  },
] as const

export const certifications = [
  { name: 'AWS Solutions Architect — Associate', status: 'Certified' },
  { name: 'AWS Developer — Associate', status: 'Certified' },
  { name: 'AWS DevOps Engineer — Professional', status: 'Certified' },
] as const

export const contact = {
  heading: 'Let us talk about what should be running itself.',
  body: 'Whether that is a cloud platform that needs proper pipelines, or a business process still being run by hand at 8am every morning — tell me what the work looks like and I will tell you honestly whether automation is the answer.',
} as const
