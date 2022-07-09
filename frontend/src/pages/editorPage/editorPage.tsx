import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {LoggedInNavbar} from '../../components/navbars/homeNavbar';
import {BasicInfo} from './basicInfoForm/basicInfo';
import styles from './editorPage.module.css';
export const EditorPage = () => {
  return <div style={styles}>
    <div className='fillPage'>
      <LoggedInNavbar></LoggedInNavbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Draft Editor</h2>
        <p id={styles.autosavedMessage} className='whiteText'>
            All fields are autosaved.
        </p>
        <div>
          <h3>Basic Info</h3>
        </div>
        <BasicInfo></BasicInfo>

        <h3>Content</h3>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
