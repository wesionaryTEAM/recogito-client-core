import React from 'preact/compat';
import { useState, useEffect, useRef } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  const [ showDelete, setShowDelete ] = useState(false);
  const [ showMenu, setShowMenu] = useState(false)

  const [value, setValue] = useState("")

  const tagRef = useRef();

  const tagListenerFunction = (event) => {
    if(tagRef.current !== null && !tagRef.current.contains(event.target)){
      setShowMenu(false)
    }
  }


  const handleOutsideClick = () => {
    const tagItem = document.getElementById("")
     document.addEventListener("click", tagListenerFunction)
  }

  const removeListener = () =>{
    document.removeEventListener("click", tagListenerFunction)
  }

  useEffect(() => {
    handleOutsideClick()
    return () => {
      removeListener()
    }
  }, [])

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
    setShowMenu(false)
    if(tagBodies && tagBodies[0]){
      props.onUpdateBody(tagBodies[0], { ...tagBodies[0], value: val });
      return;
    }
    props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: val });
  }

  const handleToggle = () => {
    setShowMenu(!showMenu)
  }

  const currentOption = props.vocabulary &&  props.vocabulary.find(option => option.value === value) 

  return (
    <div className="r6o-widget tag" ref={tagRef}>
      <div class="tag-dropdown" >
        <button onClick={handleToggle} class="btn btn-sm tag-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="tag-icon">
          <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
           
           {
             currentOption && currentOption.label || props.placeholder || i18n.t('Select Tag')
           }
        </button>
        <div class="tag-dropdown-menu" style={{display: showMenu ? 'flex' : 'none'}}>
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