import React, { useState, useMemo } from 'react';
import { Loader2, Package } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useProducts, useCategories, useSearchProducts, useProductsByCategory } from '@/hooks/useProducts';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: allProductsData, isLoading: isLoadingProducts } = useProducts(100);
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: searchData, isLoading: isSearching } = useSearchProducts(searchQuery);
  const { data: categoryData, isLoading: isLoadingCategory } = useProductsByCategory(selectedCategory || '');

  const products = useMemo(() => {
    if (searchQuery) {
      return searchData?.products || [];
    }
    if (selectedCategory) {
      return categoryData?.products || [];
    }
    return allProductsData?.products || [];
  }, [searchQuery, searchData, selectedCategory, categoryData, allProductsData]);

  const isLoading = isLoadingProducts || isSearching || isLoadingCategory;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Section */}
        <section className="mb-5 sm:mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Xush kelibsiz, <span className="text-gradient">MarketPlus</span>ga!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl">
              Eng yaxshi mahsulotlarni qulay narxlarda toping. Tez yetkazib berish va kafolatlangan sifat.
            </p>
          </div>
        </section>

        {/* Categories */}
        {!isLoadingCategories && categories.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </section>
        )}

        {/* Products Grid */}
        <section>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Mahsulotlar yuklanmoqda...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">Mahsulotlar topilmadi</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary hover:underline"
                >
                  Qidiruvni tozalash
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-sm sm:text-base text-muted-foreground">
                  <span className="font-semibold text-foreground">{products.length}</span> ta mahsulot topildi
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 MarketPlus. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
