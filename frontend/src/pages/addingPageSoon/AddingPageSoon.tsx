import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Navbar} from '../../components/navbars/Navbar';
import {Footer} from '../../components/footer/footer';
import styles from './AddingPageSoon.module.css';
import {useSelector} from 'react-redux';
import {UserState} from '../../store/user';

export const AddingPageSoon = () => {
  const userState = useSelector((state: any) => state.user) as UserState;
  return <div style={styles}>
    <Navbar type={userState.loggedIn ? 'home' : 'index'}></Navbar>
    <div className=' fillPage'>
      <div id={styles.mainDiv}>
        <div>
            This page is coming soon!
        </div>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
