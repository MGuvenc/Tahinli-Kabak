import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { ContentBlock } from '@/components/ui/ContentBlockRenderer';

type SiteSettings = Tables<'site_settings'>;

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const { data } = await supabase.
      from('site_settings').
      select('*').
      order('created_at', { ascending: true }).
      limit(1).
      maybeSingle();

      setSettings(data);
      const { data: blocksData } = await supabase.
      from('about_blocks').
      select('*').
      order('sort_order');

      setBlocks(blocksData ?? []);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return (
    <div data-ev-id="ev_881d606d04" className="min-h-screen py-16 px-4">
			<div data-ev-id="ev_658a09862d" className="max-w-3xl mx-auto">
				<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>

					<h1 data-ev-id="ev_8a21353ee5" className="font-display text-4xl md:text-5xl font-bold text-pine mb-8">Hakkımda</h1>
				</motion.div>

				{loading ?
        <div data-ev-id="ev_cf0a523abf" className="flex flex-col gap-6">
						<div data-ev-id="ev_df39696beb" className="w-48 h-48 rounded-full bg-card animate-pulse mx-auto" />
						<div data-ev-id="ev_56595890f0" className="h-4 bg-card animate-pulse rounded w-3/4 mx-auto" />
						<div data-ev-id="ev_33a3e501b1" className="h-4 bg-card animate-pulse rounded w-1/2 mx-auto" />
					</div> :

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-8">

						{/* Profile image */}
						{settings?.about_image_url ?
          <div data-ev-id="ev_cf5618ee11" className="relative">
								<img data-ev-id="ev_007c8cffa9"
            src={settings.about_image_url}
            alt="Hakkımda"
            className="w-48 h-48 rounded-full object-cover shadow-card" />

								{/* Decorative elements */}
								<div data-ev-id="ev_14f3a7439e" className="absolute -top-2 -right-2 text-4xl">🍬</div>
								<div data-ev-id="ev_6372a6f401" className="absolute -bottom-2 -left-2 text-4xl">🎃</div>
							</div> :

          <div data-ev-id="ev_8a80bbb448" className="w-48 h-48 rounded-full bg-gradient-to-br from-tahini to-pumpkin flex items-center justify-center">
								<span data-ev-id="ev_79172571ac" className="text-6xl">🎃</span>
							</div>
          }

						{/* Content */}
						<div data-ev-id="ev_f6b4f8d004" className="prose prose-lg max-w-none">
							{blocks.length > 0 ? (
								blocks.map((block) => <ContentBlock key={block.id} block={block} />)
							) : (
								<div data-ev-id="ev_35a055ea6a" className="bg-card rounded-2xl p-8 text-center">
									<p data-ev-id="ev_23f236d18b" className="text-muted-foreground mb-4">
										Merhaba! Ben <span data-ev-id="ev_c108eaaeca" className="text-pumpkin font-semibold">tahinlikabak</span>'in arkasindaki kişiyim.
									</p>
									<p data-ev-id="ev_565061ee2b" className="text-sm text-muted-foreground/70 italic">
										(Bu içerik admin panelinden düzenlenebilir)
									</p>
								</div>
							)}
						</div>

						{/* Fun fact */}
						<div data-ev-id="ev_27cc531c79" className="bg-pumpkin/10 rounded-2xl p-6 text-center max-w-md">
							<span data-ev-id="ev_50fb603e64" className="text-3xl mb-2 block">✨</span>
							<p data-ev-id="ev_70c7c24c19" className="text-sm text-foreground">
								<span data-ev-id="ev_069703cc13" className="font-semibold">Eğlenceli gerçek:</span> Tahin ve kabak bir arada 
								muhteşem bir tatlı yapar. Tıpkı bu blog gibi!
							</p>
						</div>
					</motion.div>
        }
			</div>
		</div>);

}