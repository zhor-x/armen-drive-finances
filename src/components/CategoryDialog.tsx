import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types/finance';
import { FolderPlus } from 'lucide-react';

interface CategoryDialogProps {
  onAdd: (category: Omit<Category, 'id'>) => void;
  type: 'income' | 'expense';
}

const emojiOptions = ['📚', '💻', '🚗', '📝', '⭐', '🏢', '💰', '⛽', '🔧', '💡', '📢', '🛡️', '📋', '🎯', '🏆', '💼', '📊'];

export const CategoryDialog = ({ onAdd, type }: CategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📋',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd({
      name: formData.name,
      icon: formData.icon,
      type,
    });

    setFormData({ name: '', icon: '📋' });
    setOpen(false);
  };

  const title = type === 'income' ? 'Նոր եկամտի կատեգորիա' : 'Նոր ծախսի կատեգորիա';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderPlus className="mr-2 h-4 w-4" />
          Նոր կատեգորիա
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Անվանում</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Մուտքագրեք կատեգորիայի անվանումը"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Պատկերակ</Label>
            <div className="grid grid-cols-9 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`p-2 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                    formData.icon === emoji ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Ստեղծել
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
