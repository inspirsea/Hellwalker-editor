import { HellwalkerEditorPage } from './app.po';

describe('hellwalker-editor App', () => {
  let page: HellwalkerEditorPage;

  beforeEach(() => {
    page = new HellwalkerEditorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
