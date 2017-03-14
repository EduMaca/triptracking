import { TriptrackingPage } from './app.po';

describe('triptracking App', () => {
  let page: TriptrackingPage;

  beforeEach(() => {
    page = new TriptrackingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
