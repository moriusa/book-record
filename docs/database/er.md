# ER図

## 全体

```mermaid
erDiagram
    USERS ||--o{ BOOKS : owns

    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
        timestamp updated_at
    }

    BOOKS {
        uuid id PK
        uuid user_id FK
        string isbn
        string title
        string author
        string publisher
        string cover_image_url
        string status
        smallint rating
        text review
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }
```

## テーブルの関係

* `USERS` 1人に対して、`BOOKS` は複数登録できる
* `BOOKS.user_id` が `USERS.id` を参照する
* 1冊の本は必ず1人のユーザーに紐づく
* ユーザーが退会した場合、そのユーザーの本をどう扱うかは別途検討する

## 認証

ユーザー認証は AWS Cognito を使用する。

`USERS.id` には Cognito User Pool の `sub` を保存する。

```text
Google
  ↓
Cognito
  ↓
Cognito sub
  ↓
USERS.id
```
