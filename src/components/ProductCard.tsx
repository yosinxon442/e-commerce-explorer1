import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useApp } from '@/contexts/AppContext';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info('Sevimlilardan olib tashlandi');
    } else {
      addToWishlist(product);
      toast.success('Sevimlilarga qo\'shildi');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Savatchaga qo\'shildi');
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-slide-up h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="bg-card rounded-xl sm:rounded-2xl overflow-hidden border border-border card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary flex-shrink-0">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Discount badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-destructive text-destructive-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
              isWishlisted 
                ? 'bg-wishlist text-wishlist-foreground' 
                : 'bg-card/80 backdrop-blur-sm text-foreground hover:bg-card'
            }`}
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isWishlisted ? 'fill-current animate-heart' : ''}`} 
            />
          </button>

          {/* Quick add to cart - Hidden on mobile */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Savatchaga
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">
            {product.category}
          </p>
          <h3 className="font-medium sm:font-semibold text-foreground text-sm sm:text-base line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-primary transition-colors flex-1">
            {product.title}
          </h3>
          
          <div className="mt-auto">
            <StarRating rating={product.rating} size="sm" />
            
            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-primary">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Mobile add to cart button */}
            <Button
              onClick={handleAddToCart}
              className="w-full mt-2 sm:hidden bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs"
              size="sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Qo'shish
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
