import S from './secret';
import { Client } from '@notionhq/client';
import { ListBlockChildrenResponse, UpdateBlockParameters } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: S.NOTION_KEY });

const cheatSheetId = S.PAGE_ID_CHEAT_SHEET;

const main = async () => {
  const headings = await getPagesHeadingBlocks();

  const requestParams = headings.map(changeToToggleBlockUpdateRequestParam);

  for await (const p of requestParams) {
    try {
      const res = await notion.blocks.update(p);
      console.log('success:', res);
    } catch (error) {
      // console.log({ error });
    }
  }
};

export default main;

/**
 * 어떤 페이지의 하위 블록들 중 제목 블록들만 반환한다.
 */
async function getPagesHeadingBlocks(): Promise<any[]> {
  let result: any[] = [];

  let next_cursor: string | null = null;
  let has_more: boolean = true;
  while (has_more) {
    const res: ListBlockChildrenResponse = await notion.blocks.children.list({
      block_id: cheatSheetId,
      page_size: 100,
      start_cursor: next_cursor ?? undefined,
    });

    ({ has_more, next_cursor } = res);

    const { results /*, object, ...rest */ } = res;
    result = [...result, ...results.filter(isHeadingTwoThree)];
  }

  return result;
}

/**
 * 오브젝트가 제목 2이거나 제목 3이면 true를, 아니면 false를 반환한다.
 *
 * 토글 제목2와 3도 제목 2와 3으로 취급한다.
 */
function isHeadingTwoThree(obj: any): any {
  return ['heading_2', 'heading_3'].includes(obj.type);
}

/**
 * 제목을 토글 제목으로 바꾼고 반환한다. 기존 토글 제목도 변환을 수행한다.
 */
function changeToToggleHeading(obj: any): any {
  return { ...obj, has_children: true };
}

/**
 * 블록을 토글 제목으로 바꾸는 업데이트를 요청하는 파라미터로 바꾸고 반환한다.
 */
function changeToToggleBlockUpdateRequestParam(obj: any): /*UpdateBlockParameters*/ any {
  const { type } = obj;
  return {
    block_id: obj.id,
    type,
    [type]: { rich_text: obj[type].rich_text },
    has_children: true,
  };
}
