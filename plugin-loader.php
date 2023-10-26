<?php
/**
 * Plugin Loader.
 *
 * @package bsf-docs-bot
 * @since 1.0.0
 */

namespace BSF_DOCS_BOT;

use BSF_DOCS_BOT\Core\Shortcode;
use BSF_DOCS_BOT\Admin\Setup;
use BSF_DOCS_BOT\Admin\Page;

/**
 * Plugin_Loader
 *
 * @since x.x.x
 */
class Plugin_Loader {

	/**
	 * Instance
	 *
	 * @access private
	 * @var object Class Instance.
	 * @since x.x.x
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since x.x.x
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Autoload classes.
	 *
	 * @param string $class class name.
	 */
	public function autoload( $class ) {
		if ( 0 !== strpos( $class, __NAMESPACE__ ) ) {
			return;
		}

		$class_to_load = $class;

		$filename = strtolower(
			preg_replace(
				[ '/^' . __NAMESPACE__ . '\\\/', '/([a-z])([A-Z])/', '/_/', '/\\\/' ],
				[ '', '$1-$2', '-', DIRECTORY_SEPARATOR ],
				$class_to_load
			)
		);

		$file = BSF_DOCS_BOT_DIR . $filename . '.php';

		// if the file readable, include it.
		if ( is_readable( $file ) ) {
			require_once $file;
		}
	}

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {

		spl_autoload_register( [ $this, 'autoload' ] );

		add_action( 'plugins_loaded', [ $this, 'load_textdomain' ] );

		$this->setup();
	}

	/**
	 * Load Plugin Text Domain.
	 * This will load the translation textdomain depending on the file priorities.
	 *      1. Global Languages /wp-content/languages/bsf-docs-bot/ folder
	 *      2. Local dorectory /wp-content/plugins/bsf-docs-bot/languages/ folder
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function load_textdomain() {
		// Default languages directory.
		$lang_dir = BSF_DOCS_BOT_DIR . 'languages/';

		/**
		 * Filters the languages directory path to use for plugin.
		 *
		 * @param string $lang_dir The languages directory path.
		 */
		$lang_dir = apply_filters( 'wpb_languages_directory', $lang_dir );

		// Traditional WordPress plugin locale filter.
		global $wp_version;

		$get_locale = get_locale();

		if ( $wp_version >= 4.7 ) {
			$get_locale = get_user_locale();
		}

		/**
		 * Language Locale for plugin
		 *
		 * @var $get_locale The locale to use.
		 * Uses get_user_locale()` in WordPress 4.7 or greater,
		 * otherwise uses `get_locale()`.
		 */
		$locale = apply_filters( 'plugin_locale', $get_locale, 'bsf-docs-bot' );
		$mofile = sprintf( '%1$s-%2$s.mo', 'bsf-docs-bot', $locale );

		// Setup paths to current locale file.
		$mofile_global = WP_LANG_DIR . '/plugins/' . $mofile;
		$mofile_local  = $lang_dir . $mofile;

		if ( file_exists( $mofile_global ) ) {
			// Look in global /wp-content/languages/bsf-docs-bot/ folder.
			load_textdomain( 'bsf-docs-bot', $mofile_global );
		} elseif ( file_exists( $mofile_local ) ) {
			// Look in local /wp-content/plugins/bsf-docs-bot/languages/ folder.
			load_textdomain( 'bsf-docs-bot', $mofile_local );
		} else {
			// Load the default language files.
			load_plugin_textdomain( 'bsf-docs-bot', false, $lang_dir );
		}
	}

	/**
	 * Include required classes.
	 *
	 * @since x.x.x
	 */
	public function setup() {
		Shortcode::get_instance();

		if ( is_admin() ) {
			Setup::get_instance();
			Page::get_instance();
		}
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
Plugin_Loader::get_instance();
