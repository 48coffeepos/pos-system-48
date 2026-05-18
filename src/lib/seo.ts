const siteName = '48 Coffee Management'
const siteDescription =
	'Run your coffee shop with a clean, type-safe TanStack Start dashboard.'

export function createSeo({
	title,
	description = siteDescription,
}: {
	title?: string
	description?: string
} = {}): {
	meta: Array<
		| { title: string }
		| { name: string; content: string }
		| { property: string; content: string }
	>
} {
	return {
		meta: [
			{ title: title ? `${title} | ${siteName}` : siteName },
			{ name: 'description', content: description },
			{ property: 'og:site_name', content: siteName },
			{ property: 'og:title', content: title ? `${title} | ${siteName}` : siteName },
			{ property: 'og:description', content: description },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: title ? `${title} | ${siteName}` : siteName },
			{ name: 'twitter:description', content: description },
		],
	}
}

export { siteDescription, siteName }
