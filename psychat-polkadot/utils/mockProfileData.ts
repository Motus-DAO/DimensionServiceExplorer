export interface MockPsychologist {
  id: string;
  name: string;
  specialty: string;
  sessionCount: number;
  lastSession: string;
  rating: number;
  isVerified: boolean;
}

export interface MockPayment {
  id: string;
  date: string;
  amount: number;
  currency: 'PSY' | 'rUSD';
  type: 'data_sale' | 'yield_farming' | 'ubi_claim';
  description: string;
  transactionHash: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface MockYieldPosition {
  id: string;
  protocol: string;
  pool: string;
  amount: number;
  apy: number;
  currency: string;
  isActive: boolean;
  autoCompound: boolean;
}

export const mockPsychologists: MockPsychologist[] = [
  {
    id: 'psych_1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cognitive Behavioral Therapy',
    sessionCount: 12,
    lastSession: '2024-01-15',
    rating: 4.9,
    isVerified: true,
  },
  {
    id: 'psych_2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Trauma & PTSD Treatment',
    sessionCount: 8,
    lastSession: '2024-01-10',
    rating: 4.8,
    isVerified: true,
  },
  {
    id: 'psych_3',
    name: 'Dr. Emily Watson',
    specialty: 'Anxiety & Depression',
    sessionCount: 15,
    lastSession: '2024-01-18',
    rating: 4.9,
    isVerified: true,
  },
];

export const mockPayments: MockPayment[] = [
  {
    id: 'pay_1',
    date: '2024-01-18',
    amount: 2.5,
    currency: 'PSY',
    type: 'data_sale',
    description: 'Therapy session dataset sale',
    transactionHash: '5KJp7Kqj8Lp9Mq0Nr1Os2Pt3Qu4Rv5Sw6Tx7Uy8Vz9Wx0Yy1Zz2Aa3Bb4Cc5Dd6Ee7Ff8Gg9Hh0Ii1Jj2Kk3Ll4Mm5Nn6Oo7Pp8Qq9Rr0Ss1Tt2Uu3Vv4Ww5Xx6Yy7Zz8',
    status: 'completed',
  },
  {
    id: 'pay_2',
    date: '2024-01-15',
    amount: 45.2,
    currency: 'rUSD',
    type: 'data_sale',
    description: 'Anonymized insights dataset',
    transactionHash: '3Ff8Gg9Hh0Ii1Jj2Kk3Ll4Mm5Nn6Oo7Pp8Qq9Rr0Ss1Tt2Uu3Vv4Ww5Xx6Yy7Zz8Aa9Bb0Cc1Dd2Ee3Ff4Gg5Hh6Ii7Jj8Kk9Ll0Mm1Nn2Oo3Pp4Qq5Rr6Ss7Tt8Uu9Vv0Ww1Xx2Yy3Zz4',
    status: 'completed',
  },
  {
    id: 'pay_3',
    date: '2024-01-12',
    amount: 1.8,
    currency: 'PSY',
    type: 'yield_farming',
    description: 'Raydium PSY-rUSD pool rewards',
    transactionHash: '7Zz8Aa9Bb0Cc1Dd2Ee3Ff4Gg5Hh6Ii7Jj8Kk9Ll0Mm1Nn2Oo3Pp4Qq5Rr6Ss7Tt8Uu9Vv0Ww1Xx2Yy3Zz4Aa5Bb6Cc7Dd8Ee9Ff0Gg1Hh2Ii3Jj4Kk5Ll6Mm7Nn8Oo9Pp0Qq1Rr2Ss3Tt4Uu5Vv6Ww7Xx8Yy9Zz0',
    status: 'completed',
  },
  {
    id: 'pay_4',
    date: '2024-01-10',
    amount: 12.5,
    currency: 'rUSD',
    type: 'ubi_claim',
    description: 'Universal Basic Income claim',
    transactionHash: '9Bb0Cc1Dd2Ee3Ff4Gg5Hh6Ii7Jj8Kk9Ll0Mm1Nn2Oo3Pp4Qq5Rr6Ss7Tt8Uu9Vv0Ww1Xx2Yy3Zz4Aa5Bb6Cc7Dd8Ee9Ff0Gg1Hh2Ii3Jj4Kk5Ll6Mm7Nn8Oo9Pp0Qq1Rr2Ss3Tt4Uu5Vv6Ww7Xx8Yy9Zz0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6',
    status: 'completed',
  },
  {
    id: 'pay_5',
    date: '2024-01-08',
    amount: 0.8,
    currency: 'PSY',
    type: 'data_sale',
    description: 'Mental health insights dataset',
    transactionHash: '1Dd2Ee3Ff4Gg5Hh6Ii7Jj8Kk9Ll0Mm1Nn2Oo3Pp4Qq5Rr6Ss7Tt8Uu9Vv0Ww1Xx2Yy3Zz4Aa5Bb6Cc7Dd8Ee9Ff0Gg1Hh2Ii3Jj4Kk5Ll6Mm7Nn8Oo9Pp0Qq1Rr2Ss3Tt4Uu5Vv6Ww7Xx8Yy9Zz0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6Aa7Bb8Cc9Dd0Ee1Ff2Gg3Hh4Ii5Jj6Kk7Ll8Mm9Nn0Oo1Pp2Qq3Rr4Ss5Tt6Uu7Vv8Ww9Xx0Yy1Zz2',
    status: 'completed',
  },
];

export const mockYieldPositions: MockYieldPosition[] = [
  {
    id: 'yield_1',
    protocol: 'Raydium',
    pool: 'PSY-rUSD',
    amount: 5.2,
    apy: 15.2,
    currency: 'PSY',
    isActive: true,
    autoCompound: true,
  },
  {
    id: 'yield_2',
    protocol: 'Forward Industries',
    pool: 'Treasury Pool',
    amount: 120.5,
    apy: 12.8,
    currency: 'rUSD',
    isActive: true,
    autoCompound: true,
  },
  {
    id: 'yield_3',
    protocol: 'MotusDAO',
    pool: '$PSYC Staking',
    amount: 2.1,
    apy: 18.5,
    currency: 'PSYC',
    isActive: true,
    autoCompound: false,
  },
];

export function generateMockDatasetNFTs(count: number = 5) {
  const categories = ['anxiety', 'depression', 'stress', 'trauma', 'general'];
  const nfts = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    nfts.push({
      id: `dataset_${i + 1}`,
      sessionId: `session_${Date.now()}_${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      messageCount: Math.floor(Math.random() * 20) + 5,
      date: date.toISOString().split('T')[0],
      walrusCid: `walrus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mintAddress: `mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isListed: Math.random() > 0.5,
      price: Math.random() * 5 + 0.5,
    });
  }
  
  return nfts;
}
