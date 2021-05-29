import Head from 'next/head';
import { GetStaticProps } from 'next'
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>

      </Head>
      <main className={styles.mainContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News about <br /> the <span>React</span> world</h1>
          <p>Get acess to all the publications <br /> <span>for {product.amount} month</span></p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1IYdYhEZmg6MD7Eq9w8o24eI');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((price.unit_amount / 100)),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}