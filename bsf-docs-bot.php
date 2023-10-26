<?php
/**
 * Plugin Name: BSF Docs Bot
 * Description: This ultimate tool for managing and presenting interactive documentation with ease and efficiency.
 * Author: Brainstorm Force, Navanath Bhosale
 * Author URI: https://github.com/brainstormforce/bsf-docs-bot
 * Version: 1.0.0
 * License: GPL v2
 * Text Domain: bsf-docs-bot
 *
 * @package bsf-docs-bot
 */

/**
 * Set constants
 */
define( 'BSF_DOCS_BOT_FILE', __FILE__ );
define( 'BSF_DOCS_BOT_BASE', plugin_basename( BSF_DOCS_BOT_FILE ) );
define( 'BSF_DOCS_BOT_DIR', plugin_dir_path( BSF_DOCS_BOT_FILE ) );
define( 'BSF_DOCS_BOT_URL', plugins_url( '/', BSF_DOCS_BOT_FILE ) );
define( 'BSF_DOCS_BOT_VER', '1.0.0' );
define( 'BSF_DOCS_BOT_ADMIN_SLUG', 'bsf_docs_bot' );
define( 'BSF_DOCS_BOT_DB_OPTION', 'bsf_docs_bot_settings' );


require_once 'plugin-loader.php';
