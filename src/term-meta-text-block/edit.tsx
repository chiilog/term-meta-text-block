/**
 * タームメタテキストブロックの編集コンポーネント
 *
 * タクソノミー、ターム、タームメタキーを選択し、対応するタームメタの値を表示するブロックの編集インターフェース
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import type { StoreDescriptor } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import './editor.scss';

/**
 * WordPress タクソノミーの型定義
 */
interface Taxonomy {
	slug: string;
	name: string;
	[ key: string ]: any;
}

/**
 * WordPress タームの型定義
 */
interface Term {
	id: number;
	name: string;
	[ key: string ]: any;
}

/**
 * ブロック属性の型定義
 */
interface TermMetaTextBlockAttributes {
	taxonomy: string;
	termId: number;
	termMetaKey: string;
}

/**
 * タームメタテキストブロックの編集コンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {TermMetaTextBlockAttributes} props.attributes - ブロック属性
 * @param {Function} props.setAttributes - 属性を更新する関数
 * @return {JSX.Element} 編集画面のコンポーネント
 */
export default function Edit( {
	attributes,
	setAttributes,
}: {
	attributes: TermMetaTextBlockAttributes;
	setAttributes: ( attrs: Partial< TermMetaTextBlockAttributes > ) => void;
} ) {
	const { taxonomy, termId, termMetaKey } = attributes;

	// タクソノミーの一覧を取得
	const taxonomies = useSelect< Taxonomy[] | undefined >( ( select ) => {
		const taxonomyEntities = select( coreDataStore ).getTaxonomies( {
			per_page: -1,
		} );
		return taxonomyEntities;
	}, [] );

	// 選択されたタクソノミーに属するタームの一覧を取得
	const terms = useSelect< Term[] | undefined >(
		( select ) => {
			if ( ! taxonomy ) {
				return [];
			}

			const termEntities = select( coreDataStore ).getEntityRecords(
				'taxonomy',
				taxonomy,
				{ per_page: -1 }
			);

			return termEntities;
		},
		[ taxonomy ]
	);

	// タクソノミーが変更された時にtermIdをリセット
	useEffect( () => {
		if ( termId !== 0 ) {
			setAttributes( { termId: 0 } );
		}
	}, [ taxonomy, termId ] );

	// ブロックプロパティを取得
	const blockProps = useBlockProps();

	// 表示用のデータ
	const selectedTaxonomyName =
		taxonomies?.find( ( tax: Taxonomy ) => tax?.slug === taxonomy )?.name ||
		taxonomy;
	const selectedTermName =
		terms?.find( ( term: Term ) => term?.id === termId )?.name ||
		`ID: ${ termId }`;

	/**
	 * タクソノミー、ターム、メタキーが選択された時に表示するメッセージ
	 *
	 * 値を表示する代わりに、どのタクソノミー、ターム、キーの値が表示されるかを示す
	 */
	const displayMessage =
		taxonomy && termId && termMetaKey
			? __(
					'Taxonomy: %1$s / Term: %2$s / Key: %3$s の内容が表示されます',
					'term-meta-text-block'
			  )
			: __(
					'タクソノミー、ターム、タームメタキーを設定してください',
					'term-meta-text-block'
			  );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'ターム設定', 'term-meta-text-block' ) }>
					{ /* タクソノミー選択 */ }
					<SelectControl
						label={ __( 'タクソノミー', 'term-meta-text-block' ) }
						value={ taxonomy }
						options={ [
							{
								label: __(
									'選択してください',
									'term-meta-text-block'
								),
								value: '',
							},
							...( taxonomies || [] ).map(
								( tax: Taxonomy ) => ( {
									label: tax.name,
									value: tax.slug,
								} )
							),
						] }
						onChange={ ( value ) =>
							setAttributes( { taxonomy: value } )
						}
					/>

					{ /* ターム選択 - タクソノミーが選択されている場合のみ表示 */ }
					{ taxonomy && (
						<SelectControl
							label={ __( 'ターム', 'term-meta-text-block' ) }
							value={ String( termId ) }
							options={ [
								{
									label: __(
										'選択してください',
										'term-meta-text-block'
									),
									value: '0',
								},
								...( terms || [] ).map( ( term: Term ) => ( {
									label: term.name,
									value: String( term.id ),
								} ) ),
							] }
							onChange={ ( value ) =>
								setAttributes( {
									termId: parseInt( value, 10 ),
								} )
							}
						/>
					) }

					{ /* タームメタキー入力 */ }
					<TextControl
						label={ __( 'タームメタキー', 'term-meta-text-block' ) }
						value={ termMetaKey }
						onChange={ ( value ) =>
							setAttributes( { termMetaKey: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<p { ...blockProps }>
				{ taxonomy && termId && termMetaKey
					? displayMessage
							.replace( '%1$s', selectedTaxonomyName )
							.replace( '%2$s', selectedTermName )
							.replace( '%3$s', termMetaKey )
					: displayMessage }
			</p>
		</>
	);
}
