import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils'
import { getSession, useSession } from 'next-auth/client';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: "post-slug",
  title: "post-title",
  content: "<p>post-content</p>",
  updatedAt: "10 de abril"
}

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Post preview page Component', () => {
  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('post-title')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();

  })
  it('redirects user to full post when subscribed', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedUseRouter = mocked(useRouter);
    const pushMock = jest.fn();

    mockedUseRouter.mockReturnValueOnce({
      push: pushMock
    } as any)

    mockedUseSession.mockReturnValueOnce([
      { activeSubscription: {} },
      false
    ] as any);

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/post-slug')
  })

  it('loads data correctly', async () => {

    const prismicMocked = mocked(getPrismicClient);

    prismicMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data:
        {
          title: [
            {
              type: 'heading', text: 'post-title'
            }
          ],
          content: [
            {
              type: 'paragraph', text: 'post-content'
            }
          ],
        },
        last_publication_date: '04-01-2021'

      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'post-slug'
      }
    } as any)

    expect(response).toEqual(expect.objectContaining({
      props: {
        post:
        {
          slug: "post-slug",
          title: "post-title",
          content: "<p>post-content</p>",
          updatedAt: "01 de abril de 2021"
        },

      }
    }))

  })
})