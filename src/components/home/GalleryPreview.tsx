import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Images } from 'lucide-react';
import SectionTitle from './SectionTitle';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface GalleryPreviewProps {
  images: GalleryImage[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <section data-ev-id="ev_b8803212b6" className="py-16 px-4 bg-cream-dark">
				<div data-ev-id="ev_e1a0f3ea81" className="max-w-7xl mx-auto">
					<SectionTitle icon="🖼️">Galeriden</SectionTitle>
					<div data-ev-id="ev_f8f5a3ac62" className="bg-card rounded-2xl p-12 text-center">
						<Images className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
						<p data-ev-id="ev_087a5ba878" className="text-muted-foreground">
							Henüz görsel eklenmemiş. Yakında renkli karelerle dolacak!
						</p>
					</div>
				</div>
			</section>);

  }

  return (
    <section data-ev-id="ev_1440b7a2bc" className="py-16 px-4 bg-cream-dark">
			<div data-ev-id="ev_fd0516c047" className="max-w-7xl mx-auto">
				<div data-ev-id="ev_c1e69d4a21" className="flex items-end justify-between mb-8">
					<SectionTitle icon="🖼️">Galeriden</SectionTitle>
					<Link
            to="/galeri"
            className="flex items-center gap-2 text-pumpkin hover:text-pumpkin-dark transition-colors font-medium">

						Tümünü gör
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				<div data-ev-id="ev_423e9f8188" className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{images.slice(0, 4).map((image, index) =>
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative aspect-square rounded-2xl overflow-hidden group">

							<motion.img
              src={image.image_url}
              alt={image.alt_text || ''}
              className="w-full h-full object-cover"
              animate={{
                scale: hoveredIndex === index ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }} />

							<div data-ev-id="ev_14b8c320a9" className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
						</motion.div>
          )}
				</div>
			</div>
		</section>);

}