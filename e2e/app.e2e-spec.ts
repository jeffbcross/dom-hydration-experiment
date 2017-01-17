import { HydrationRendererPage } from './app.po';

describe('hydration-renderer App', function() {
  let page: HydrationRendererPage;

  beforeEach(() => {
    page = new HydrationRendererPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
