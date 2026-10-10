import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useToast } from "../context/ToastContext";
import {
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Smartphone,
  Laptop,
  Shirt,
  Tv,
  Armchair,
  Watch,
  ShoppingBag,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Tag,
  Copy,
  Check,
  ArrowUp,
  Gift,
  Clock,
  LayoutGrid,
  Grid3X3,
  X,
  Filter,
} from "lucide-react";


const CATEGORIES = [
  { name: "All", label: "All Items", icon: ShoppingBag, desc: "Explore entire catalog", badge: "Hot" },
  { name: "Mobiles", label: "Smartphones", icon: Smartphone, desc: "iPhone, Samsung, 5G", badge: "New" },
  { name: "Laptops", label: "Laptops & PC", icon: Laptop, desc: "MacBook, Gaming, OLED", badge: "Trending" },
  { name: "Fashion", label: "Fashion & Wear", icon: Shirt, desc: "Streetwear, Kicks, Jackets", badge: "Sale" },
  { name: "Electronics", label: "Electronics", icon: Tv, desc: "Sony Audio, 4K OLED TV", badge: "Pro" },
  { name: "Furniture", label: "Home Decor", icon: Armchair, desc: "Modern Living & Desks", badge: "Popular" },
  { name: "Watches", label: "Smart Watches", icon: Watch, desc: "Fitness & Luxury Wear", badge: "Smart" },
];

const HERO_SLIDES = [
  {
    id: 1,
    tag: "🔥 MEGA TECH FESTIVAL 2026",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    title: "Next-Gen AI Smartphones & Flagships",
    titleGradient: "from-brand-300 via-indigo-200 to-amber-300",
    description: "Unleash extreme power with the iPhone 15 Pro Max Titanium, Samsung Galaxy S24 Ultra & OnePlus 12. Instant same-day dispatch with 1-year brand warranty.",
    ctaPrimary: "Shop Flagship Mobiles",
    ctaCategory: "Mobiles",
    ctaSecondary: "Explore Laptops",
    ctaSecondaryCategory: "Laptops",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    featuredBadge: "Deal of the Day",
    featuredTitle: "Apple iPhone 15 Pro Max",
    featuredSubtitle: "Forged in Titanium • A17 Pro Chip",
    featuredPrice: "₹1,48,900",
    featuredDiscount: "Save ₹15,000",
    bgGradient: "from-slate-950 via-brand-950 to-indigo-950",
  },
  {
    id: 2,
    tag: "✨ TRENDING STREETWEAR DROP",
    tagColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    title: "Iconic Kicks & Luxury Apparel",
    titleGradient: "from-rose-300 via-pink-200 to-amber-200",
    description: "Step into greatness with authentic Nike Air Jordan 1 'Chicago', full-grain biker leather jackets, and premium heavyweight French Terry hoodies.",
    ctaPrimary: "Explore Fashion",
    ctaCategory: "Fashion",
    ctaSecondary: "Shop Sneakers",
    ctaSecondaryCategory: "Fashion",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    featuredBadge: "Limited Edition",
    featuredTitle: "Air Jordan 1 Retro 'Chicago'",
    featuredSubtitle: "Full-Grain Leather • Encapsulated Air",
    featuredPrice: "₹16,995",
    featuredDiscount: "40% OFF",
    bgGradient: "from-slate-950 via-rose-950 to-purple-950",
  },
  {
    id: 3,
    tag: "🎧 STUDIO ACOUSTICS & OLED CINEMA",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    title: "Immersive Audio & 4K Entertainment",
    titleGradient: "from-cyan-300 via-sky-200 to-emerald-300",
    description: "Experience silence and studio fidelity with Sony WH-1000XM5 Hi-Res Noise Cancelling Headphones and self-lit 120Hz OLED 4K smart cinema displays.",
    ctaPrimary: "Shop Electronics",
    ctaCategory: "Electronics",
    ctaSecondary: "View Audio Picks",
    ctaSecondaryCategory: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    featuredBadge: "Top Rated Audio",
    featuredTitle: "Sony WH-1000XM5 Hi-Res",
    featuredSubtitle: "Dual Processor ANC • 30h Battery",
    featuredPrice: "₹29,990",
    featuredDiscount: "Top Pick",
    bgGradient: "from-slate-950 via-cyan-950 to-blue-950",
  },
];

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Verified Buyer, Bengaluru",
    rating: 5,
    comment: "Ordered the MacBook Pro M3 and it got delivered within 24 hours in flawless condition. Authenticity verified directly on Apple's portal. QuickKart is top tier!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    product: "Apple MacBook Pro 16\"",
  },
  {
    name: "Priya Patel",
    role: "Verified Buyer, Mumbai",
    rating: 5,
    comment: "The Nike Air Jordan 1 Chicago are 100% original! Packaging was pristine, and using the ₹500 welcome coupon made it an absolute steal.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    product: "Nike Air Jordan 1 OG",
  },
  {
    name: "Rohan Verma",
    role: "Verified Buyer, Delhi",
    rating: 5,
    comment: "Sony WH-1000XM5 headphones sound sublime. Seamless UPI payment, fast tracking updates, and top-notch customer support.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    product: "Sony WH-1000XM5",
  },
];

