import { getPosPageData } from './src/features/staff/pos/server/getPosPageData.js';

async function main() {
  const data = await getPosPageData();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
