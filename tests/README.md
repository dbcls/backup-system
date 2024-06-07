# Tests

- [./generate_test_data.sh](./generate_test_data.sh) を実行することで、テストデータを生成する
  - [../src/treeDataExample.jsonl](../src/treeDataExample.jsonl) に基づいて生成される
  - 生成されたデータは [./test_data](./test_data) に保存される
  - size を 1/1000 して生成する

```bash
/tests $ bash ./generate_test_data.sh
/tests $ tree
.
├── generate_test_data.sh
└── test_data
    └── var
        └── data
            ├── config
            │   ├── config1.json
            │   ├── config2.json
            │   └── config3.json
            ├── database.db
...
```

- 下のコマンドで、テストデータのファイルリストを生成する
  - test 環境における絶対パスを含むファイルリスト

```bash
/tests $ bash ../src/assets/get_file_list.sh -d 10 ./test_data > ./test_file_list.jsonl
```
