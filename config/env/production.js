'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/pong-kombat',
	assets: {
		lib: {
			css: [
				'public/dist/pong-kombat.min.css'
			],
			js: [
				'public/vendors/angular/angular.min.js',
				'public/vendors/angular-resource/angular-resource.js', 
				'public/vendors/angular-cookies/angular-cookies.js', 
				'public/vendors/angular-animate/angular-animate.js', 
				'public/vendors/angular-touch/angular-touch.js', 
				'public/vendors/angular-sanitize/angular-sanitize.js', 
				'public/vendors/angular-ui-router/release/angular-ui-router.min.js',
				'public/vendors/angular-ui-utils/ui-utils.min.js',
				'public/vendors/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/vendors/angular-translate/angular-translate.min.js',
				'public/vendors/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
