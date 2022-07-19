import {EditorState} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '../../css/drafteditor.css';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {useState} from 'react';
import {LetterContent} from
  'shared/dist/editor/classes/letterContent';
import {editorAPI} from '../../api/editor';
import {useSelector} from 'react-redux';
import {DraftFrontendState} from 'shared/dist/types/draft';

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;

export const LetterEditor = (props: {letterContent? : LetterContent}) => {
  const [letterEditorState, setLetterEditorState] = useState(
      () => props.letterContent?.data?.editorState || EditorState.createEmpty(),
  );
  const editorState =
    useSelector((state) => (state as any).editor) as DraftFrontendState;

  const onChange = (editor: EditorState) => {
    setLetterEditorState(editor);
  };

  const save = () => {
    const letterContent = new LetterContent();
    letterContent.initialize({
      editorState: letterEditorState,
    });

    editorAPI.save(editorState._id, editorState.type, {
      content: letterContent.serialize(),
    });
  };

  return <>
    <Toolbar/>
    <Editor
      editorState={letterEditorState}
      onChange={onChange} onBlur={save} plugins={[toolbarPlugin, emojiPlugin]}/>
    <EmojiSuggestions/>
    <EmojiSelect/>
  </>;
};
