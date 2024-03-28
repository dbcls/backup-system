# Zuke-gui

- Backup policy を設定するための GUI app
- 汎用的なものとして実装する
  - policy の選択肢を、外部変数化し、動的に描画する
  - 一度、日本語で PoC を作成し、その結果をもって完全英語化するかを検討する

---

開発環境の起動方法として、

```bash
docker compose up -d --build
docker compose exec npm run dev
```
