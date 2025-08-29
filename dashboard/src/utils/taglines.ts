import { PortHubTagline } from '../types';

export const PORTHUB_TAGLINES: PortHubTagline[] = [
  { text: "Claim Your Port Before Someone Else Does", category: "motivational" },
  { text: "Bind Fast. Bind Often.", category: "snarky" },
  { text: "Where Every Port Gets Action", category: "sleazy" },
  { text: "The Only Hub You Don't Have to Clear Your History For", category: "snarky" },
  { text: "No Conflicts. Just Connections.", category: "professional" },
  { text: "Ports So Open, It's Almost Insecure", category: "sleazy" },
  { text: "We Keep It Clean. Your Services Won't.", category: "snarky" },
  { text: "Come for the Ports. Stay for the Logs.", category: "motivational" },
  { text: "One Registry to Rule Your Runtime", category: "professional" },
  { text: "Get it up. Get it bound. Stay registered.", category: "sleazy" },
  { text: "The Protocol Registry That Parties Responsibly", category: "professional" }
];

export const getRandomTagline = (): PortHubTagline => {
  const randomIndex = Math.floor(Math.random() * PORTHUB_TAGLINES.length);
  return PORTHUB_TAGLINES[randomIndex];
};

export const getTaglineByCategory = (category: PortHubTagline['category']): PortHubTagline => {
  const filtered = PORTHUB_TAGLINES.filter(t => t.category === category);
  if (filtered.length === 0) return getRandomTagline();
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

export const formatTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};
