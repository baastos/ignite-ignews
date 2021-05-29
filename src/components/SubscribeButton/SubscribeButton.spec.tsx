import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')


describe('SubscribeButton Component ', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      null, false
    ])

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now'))
  })
  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      null, false
    ])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  })
  it('redirects user to posts when already has a subscription', () => {
    const userRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: "John Doe",
        email: "johndoe@example.com"
      },
      activeSubscription: {},
      expires: 'fake-expires'
    },
      false
    ])

    const pushMock = jest.fn();

    userRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts')

  })
})
