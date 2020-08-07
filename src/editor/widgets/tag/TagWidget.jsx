import React from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  const [ showDelete, setShowDelete ] = useState(false);

  const [value, setValue] = useState("")

  // Every body with a 'tagging' purpose is considered a tag
  const tagBodies = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

    if(tagBodies && tagBodies[0]){
      console.log('tag bodies', tagBodies)
      setValue(tagBodies[0].value)
    }

  const toggle = tag => _ => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else 
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDelete = tag => evt => { 
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

  // const onSubmit = tag => {
  //   props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: tag.trim() });
  // }

  const handleSelect = (val) => {
    setValue(val);
    if(tagBodies && tagBodies[0]){
      props.onUpdateBody(tagBodies[0], { ...tagBodies[0], value: val });
      return;
    }
    props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: val });
  }

  const currentOption = props.vocabulary.find(option => option.value === value) 

  return (
    <div className="r6o-widget tag">
      {/* { tagBodies.length > 0 &&
        <ul className="r6o-taglist">
          { tagBodies.map(tag => 
            <li key={tag.value} onClick={toggle(tag.value)}>
              <span className="label">{tag.value}</span>

              {!props.readOnly &&
                <CSSTransition in={showDelete === tag.value} timeout={200} classNames="delete">
                  <span className="delete-wrapper" onClick={onDelete(tag)}>
                    <span className="delete">
                      <CloseIcon width={12} />
                    </span>
                  </span>
                </CSSTransition>
              }
            </li>
          )}
        </ul>
      }

      { !props.readOnly &&
        <Autocomplete 
          placeholder={props.tagPlaceholder || i18n.t('Add tag...')}
          onSubmit={onSubmit}
          vocabulary={props.vocabulary || []} />
      } */}
        {/* <select className="custom-select">
        <option value="0">Select Organ</option>
          {
            props.vocabulary && props.vocabulary.length > 0 &&
            props.vocabulary.map(option => {
              return (
                    <option value={option.value}>{option.label}</option>
              )
            })
          }
        </select> */}

      <div class="dropdown">
        <button class="btn btn-sm tag-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="tag-icon">
          <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
           
           {
             currentOption && currentOption.label || i18n.t('Select Tag')
           }
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {
            props.vocabulary && props.vocabulary.length > 0 &&
            props.vocabulary.map(option => {
              return (
              <span class="dropdown-item button-span" onClick={() => handleSelect(option.value)}>{option.label}</span>
              )
            })
          }
        </div>
      </div>
 
    </div>
  )

};

export default TagWidget;