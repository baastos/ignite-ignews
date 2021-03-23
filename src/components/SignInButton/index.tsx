import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
    const isUserLoggedIn = false;

    return isUserLoggedIn ? (
        <button className={styles.signInButton} type='button'>
            <FaGithub color="#04D361" />
            Victor Bastos
            <FiX className={styles.closeIcon} color="#737380" />
        </button>
    ) : (
        <button className={styles.signInButton} type='button'>
            <FaGithub color="#EBA417" />
            Sign in with GitHub
        </button>
    )
}




