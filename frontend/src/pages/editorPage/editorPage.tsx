import {useState} from 'react';
import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {LetterEditor} from '../../components/letterEditor/LetterEditor';
import {Navbar} from '../../components/navbars/Navbar';
import {BasicInfo} from './basicInfoForm/basicInfo';
import styles from './editorPage.module.css';
export const EditorPage = () => {
  const [infoHidden, setInfoHidden] = useState(false);
  return <div style={styles}>
    <div className='fillPage'>
      <Navbar></Navbar>
      <div id={styles.mainDiv}>
        <h2 className='pinkText'>Draft Editor</h2>
        <p id={styles.autosavedMessage} className='whiteText'>
            All fields are autosaved.
        </p>
        <div className={styles.headerCollapseRow}>
          <h3>Basic Info</h3>
          <span className="pinkText"
            onClick={() => setInfoHidden(!infoHidden)}>
            {infoHidden ? 'Expand' : 'Collapse'}</span>
        </div>
        {!infoHidden ? <BasicInfo draftType='letter'></BasicInfo> : ''}
        <h3>Content</h3>
        <LetterEditor></LetterEditor>
      </div>
      <BottomBuffer></BottomBuffer>
    </div>
    <Footer></Footer>
  </div>;
};
