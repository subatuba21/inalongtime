import styles from './CustomizeForm.module.css';
import FontPicker from 'font-picker-react';
import {SwatchesPicker} from 'react-color';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {saveDraft, setBackgroundColor, setFontColor,
  setFontFamily,
  setStepFinished} from '../../../store/editor';
import {useEffect} from 'react';

export const CustomizeForm = () => {
  const dispatch = useAppDispatch();
  const editorState = useSelector(
      (state) => (state as any).editor) as DraftFrontendState;

  useEffect(() => {
    dispatch(setStepFinished('customize'));
  });

  return <div className='box' id={styles.customizeForm}>
    <span className={styles.fieldName}>Choose a font</span>
    <FontPicker
      apiKey={process.env.REACT_APP_FONTS_API_KEY as string}
      activeFontFamily={editorState.customization?.font} onChange={
        (font) => {
          dispatch(setFontFamily(font.family));
          dispatch(saveDraft('properties'));
        }
      } limit={200} sort={'popularity'}></FontPicker>
    <br />
    <br />
    <span className={styles.fieldName}>
        Choose font color
    </span>
    <SwatchesPicker
      color={editorState.customization?.fontColor} onChange={(x) => {
        dispatch(setFontColor(x.hex));
        dispatch(saveDraft('properties'));
      }} className={styles.swatchesPicker}></SwatchesPicker>
    <br />

    <span className={styles.fieldName}>
        Choose background color (more designs coming soon!)
    </span>
    <SwatchesPicker
      color={editorState.customization?.backgroundColor} onChange={(x) => {
        dispatch(setBackgroundColor(x.hex));
        dispatch(saveDraft('properties'));
      }} className={styles.swatchesPicker}></SwatchesPicker>


  </div>;
};
