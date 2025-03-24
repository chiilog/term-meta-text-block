/**
 * タームメタテキストブロックの編集コンポーネント
 *
 * タクソノミー、ターム、タームメタキーを選択し、対応するタームメタの値を表示するブロックの編集インターフェース
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import type { BlockEditProps } from '@wordpress/blocks';
import type {
	WP_REST_API_Taxonomy as RestTaxonomy,
	WP_REST_API_Term as RestTerm,
} from 'wp-types';
import './editor.scss';

/**
 * ブロック属性の型定義
 */
interface BlockAttributes {
	taxonomy: string;
	termId: number;
	termMetaKey: string;
}

/**
 * タームメタテキストブロックの編集コンポーネント
 *
 * @param {BlockEditProps<BlockAttributes>} props - ブロック編集用のプロパティ
 * @return {JSX.Element} 編集画面のコンポーネント
 */
export default function Edit( props: BlockEditProps< BlockAttributes > ) {
	const { attributes, setAttributes } = props;
	const { taxonomy, termId, termMetaKey } = attributes;

	// タクソノミーの一覧を取得
	// @ts-ignore
	const taxonomies = useSelect( ( select ) => {
		const taxonomyEntities = select( coreDataStore ).getTaxonomies( {
			per_page: -1,
		} );
		return taxonomyEntities;
	}, [] );

	// 選択されたタクソノミーに属するタームの一覧を取得
	// @ts-ignore
	const terms = useSelect(
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

	// ブロックプロパティを取得
	const blockProps = useBlockProps();

	// 表示用のデータ
	const selectedTaxonomyName =
		taxonomies?.find( ( tax: RestTaxonomy ) => tax?.slug === taxonomy )
			?.name || taxonomy;
	const selectedTermName =
		terms?.find( ( term: RestTerm ) => term?.id === termId )?.name ||
		`ID: ${ termId }`;

	/**
	 * タクソノミー、ターム、メタキーが選択された時に表示するメッセージ
	 *
	 * 値を表示する代わりに、どのタクソノミー、ターム、キーの値が表示されるかを示す
	 */
	const displayMessage =
		taxonomy && termId && termMetaKey
			? // translators: %1$s: タクソノミー名, %2$s: ターム名, %3$s: メタキー名
			  __(
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
								( tax: RestTaxonomy ) => ( {
									label: tax.name,
									value: tax.slug,
								} )
							),
						] }
						onChange={ ( value ) =>
							setAttributes( {
								taxonomy: value,
								termId: 0, // タクソノミー変更時にtermIdをリセット
							} )
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
								...( terms || [] ).map(
									( term: RestTerm ) => ( {
										label: term.name,
										// SelectControlのvalueは文字列である必要があるため、数値を文字列に変換
										value: String( term.id ),
									} )
								),
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
