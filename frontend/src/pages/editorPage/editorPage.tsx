import {useState} from 'react';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {InputBox} from '../../components/inputBox/inputBox';
import {LoggedInNavbar} from '../../components/navbars/homeNavbar';
import styles from './editorPage.module.css';
export const EditorPage = () => {
  const [titleState, setTitleState] = useState('');
  return <div style={styles}>
    <div className='fillPage'>
      <LoggedInNavbar></LoggedInNavbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Draft Editor</h2>
        <p id={styles.autosavedMessage} className='whiteText'>
            All fields are autosaved.
        </p>
        <h3>Basic Info</h3>
        <div id={styles.basicInfo} className='box'>
          <div><span className={styles.fieldName}>Title</span>
            <InputBox name='title' placeholder='A message from the past'
              valueState={{value: titleState, set: setTitleState}}></InputBox>
          </div>
          <br />
          <div><span className={styles.fieldName}>Recipient</span>
            <InputBox name='title' placeholder='A message from the past'
              valueState={{value: titleState, set: setTitleState}}></InputBox>
          </div>
        </div>

        <h3>Content</h3>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
