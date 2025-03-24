<?php
/**
 * タームメタテキストブロックのレンダリング機能
 *
 * @package ChiilogTermMetaTextBlock
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

/**
 * タームメタテキストブロック - レンダリング
 *
 * タームメタの値を取得して表示するブロックのサーバーサイドレンダリング
 *
 * @param array    $attributes ブロック属性.
 * @param string   $content    ブロックのコンテンツ.
 * @param WP_Block $block      ブロックインスタンス.
 * @return string フロントエンドに表示するHTML
 */

// 必須属性の存在確認と入力値の検証
$block_taxonomy = isset( $attributes['taxonomy'] ) ? sanitize_text_field( $attributes['taxonomy'] ) : '';
$block_term_id  = isset( $attributes['termId'] ) ? absint( $attributes['termId'] ) : 0;
$block_meta_key = isset( $attributes['termMetaKey'] ) ? sanitize_text_field( $attributes['termMetaKey'] ) : '';

// 必要な情報が不足している場合は何も表示しない
if ( empty( $block_taxonomy ) || empty( $block_term_id ) || empty( $block_meta_key ) ) {
	return;
}

// タームメタの値を取得
$meta_value = get_term_meta( $block_term_id, $block_meta_key, true );

// TODOの仕様に従い、文字列のみを受け付ける
if ( ! is_string( $meta_value ) ) {
	return;
}

// 値が空の場合もなにも表示しない
if ( '' === $meta_value ) {
	return;
}

// ブロックラッパーの属性を取得
$wrapper_attributes = get_block_wrapper_attributes();
?>
<p <?php echo $wrapper_attributes; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php echo esc_html( $meta_value ); ?>
</p>
