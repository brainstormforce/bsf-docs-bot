<?php
/**
 * bsf_docs_bot admin settings.
 *
 * @package bsf-docs-bot
 */

namespace BSF_DOCS_BOT\Admin;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Menu.
 */
class Setup {

	/**
	 * Instance
	 *
	 * @access private
	 * @var object Class object.
	 * @since 1.0.0
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since 1.0.0
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->initialize_hooks();
	}

	/**
	 * Init Hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function initialize_hooks() {
		add_action( 'plugin_action_links_' . BSF_DOCS_BOT_BASE, array( $this, 'action_links' ) );
		add_filter( 'plugin_row_meta', array( $this, 'filter_plugin_row_meta' ), 10, 2 );
	}

	/**
	 * Show action links on the plugin screen.
	 *
	 * @param   mixed $links Plugin Action links.
	 * @return  array
	 */
	public function action_links( $links = array() ) {

		$admin_base   = 'themes.php';
		$action_links = array(
			'settings' => '<a href="' . esc_url( admin_url( 'options-general.php?page=' . BSF_DOCS_BOT_ADMIN_SLUG ) ) . '" aria-label="' . esc_attr__( 'visit the plugin settings page', 'bsf-docs-bot' ) . '">' . esc_html__( 'Settings', 'bsf-docs-bot' ) . '</a>',
		);

		return array_merge( $action_links, $links );
	}

	/**
	 * Filters the array of row meta for each plugin in the Plugins list table.
	 *
	 * @param array<int, string> $plugin_meta An array of the plugin's metadata.
	 * @param string             $plugin_file Path to the plugin file relative to the plugins directory.
	 * @return array<int, string> Updated array of the plugin's metadata.
	 */
	public function filter_plugin_row_meta( array $plugin_meta, $plugin_file ) {
		if ( 'bsf-docs-bot/bsf-docs-bot.php' !== $plugin_file ) {
			return $plugin_meta;
		}

		$plugin_meta[] = sprintf(
			'<a href="%1$s"> %2$s </a>',
			home_url() . '/support/',
			esc_html_x( 'Implementation', 'bsf-docs-bot' )
		);

		return $plugin_meta;
	}
}

/**
 * Kicking this off by calling 'get_instance()' method.
 */
Setup::get_instance();
