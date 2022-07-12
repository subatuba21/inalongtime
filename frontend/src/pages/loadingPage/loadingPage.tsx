import {LoggedInNavbar} from '../../components/navbars/homeNavbar';
import styles from './loadingPage.module.css';
import {Spinner} from 'react-bootstrap';

export const LoadingPage = (props: {loggedInNavbar?: boolean}) => {
  return <div style={styles} id={styles.container}>
    <div className='fillPage'>
      {props.loggedInNavbar ? <LoggedInNavbar></LoggedInNavbar> : <></>}
      <div id={styles.iconContainer}>
        <Spinner animation={'grow'} id={styles.icon}></Spinner>
      </div>


    </div>
  </div>;
};
