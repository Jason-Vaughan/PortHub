// PortHub Banner Utility
// "Vegas LED porn studio meets 1998 hacking console"

import chalk from 'chalk';

const taglines = [
  "Claim Your Port Before Someone Else Does",
  "Bind Fast. Bind Often.",
  "Where Every Port Gets Action",
  "The Only Hub You Don't Have to Clear Your History For",
  "No Conflicts. Just Connections.",
  "Ports So Open, It's Almost Insecure",
  "We Keep It Clean. Your Services Won't.",
  "Come for the Ports. Stay for the Logs.",
  "One Registry to Rule Your Runtime"
];

export function showBanner(): void {
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];
  
  console.log('\n');
  console.log(chalk.hex('#FF9900')('██████╗  ██████╗ ██████╗ ████████╗██╗  ██╗██╗   ██╗██████╗ '));
  console.log(chalk.hex('#FF9900')('██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██║  ██║██║   ██║██╔══██╗'));
  console.log(chalk.hex('#FF9900')('██████╔╝██║   ██║██████╔╝   ██║   ███████║██║   ██║██████╔╝'));
  console.log(chalk.hex('#FF9900')('██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║   ██║██╔══██╗'));
  console.log(chalk.hex('#FF9900')('██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║╚██████╔╝██████╔╝'));
  console.log(chalk.hex('#FF9900')('╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ '));
  console.log('\n');
  console.log(chalk.hex('#FF9900')('The Protocol Registry That Parties Responsibly'));
  console.log(chalk.gray(`"${tagline}"`));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('\n');
}

export function showPortCategory(category: string): string {
  const emojis: Record<string, string> = {
    'nubiles': '🍒',
    'milfs': '🍑', 
    'gmilfs': '🥵',
    'trampstamps': '💋',
    'bindstormers': '⚡',
    'fluffers': '🧼'
  };
  
  return `${emojis[category] || '🔌'} ${category}`;
}

export function showStatus(status: string): string {
  const statusMap: Record<string, { emoji: string; color: string }> = {
    'active': { emoji: '🍆', color: '#00FF00' },
    'expired': { emoji: '💀', color: '#FF0000' },
    'conflict': { emoji: '⚠️', color: '#FF9900' },
    'ghost': { emoji: '👻', color: '#800080' }
  };
  
  const statusInfo = statusMap[status] || { emoji: '❓', color: '#808080' };
  return chalk.hex(statusInfo.color)(`${statusInfo.emoji} ${status}`);
}
