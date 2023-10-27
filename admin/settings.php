<?php
/**
 * BSF Docs Bot options page
 *
 * @package bsf-docs-bot
 */

defined( 'ABSPATH' ) || die( 'No direct script access allowed!' );

use BSF_DOCS_BOT\Core\Helper;

/*
 * Bot settings
 */
$product_name = Helper::get_admin_settings_option( 'product_name' );
$team_id      = Helper::get_admin_settings_option( 'team_id' );
$bot_id       = Helper::get_admin_settings_option( 'bot_id' );
$random_que   = Helper::get_admin_settings_option( 'random_que' );
$sily_phrase  = Helper::get_admin_settings_option( 'sily_phrase' );
$after_text   = Helper::get_admin_settings_option( 'after_text' );
$support_link = Helper::get_admin_settings_option( 'support_link' );

$header_markup  = '';
$header_markup .= '<br/><h1 class="bsf-docs-bot-page-title">';
$header_markup .= '<span class="dashicons dashicons-rest-api bsf-docs-bot-page-dashicon"></span><span class="bsf-docs-bot-page-middle-align">';
$header_markup .= __( 'BSF Docs Bot Settings', 'bsf-docs-bot' );
$header_markup .= '</span></h1>';

printf( '%1$s', $header_markup );

?>

<div class="bsf-docs-bot-admin-wrap">
	<div class="bsf-docs-bot-options-form-wrap bsf-docs-bot-clearfix">
		<form method="post" name="pf_docs_options_page">

			<?php settings_fields( 'bsf-docs-bot-settings-group' ); ?>
			<?php do_settings_sections( 'bsf-docs-bot-settings-group' ); ?>

			<table class="form-table">
				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Product Name', 'bsf-docs-bot' ); ?>
							<span class="bsf-docs-bot-help-tooltip">
								<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
								<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'This name works globally on frontend.', 'bsf-docs-bot' ); ?> </span>
							</span>
						</th>
					<td>
						<input placeholder="Astra" type="text" name="product_name" value="<?php esc_attr_e( $product_name, 'bsf-docs-bot' ); ?>" />
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Team ID', 'bsf-docs-bot' ); ?>
							<span class="bsf-docs-bot-help-tooltip">
								<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
								<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Provide Team ID which can embed in docs bot API URL for further operation.', 'bsf-docs-bot' ); ?> </span>
							</span>
						</th>
					<td>
						<input placeholder="bAwbmXW2HJsZYZrWX7CF" type="text" name="team_id" value="<?php esc_attr_e( $team_id, 'bsf-docs-bot' ); ?>" />
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Bot ID', 'bsf-docs-bot' ); ?>
							<span class="bsf-docs-bot-help-tooltip">
								<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
								<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Provide Bot ID which can embed in docs bot API URL for further operation.', 'bsf-docs-bot' ); ?> </span>
							</span>
						</th>
					<td>
						<input placeholder="N7HIwHfMzxdTutAEgMxa" type="text" name="bot_id" value="<?php esc_attr_e( $bot_id, 'bsf-docs-bot' ); ?>" />
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Sily Phrases', 'bsf-docs-bot' ); ?>
						<span class="bsf-docs-bot-help-tooltip">
							<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
							<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Add sily phrases separated by "|"', 'bsf-docs-bot' ); ?> </span>
						</span>
					</th>
					<td>
						<textarea name="sily_phrase" class="pf-docs-end-text" placeholder="Astra's magic, so fantastic, making websites look elastic!|With Astra, your site will gleam, like a star in a web design dream!Astra's powers, a digital feast, creating websites fit for a royal feast!" value=""><?php esc_attr_e( $sily_phrase, 'bsf-docs-bot' ); ?></textarea>
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Random Questions', 'bsf-docs-bot' ); ?>
						<span class="bsf-docs-bot-help-tooltip">
							<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
							<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Add random questions separated by "|"', 'bsf-docs-bot' ); ?> </span>
						</span>
					</th>
					<td>
						<textarea name="random_que" class="pf-docs-end-text" placeholder="How can I customize the header in Astra? Show me a before-and-after example.|What are the recommended plugins to enhance Astra theme functionality?" value=""><?php esc_attr_e( $random_que, 'bsf-docs-bot' ); ?></textarea>
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'After Text', 'bsf-docs-bot' ); ?>
						<span class="bsf-docs-bot-help-tooltip">
							<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
							<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Add text CTA after responses. Ex. Support CTA', 'bsf-docs-bot' ); ?> </span>
						</span>
					</th>
					<td>
						<textarea name="after_text" class="pf-docs-end-text" placeholder="If you couldn't find what you were looking for, please open a support ticket for further assistance." value=""><?php esc_attr_e( $after_text, 'bsf-docs-bot' ); ?></textarea>
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Submit Ticket URL', 'bsf-docs-bot' ); ?>
							<span class="bsf-docs-bot-help-tooltip">
								<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
								<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Support page URL, provide only slug. Ex. "/support/open-a-ticket/"', 'bsf-docs-bot' ); ?> </span>
							</span>
						</th>
					<td>
						<input placeholder="/support/open-a-ticket/" type="text" name="support_link" value="<?php esc_attr_e( $support_link, 'bsf-docs-bot' ); ?>" />
					</td>
				</tr>

				<tr valign="top">
					<th class="bsf-docs-bot-table-data" scope="row"><?php _e( 'Shortcode', 'bsf-docs-bot' ); ?>
							<span class="bsf-docs-bot-help-tooltip">
								<i class="bsf-docs-bot-field-help dashicons dashicons-editor-help"></i>
								<span class="bsf-docs-bot-tooltip-text"> <?php _e( 'Use this shortcode on your targeted page.', 'bsf-docs-bot' ); ?> </span>
							</span>
						</th>
					<td>
						<input readonly type="text" name="shortcode" value="[bsf_docs_bot]" onfocus="this.select();" />
					</td>
				</tr>
			</table>

			<p class="bsf-docs-bot-submit-para">
				<?php wp_nonce_field( 'bsf-docs-bot-security-nonce', 'bsf-docs-bot-security' ); ?>
				<input id="bsf-docs-bot-security-submit" type="submit" value="Save Changes" class="button button-primary button-hero" name="submit">
			</p>
		</form>
	</div>
</div>
