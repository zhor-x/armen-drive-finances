import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, Transaction } from '@/types/finance';
import { Plus } from 'lucide-react';

interface TransactionDialogProps {
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  type: 'income' | 'expense';
  editMode?: boolean;
  initialData?: Transaction;
  onClose?: () => void;
}

export const TransactionDialog = ({ categories, onAdd, type, editMode, initialData, onClose }: TransactionDialogProps) => {
  const [open, setOpen] = useState(editMode || false);
  const [formData, setFormData] = useState(initialData ? {
    categoryId: initialData.categoryId,
    amount: initialData.amount.toString(),
    description: initialData.description || '',
    date: initialData.date,
  } : {
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    onAdd({
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      type,
    });

    if (!editMode) {
      setFormData({
        categoryId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(false);
    if (onClose) onClose();
  };

  const buttonVariant = type === 'income' ? 'default' : 'destructive';
  const title = editMode 
    ? (type === 'income' ? 'Խմբագրել եկամուտը' : 'Խմբագրել ծախսը')
    : (type === 'income' ? 'Ավելացնել եկամուտ' : 'Ավելացնել ծախս');

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen && onClose) onClose();
    }}>
      {!editMode && (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {title}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Կատեգորիա</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Ընտրեք կատեգորիա" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Գումար (AMD)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Ամսաթիվ</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Լրացուցիչ տեղեկություն..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" variant={buttonVariant}>
            {editMode ? 'Պահպանել' : 'Ավելացնել'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
