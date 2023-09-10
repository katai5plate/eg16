# eg16

超シンプルゲームエンジン「EG.16」

## https://katai5plate.github.io/eg16/

# 仕様

- ImageSprite
  - 使用可能な画像は 16 色の画像のみ
  - `./assets/images` に素材を置き、`npm run image` を実行すると使用可能になる
  - Bitmap 形式の場合、パレット 0 番が透過される
  - PNG 形式の場合、自分で透過処理を行う必要がある
