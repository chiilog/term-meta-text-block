<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

/**
 * タームメタテキストブロック - レンダリング
 *
 * @package ChiilogTermMetaTextBlock
 *
 * タームメタの値を取得して表示するブロックのサーバーサイドレンダリング
 *
 * @param array    $attributes ブロック属性.
 * @param string   $content    ブロックのコンテンツ.
 * @param WP_Block $block      ブロックインスタンス.
 * @return string フロントエンドに表示するHTML
 */

// タームメタの値を取得する処理
$taxonomy   = isset( $attributes['taxonomy'] ) ? sanitize_text_field( $attributes['taxonomy'] ) : '';
$term_id    = isset( $attributes['termId'] ) ? absint( $attributes['termId'] ) : 0;
$meta_key   = isset( $attributes['termMetaKey'] ) ? sanitize_text_field( $attributes['termMetaKey'] ) : '';
$meta_value = '';

// 必要な情報が揃っている場合のみ、タームメタを取得
if ( ! empty( $taxonomy ) && ! empty( $term_id ) && ! empty( $meta_key ) ) {
    $meta_value = get_term_meta( $term_id, $meta_key, true );

    // 値が配列の場合は文字列に変換
    if ( is_array( $meta_value ) ) {
        $meta_value = implode( ', ', $meta_value );
    }

    // 値がオブジェクトの場合はJSONに変換
    if ( is_object( $meta_value ) ) {
        $meta_value = wp_json_encode( $meta_value );
    }

    // 値が空の場合のメッセージ
    if ( '' === $meta_value ) {
        $meta_value = __( 'メタデータが存在しません', 'term-meta-text-block' );
    }
}

// ブロックラッパーの属性を取得
$wrapper_attributes = get_block_wrapper_attributes();
?>
<p <?php echo $wrapper_attributes; ?>>
	<?php echo esc_html( $meta_value ); ?>
</p>
