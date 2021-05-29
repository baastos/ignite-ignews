import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client';


import styles from './styles.module.scss'
import { useEffect } from 'react';

export function SignInButton() {
    const [session] = useSession();

    console.log(session);


    return session ? (
        <button onClick={() => signOut()} className={styles.signInButton} type='button'>
            <FaGithub color="#04D361" />
            {session.user.name}
            <FiX className={styles.closeIcon} color="#737380" />
        </button>
    ) : (
        <button onClick={async () => await signIn('github')} className={styles.signInButton} type='button'>
            <FaGithub color="#EBA417" />
            Sign in with Github
        </button>
    )
}
