import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useApp();

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
              <Heart className="w-5 h-5 text-wishlist" />
              Sevimlilar
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-wishlist/10 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-wishlist" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sevimlilar ro'yxati bo'sh</h2>
            <p className="text-muted-foreground mb-6">Mahsulotlarni sevimlilaringizga qo'shing</p>
            <Link to="/">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Xarid qilishni boshlash
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{wishlist.length}</span> ta mahsulot
              </p>
              <button
                onClick={() => wishlist.forEach(p => removeFromWishlist(p.id))}
                className="text-destructive hover:underline text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Hammasini o'chirish
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {wishlist.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
