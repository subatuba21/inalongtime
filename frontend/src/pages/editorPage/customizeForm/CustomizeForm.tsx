import styles from './CustomizeForm.module.css';
import FontPicker from 'font-picker-react';
import {SwatchesPicker} from 'react-color';
import {useState} from 'react';
export const CustomizeForm = () => {
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [fontColor, setFontColor] = useState('#fff');
  const [activeFont, setActiveFont] = useState('Open Sans');

  return <div className='box' id={styles.customizeForm}>
    <span className={styles.fieldName}>Choose a font</span>
    <FontPicker
      apiKey={process.env.REACT_APP_FONTS_API_KEY as string}
      activeFontFamily={activeFont} onChange={
        (font) => setActiveFont(font.family)}></FontPicker>
    <br />
    <br />
    <span className={styles.fieldName}>
        Choose font color
    </span>
    <SwatchesPicker color={fontColor} onChange={(x) => {
      setFontColor(x.hex);
    }}></SwatchesPicker>
    <br />

    <span className={styles.fieldName}>
        Choose background color (more designs coming soon!)
    </span>
    <SwatchesPicker color={backgroundColor} onChange={(x) => {
      setBackgroundColor(x.hex);
    }}></SwatchesPicker>


  </div>;
};
