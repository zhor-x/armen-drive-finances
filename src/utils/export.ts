import { Transaction, Category } from '@/types/finance';
import { format } from 'date-fns';

export const exportToCSV = (
  transactions: Transaction[],
  categories: Category[],
  filename: string = 'գործարքներ.csv'
) => {
  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  const headers = ['Ամսաթիվ', 'Կատեգորիա', 'Գումար', 'Նկարագրություն', 'Տիպ'];
  
  const rows = transactions.map(t => {
    const category = getCategoryById(t.categoryId);
    return [
      format(new Date(t.date), 'dd/MM/yyyy'),
      category?.name || '',
      t.amount.toString(),
      t.description || '',
      t.type === 'income' ? 'Եկամուտ' : 'Ծախս'
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};