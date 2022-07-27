import {AtomicBlockUtils, EditorState} from 'draft-js';
import Editor, {composeDecorators} from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '../../../css/drafteditor.css';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createImagePlugin from '@draft-js-plugins/image';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import {LetterContent} from
  'shared/dist/editor/classes/letterContent';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {changeContent,
  saveDraft,
  setStepFinished, setStepUnfinished} from '../../../store/editor';
import {useEffect} from 'react';
import {
  BoldButton,
  ItalicButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  OrderedListButton,
  UnorderedListButton,
} from '@draft-js-plugins/buttons';
import {Button} from 'react-bootstrap';
import styles from './letterEditor.module.css';

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;


const resizeablePlugin = createResizeablePlugin();
const imagePlugin = createImagePlugin({decorator: composeDecorators(
    resizeablePlugin.decorator,
)});


export const LetterEditor = () => {
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;

  const letterEditorState =
    (editorState?.content as LetterContent)?.editorState ||
    EditorState.createEmpty();
  const dispatch = useAppDispatch();

  const onChange = (editorState: EditorState) => {
    const content = new LetterContent();
    content.initialize({
      editorState,
    });
    dispatch(changeContent(content));
  };

  const insertImage = (url: string) => {
    const contentState = letterEditorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        'image',
        'IMMUTABLE',
        {src: url},
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(letterEditorState, {
      currentContent: contentStateWithEntity,
    });
    const finalEditorState =
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    onChange(finalEditorState);
  };

  if (editorState.content && (editorState.content as any).editorState &&
  ((editorState.content as LetterContent).editorState as EditorState)
      .getCurrentContent().getPlainText().trim() != '') {
    dispatch(setStepFinished('content'));
  } else {
    dispatch(setStepUnfinished('content'));
  }

  useEffect(() => {
    const debounced = setTimeout(() => {
      dispatch(saveDraft('data'));
    }, 2500);

    return () => clearTimeout(debounced);
  }, [editorState.content]);


  return <>
    <Toolbar>
      {
        (externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
          </>
        )
      }
    </Toolbar>
    <Editor
      editorState={letterEditorState}
      onChange={onChange} onBlur={() => dispatch(saveDraft('data'))}
      plugins={[toolbarPlugin,
        emojiPlugin, imagePlugin, resizeablePlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
    <Button id={styles.uploadImageButton} onClick={() => {
      insertImage('https://picsum.photos/200/300');
    }}>Upload Image</Button>
  </>;
};
