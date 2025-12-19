import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, Package } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const History = () => {
  const { purchaseHistory } = useApp();

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
              <HistoryIcon className="w-5 h-5 text-primary" />
              Xaridlar tarixi
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {purchaseHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Tarix bo'sh</h2>
            <p className="text-muted-foreground mb-6">Siz hali xarid qilmagansiz</p>
            <Link to="/">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Xarid qilishni boshlash
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {purchaseHistory.map((purchase, index) => (
              <div
                key={purchase.id}
                className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="bg-secondary p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Buyurtma raqami</p>
                    <p className="font-mono font-bold text-foreground">#{purchase.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sana</p>
                    <p className="font-medium text-foreground">
                      {new Date(purchase.date).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jami</p>
                    <p className="font-bold text-primary text-lg">${purchase.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="p-4 space-y-3">
                  {purchase.products.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <Link to={`/product/${item.product.id}`}>
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
