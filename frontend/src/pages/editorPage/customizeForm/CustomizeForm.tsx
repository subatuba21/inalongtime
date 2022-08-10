import styles from './CustomizeForm.module.css';
import FontPicker from 'font-picker-react';
import {SwatchesPicker} from 'react-color';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {changeSenderName, changeShowDate,
  saveDraft, setBackgroundColor, setFontColor,
  setFontFamily,
  setHeaderColor,
  setStepFinished} from '../../../store/editor';
import {useEffect} from 'react';
import {InputBox} from '../../../components/inputBox/inputBox';
import {UserState} from '../../../store/user';
import {SelectBox} from '../../../components/selectBox/selectBox';

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
Choose heading color
    </span>
    <SwatchesPicker
      color={editorState.customization?.headerColor} onChange={(x) => {
        dispatch(setHeaderColor(x.hex));
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
    <br />
    <h4>Additional Options</h4>
    <br />
    <span className={styles.fieldName}>
        Custom Name
    </span>
    <span className={styles.fieldDescription}>
        Use this if you want to use a nickname or go anonymous.
    </span>
    <InputBox name='custom name' valueState={{
      value: editorState.senderName,
      set: (value: string) => dispatch(changeSenderName(value)),
    }} placeholder='Ex. Uncle Sam' optional={{
      defaultValue: `${userState.firstName} ${userState.lastName}`,
    }} onBlur={() => {
      dispatch(saveDraft('properties'));
    }}/>
    <br />
    <span className={styles.fieldName}>
        Show date
    </span>
    <span className={styles.fieldDescription}>
        If you don&apos;t want to the recipient to see
        when you sent this, select &apos;no&apos;
    </span>
    <SelectBox name={'showDate'}
      options={['Yes', 'No']} values={['true', 'false']} valueState={{
        value: editorState.customization?.showDate ? 'true' : 'false',
        set: (value: string) => {
          const bool = value === 'true';
          dispatch(changeShowDate(bool));
        },
      }} onChange={() => {
        dispatch(saveDraft('properties'));
      }} />

  </div>;
};
