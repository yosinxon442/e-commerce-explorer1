import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, LogIn, LogOut, Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useProducts, addProduct, updateProduct, deleteProduct } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Admin = () => {
  const { isAdmin, login, logout } = useApp();
  const { data: productsData, isLoading, refetch } = useProducts(100);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    category: '',
    brand: '',
    stock: '',
    thumbnail: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setEmail('');
      setPassword('');
      setLoginError('');
      toast.success('Muvaffaqiyatli kirdingiz!');
    } else {
      setLoginError('Email yoki parol noto\'g\'ri');
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Chiqish amalga oshirildi');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      discountPercentage: '',
      category: '',
      brand: '',
      stock: '',
      thumbnail: '',
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      discountPercentage: product.discountPercentage.toString(),
      category: product.category,
      brand: product.brand || '',
      stock: product.stock.toString(),
      thumbnail: product.thumbnail,
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        thumbnail: formData.thumbnail,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Mahsulot yangilandi!');
      } else {
        await addProduct(productData);
        toast.success('Mahsulot qo\'shildi!');
      }

      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu mahsulotni o\'chirmoqchimisiz?')) return;

    try {
      await deleteProduct(id);
      toast.success('Mahsulot o\'chirildi!');
      refetch();
    } catch (error) {
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Orqaga</span>
              </Link>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Admin Panel
              </h1>
              <div className="w-20" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Admin Kirish</h2>
                <p className="text-muted-foreground mt-2">Admin paneliga kirish uchun ma'lumotlaringizni kiriting</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Parol</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                    required
                  />
                </div>

                {loginError && (
                  <p className="text-destructive text-sm">{loginError}</p>
                )}

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Kirish
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Admin Panel
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add Product Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Mahsulotlar boshqaruvi</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Nomi *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Tavsif *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Narx ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Chegirma (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      step="0.1"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategoriya *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brend</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stock">Omborda *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail">Rasm URL *</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingProduct ? 'Yangilash' : 'Qo\'shish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Rasm</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Nomi</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Kategoriya</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Narx</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Ombor</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productsData?.products.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="p-4">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground line-clamp-1">{product.title}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground capitalize">{product.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="p-4">
                        <span className={product.stock > 0 ? 'text-success' : 'text-destructive'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
