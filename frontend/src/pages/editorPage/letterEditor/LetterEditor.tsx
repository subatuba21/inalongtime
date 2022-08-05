import {AtomicBlockUtils, EditorState} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '../../../css/drafteditor.css';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createImagePlugin from '@draft-js-plugins/image';
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
import {Image} from 'react-bootstrap-icons';
import {activateModal} from '../../../store/modal';
import {UploadImageModalContent} from
  './UploadImageModalContent.tsx/UploadImageModalContent';

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;

const imagePlugin = createImagePlugin();


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

  const openImageUpload = () => {
    dispatch(activateModal({
      header: 'Upload Image',
      content: <UploadImageModalContent
        insertImage={insertImage}></UploadImageModalContent>,
    }));
  };


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
            <Image style={{
              height: '100%',
              marginLeft: '7px',
              marginRight: '7px',
              color: 'grey',
              display: 'inline-block',
              cursor: 'pointer',
              position: 'relative',
              bottom: '4px',
            }} onClick={openImageUpload}></Image>
          </>
        )
      }
    </Toolbar>
    <Editor
      editorState={letterEditorState}
      onChange={onChange} onBlur={() => dispatch(saveDraft('data'))}
      plugins={[toolbarPlugin,
        emojiPlugin, imagePlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
  </>;
};
