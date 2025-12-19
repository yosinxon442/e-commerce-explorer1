import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useApp } from '@/contexts/AppContext';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-destructive text-lg mb-4">Mahsulot topilmadi</p>
        <Link to="/" className="text-primary hover:underline">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info('Sevimlilardan olib tashlandi');
    } else {
      addToWishlist(product);
      toast.success('Sevimlilarga qo\'shildi');
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ta mahsulot savatchaga qo'shildi`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Orqaga</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {product.title}
                  </h1>
                </div>
                <button
                  onClick={handleWishlistClick}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isWishlisted
                      ? 'bg-wishlist text-wishlist-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {product.brand && (
                <Badge variant="secondary" className="text-sm">
                  {product.brand}
                </Badge>
              )}

              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size="lg" />
                <span className="text-muted-foreground">
                  ({product.reviews?.length || 0} sharh)
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      -{Math.round(product.discountPercentage)}%
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-destructive'}`} />
                <span className={product.stock > 0 ? 'text-success' : 'text-destructive'}>
                  {product.stock > 0 ? `${product.stock} ta mavjud` : 'Sotuvda yo\'q'}
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-foreground font-medium">Miqdor:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Savatchaga qo'shish
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-xl">
                  <Truck className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">{product.shippingInformation}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-xl">
                  <Shield className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">{product.warrantyInformation}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-secondary rounded-xl">
                  <RotateCcw className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">{product.returnPolicy}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Sharhlar</h2>
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{review.reviewerName}</span>
                        <StarRating rating={review.rating} size="sm" showNumber={false} />
                      </div>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {new Date(review.date).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
