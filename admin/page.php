<?php
/**
 * bsf_docs_bot admin settings.
 *
 * @package bsf-docs-bot
 */

namespace BSF_DOCS_BOT\Admin;

use BSF_DOCS_BOT\Core\Helper;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Menu.
 */
class Page {

	/**
	 * Instance
	 *
	 * @access private
	 * @var object Class object.
	 * @since 1.0.0
	 */
	private static $instance;

	/**
	 * Docs bot Settings
	 *
	 * @var bsf_docs_bot
	 */
	private static $bsf_docs_bot = array();

	/**
	 * Option slug
	 *
	 * @var option_slug
	 */
	private static $option_slug = '';

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
		self::$option_slug  = BSF_DOCS_BOT_DB_OPTION;
		self::$bsf_docs_bot = get_option( self::$option_slug );
		$this->initialize_hooks();
	}

	/**
	 * Init Hooks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function initialize_hooks() {
		add_action( 'init', array( $this, 'update_admin_settings_option' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ), 10 );
		add_action( 'admin_init', array( $this, 'register_pf_docs_plugin_settings' ) );
		add_action( 'admin_menu', array( $this, 'bsf_bot_admin_menu' ) );
	}

	/**
	 * Add menu item to wp-admin
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function bsf_bot_admin_menu() {
		$bot_options_page = add_options_page(
			__( 'BSF Docs Bot', 'bsf-docs-bot' ),
			__( 'BSF Docs Bot', 'bsf-docs-bot' ),
			'manage_options',
			BSF_DOCS_BOT_ADMIN_SLUG,
			array( $this, 'dosc_bot_settings_page' )
		);
	}

	/**
	 * Create settings page.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function dosc_bot_settings_page() {
		require BSF_DOCS_BOT_DIR . 'admin/settings.php';
	}

	/**
	 * Enqueue admin scripts.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_admin_scripts() {
		if ( ! empty( $_GET['page'] ) && BSF_DOCS_BOT_ADMIN_SLUG === $_GET['page'] ) { //phpcs:ignore
			wp_enqueue_style(
				'bsf-docs-bot-admin-settings-style',
				BSF_DOCS_BOT_URL . 'admin/assets/style.css',
				array(),
				BSF_DOCS_BOT_VER
			);
			wp_enqueue_script(
				'bsf-docs-bot-admin-settings-script',
				BSF_DOCS_BOT_URL . 'admin/assets/script.js',
				array( 'jquery' ),
				BSF_DOCS_BOT_VER,
				false
			);
		}
	}

	/**
	 * Register setting option variables.
	 *
	 * @since 1.0.0
	 */
	public function register_pf_docs_plugin_settings() {
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'product_name' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'team_id' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'bot_id' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'random_que' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'sily_phrase' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'after_text' ) );
		register_setting( 'bsf-docs-bot-settings-group', Helper::get_admin_settings_option( 'support_link' ) );
	}

	/**
	 * Updates an option from the admin settings.
	 *
	 * @param string $key       The option key.
	 * @param mixed  $value     The value to update.
	 * @return mixed
	 *
	 * @since 1.0.0
	 */
	public function update_admin_settings_option() {

		$page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : null;

		if ( BSF_DOCS_BOT_ADMIN_SLUG !== $page ) {
			return;
		}

		/*
		 * General Tab settings
		 */
		if ( isset( $_POST['bsf-docs-bot-security'] ) && wp_verify_nonce( sanitize_text_field( $_POST['bsf-docs-bot-security'] ), 'bsf-docs-bot-security-nonce' ) ) {
			self::update_bot_core_settings();
		}
	}

	/**
	 * Updates options from the General settings tab.
	 *
	 * @since 1.0.0
	 */
	public static function update_bot_core_settings() {
		$bsf_docs_bot = self::$bsf_docs_bot;

		$bsf_docs_bot['product_name'] = ! empty( $_POST['product_name'] ) ? sanitize_text_field( $_POST['product_name'] ) : '';
		$bsf_docs_bot['team_id']      = ! empty( $_POST['team_id'] ) ? sanitize_text_field( $_POST['team_id'] ) : '';
		$bsf_docs_bot['bot_id']       = ! empty( $_POST['bot_id'] ) ? sanitize_text_field( $_POST['bot_id'] ) : '';
		$bsf_docs_bot['random_que']   = ( ( isset( $_POST['random_que'] ) && ! empty( $_POST['random_que'] ) ) ? stripcslashes( $_POST['random_que'] ) : '' );
		$bsf_docs_bot['sily_phrase']  = ( ( isset( $_POST['sily_phrase'] ) && ! empty( $_POST['sily_phrase'] ) ) ? stripcslashes( $_POST['sily_phrase'] ) : '' );
		$bsf_docs_bot['after_text']   = ( ( isset( $_POST['after_text'] ) && ! empty( $_POST['after_text'] ) ) ? stripcslashes( $_POST['after_text'] ) : '' );
		$bsf_docs_bot['support_link'] = ! empty( $_POST['support_link'] ) ? sanitize_text_field( $_POST['support_link'] ) : '';

		update_option( self::$option_slug, $bsf_docs_bot );
	}
}

/**
 * Kicking this off by calling 'get_instance()' method.
 */
Page::get_instance();
