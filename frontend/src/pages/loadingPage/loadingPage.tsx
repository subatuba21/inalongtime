import {Navbar} from '../../components/navbars/Navbar';
import styles from './loadingPage.module.css';
import {Spinner} from 'react-bootstrap';
import {Head} from '../../components/Head/Head';

export const LoadingPage = (props: {loggedInNavbar?: boolean}) => {
  return <div style={styles} id={styles.container}>
    <Head title='Loading'></Head>
    <div className='fillPage'>
      {props.loggedInNavbar ? <Navbar></Navbar> : <></>}
      <div id={styles.iconContainer}>
        <Spinner animation={'grow'} id={styles.icon}></Spinner>
      </div>


    </div>
  </div>;
};
