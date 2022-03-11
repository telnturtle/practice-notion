import S from './secret';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: S.NOTION_KEY });

const databaseId = S.DATABASE_ID;

const addItem = async (text: string) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: { title: [{ text: { content: text } }] },
      },
    });
    console.log({ response });
    console.log('Success! Entry added.');
  } catch (error) {
    console.error((error as any).body);
  }
};

addItem('Yurts in Big Sur, California');