export default function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [collectionTab, setCollectionTab] = useState("all"); // all, deals, best, premium, budget
  const [sort, setSort] = useState("Default");
  const [priceRange, setPriceRange] = useState("all"); // all, under5k, 5k-25k, 25k-75k, 75k+
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [gridColumns, setGridColumns] = useState(4); // 4 or 3
  const [showScrollTop, setShowScrollTop] = useState(false);

  // VIP Coupon Box State
  const [vipEmail, setVipEmail] = useState("");
  const [couponUnlocked, setCouponUnlocked] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Countdown timer simulation (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  const productsSectionRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero auto-slider
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("QUICK500");
    setCopiedCode(true);
    showToast("Coupon QUICK500 copied to clipboard!", "success");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipEmail) return;
    setCouponUnlocked(true);
    showToast("VIP discount unlocked! Use code QUICK500", "success");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const keyword = searchKeyword.toLowerCase();
      const matchSearch =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.category?.toLowerCase().includes(keyword);

      const matchCategory =
        category === "All" ||
        product.category?.toLowerCase() === category.toLowerCase();

      // Collection filter tab
      let matchTab = true;
      if (collectionTab === "deals") {
        matchTab = product.stock <= 10 || product.price < 30000;
      } else if (collectionTab === "best") {
        matchTab = product.stock > 10;
      } else if (collectionTab === "premium") {
        matchTab = product.price >= 50000;
      } else if (collectionTab === "budget") {
        matchTab = product.price < 10000;
      }

      // Price range filter
      let matchPrice = true;
      if (priceRange === "under5k") matchPrice = product.price <= 5000;
      else if (priceRange === "5k-25k") matchPrice = product.price > 5000 && product.price <= 25000;
      else if (priceRange === "25k-75k") matchPrice = product.price > 25000 && product.price <= 75000;
      else if (priceRange === "75k+") matchPrice = product.price > 75000;

      return matchSearch && matchCategory && matchTab && matchPrice;
    })
    .sort((a, b) => {
      if (sort === "LowToHigh") return a.price - b.price;
      if (sort === "HighToLow") return b.price - a.price;
      return 0;
    });

  // Hot deals for flash sale section (top 4 discounted items)
  const flashDeals = products.slice(0, 4);

  const activeHero = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* 1. TOP LIVE PERKS MARQUEE TICKER */}
      <div className="overflow-hidden bg-slate-900 text-slate-200 py-2 border-b border-slate-800 text-xs font-semibold select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
          <span className="flex items-center gap-2 text-brand-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            MEGA FESTIVAL 2026: UP TO 70% OFF ON TOP BRANDS
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            FREE SAME-DAY EXPRESS SHIPPING ON ORDERS OVER ₹499
          </span>
          <span className="flex items-center gap-2 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            INSTANT 10% CASHBACK WITH HDFC & ICICI BANK CARDS
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            100% AUTHENTIC GUARANTEE WITH 1-YEAR BRAND WARRANTY
          </span>
          <span className="flex items-center gap-2 text-pink-300">
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            7-DAY EASY REPLACEMENTS & INSTANT DOORSTEP REFUNDS
          </span>
          {/* Repeat for continuous marquee loop */}
          <span className="flex items-center gap-2 text-brand-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            MEGA FESTIVAL 2026: UP TO 70% OFF ON TOP BRANDS
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            FREE SAME-DAY EXPRESS SHIPPING ON ORDERS OVER ₹499
          </span>
          <span className="flex items-center gap-2 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            INSTANT 10% CASHBACK WITH HDFC & ICICI BANK CARDS
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            100% AUTHENTIC GUARANTEE WITH 1-YEAR BRAND WARRANTY
          </span>
        </div>
      </div>

      <main className="flex-1">
        {/* 2. DYNAMIC HERO BANNER CAROUSEL */}
        <section
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className={`relative overflow-hidden bg-gradient-to-br ${activeHero.bgGradient} text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/30 transition-all duration-700`}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-64 bg-radial from-brand-500/10 to-transparent blur-2xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Live Badge & Countdown */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase shadow-sm ${activeHero.tagColor}`}>
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    <span>{activeHero.tag}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Flash Deals End:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
                    </span>
                  </div>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.08] text-white">
                  {activeHero.title.split(" & ")[0]} <br />
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeHero.titleGradient}`}>
                    {activeHero.title.includes(" & ") ? `& ${activeHero.title.split(" & ")[1]}` : "Delivered In Minutes."}
                  </span>
                </h1>

                {/* Hero Description */}
                <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  {activeHero.description}
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => {
                      setCategory(activeHero.ctaCategory);
                      scrollToProducts();
                    }}
                    className="btn-primary px-8 py-4 text-sm font-bold shadow-xl shadow-brand-600/30 hover:shadow-brand-500/50"
                  >
                    <span>{activeHero.ctaPrimary}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setCategory(activeHero.ctaSecondaryCategory);
                      scrollToProducts();
                    }}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-md border border-white/15 hover:border-white/30 transition duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{activeHero.ctaSecondary}</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-medium">100% Genuine Authenticity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-medium">Zero-Cost EMI Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="font-medium">50,000+ Happy Customers</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Visual Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-amber-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />
                  
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl p-4">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 aspect-[4/3] flex items-center justify-center">
                      <img
                        src={activeHero.image}
                        alt={activeHero.featuredTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/15 text-amber-400 font-extrabold text-xs rounded-full uppercase tracking-wider shadow">
                        {activeHero.featuredBadge}
                      </span>
                      <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs rounded-full shadow">
                        {activeHero.featuredDiscount}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl mt-4 border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">
                          {activeHero.featuredTitle}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{activeHero.featuredSubtitle}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-black text-amber-400">{activeHero.featuredPrice}</span>
                          <span className="text-[11px] text-slate-500 line-through">M.R.P. Higher</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCategory(activeHero.ctaCategory);
                          scrollToProducts();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <span>View Deal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-10">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-8 bg-amber-400 shadow-glow-accent" : "w-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition backdrop-blur-md"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition backdrop-blur-md"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. VALUE PROPOSITION FEATURE STRIP */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 py-8 shadow-sm transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Free Express Shipping</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">On all orders above ₹499</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">100% Genuine Brands</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Official manufacturer warranty</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Zero-Cost EMI & UPI</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant checkout & cashback</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">7-Day Easy Returns</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hassle-free doorstep pickup</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. INTERACTIVE CATEGORY SHOWCASE CARDS */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" />
                Explore By Departments
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                Featured Categories
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Find exactly what you are looking for from our curated collection of certified flagships and lifestyle gear.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = category.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    scrollToProducts();
                  }}
                  className={`group relative flex flex-col items-center text-center p-5 rounded-3xl transition-all duration-300 border ${
                    isActive
                      ? "bg-gradient-to-b from-brand-600 to-indigo-700 text-white shadow-lg shadow-brand-500/30 scale-105 border-brand-500"
                      : "bg-white dark:bg-slate-900 hover:bg-brand-50/50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-600/50 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="font-heading font-bold text-sm tracking-tight leading-snug">
                    {cat.label}
                  </span>
                  <span
                    className={`text-[10px] mt-1 font-medium line-clamp-1 ${
                      isActive ? "text-brand-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {cat.desc}
                  </span>

                  <span
                    className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isActive
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand-500 group-hover:text-white"
                    }`}
                  >
                    {cat.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. FLASH DEALS / DEAL OF THE DAY SPOTLIGHT */}
        {flashDeals.length > 0 && (
          <section className="bg-gradient-to-b from-amber-500/10 via-brand-500/5 to-transparent dark:from-amber-950/20 dark:via-brand-950/10 py-12 border-y border-amber-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/30">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    Limited Time Flash Deals
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                    ⚡ Deals Of The Day
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Grab these blockbuster discounts before the stock runs out.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-amber-500/30 shadow-sm">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Offer Expires In:
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span>:</span>
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span>:</span>
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flash Deals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {flashDeals.map((product, idx) => (
                  <div key={product._id} className="relative">
                    <ProductCard product={product} />
                    {/* Stock claimed progress bar indicator */}
                    <div className="mt-3 px-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span>🔥 {75 + idx * 6}% Claimed</span>
                        <span className="text-rose-500 font-extrabold">Fast Selling</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                          style={{ width: `${75 + idx * 6}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. PROMOTIONAL BENTO GRID SHOWCASE */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Wide Tech Flagships */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-10 border border-indigo-900/40 shadow-xl flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-md space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> Flagship Ecosystem
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight">
                  Pro Workstations & Gaming Rigs
                </h3>
                <p className="text-sm text-slate-300">
                  MacBook Pro M3, Dell XPS 15 OLED, and ASUS ROG RTX 4080 ready for extreme creators.
                </p>
              </div>

              <div className="relative z-10 pt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    setCategory("Laptops");
                    scrollToProducts();
                  }}
                  className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow flex items-center gap-2"
                >
                  <span>Explore Laptops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-emerald-400">
                  ✓ Same-Day Dispatch
                </span>
              </div>
            </div>

            {/* Bento Card 2: Streetwear & Shoes */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 text-white p-8 border border-rose-900/40 shadow-xl flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  <Flame className="w-3.5 h-3.5" /> Street Style
                </span>
                <h3 className="text-2xl font-heading font-black tracking-tight leading-tight">
                  Sneakerhead & Luxury Fashion
                </h3>
                <p className="text-xs text-slate-300">
                  Nike Air Jordan, Genuine Leather Biker Jackets & Heavyweight Hoodies.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <button
                  onClick={() => {
                    setCategory("Fashion");
                    scrollToProducts();
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs hover:opacity-95 transition shadow flex items-center gap-2"
                >
                  <span>Shop Fashion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. MAIN PRODUCTS CATALOG WITH ADVANCED FILTER HUB */}
        <section ref={productsSectionRef} id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Main Title & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                  {searchKeyword ? `Search Results for "${searchKeyword}"` : `${category} Collection`}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  {filteredProducts.length} Products
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Handpicked 100% authentic products with verified seller ratings.
              </p>
            </div>

            {/* View Controls & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Grid Column Toggle */}
              <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setGridColumns(4)}
                  className={`p-2 rounded-xl transition ${
                    gridColumns === 4
                      ? "bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="4 Columns Grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridColumns(3)}
                  className={`p-2 rounded-xl transition ${
                    gridColumns === 3
                      ? "bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="3 Columns Wide"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  <option value="Default" className="dark:bg-slate-900">Featured (Default)</option>
                  <option value="LowToHigh" className="dark:bg-slate-900">Price: Low to High</option>
                  <option value="HighToLow" className="dark:bg-slate-900">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            <button
              onClick={() => setCollectionTab("all")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                collectionTab === "all"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              🌟 All Items
            </button>
            <button
              onClick={() => setCollectionTab("deals")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                collectionTab === "deals"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              ⚡ Flash Deals & Offers
            </button>
            <button
              onClick={() => setCollectionTab("best")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                collectionTab === "best"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              🔥 Best Sellers
            </button>
            <button
              onClick={() => setCollectionTab("premium")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                collectionTab === "premium"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              💎 Flagships (₹50k+)
            </button>
            <button
              onClick={() => setCollectionTab("budget")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                collectionTab === "budget"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
              }`}
            >
              🏷️ Under ₹10,000
            </button>
          </div>

          {/* Quick Price Range Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5" /> Price Filter:
            </span>
            <button
              onClick={() => setPriceRange("all")}
              className={`px-3 py-1 rounded-xl transition ${
                priceRange === "all"
                  ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceRange("under5k")}
              className={`px-3 py-1 rounded-xl transition ${
                priceRange === "under5k"
                  ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Under ₹5,000
            </button>
            <button
              onClick={() => setPriceRange("5k-25k")}
              className={`px-3 py-1 rounded-xl transition ${
                priceRange === "5k-25k"
                  ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              ₹5,000 - ₹25,000
            </button>
            <button
              onClick={() => setPriceRange("25k-75k")}
              className={`px-3 py-1 rounded-xl transition ${
                priceRange === "25k-75k"
                  ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              ₹25,000 - ₹75,000
            </button>
            <button
              onClick={() => setPriceRange("75k+")}
              className={`px-3 py-1 rounded-xl transition ${
                priceRange === "75k+"
                  ? "bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              ₹75,000+
            </button>

            {/* Active Filters Clear Button */}
            {(category !== "All" || collectionTab !== "all" || priceRange !== "all" || searchKeyword) && (
              <button
                onClick={() => {
                  setCategory("All");
                  setCollectionTab("all");
                  setPriceRange("all");
                }}
                className="ml-auto inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-bold transition text-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          {/* Product Grid Render */}
          {loading ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridColumns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
              } gap-6`}
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="w-full h-52 skeleton-box rounded-2xl" />
                  <div className="w-3/4 h-5 skeleton-box rounded" />
                  <div className="w-1/2 h-4 skeleton-box rounded" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="w-1/3 h-6 skeleton-box rounded" />
                    <div className="w-1/4 h-8 skeleton-box rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-12 space-y-4">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matching products found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try clearing active filters or searching for different keywords.
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setCollectionTab("all");
                  setPriceRange("all");
                }}
                className="btn-primary text-xs px-6 py-3"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridColumns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
              } gap-6`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 8. VERIFIED CUSTOMER TESTIMONIALS & TRUST */}
        <section className="bg-slate-100 dark:bg-slate-900/60 py-16 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-current" /> Verified Customer Reviews
              </div>
              <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                Loved by 50,000+ Happy Shoppers
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                See what genuine customers say about our authentic products and lightning-fast delivery experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((review, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, r) => (
                        <Star key={r} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border border-brand-500/30"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. VIP REWARD CLUB & NEWSLETTER WITH INSTANT COUPON */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-14 border border-indigo-900/40 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                <Gift className="w-4 h-4 text-amber-400" />
                Exclusive VIP Member Perk
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white leading-tight">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">₹500 OFF</span> On Your First Order
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Join 50,000+ smart shoppers in our VIP club. Get early festival access, private secret discounts, and instant cashback drops.
              </p>

              {!couponUnlocked ? (
                <form onSubmit={handleVipSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={vipEmail}
                    onChange={(e) => setVipEmail(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:border-amber-400 text-sm backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition shadow-lg shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>Claim ₹500</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-amber-400/40 max-w-md mx-auto space-y-3 animate-fade-in">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    🎉 Woohoo! Your VIP Discount Code:
                  </span>
                  <div className="flex items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-amber-400/50">
                    <span className="font-mono text-xl font-black tracking-widest text-amber-400">
                      QUICK500
                    </span>
                    <button
                      onClick={handleCopyCoupon}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg transition flex items-center gap-1.5"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Apply this code at checkout to get ₹500 off instantly on all orders!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-slate-900 dark:bg-brand-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
}
