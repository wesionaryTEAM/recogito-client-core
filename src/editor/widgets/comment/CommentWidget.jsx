import React from 'preact/compat';
import TextEntryField from './TextEntryField';
import i18n from '../../../i18n';

/**
 * Comments are TextualBodies where the purpose field is either 
 * blank or 'commenting' or 'replying'
 */
const isComment = body => 
  body.type === 'TextualBody' && (
    !body.hasOwnProperty('purpose') || body.purpose === 'commenting' || body.purpose === 'replying'
  );
  
/**
 * The draft reply is a comment body with a 'draft' flag
 */
const getDraftReply = (existingDraft, isReply) => {
  return existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: isReply ? 'replying' : 'commenting', draft: true
  };
};

/** 
 * Renders a list of comment bodies, followed by a 'reply' field.
 */
const CommentWidget = props => {

  // All comments (draft + non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(isComment) : [];

  // Last draft comment without a creator field goes into the reply field
  const draftReply = getDraftReply(all.slice().reverse().find(b => b.draft && !b.creator), all.length > 1); 

  // All except draft reply
  const comments = all.filter(b => b != draftReply);

  const onEditReply = evt => {
    const prev = draftReply.value.trim();
    const updated = evt.target.value;

    if (prev.length === 0 && updated.length > 0) {
      props.onAppendBody({ ...draftReply, value: updated });
    } else if (prev.length > 0 && updated.length === 0) {
      props.onRemoveBody(draftReply);
    } else {
      props.onUpdateBody(draftReply, { ...draftReply, value: updated });
    }
  }



  const currentComment = comments[0] || null

  const onUpdateComment = evt => {
    props.onUpdateBody(currentComment, { ...currentComment, value: evt.target.value });
  }
console.log('checking props', props)
  return (
    <div className="r6o-widget comment editable">
      <TextEntryField
        maxLength={props.maxCommentLength}
        content={(currentComment && currentComment.value) || draftReply.value }
        editable={!props.readOnly }
        placeholder={props.placeholder || i18n.t('Add your review')}
        onChange={currentComment ? onUpdateComment : onEditReply}
        onSaveAndClose={() => props.onSaveAndClose()}
      /> 
    </div> 
  )

}

export default CommentWidget;