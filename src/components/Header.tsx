import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Settings, History, Search, Store, Moon, Sun, Menu, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { wishlist, cart } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">
              Market<span className="text-primary">Plus</span>
            </span>
          </Link>

          {/* Search - Hidden on mobile, shown in menu */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title={theme === 'dark' ? 'Yorug\' rejim' : 'Qorong\'i rejim'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              )}
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Sevimlilar"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-wishlist text-wishlist-foreground text-xs">
                  {wishlist.length}
                </Badge>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Savatcha"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>

            <Link
              to="/history"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Tarix"
            >
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </Link>

            <Link
              to="/admin"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Sozlamalar"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </Link>
          </nav>

          {/* Mobile Navigation Icons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px]">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-secondary border-0 focus-visible:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-border animate-slide-up">
            <div className="grid grid-cols-4 gap-2">
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 text-wishlist" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-2 text-[10px] font-bold text-wishlist">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-xs text-foreground">Sevimli</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-[10px] font-bold text-primary">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-foreground">Savat</span>
              </Link>

              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <History className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-foreground">Tarix</span>
              </Link>

              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-foreground">Admin</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
