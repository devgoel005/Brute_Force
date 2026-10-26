import pkg from './package.json' with {type:'json'}

export default {
	// import name from package.json
	name: pkg.name,
	triggers: {
		keywords: [
			'tourist attractions',
			'things to do',
			'places to visit',
			'landmarks',
			'sights',
			'points of interest',
			'museums',
			'attractions',
			'tourism',
			'visit'
		]
	},
	query_format: {
		regex: [
			'((best|top|famous)\\s+)?(tourist\\s+attractions?|things\\s+to\\s+do|places\\s+to\\s+(visit|see)|landmarks|sights|points\\s+of\\s+interest)\\s+(in|near|around)\\s+HD_LOCATION(__\\w+)?.*',
			'((best|top|famous)\\s+)?(museums?|monuments?|temples?|forts?|viewpoints?|parks?|historic(al)?\\s+sites?)\\s+(in|near|around)\\s+HD_LOCATION(__\\w+)?.*',
			'((explore|visit|travel\\s+to|trip\\s+to)\\s+)?HD_LOCATION(__\\w+)?.*'
		]
	},
	server: {
		location: 'dist/backend/index.js',
		configPath: 'dist/backend/wrangler.jsonc',
		schemaPath: 'dist/backend/schema.jsonc'
	},
	client: {
		// location of client side code
		location: pkg.module,
		// name of the UMD module
		moduleName: pkg.umdName || 'HD' + pkg.name,
		// baseURL is only used in local testing and ignored after publish
		baseURL: '/' + pkg.name,
	},
	format: {
		mainline: true,
		sidebar: true
	},
	permissions: {
		
	},
	info: {
		description: "Explore tourist attractions, landmarks, museums, and points of interest with interactive day plans, weather forecasts, and responsive maps."
	},
	github: "https://github.com/devgoel005/Brute_Force",
	demovideo: "https://youtu.be/4fgjnw9s-XY"
}
