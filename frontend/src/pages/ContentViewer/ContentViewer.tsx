import {EditorState} from 'draft-js';
import {Content} from 'shared/dist/editor/classes/content';
import {LetterContent} from 'shared/dist/editor/classes/letterContent';
import {parseContent} from 'shared/dist/editor/parseContent';
import {stateToHTML} from 'draft-js-export-html';
import parse from 'html-react-parser';
import {ReminderContent} from 'shared/dist/editor/classes/reminderContent';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {editorAPI} from '../../api/editor';
import {DraftType, CustomizationSchema} from 'shared/dist/types/draft';
import styles from './ContentViewer.module.css';

export const ContentViewer = (props: {
    mode: 'preview' | 'future'
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;

  if (!id) {
    navigate('/home');
    return <></>;
  }


  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [customization, setCustomization] =
  useState<CustomizationSchema | undefined>(undefined);

  const [contentType, setContentType] =
    useState<DraftType | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      if (props.mode === 'preview') {
        const res = await editorAPI.getDraft(id);
        if (res.success) {
          setContent(
              parseContent(res.data?.content,
                res.data?.properties.type as DraftType));

          setContentType(res.data?.properties.type);

          setTitle(res.data?.properties.title ?
            res.data?.properties.title : '');

          setCustomization(res.data?.properties.customization);
        }
        setIsLoading(false);
      } else {

      }
    };

    getData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let jsxContent : any = <></>;

  switch (contentType) {
    case 'letter': {
      const letter = content as LetterContent;
      const editorState = letter.editorState as EditorState;
      const currentContent = editorState.getCurrentContent();
      const htmlString = stateToHTML(currentContent);
      jsxContent = parse(htmlString);
      break;
    }

    case 'reminder': {
      const reminder = content as ReminderContent;
      jsxContent = <>
        <h4>{reminder.subject}</h4>
        <p>{reminder.text}</p>
      </>;
      break;
    }
  }

  return <div id={styles.container} style={{
    backgroundColor: customization?.backgroundColor ?
    customization.backgroundColor : '#fff',
    color: customization?.fontColor ? customization.fontColor : '#000',
  }}>
    <h3>{title}</h3>
    {jsxContent}
  </div>;
};
