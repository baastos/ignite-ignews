import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils'

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]

  }
})
jest.mock('../../services/stripe');


describe('Home Page Component', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: "price-id", amount: "R$10,00" }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  })
  it('loads data correctly', async () => {
    const stripePriceRetrievesMocked = mocked(stripe.prices.retrieve);

    stripePriceRetrievesMocked.mockResolvedValueOnce({

      id: 'fake-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          priceId: 'fake-id',
          amount: '$10.00'
        }
      }
    }))
  })
})