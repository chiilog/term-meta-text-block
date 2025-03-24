## 概要

設定されたタームメタを取得し、その値を表示する WordPress のカスタムブロックを作成します。  
※タームメタの登録機能は別プラグインが担うため、本実装には含まれません。

## 1. 技術スタック・前提

-   JavaScriptは TypeScript（.ts / .tsx）を使用
-   以下の型定義パッケージがインストール済みです。必要に応じて使用してください。

    -   @types/wordpress\_\_block-editor
    -   @types/wordpress\_\_blocks
        -   Edit: `BlockEditProps`
    -   wp-types
        -   taxonomy: `WP_REST_API_Taxonomy`
        -   term: `WP_REST_API_Term`

また、以下のコンポーネントは型定義がありませんので、TypeScriptのエラーを解消しようとせず、 `@ts-ignore` で無視してください。

-   `registerBlockType`
-   `useSelect`

以下のWordPress関数のphpcsは無視してください

-   get_block_wrapper_attributes() - WordPress.Security.EscapeOutput.OutputNotEscaped

コードの生成が終わったら、Lintを実行してください。

-   npm run lint-js
-   npm run lint-css
-   npm run lint-php

Lintのエラーが出ていれば解消してください。

## 2. block.json の設定

### 2.1 attributes

以下の3つの attributes を必須とします：

-   `taxonomy`（string）
-   `termId`（number）
-   `termMetaKey`（string）

※他に必要な attributes がある場合は、適宜提案してください。

### 2.2 supports

以下のカスタムオプションを有効にしてください（例： `"supports": { ... }` に含める）：

-   テキストカラー
-   背景色
-   フォントサイズ
-   フォントファミリー
-   フォントの外観（appearance）
-   行間（line height）

## 3. ブロックの設定パネル（InspectorControls）

以下のUIを用意してください：

-   **タクソノミー**
    -   セレクトボックスで選択
-   **ターム**
    -   指定されたタクソノミーに紐づくタームをセレクトボックスで選択
    -   タクソノミーが未選択の場合は非表示
    -   タクソノミーが変更された場合は`termId`を`'0'`にする
-   **タームメタキー**
    -   テキストボックスで自由入力
    -   値は文字列で固定。配列やオブジェクト等、文字列以外が入った時は処理しない。

## 4. 表示仕様

### 4.1 管理画面（エディター）

-   タームメタの**値そのものは表示しない**
-   以下の情報を1つの段落ブロック（`<p>`）で表示：
    -   選択されたタクソノミー
    -   ターム名（またはID）
    -   メタキー名
    -   例： `Taxonomy: Sample / Term: sample-1 / Key: Test の内容が表示されます`
-   `block.json`で指定した supports を使用して、スタイルのカスタマイズが反映されるようにしてください

### 4.2 フロントエンド

-   `<p>`で、指定されたタームIDとメタキーに対応する **タームメタの値** を表示してください
-   supports によるスタイル設定（色・フォント等）がフロントでも反映されるようにしてください
-   タームメタの取得・出力は render.php で行い、サーバーサイドレンダリングで表示してください
-   未入力の場合は、フロント側では`<p>`を含めて何も出力しない
