import { TechStackPreferences } from "./types";

export interface CostBreakdownItem {
  resource: string;
  category: "Compute" | "Database" | "Caching" | "Networking & CDN" | "Storage & Monitoring";
  spec: string;
  monthlyCostUSD: number;
}

export interface EstimatedCloudCost {
  totalMonthlyUSD: number;
  currency: string;
  breakdown: CostBreakdownItem[];
  costOptimizationTips: string[];
}

export function estimateCloudArchitectureCost(
  techStack: TechStackPreferences,
  estimatedRPS: number = 2500
): EstimatedCloudCost {
  const breakdown: CostBreakdownItem[] = [];

  // Compute Layer
  if (techStack.deployment.toLowerCase().includes("kubernetes") || techStack.deployment.toLowerCase().includes("eks")) {
    breakdown.push({
      resource: "EKS Managed Control Plane + 3x t4g.xlarge Node Pool",
      category: "Compute",
      spec: "4 vCPU, 16GB RAM per node (Auto-scaling 2-8 nodes)",
      monthlyCostUSD: 148.50
    });
  } else {
    breakdown.push({
      resource: "AWS ECS Fargate / Cloud Run Serverless Containers",
      category: "Compute",
      spec: "2 vCPU, 4GB RAM (Auto-scaling 1-6 tasks)",
      monthlyCostUSD: 64.00
    });
  }

  // Database Layer
  if (techStack.database.toLowerCase().includes("cockroach") || techStack.database.toLowerCase().includes("distributed")) {
    breakdown.push({
      resource: "Managed CockroachDB Dedicated Cluster (Multi-AZ)",
      category: "Database",
      spec: "3 Nodes, 2 vCPU, 8GB RAM, 100GB NVMe SSD",
      monthlyCostUSD: 195.00
    });
  } else {
    breakdown.push({
      resource: "AWS RDS PostgreSQL 16 (Multi-AZ with Read Replica)",
      category: "Database",
      spec: "db.t4g.large, 50GB Provisioned GP3 Storage, Automated Backups",
      monthlyCostUSD: 86.40
    });
  }

  // Caching & Redis Layer
  if (techStack.caching.toLowerCase().includes("redis") || techStack.caching.toLowerCase().includes("cluster")) {
    breakdown.push({
      resource: "Amazon ElastiCache Redis Cluster (Multi-AZ)",
      category: "Caching",
      spec: "cache.t4g.medium (2 nodes with automatic failover)",
      monthlyCostUSD: 42.80
    });
  }

  // Ingress, CDN & WAF
  breakdown.push({
    resource: "AWS Application Load Balancer (ALB) + Cloudflare Edge CDN",
    category: "Networking & CDN",
    spec: "Global Anycast routing, DDoS Layer 7 protection, TLS termination",
    monthlyCostUSD: 24.50
  });

  // Storage & Telemetry Monitoring
  breakdown.push({
    resource: "Amazon S3 Encrypted Storage + CloudWatch / Prometheus Logging",
    category: "Storage & Monitoring",
    spec: "250GB hot storage, 5M API logs/month, 90-day retention",
    monthlyCostUSD: 18.20
  });

  const totalMonthlyUSD = breakdown.reduce((sum, item) => sum + item.monthlyCostUSD, 0);

  const tips: string[] = [
    "Leverage AWS Savings Plans or 1-Year Reserved Instances on database nodes to save ~38%.",
    "Utilize Cloudflare CDN edge caching to offload up to 70% of static API reads from compute nodes.",
    "Implement automated dev/staging environment auto-shutdown during non-working hours to save ~$60/mo."
  ];

  return {
    totalMonthlyUSD: Math.round(totalMonthlyUSD * 100) / 100,
    currency: "USD",
    breakdown,
    costOptimizationTips: tips
  };
}
