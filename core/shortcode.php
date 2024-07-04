<?php
/**
 * bsf_docs_bot shortcode.
 *
 * @package bsf-docs-bot
 */

namespace BSF_DOCS_BOT\Core;

use BSF_DOCS_BOT\Core\Helper;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Menu.
 */
class Shortcode {

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
		add_shortcode( 'bsf_docs_bot', array( $this, 'bsf_docs_bot_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_scripts' ), 20 );
	}

	/**
	 * Frontend shortcode require scripts
	 *
	 * @since 1.0.0
	 */
	public function frontend_scripts() {
		$script_asset_path = BSF_DOCS_BOT_DIR . 'app/assets/build/bot-app.asset.php';

		$script_info = file_exists( $script_asset_path ) ? include $script_asset_path : array(  // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
			'dependencies' => array(),
			'version'      => BSF_DOCS_BOT_VER,
		);

		$script_dep = array_merge( $script_info['dependencies'], array() );

		wp_register_style(
			'bsf-docs-bot-style',
			BSF_DOCS_BOT_URL . 'app/assets/build/bot-app.css',
			array(),
			BSF_DOCS_BOT_VER
		);

		wp_register_script(
			'bsf-docs-bot-script',
			BSF_DOCS_BOT_URL . 'app/assets/build/bot-app.js',
			$script_dep,
			BSF_DOCS_BOT_VER,
			false
		);

		wp_localize_script(
			'bsf-docs-bot-script',
			'bsf_bot_localizer',
			array(
				'home_url'           => home_url(),
				'product_name'       => Helper::get_admin_settings_option( 'product_name' ),
				'team_id'            => Helper::get_admin_settings_option( 'team_id' ),
				'bot_id'             => Helper::get_admin_settings_option( 'bot_id' ),
				'random_que'         => explode( '|', Helper::get_admin_settings_option( 'random_que' ) ),
				'sily_phrase'        => explode( '|', Helper::get_admin_settings_option( 'sily_phrase' ) ),
				'after_text'         => Helper::get_admin_settings_option( 'after_text' ),
				'support_link'       => Helper::get_admin_settings_option( 'support_link' ),
				'random_que_section' => Helper::get_admin_settings_option( 'random_que_section' ),
				'example_questions'  => explode( '|', Helper::get_admin_settings_option( 'example_questions' ) ),
			)
		);
	}

	/**
	 * BSF Docs Bot Shortcode.
	 *
	 * @param array $atts Array of attributes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function bsf_docs_bot_shortcode( $atts ) {
		if ( is_admin() ) {
			return;
		}
		wp_enqueue_style( 'bsf-docs-bot-style' );
		wp_enqueue_script( 'bsf-docs-bot-script' );

		ob_start();

		?>
			<div class="ast-bsf-docs-wrapper">
				<script type="text/javascript">
					document.body.classList.add( 'bsf-docs-bot-page' );
				</script>
				<div id="ast-bsf-docs-content">
					<div id="bsf-docs-bot-app" class="astra-bot-app"> </div>
				</div>
			</div>
		<?php

		return ob_get_clean();
	}
}

/**
 * Kicking this off by calling 'get_instance()' method.
 */
Shortcode::get_instance();
