import {EditorState} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '../../../css/drafteditor.css';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {LetterContent} from
  'shared/dist/editor/classes/letterContent';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';
import {useAppDispatch} from '../../../store/store';
import {changeContent, saveDraft} from '../../../store/editor';
import {activateModal} from '../../../store/modal';
import {useEffect} from 'react';

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;

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
    <Toolbar/>
    <Editor
      editorState={letterEditorState}
      onChange={onChange} onBlur={save} plugins={[toolbarPlugin, emojiPlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
  </>;
};
