import {EditorState} from 'draft-js';
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
import {changeContent, saveDraft,
  setStepFinished, setStepUnfinished} from '../../../store/editor';
import {activateModal} from '../../../store/modal';
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

  if (editorState.content && (editorState.content as any).editorState &&
  ((editorState.content as LetterContent).editorState as EditorState)
      .getCurrentContent().getPlainText().trim() != '') {
    dispatch(setStepFinished('content'));
  } else {
    dispatch(setStepUnfinished('content'));
  }

  const save = () => {
    if (editorState.content) {
      dispatch(saveDraft({
        type: 'letter',
        id: editorState._id,
        data: {
          content: editorState.content?.serialize(),
        },
        onSuccess: () => {},
        onFailure: () => {
          dispatch(activateModal({
            content: <div>Unable to save draft due to unknown error</div>,
            header: 'Error: Unable to save draft',
          }));
        },
      }));
    }
  };

  useEffect(() => {
    const debounced = setTimeout(() => {
      save();
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
      onChange={onChange} onBlur={save} plugins={[toolbarPlugin,
        emojiPlugin, imagePlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
  </>;
};
