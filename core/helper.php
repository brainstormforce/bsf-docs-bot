<?php
/**
 * bsf_docs_bot shortcode.
 *
 * @package bsf-docs-bot
 */

namespace BSF_DOCS_BOT\Core;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Menu.
 */
class Helper {
	/**
	 * Returns an option from the database for the admin settings.
	 *
	 * @param  string $key     The option key.
	 * @param  mixed  $default Option default value if option is not available.
	 * @return string           Return the option value
	 *
	 * @since 1.0.0
	 */
	public static function get_admin_settings_option( $key, $default = false ) {
		$bot_settings = get_option( BSF_DOCS_BOT_DB_OPTION );

		if ( ! is_array( $bot_settings ) || ! array_key_exists( $key, $bot_settings ) || empty( $bot_settings ) ) {
			$bot_settings[ $key ] = '';
		}

		// Get the setting option if we're in the admin panel.
		$value = $bot_settings[ $key ];

		return $value;
	}
}
