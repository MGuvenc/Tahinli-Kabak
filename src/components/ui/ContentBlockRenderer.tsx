export interface RenderableBlock {
	id: string;
	block_type: string;
	content: string | null;
	image_url: string | null;
	image_alt: string | null;
	layout: string | null;
}

export function ContentBlock({ block }: { block: RenderableBlock }) {
	switch (block.block_type) {
		case 'text':
			return (
				<div
					className="mb-6 text-foreground"
					dangerouslySetInnerHTML={{ __html: block.content || '' }}
				/>
			);

		case 'image':
			return (
				<figure className={`mb-6 ${getLayoutClass(block.layout)}`}>
					<img
						src={block.image_url || ''}
						alt={block.image_alt || ''}
						className="rounded-xl w-full"
						loading="lazy"
					/>
					{block.image_alt && (
						<figcaption className="text-sm text-muted-foreground text-center mt-2">
							{block.image_alt}
						</figcaption>
					)}
				</figure>
			);

		case 'quote':
			return (
				<blockquote className="mb-6 pl-6 border-l-4 border-pumpkin italic text-muted-foreground">
					{block.content}
				</blockquote>
			);

		default:
			return null;
	}
}

export function getLayoutClass(layout: string | null): string {
	switch (layout) {
		case 'image-left':
			return 'float-left mr-6 w-1/2';
		case 'image-right':
			return 'float-right ml-6 w-1/2';
		default:
			return '';
	}
}