import { Category, Transaction } from '@/types/finance';

export const incomeCategories: Category[] = [
  { id: 'theory', name: 'Տեսություն', type: 'income', icon: '📚' },
  { id: 'theory-online', name: 'Տեսություն օնլայն', type: 'income', icon: '💻' },
  { id: 'driving', name: 'Վարում', type: 'income', icon: '🚗' },
  { id: 'exam', name: 'Քննություն', type: 'income', icon: '📝' },
  { id: 'additional', name: 'Լրացուցիչ ծառայություններ', type: 'income', icon: '⭐' },
];

export const expenseCategories: Category[] = [
  { id: 'rent', name: 'Վարձակալություն', type: 'expense', icon: '🏢' },
  { id: 'salaries', name: 'Աշխատավարձ', type: 'expense', icon: '💰' },
  { id: 'fuel', name: 'Վառելիք', type: 'expense', icon: '⛽' },
  { id: 'maintenance', name: 'Մեքենաների սպասարկում', type: 'expense', icon: '🔧' },
  { id: 'utilities', name: 'Կոմունալ ծառայություններ', type: 'expense', icon: '💡' },
  { id: 'marketing', name: 'Մարքեթինգ', type: 'expense', icon: '📢' },
  { id: 'insurance', name: 'Ապահովագրություն', type: 'expense', icon: '🛡️' },
  { id: 'other', name: 'Այլ ծախսեր', type: 'expense', icon: '📋' },
];

export const transactions: Transaction[] = [
  // Income transactions
  { id: '1', categoryId: 'theory', amount: 45000, description: 'Տեսական դասընթաց - Անուն Ազգանուն', date: '2025-01-15', type: 'income' },
  { id: '2', categoryId: 'theory-online', amount: 35000, description: 'Օնլայն տեսություն - Անուն Ազգանուն', date: '2025-01-14', type: 'income' },
  { id: '3', categoryId: 'driving', amount: 120000, description: 'Վարման դասեր - Անուն Ազգանուն', date: '2025-01-13', type: 'income' },
  { id: '4', categoryId: 'exam', amount: 15000, description: 'Քննական վճար', date: '2025-01-12', type: 'income' },
  { id: '5', categoryId: 'theory', amount: 45000, description: 'Տեսական դասընթաց - Անուն Ազգանուն', date: '2025-01-11', type: 'income' },
  { id: '6', categoryId: 'driving', amount: 120000, description: 'Վարման դասեր - Անուն Ազգանուն', date: '2025-01-10', type: 'income' },
  { id: '7', categoryId: 'additional', amount: 25000, description: 'Լրացուցիչ ծառայություններ', date: '2025-01-09', type: 'income' },
  { id: '8', categoryId: 'theory-online', amount: 35000, description: 'Օնլայն տեսություն - Անուն Ազգանուն', date: '2025-01-08', type: 'income' },
  
  // Expense transactions
  { id: '9', categoryId: 'rent', amount: 300000, description: 'Սրահի վարձակալություն', date: '2025-01-05', type: 'expense' },
  { id: '10', categoryId: 'salaries', amount: 850000, description: 'Աշխատավարձեր - Հունվար', date: '2025-01-05', type: 'expense' },
  { id: '11', categoryId: 'fuel', amount: 125000, description: 'Վառելիք - Հունվար', date: '2025-01-06', type: 'expense' },
  { id: '12', categoryId: 'maintenance', amount: 75000, description: 'Մեքենաների սպասարկում', date: '2025-01-07', type: 'expense' },
  { id: '13', categoryId: 'utilities', amount: 45000, description: 'Կոմունալ վճարներ', date: '2025-01-08', type: 'expense' },
  { id: '14', categoryId: 'marketing', amount: 50000, description: 'Սոցիալական ցանցերում գովազդ', date: '2025-01-09', type: 'expense' },
  { id: '15', categoryId: 'insurance', amount: 180000, description: 'Մեքենաների ապահովագրություն', date: '2025-01-10', type: 'expense' },
  { id: '16', categoryId: 'other', amount: 30000, description: 'Գրասենյակային պիտույքներ', date: '2025-01-11', type: 'expense' },
];
