import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { useLocation } from 'react-router';

type GalleryImage = Tables<'gallery_images'>;

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchGallery = async () => {
      const { data } = await supabase.
      from('gallery_images').
      select('*').
      order('created_at', { ascending: false });

      setImages(data ?? []);
      setLoading(false);

      const openIndex = (location.state as { openIndex?: number } | null)?.openIndex;
      if (typeof openIndex === 'number' && data && data[openIndex]) {
        setSelectedIndex(openIndex);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => prev !== null && prev < images.length - 1 ? prev + 1 : 0);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => prev !== null && prev > 0 ? prev - 1 : images.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <div data-ev-id="ev_587e76ee32" className="min-h-screen py-16 px-4">
      <div data-ev-id="ev_3eb083015e" className="max-w-7xl mx-auto">
        <motion.div data-ev-id="ev_f49a90fc92"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12">

          <h1 data-ev-id="ev_9422e85953" className="font-display text-4xl md:text-5xl font-bold text-pine mb-4">Galeri</h1>
          <p data-ev-id="ev_2f5ecc4e93" className="text-muted-foreground max-w-2xl">
            Hayattan kareler, anlardan izler. Her görsel bir hikaye anlatır.
          </p>
        </motion.div>

        {loading ?
        <div data-ev-id="ev_7764b1f8e2" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(15)].map((_, i) =>
          <div data-ev-id="ev_45124ae34f" key={i} className="aspect-square bg-card rounded-xl animate-pulse" />
          )}
          </div> :
        images.length > 0 ?
        <div data-ev-id="ev_2277153eba" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) =>
          <motion.div data-ev-id="ev_2826b3f039"
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.03 }}
          onClick={() => openLightbox(index)}
          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-soft">

                <motion.img data-ev-id="ev_d74e17d554"
            src={image.image_url}
            alt={image.alt_text || 'Galeri görseli'}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }} />

                {/* Hover overlay */}
                <div data-ev-id="ev_94257f3bc2" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
          )}
          </div> :

        <div data-ev-id="ev_231a90725b" className="bg-card rounded-2xl p-12 text-center">
            <span data-ev-id="ev_b08f94536f" className="text-6xl mb-4 block">🖼️</span>
            <p data-ev-id="ev_b2bcab0383" className="text-muted-foreground">
              Henüz galeri boş. Yakında renkli karelerle dolacak!
            </p>
          </div>
        }
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && images[selectedIndex] &&
        <motion.div data-ev-id="ev_3d26051688"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={closeLightbox}>

            {/* Close button */}
            <button data-ev-id="ev_1d1182bf48"
          onClick={closeLightbox}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10">

              <X className="w-8 h-8" />
            </button>

            {/* Counter */}
            <div data-ev-id="ev_84376f5b6b" className="absolute top-4 left-4 text-white/60 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Image */}
            <motion.div data-ev-id="ev_36cf5d2d23"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl h-[85vh] w-full mx-4">

              <img data-ev-id="ev_607e756f32"
            src={images[selectedIndex].image_url}
            alt={images[selectedIndex].alt_text || ''}
            className="w-full h-full object-contain rounded-lg" />


              {/* Alt text caption */}
              {images[selectedIndex].alt_text &&
            <p data-ev-id="ev_83d3f0431c" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  {images[selectedIndex].alt_text}
                </p>
            }
            </motion.div>

            {/* Navigation arrows */}
            {images.length > 1 &&
          <>
                <button data-ev-id="ev_5ab941198d"
            onClick={(e) => {e.stopPropagation();prevImage();}}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">

                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button data-ev-id="ev_38bbc46dcb"
            onClick={(e) => {e.stopPropagation();nextImage();}}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">

                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
          }

            {/* Thumbnail strip */}
            {images.length > 1 &&
          <div data-ev-id="ev_9fc8b60bcf" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 rounded-xl backdrop-blur-sm">
                {images.map((img, idx) =>
            <button data-ev-id="ev_8a7dc331ca"
            key={img.id}
            onClick={(e) => {e.stopPropagation();setSelectedIndex(idx);}}
            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
            idx === selectedIndex ? 'ring-2 ring-pumpkin scale-110' : 'opacity-60 hover:opacity-100'}`
            }>

                    <img data-ev-id="ev_76f9f626ff"
              src={img.image_url}
              alt=""
              className="w-full h-full object-cover" />

                  </button>
            )}
              </div>
          }
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}