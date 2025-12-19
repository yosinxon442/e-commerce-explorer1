import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, checkout, clearCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const handleCheckout = () => {
    checkout();
    toast.success('Buyurtma muvaffaqiyatli amalga oshirildi!');
    navigate('/history');
  };

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
              <ShoppingCart className="w-5 h-5 text-primary" />
              Savatcha
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Savatcha bo'sh</h2>
            <p className="text-muted-foreground mb-6">Xarid qilish uchun mahsulotlar qo'shing</p>
            <Link to="/">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Xarid qilishni boshlash
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{cart.length}</span> ta mahsulot
                </p>
                <button
                  onClick={clearCart}
                  className="text-destructive hover:underline text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Hammasini o'chirish
                </button>
              </div>

              {cart.map((item, index) => {
                const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                return (
                  <div
                    key={item.product.id}
                    className="bg-card rounded-2xl border border-border p-4 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex gap-4">
                      <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {item.product.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-primary">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {item.product.discountPercentage > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">Buyurtma xulosasi</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Mahsulotlar ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Yetkazib berish</span>
                    <span className="text-success">Bepul</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
                    <span>Jami</span>
                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
                >
                  Buyurtma berish
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
