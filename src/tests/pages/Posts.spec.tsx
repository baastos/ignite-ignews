import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

import { mocked } from 'ts-jest/utils'

const posts = [
  {
    slug: "post-slug",
    title: "post-title",
    excerpt: "post-excerpt",
    updatedAt: "10 de abril"
  }
]

jest.mock('../../services/prismic');

describe('Posts Page Component', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('post-title')).toBeInTheDocument();
  })

  it('loads data correctly', async () => {
    const prismicMocked = mocked(getPrismicClient);

    prismicMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "post slug",
            data: {
              title: [
                {
                  type: 'heading', text: 'post title'
                }
              ],
              content: [
                {
                  type: 'paragraph', text: 'post excerpt'
                }
              ],
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        posts: [
          {
            slug: "post slug",
            title: "post title",
            excerpt: "post excerpt",
            updatedAt: "01 de abril de 2021"
          },
        ]
      }
    }))

  })
})