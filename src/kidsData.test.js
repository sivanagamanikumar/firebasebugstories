import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import KidsData from './kidsData';

const apiData = {
  by: 'pchristensen',
  id: 2922097,
  kids: [2923189],
  parent: 2921983,
  text: 'Deal.  You promise?',
  time: 1314213033,
  type: 'comment',
};

const server = setupServer(
  rest.get(
    'https://hacker-news.firebaseio.com/v0/item/2922097.json',
    (req, res, ctx) => {
      return res(ctx.json(apiData));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders commenst', () => {
  const data = {
    by: 'norvig',
    id: 2921983,
    kids: [2922097],
    parent: 2921506,
    text: 'Aw shucks, guys',
    time: 1314211127,
    type: 'comment',
  };
  render(<KidsData item={data} />);
  const linkElement = screen.getByTestId('2921983');
  expect(linkElement).toBeInTheDocument();
});

test('fire api call', async () => {
  const data = {
    by: 'norvig',
    id: 2921983,
    kids: [2922097],
    parent: 2921506,
    text: '',
    time: 1314211127,
    type: 'comment',
  };
  render(<KidsData item={data} />);
  const linkElement = screen.getByTestId('2921983');
  fireEvent(
    linkElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  await waitForElementToBeRemoved(linkElement);
  expect(linkElement).not.toBeInTheDocument();
});
