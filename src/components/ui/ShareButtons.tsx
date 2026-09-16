import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
  {
    name: 'WhatsApp',
    icon: '💬',
    href: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    color: 'hover:bg-green-500/10 hover:text-green-600'
  },
  {
    name: 'Twitter',
    icon: '𝕏',
    href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
    color: 'hover:bg-black/10 hover:text-black'
  },
  {
    name: 'Facebook',
    icon: 'f',
    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    color: 'hover:bg-blue-500/10 hover:text-blue-600'
  }];


  return (
    <div data-ev-id="ev_c4d15671d4" className="flex items-center gap-2">
			<span data-ev-id="ev_9d006ed019" className="flex items-center gap-1 text-sm text-muted-foreground">
				<Share2 className="w-4 h-4" />
				Paylaş:
			</span>
			
			<div data-ev-id="ev_3dd07837a4" className="flex items-center gap-1">
				{platforms.map((platform) =>
        <motion.a
          key={platform.name}
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
							w-9 h-9 flex items-center justify-center rounded-full
							bg-muted text-muted-foreground transition-colors
							${platform.color}
						`}
          title={platform.name}>

						<span data-ev-id="ev_8da9a1fef6" className="text-sm font-bold">{platform.icon}</span>
					</motion.a>
        )}

				{/* Copy link button */}
				<motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
						w-9 h-9 flex items-center justify-center rounded-full
						transition-colors
						${copied ?
          'bg-green-500/10 text-green-600' :
          'bg-muted text-muted-foreground hover:bg-pumpkin/10 hover:text-pumpkin'}
					`
          }
          title="Linki kopyala">

					{copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
				</motion.button>
			</div>
		</div>);

}