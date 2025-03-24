<?php
/**
 * Plugin Name:       Term Meta Text
 * Plugin URI:        mel_cha
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       term-meta-text-block
 *
 * @package ChiilogTermMetaTextBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function chiilog_term_meta_text_block_term_meta_text_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'chiilog_term_meta_text_block_term_meta_text_block_block_init' );
