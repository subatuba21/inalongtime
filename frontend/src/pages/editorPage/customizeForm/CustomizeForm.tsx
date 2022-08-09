import styles from './CustomizeForm.module.css';
import FontPicker from 'font-picker-react';
import {SwatchesPicker} from 'react-color';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {changeSenderName, saveDraft, setBackgroundColor, setFontColor,
  setFontFamily,
  setStepFinished} from '../../../store/editor';
import {useEffect} from 'react';
import {InputBox} from '../../../components/inputBox/inputBox';
import {UserState} from '../../../store/user';

export const CustomizeForm = () => {
  const dispatch = useAppDispatch();
  const editorState = useSelector(
      (state) => (state as any).editor) as DraftFrontendState;
  const userState = useSelector((state) => (state as any).user) as UserState;

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

    <br />
    <h4>Additional Options</h4>
    <br />
    <span className={styles.fieldName}>
        Custom Name
    </span>
    <InputBox name='custom name' valueState={{
      value: editorState.senderName,
      set: (value: string) => dispatch(changeSenderName(value)),
    }} placeholder='Ex. Uncle Sam' optional={{
      defaultValue: `${userState.firstName} ${userState.lastName}`,
    }} onBlur={() => {
      dispatch(saveDraft('properties'));
    }}/>

  </div>;
};
