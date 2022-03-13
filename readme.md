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

## convertCheatSheet

Cheat Sheet를 작성하면서 너무 길이가 길어졌기 때문에 더 편하게 보기 위해서 제목 2와 제목 3을 토글 제목 2와 토글 제목 3으로 변경한다.

제목 2과 토글 제목 2은 `type`이 `heading_2`로 같다. 구분은 `has_children`으로 할 수 있다. 아래 예시이다.

2022-03-14 API로는 수행할 수 없는 기능이다.

```plaintext
[
  {
    "object": "block",
    "id": "",
    "created_time": "2022-03-00T00:00:00.000Z",
    "last_edited_time": "2022-03-00T00:00:00.000Z",
    "created_by": {
      "object": "user",
      "id": ""
    },
    "last_edited_by": {
      "object": "user",
      "id": ""
    },
    "has_children": true,
    "archived": false,
    "type": "heading_3",
    "heading_3": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "AAA",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "AAA",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "",
    "created_time": "2022-03-00T00:00:00.000Z",
    "last_edited_time": "2022-03-00T00:00:00.000Z",
    "created_by": {
      "object": "user",
      "id": ""
    },
    "last_edited_by": {
      "object": "user",
      "id": ""
    },
    "has_children": false,
    "archived": false,
    "type": "heading_3",
    "heading_3": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "BBB",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "BBB",
          "href": null
        }
      ],
      "color": "default"
    }
  },
```

`has_children`을 바꿀 수는 없다. 아래 응답을 보면 요청이 성공했어도 `has_children`은 `false`이다. 그 아래는 `has_children`을 수정하려고 만들어 본 요청 파라미터이다.

```plaintext
success: {
  object: 'block',
  id: 'e5dc2903-252f-4b94-8468-25644f678d47',
  created_time: '2022-03-13T13:52:00.000Z',
  last_edited_time: '2022-03-13T16:18:00.000Z',
  created_by: { object: 'user', id: 'a86940e6-804a-463f-a4db-5c3a4cbf043f' },
  last_edited_by: { object: 'user', id: 'c92427ac-3afe-4d83-be99-9c378c868270' },
  has_children: false,
  archived: false,
  type: 'heading_3',
  heading_3: { rich_text: [ [Object] ], color: 'default' }
}
```

```typescript
return {
  block_id: obj.id,
  type,
  [type]: { rich_text: obj[type].rich_text },
  has_children: true,
};
```

아래는 개발 중 발생한 에러 중 하나이다.

```plaintext
@notionhq/client warn: request fail {
  code: 'conflict_error',
  message: 'Conflict occurred while saving. Please try again.'
}
```

