import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';

import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/client';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: "post-slug",
  title: "post-title",
  content: "<p>post-content</p>",
  updatedAt: "10 de abril"
}


jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Post Page Component', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('post-title')).toBeInTheDocument();
  })
  it('redirects user if active subscription is not found', async () => {
    const mockedGetSession = mocked(getSession);

    mockedGetSession.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: 'post-slug'
      }
    } as any)

    expect(response).toEqual(expect.objectContaining({
      redirect: expect.objectContaining({
        destination: '/'
      })
    }))
  })

  it('loads data correctly', async () => {
    const mockedGetSession = mocked(getSession);

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: {}
    } as any);


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

    const response = await getServerSideProps({
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