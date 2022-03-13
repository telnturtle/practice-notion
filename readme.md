# practice-notion

노션을 사용하며 필요한 자동화 기능을 만들며 노션 API를 연습한다.

## 프로젝트 구조

`app.ts`는 앱의 실행 포인트이며, 각 자동화 기능은 각각 파일로 만든다.

`secret.ts`는 앱에 필요한 키 등을 담는다. 위치는 `src/`에 만들고, 아래와 같이 만들면 된다.

```typescript
export default {
  NOTION_KEY: '',
  DATABASE_ID_SOMEWHAT: '',
  PAGE_ID: '',
};

```

## 도움 받은 문서 

Project initial setup by https://losikov.medium.com/part-1-project-initial-setup-typescript-node-js-31ba3aa7fbf1

Notion API: https://developers.notion.com/docs/getting-started

## addLinkToVocaDastabase

단어를 외우며 모르는 단어들을 title로 표에 나열하면 단어의 oxford 사전 링크를 표의 링크 칸에 삽입해준다.

