import S from './secret';
import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: S.NOTION_KEY });

const databaseId = S.DATABASE_ID;

type TPageArray = QueryDatabaseResponse['results'];

const main = async () => {
  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: '링크',
        rich_text: {
          is_empty: true,
        },
      },
    });

    // console.log((results[3] as any).properties['단어']);
    // console.log(JSON.stringify((results[2] as any).properties.링크, null, 2));
    console.log(results.length);

    const pages = addLinkToPages(results);

    pages.forEach((page: any) => {
      notion.pages.update(page);
    });
  } catch (error) {
    console.error((error as any).body);
  }
};

/**
 * 페이지 업데이트 객체를 리턴한다.
 *
 * `page as any`를 사용한 이유는 page.properties가 TS에서 에러가 나기 때문이다.
 *
 * @param pages
 * @returns
 */
const addLinkToPages = (pages: TPageArray) => {
  return pages.map((page): any => {
    const url: string = `https://www.oxfordlearnersdictionaries.com/definition/english/${(page as any).properties.단어.title[0].plain_text}`;
    return {
      page_id: page.id,
      properties: {
        링크: {
          ...(page as any).properties.링크,
          rich_text: [{ type: 'text', text: { content: 'Oxford', link: { content: 'Oxford', url } }, plain_text: 'Oxford', href: url }],
        },
      },
    };
  });
};

export default main;
